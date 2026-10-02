-- 001_initial_schema.sql
-- SilaiBook database schema: multi-unit piece-rate payroll

-- ============================================================
-- TABLES
-- ============================================================

-- Garment units (factories)
CREATE TABLE units (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- User profiles (linked to auth.users)
CREATE TABLE profiles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  unit_id     uuid NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  role        text NOT NULL CHECK (role IN ('owner', 'manager', 'tailor')),
  full_name   text NOT NULL DEFAULT '',
  phone       text,
  language    text NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'gu', 'hi')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, unit_id)
);

-- Tailors (may or may not have a login / profile)
CREATE TABLE tailors (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id     uuid NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  name        text NOT NULL,
  phone       text,
  active      boolean NOT NULL DEFAULT true,
  profile_id  uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Lots (garment batches)
CREATE TABLE lots (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id       uuid NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  lot_no        text NOT NULL,
  style         text NOT NULL DEFAULT '',
  total_pieces  integer NOT NULL DEFAULT 0 CHECK (total_pieces >= 0),
  status        text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (unit_id, lot_no)
);

-- Operations (e.g. stitching collar, hemming, etc.)
CREATE TABLE operations (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id           uuid NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  name              text NOT NULL,
  default_rate_paise integer NOT NULL DEFAULT 0 CHECK (default_rate_paise >= 0),
  created_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (unit_id, name)
);

-- Piece-work entries
CREATE TABLE entries (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id       uuid NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  tailor_id     uuid NOT NULL REFERENCES tailors(id) ON DELETE CASCADE,
  lot_id        uuid NOT NULL REFERENCES lots(id) ON DELETE CASCADE,
  operation_id  uuid NOT NULL REFERENCES operations(id) ON DELETE CASCADE,
  work_date     date NOT NULL,
  pieces        integer NOT NULL CHECK (pieces > 0),
  rate_paise    integer NOT NULL CHECK (rate_paise >= 0),
  status        text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  entered_by    uuid REFERENCES auth.users(id),
  verified_by   uuid REFERENCES auth.users(id),
  verified_at   timestamptz,
  note          text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Monthly adjustments (bonus, advance, deduction)
CREATE TABLE adjustments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id       uuid NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  tailor_id     uuid NOT NULL REFERENCES tailors(id) ON DELETE CASCADE,
  month         date NOT NULL,  -- first day of the month
  type          text NOT NULL CHECK (type IN ('bonus', 'advance', 'deduction')),
  amount_paise  integer NOT NULL CHECK (amount_paise > 0),
  note          text,
  created_by    uuid REFERENCES auth.users(id),
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Month closures (locks a month for a unit)
CREATE TABLE month_closures (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id     uuid NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  month       date NOT NULL,  -- first day of the month
  closed_by   uuid NOT NULL REFERENCES auth.users(id),
  closed_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (unit_id, month)
);

-- Audit log
CREATE TABLE audit_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id     uuid NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  user_id     uuid REFERENCES auth.users(id),
  action      text NOT NULL,
  table_name  text,
  record_id   uuid,
  old_data    jsonb,
  new_data    jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);


-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_entries_unit_date   ON entries (unit_id, work_date);
CREATE INDEX idx_entries_tailor_date ON entries (tailor_id, work_date);
CREATE INDEX idx_entries_lot         ON entries (lot_id);
CREATE INDEX idx_tailors_unit        ON tailors (unit_id);
CREATE INDEX idx_lots_unit           ON lots (unit_id);
CREATE INDEX idx_operations_unit     ON operations (unit_id);
CREATE INDEX idx_adjustments_unit    ON adjustments (unit_id, tailor_id, month);
CREATE INDEX idx_profiles_user       ON profiles (user_id);
CREATE INDEX idx_profiles_unit       ON profiles (unit_id);
CREATE INDEX idx_audit_log_unit      ON audit_log (unit_id, created_at);


-- ============================================================
-- HELPER FUNCTION: get the current user's unit_id
-- ============================================================

CREATE OR REPLACE FUNCTION get_user_unit_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT unit_id FROM profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Helper: get the current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Helper: get the tailor_id linked to the current user (if tailor)
CREATE OR REPLACE FUNCTION get_user_tailor_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT t.id FROM tailors t
  JOIN profiles p ON p.id = t.profile_id
  WHERE p.user_id = auth.uid()
  LIMIT 1;
$$;


-- ============================================================
-- SIGNUP FUNCTION: creates unit + owner profile atomically
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_signup(
  unit_name text,
  owner_name text,
  owner_phone text DEFAULT NULL,
  owner_language text DEFAULT 'en'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_unit_id uuid;
  new_profile_id uuid;
BEGIN
  -- Create unit
  INSERT INTO units (name)
  VALUES (unit_name)
  RETURNING id INTO new_unit_id;

  -- Create owner profile
  INSERT INTO profiles (user_id, unit_id, role, full_name, phone, language)
  VALUES (auth.uid(), new_unit_id, 'owner', owner_name, owner_phone, owner_language)
  RETURNING id INTO new_profile_id;

  RETURN jsonb_build_object(
    'unit_id', new_unit_id,
    'profile_id', new_profile_id
  );
END;
$$;


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE units          ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE tailors        ENABLE ROW LEVEL SECURITY;
ALTER TABLE lots           ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries        ENABLE ROW LEVEL SECURITY;
ALTER TABLE adjustments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE month_closures ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log      ENABLE ROW LEVEL SECURITY;


-- ---- UNITS ----
CREATE POLICY "Users can view their own unit"
  ON units FOR SELECT
  USING (id = get_user_unit_id());

CREATE POLICY "Service role can manage units"
  ON units FOR ALL
  USING (auth.role() = 'service_role');


-- ---- PROFILES ----
CREATE POLICY "Users can view profiles in their unit"
  ON profiles FOR SELECT
  USING (unit_id = get_user_unit_id());

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Service role can manage profiles"
  ON profiles FOR ALL
  USING (auth.role() = 'service_role');


-- ---- TAILORS ----
CREATE POLICY "Users can view tailors in their unit"
  ON tailors FOR SELECT
  USING (unit_id = get_user_unit_id());

CREATE POLICY "Owners/managers can manage tailors"
  ON tailors FOR ALL
  USING (
    unit_id = get_user_unit_id()
    AND get_user_role() IN ('owner', 'manager')
  );


-- ---- LOTS ----
CREATE POLICY "Users can view lots in their unit"
  ON lots FOR SELECT
  USING (unit_id = get_user_unit_id());

CREATE POLICY "Owners/managers can manage lots"
  ON lots FOR ALL
  USING (
    unit_id = get_user_unit_id()
    AND get_user_role() IN ('owner', 'manager')
  );


-- ---- OPERATIONS ----
CREATE POLICY "Users can view operations in their unit"
  ON operations FOR SELECT
  USING (unit_id = get_user_unit_id());

CREATE POLICY "Owners/managers can manage operations"
  ON operations FOR ALL
  USING (
    unit_id = get_user_unit_id()
    AND get_user_role() IN ('owner', 'manager')
  );


-- ---- ENTRIES ----
-- All unit members can view entries in their unit
CREATE POLICY "Users can view entries in their unit"
  ON entries FOR SELECT
  USING (unit_id = get_user_unit_id());

-- Tailors can only insert entries for themselves, status must be 'pending'
CREATE POLICY "Tailors can insert own entries"
  ON entries FOR INSERT
  WITH CHECK (
    unit_id = get_user_unit_id()
    AND (
      get_user_role() IN ('owner', 'manager')
      OR (
        get_user_role() = 'tailor'
        AND tailor_id = get_user_tailor_id()
        AND status = 'pending'
      )
    )
  );

-- Only owners/managers can update entries (verify/reject)
CREATE POLICY "Owners/managers can update entries"
  ON entries FOR UPDATE
  USING (
    unit_id = get_user_unit_id()
    AND get_user_role() IN ('owner', 'manager')
  );

-- Only owners/managers can delete entries
CREATE POLICY "Owners/managers can delete entries"
  ON entries FOR DELETE
  USING (
    unit_id = get_user_unit_id()
    AND get_user_role() IN ('owner', 'manager')
  );


-- ---- ADJUSTMENTS ----
CREATE POLICY "Users can view adjustments in their unit"
  ON adjustments FOR SELECT
  USING (unit_id = get_user_unit_id());

CREATE POLICY "Owners/managers can manage adjustments"
  ON adjustments FOR ALL
  USING (
    unit_id = get_user_unit_id()
    AND get_user_role() IN ('owner', 'manager')
  );


-- ---- MONTH CLOSURES ----
CREATE POLICY "Users can view month closures in their unit"
  ON month_closures FOR SELECT
  USING (unit_id = get_user_unit_id());

CREATE POLICY "Owners/managers can manage month closures"
  ON month_closures FOR ALL
  USING (
    unit_id = get_user_unit_id()
    AND get_user_role() IN ('owner', 'manager')
  );


-- ---- AUDIT LOG ----
CREATE POLICY "Owners/managers can view audit log"
  ON audit_log FOR SELECT
  USING (
    unit_id = get_user_unit_id()
    AND get_user_role() IN ('owner', 'manager')
  );

CREATE POLICY "Service role can manage audit log"
  ON audit_log FOR ALL
  USING (auth.role() = 'service_role');
