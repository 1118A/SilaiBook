-- SilaiBook Performance Optimization Migration
-- Version: 004_performance_indexes.sql
-- Goal: Accelerate query execution speeds to <15ms, prevent full table scans, and guarantee idempotency.

-- 1. Accelerates monthly tailor salary aggregation (used by salary engine & monthly rollups)
CREATE INDEX IF NOT EXISTS idx_entries_salary_lookup 
ON piece_entries (unit_id, tailor_id, work_date) 
WHERE status = 'verified';

-- 2. Accelerates manager verification queue lookup (instant inbox loading)
CREATE INDEX IF NOT EXISTS idx_entries_pending_verification 
ON piece_entries (unit_id, status) 
WHERE status = 'pending';

-- 3. Composite index on lots for active factory styles & progress tracking
CREATE INDEX IF NOT EXISTS idx_lots_unit_status 
ON lots (unit_id, status);

-- 4. Fast lookup for active tailors within a unit
CREATE INDEX IF NOT EXISTS idx_tailors_unit_active 
ON tailors (unit_id, active);

-- 5. Materialized View for Platform & Unit Historical Analytics
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_monthly_tailor_stats AS
SELECT 
  unit_id,
  tailor_id,
  to_char(work_date::date, 'YYYY-MM') as month,
  COUNT(id) as total_entries,
  SUM(pieces) as total_pieces,
  SUM(pieces * rate_paise) as gross_paise
FROM piece_entries
WHERE status = 'verified'
GROUP BY unit_id, tailor_id, to_char(work_date::date, 'YYYY-MM');

-- Unique index for concurrent refreshes without read locking
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_monthly_tailor 
ON mv_monthly_tailor_stats (unit_id, tailor_id, month);
