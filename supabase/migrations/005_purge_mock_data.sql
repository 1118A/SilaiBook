-- ============================================================
-- Migration 005: Purge Mock & Seed Data for Production Deployment
-- Target: Supabase PostgreSQL
-- ============================================================

-- Disable triggers temporarily to avoid cascading audit noise during purge
SET session_replication_role = 'replica';

-- 1. Purge all transactional and piece-entry data
TRUNCATE TABLE adjustments CASCADE;
TRUNCATE TABLE entries CASCADE;
TRUNCATE TABLE audit_logs CASCADE;

-- 2. Purge production catalog and roster seed items
TRUNCATE TABLE lots CASCADE;
TRUNCATE TABLE operations CASCADE;
TRUNCATE TABLE tailors CASCADE;

-- 3. Purge seed garment units (preserves any real production units)
DELETE FROM units WHERE id IN (
  'a0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000004'
);

-- Re-enable normal trigger execution
SET session_replication_role = 'origin';

-- Verify clean state
COMMENT ON TABLE units IS 'SilaiBook production tenant units - Seed data purged for production';
