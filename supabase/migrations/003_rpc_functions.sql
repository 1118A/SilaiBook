-- 003_rpc_functions.sql
-- SilaiBook: Complete RPC functions, triggers, and workflow logic
-- Integrates T02, T03, T07, T08, T09 requirements

-- ============================================================
-- HELPER: Check if a month is locked for a unit
-- ============================================================
CREATE OR REPLACE FUNCTION is_month_locked(p_unit_id uuid, p_work_date date)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM month_closures
    WHERE unit_id = p_unit_id
      AND month = date_trunc('month', p_work_date)::date
  );
END;
$$;


-- ============================================================
-- TRIGGER FUNCTION: Prevent entry modifications if month is locked
-- ============================================================
CREATE OR REPLACE FUNCTION check_entry_month_lock()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  target_unit uuid;
  target_date date;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_unit := OLD.unit_id;
    target_date := OLD.work_date;
  ELSE
    target_unit := NEW.unit_id;
    target_date := NEW.work_date;
  END IF;

  IF is_month_locked(target_unit, target_date) THEN
    RAISE EXCEPTION 'Month % is locked for payroll. Modifications are not allowed.', 
      to_char(target_date, 'YYYY-MM');
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS trg_entries_month_lock ON entries;
CREATE TRIGGER trg_entries_month_lock
  BEFORE INSERT OR UPDATE OR DELETE ON entries
  FOR EACH ROW
  EXECUTE FUNCTION check_entry_month_lock();


-- ============================================================
-- TRIGGER FUNCTION: Validate entry cross-table unit consistency
-- ============================================================
CREATE OR REPLACE FUNCTION validate_entry_integrity()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- 1. Validate Tailor belongs to same unit
  IF NOT EXISTS (SELECT 1 FROM tailors WHERE id = NEW.tailor_id AND unit_id = NEW.unit_id) THEN
    RAISE EXCEPTION 'Tailor % does not belong to unit %', NEW.tailor_id, NEW.unit_id;
  END IF;

  -- 2. Validate Lot belongs to same unit
  IF NOT EXISTS (SELECT 1 FROM lots WHERE id = NEW.lot_id AND unit_id = NEW.unit_id) THEN
    RAISE EXCEPTION 'Lot % does not belong to unit %', NEW.lot_id, NEW.unit_id;
  END IF;

  -- 3. Validate Operation belongs to same unit
  IF NOT EXISTS (SELECT 1 FROM operations WHERE id = NEW.operation_id AND unit_id = NEW.unit_id) THEN
    RAISE EXCEPTION 'Operation % does not belong to unit %', NEW.operation_id, NEW.unit_id;
  END IF;

  -- 4. Validate pieces and rate
  IF NEW.pieces <= 0 THEN
    RAISE EXCEPTION 'Pieces must be greater than zero';
  END IF;

  IF NEW.rate_paise < 0 THEN
    RAISE EXCEPTION 'Rate paise cannot be negative';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_entry_integrity ON entries;
CREATE TRIGGER trg_validate_entry_integrity
  BEFORE INSERT OR UPDATE ON entries
  FOR EACH ROW
  EXECUTE FUNCTION validate_entry_integrity();


-- ============================================================
-- RPC: rate_for
-- Returns the rate in paise for a given operation on a date
-- ============================================================
CREATE OR REPLACE FUNCTION rate_for(p_operation_id uuid, p_on_date date DEFAULT CURRENT_DATE)
RETURNS integer
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  v_rate integer;
BEGIN
  SELECT default_rate_paise INTO v_rate
  FROM operations
  WHERE id = p_operation_id;

  RETURN COALESCE(v_rate, 0);
END;
$$;


-- ============================================================
-- RPC: decide_entry
-- Approve, reject, or dispute an individual piece entry
-- ============================================================
CREATE OR REPLACE FUNCTION decide_entry(
  p_entry_id uuid,
  p_decision text,  -- 'verified' | 'approved' | 'rejected' | 'disputed'
  p_note text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_entry entries%ROWTYPE;
  v_user_role text;
  v_user_unit uuid;
  v_user_tailor uuid;
  v_norm_decision text;
BEGIN
  v_user_role := get_user_role();
  v_user_unit := get_user_unit_id();
  v_user_tailor := get_user_tailor_id();

  SELECT * INTO v_entry FROM entries WHERE id = p_entry_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Entry % not found', p_entry_id;
  END IF;

  -- Check tenant
  IF v_entry.unit_id != v_user_unit THEN
    RAISE EXCEPTION 'Permission denied for this unit';
  END IF;

  -- Check month lock
  IF is_month_locked(v_entry.unit_id, v_entry.work_date) THEN
    RAISE EXCEPTION 'Month is locked for this entry';
  END IF;

  -- Normalize decision
  IF p_decision IN ('approved', 'verified') THEN
    v_norm_decision := 'verified';
  ELSIF p_decision = 'rejected' THEN
    v_norm_decision := 'rejected';
  ELSIF p_decision = 'disputed' THEN
    v_norm_decision := 'disputed';
  ELSE
    RAISE EXCEPTION 'Invalid decision: %', p_decision;
  END IF;

  -- Role permissions
  IF v_user_role IN ('owner', 'manager') THEN
    UPDATE entries
    SET status = v_norm_decision,
        verified_by = auth.uid(),
        verified_at = now(),
        note = COALESCE(p_note, note)
    WHERE id = p_entry_id;
  ELSIF v_user_role = 'tailor' THEN
    IF v_entry.tailor_id != v_user_tailor THEN
      RAISE EXCEPTION 'Tailor can only decide on own entries';
    END IF;

    -- Tailors can verify or dispute
    UPDATE entries
    SET status = v_norm_decision,
        note = COALESCE(p_note, note)
    WHERE id = p_entry_id;
  ELSE
    RAISE EXCEPTION 'Unauthorized role: %', v_user_role;
  END IF;

  -- Audit log entry
  INSERT INTO audit_log (unit_id, user_id, action, table_name, record_id, old_data, new_data)
  VALUES (
    v_entry.unit_id,
    auth.uid(),
    'DECIDE_ENTRY',
    'entries',
    p_entry_id,
    jsonb_build_object('status', v_entry.status, 'note', v_entry.note),
    jsonb_build_object('status', v_norm_decision, 'note', COALESCE(p_note, v_entry.note))
  );

  RETURN jsonb_build_object(
    'success', true,
    'entry_id', p_entry_id,
    'new_status', v_norm_decision
  );
END;
$$;


-- ============================================================
-- RPC: confirm_day
-- Bulk verify / decide entries for a tailor on a specific date
-- ============================================================
CREATE OR REPLACE FUNCTION confirm_day(
  p_tailor_id uuid,
  p_work_date date,
  p_decision text,
  p_note text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_role text;
  v_user_unit uuid;
  v_updated_count integer;
  v_norm_decision text;
BEGIN
  v_user_role := get_user_role();
  v_user_unit := get_user_unit_id();

  IF is_month_locked(v_user_unit, p_work_date) THEN
    RAISE EXCEPTION 'Month % is locked', to_char(p_work_date, 'YYYY-MM');
  END IF;

  IF p_decision IN ('approved', 'verified') THEN
    v_norm_decision := 'verified';
  ELSIF p_decision = 'rejected' THEN
    v_norm_decision := 'rejected';
  ELSE
    RAISE EXCEPTION 'Invalid decision for confirm_day: %', p_decision;
  END IF;

  UPDATE entries
  SET status = v_norm_decision,
      verified_by = auth.uid(),
      verified_at = now(),
      note = COALESCE(p_note, note)
  WHERE unit_id = v_user_unit
    AND tailor_id = p_tailor_id
    AND work_date = p_work_date
    AND status = 'pending';

  GET DIAGNOSTICS v_updated_count = ROW_COUNT;

  RETURN jsonb_build_object(
    'success', true,
    'tailor_id', p_tailor_id,
    'work_date', p_work_date,
    'updated_count', v_updated_count,
    'status', v_norm_decision
  );
END;
$$;


-- ============================================================
-- RPC: lot_progress
-- Calculates comprehensive progress and cost breakdown for a lot
-- ============================================================
CREATE OR REPLACE FUNCTION lot_progress(p_lot_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  v_lot lots%ROWTYPE;
  v_operations_breakdown jsonb;
  v_total_completed integer := 0;
  v_total_cost_paise bigint := 0;
BEGIN
  SELECT * INTO v_lot FROM lots WHERE id = p_lot_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Lot % not found', p_lot_id;
  END IF;

  -- Operation breakdown
  SELECT jsonb_agg(op_data) INTO v_operations_breakdown
  FROM (
    SELECT 
      o.id AS operation_id,
      o.name AS operation_name,
      o.default_rate_paise,
      COALESCE(SUM(CASE WHEN e.status = 'verified' THEN e.pieces ELSE 0 END), 0) AS completed_pieces,
      COALESCE(SUM(CASE WHEN e.status = 'verified' THEN e.pieces * e.rate_paise ELSE 0 END), 0) AS cost_paise
    FROM operations o
    LEFT JOIN entries e ON e.operation_id = o.id AND e.lot_id = p_lot_id
    WHERE o.unit_id = v_lot.unit_id
    GROUP BY o.id, o.name, o.default_rate_paise
    ORDER BY o.name
  ) op_data;

  SELECT 
    COALESCE(SUM(CASE WHEN status = 'verified' THEN pieces ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN status = 'verified' THEN pieces * rate_paise ELSE 0 END), 0)
  INTO v_total_completed, v_total_cost_paise
  FROM entries
  WHERE lot_id = p_lot_id;

  RETURN jsonb_build_object(
    'lot_id', v_lot.id,
    'lot_no', v_lot.lot_no,
    'style', v_lot.style,
    'total_pieces', v_lot.total_pieces,
    'status', v_lot.status,
    'completed_pieces', v_total_completed,
    'total_labor_cost_paise', v_total_cost_paise,
    'progress_percent', CASE WHEN v_lot.total_pieces > 0 THEN ROUND((v_total_completed::numeric / v_lot.total_pieces::numeric) * 100, 1) ELSE 0 END,
    'operations', COALESCE(v_operations_breakdown, '[]'::jsonb)
  );
END;
$$;


-- ============================================================
-- RPC: close_month
-- Locks a month for the unit and generates the payroll run
-- ============================================================
CREATE OR REPLACE FUNCTION close_month(
  p_unit_id uuid,
  p_month date,  -- e.g. '2026-10-01'
  p_force_exclude_pending boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_month_start date := date_trunc('month', p_month)::date;
  v_month_end date := (date_trunc('month', p_month) + interval '1 month - 1 day')::date;
  v_pending_count integer := 0;
  v_closure_id uuid;
  v_payroll_summary jsonb;
  v_total_gross bigint := 0;
  v_total_net bigint := 0;
BEGIN
  -- 1. Check permissions
  IF get_user_role() NOT IN ('owner', 'manager') THEN
    RAISE EXCEPTION 'Only owners and managers can close payroll months';
  END IF;

  -- 2. Check if already closed
  IF EXISTS (SELECT 1 FROM month_closures WHERE unit_id = p_unit_id AND month = v_month_start) THEN
    RAISE EXCEPTION 'Month % is already closed for this unit', to_char(v_month_start, 'YYYY-MM');
  END IF;

  -- 3. Check for pending entries
  SELECT COUNT(*) INTO v_pending_count
  FROM entries
  WHERE unit_id = p_unit_id
    AND work_date >= v_month_start
    AND work_date <= v_month_end
    AND status = 'pending';

  IF v_pending_count > 0 AND NOT p_force_exclude_pending THEN
    RAISE EXCEPTION 'Cannot close month: % pending entries remain. Verify or reject them first, or pass force_exclude_pending = true', v_pending_count;
  END IF;

  -- 4. Calculate Tailor Payroll Lines
  SELECT jsonb_agg(line_data), COALESCE(SUM((line_data->>'gross_paise')::bigint), 0), COALESCE(SUM((line_data->>'net_paise')::bigint), 0)
  INTO v_payroll_summary, v_total_gross, v_total_net
  FROM (
    SELECT jsonb_build_object(
      'tailor_id', t.id,
      'tailor_name', t.name,
      'pieces_verified', COALESCE(e_agg.pieces, 0),
      'gross_paise', COALESCE(e_agg.gross, 0),
      'advances_paise', COALESCE(adj.advances, 0),
      'deductions_paise', COALESCE(adj.deductions, 0),
      'bonuses_paise', COALESCE(adj.bonuses, 0),
      'net_paise', COALESCE(e_agg.gross, 0) + COALESCE(adj.bonuses, 0) - COALESCE(adj.advances, 0) - COALESCE(adj.deductions, 0)
    ) AS line_data
    FROM tailors t
    LEFT JOIN (
      SELECT 
        tailor_id,
        SUM(pieces) AS pieces,
        SUM(pieces * rate_paise) AS gross
      FROM entries
      WHERE unit_id = p_unit_id
        AND work_date >= v_month_start
        AND work_date <= v_month_end
        AND status = 'verified'
      GROUP BY tailor_id
    ) e_agg ON e_agg.tailor_id = t.id
    LEFT JOIN (
      SELECT 
        tailor_id,
        SUM(CASE WHEN type = 'advance' THEN amount_paise ELSE 0 END) AS advances,
        SUM(CASE WHEN type = 'deduction' THEN amount_paise ELSE 0 END) AS deductions,
        SUM(CASE WHEN type = 'bonus' THEN amount_paise ELSE 0 END) AS bonuses
      FROM adjustments
      WHERE unit_id = p_unit_id
        AND month = v_month_start
      GROUP BY tailor_id
    ) adj ON adj.tailor_id = t.id
    WHERE t.unit_id = p_unit_id AND t.active = true
  ) summary_query;

  -- 5. Insert month closure
  INSERT INTO month_closures (unit_id, month, closed_by)
  VALUES (p_unit_id, v_month_start, auth.uid())
  RETURNING id INTO v_closure_id;

  -- 6. Write Audit Log
  INSERT INTO audit_log (unit_id, user_id, action, table_name, record_id, new_data)
  VALUES (
    p_unit_id,
    auth.uid(),
    'CLOSE_MONTH',
    'month_closures',
    v_closure_id,
    jsonb_build_object(
      'month', v_month_start,
      'total_gross_paise', v_total_gross,
      'total_net_paise', v_total_net,
      'excluded_pending_count', CASE WHEN p_force_exclude_pending THEN v_pending_count ELSE 0 END
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'closure_id', v_closure_id,
    'month', v_month_start,
    'total_gross_paise', v_total_gross,
    'total_net_paise', v_total_net,
    'tailors_count', jsonb_array_length(COALESCE(v_payroll_summary, '[]'::jsonb)),
    'payroll_lines', COALESCE(v_payroll_summary, '[]'::jsonb)
  );
END;
$$;
