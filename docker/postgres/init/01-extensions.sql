-- ────────────────────────────────────────────────────────────────────────────
-- LATTICE Postgres init scripts
--
-- Files in this directory are mounted into /docker-entrypoint-initdb.d and run
-- in alphabetical order on first boot of a *fresh* data volume. The volume
-- lattice-postgres-data is named, so first-boot only happens once per machine.
--
-- Use this for:
--   1. Enabling extensions the schema depends on (uuid-ossp, pgcrypto, etc.)
--   2. Creating the LATTICE role / database layout expected by the app
--   3. Seeding dev-only data
--
-- Conventions:
--   - Filenames: NN-description.sql  (NN is the load order)
--   - Idempotent where possible (CREATE … IF NOT EXISTS, etc.)
--   - Never DROP / TRUNCATE in this directory
-- ────────────────────────────────────────────────────────────────────────────

-- 01-extensions.sql
-- Extensions the LATTICE schema (P1) will rely on. uuid-ossp gives us uuid_generate_v4()
-- as a SQL function; pgcrypto adds gen_random_uuid() (the modern equivalent).
-- Both are pre-installed on the postgres:16-alpine image.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
