-- 002_analytics_views.sql
-- SilaiBook SQL Views & RPC functions for Manager Analytics

-- ============================================================
-- VIEW: Daily Tailor Output Summary
-- ============================================================
CREATE OR REPLACE VIEW view_daily_tailor_summary AS
SELECT
  unit_id,
  tailor_id,
  work_date,
  COUNT(*) AS total_entries,
  SUM(CASE WHEN status = 'verified' THEN pieces ELSE 0 END) AS verified_pieces,
  SUM(CASE WHEN status = 'pending' THEN pieces ELSE 0 END) AS pending_pieces,
  SUM(CASE WHEN status = 'rejected' THEN pieces ELSE 0 END) AS rejected_pieces,
  SUM(CASE WHEN status = 'verified' THEN pieces * rate_paise ELSE 0 END) AS verified_earnings_paise
FROM entries
GROUP BY unit_id, tailor_id, work_date;

-- ============================================================
-- VIEW: Lot Analytics Summary
-- ============================================================
CREATE OR REPLACE VIEW view_lot_analytics AS
SELECT
  l.id AS lot_id,
  l.unit_id,
  l.lot_no,
  l.style,
  l.total_pieces,
  l.status,
  COALESCE(SUM(CASE WHEN e.status = 'verified' THEN e.pieces ELSE 0 END), 0) AS completed_pieces,
  COALESCE(SUM(CASE WHEN e.status = 'verified' THEN e.pieces * e.rate_paise ELSE 0 END), 0) AS total_labor_cost_paise,
  COUNT(DISTINCT CASE WHEN e.status = 'verified' THEN e.tailor_id END) AS active_tailors_count
FROM lots l
LEFT JOIN entries e ON e.lot_id = l.id
GROUP BY l.id, l.unit_id, l.lot_no, l.style, l.total_pieces, l.status;

-- ============================================================
-- RPC FUNCTION: Get Unit Analytics Summary
-- ============================================================
CREATE OR REPLACE FUNCTION get_unit_analytics_summary(target_unit_id uuid, target_month text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'pieces_today', COALESCE((
      SELECT SUM(pieces) FROM entries 
      WHERE unit_id = target_unit_id AND work_date = CURRENT_DATE AND status = 'verified'
    ), 0),
    'pieces_this_month', COALESCE((
      SELECT SUM(pieces) FROM entries 
      WHERE unit_id = target_unit_id AND to_char(work_date, 'YYYY-MM') = target_month AND status = 'verified'
    ), 0),
    'payroll_so_far_paise', COALESCE((
      SELECT SUM(pieces * rate_paise) FROM entries 
      WHERE unit_id = target_unit_id AND to_char(work_date, 'YYYY-MM') = target_month AND status = 'verified'
    ), 0),
    'pending_count', COALESCE((
      SELECT COUNT(*) FROM entries 
      WHERE unit_id = target_unit_id AND status = 'pending'
    ), 0)
  ) INTO result;

  RETURN result;
END;
$$;
