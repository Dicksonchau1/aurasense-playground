-- =====================================================================
-- AuraSense NEPA — Façade module initial migration
-- Postgres 15+ (Supabase). Enables PostGIS, pgcrypto, pgvector.
-- All tables are multi-tenant via organization_id + Row Level Security.
-- audit_logs is append-only; enforced by trigger.
-- =====================================================================

create extension if not exists "pgcrypto";
create extension if not exists "postgis";
create extension if not exists "vector";

-- ---------------------------------------------------------------------
-- Helper: current org id from JWT claim `org_id`
-- ---------------------------------------------------------------------
create or replace function auth.org_id() returns uuid
language sql stable as $$
  select nullif(current_setting('request.jwt.claim.org_id', true), '')::uuid
$$;

create or replace function auth.has_role(role_name text) returns boolean
language sql stable as $$
  select coalesce(
    (current_setting('request.jwt.claim.roles', true))::jsonb ? role_name,
    false
  )
$$;

-- ---------------------------------------------------------------------
-- Core tenancy
-- ---------------------------------------------------------------------
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  region text not null default 'HK',
  plan text not null default 'starter',
  created_at timestamptz not null default now()
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid unique,
  org_id uuid not null references organizations(id) on delete restrict,
  email text not null unique,
  name text,
  roles text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index users_org_idx on users(org_id);

-- ---------------------------------------------------------------------
-- Drone registry
-- ---------------------------------------------------------------------
create type drone_status as enum ('active','maintenance','retired');

create table if not exists drones (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete restrict,
  model text not null,
  serial text not null,
  cert_no text,
  insurance_expiry date,
  firmware_version text,
  status drone_status not null default 'active',
  last_flight_at timestamptz,
  created_at timestamptz not null default now(),
  unique (org_id, serial)
);

create table if not exists drone_maintenance (
  id uuid primary key default gen_random_uuid(),
  drone_id uuid not null references drones(id) on delete restrict,
  type text not null,
  note text,
  performed_by uuid references users(id),
  performed_at timestamptz not null,
  next_due_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists pilots (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete restrict,
  user_id uuid not null references users(id) on delete restrict,
  license_no text not null,
  license_expiry date not null,
  medical_expiry date,
  recurrent_training_at date,
  created_at timestamptz not null default now(),
  unique (org_id, license_no)
);

-- ---------------------------------------------------------------------
-- Buildings and elevations (PostGIS)
-- ---------------------------------------------------------------------
create table if not exists buildings (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete restrict,
  address text not null,
  coords geography(Point, 4326) not null,
  year_built int,
  height_m numeric(6,2),
  mbis_cycle text,
  owner_org text,
  created_at timestamptz not null default now()
);

create index buildings_coords_gix on buildings using gist (coords);

create type facade_face as enum ('N','E','S','W');

create table if not exists building_elevations (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references buildings(id) on delete cascade,
  face facade_face not null,
  geometry geography(Polygon, 4326),
  mesh_ref text,
  plan_ref text,
  unique (building_id, face)
);

-- ---------------------------------------------------------------------
-- Flights
-- ---------------------------------------------------------------------
create type flight_status as enum ('planned','started','completed','aborted');

create table if not exists drone_flights (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete restrict,
  drone_id uuid not null references drones(id) on delete restrict,
  pilot_id uuid not null references pilots(id) on delete restrict,
  building_id uuid not null references buildings(id) on delete restrict,
  flight_plan jsonb not null,
  weather jsonb,
  caa_permit_ref text,
  status flight_status not null default 'planned',
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

create index drone_flights_building_idx on drone_flights(building_id);

-- ---------------------------------------------------------------------
-- Calibration profiles & regression
-- ---------------------------------------------------------------------
create type calibration_status as enum ('draft','tested','promoted','retired');

create table if not exists calibration_profiles (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete restrict,
  model_version text not null,
  params jsonb not null,
  status calibration_status not null default 'draft',
  created_by uuid references users(id),
  created_at timestamptz not null default now()
);

create table if not exists regression_runs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete restrict,
  calibration_profile_id uuid not null references calibration_profiles(id) on delete restrict,
  dataset_id text not null,
  metrics jsonb not null,
  passed boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Inspection jobs, defects, reports
-- ---------------------------------------------------------------------
create type job_status as enum ('created','ingesting','processing','completed','failed');

create table if not exists inspection_jobs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete restrict,
  building_id uuid not null references buildings(id) on delete restrict,
  flight_id uuid not null references drone_flights(id) on delete restrict,
  status job_status not null default 'created',
  calibration_profile_id uuid references calibration_profiles(id),
  model_version text,
  progress numeric(4,3) not null default 0,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now()
);

create type mbis_band as enum (
  'NO_IMMEDIATE_ACTION',
  'REQUIRE_INVESTIGATION',
  'REQUIRE_REPAIR',
  'IMMINENTLY_DANGEROUS'
);

create type defect_type as enum (
  'crack','bulging','leakage','spalling','seepage','deformation'
);

create table if not exists defects (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete restrict,
  job_id uuid not null references inspection_jobs(id) on delete cascade,
  elevation_id uuid not null references building_elevations(id) on delete restrict,
  type defect_type not null,
  bbox jsonb not null,
  centroid geography(PointZ, 4326),
  severity_score numeric(5,3) not null,
  mbis_band mbis_band not null,
  chemical_scores jsonb,
  image_refs text[] not null default '{}',
  embedding vector(512),
  created_at timestamptz not null default now()
);

create index defects_job_idx on defects(job_id);
create index defects_band_idx on defects(mbis_band);
create index defects_centroid_gix on defects using gist (centroid);

create table if not exists mbis_reports (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete restrict,
  job_id uuid not null references inspection_jobs(id) on delete restrict,
  html_ref text not null,
  pdf_ref text not null,
  ri_user_id uuid references users(id),
  signed_at timestamptz,
  version int not null default 1,
  content_hash text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Audit log (append-only)
-- ---------------------------------------------------------------------
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  actor_id uuid,
  action text not null,
  entity text not null,
  entity_id uuid,
  before_hash text,
  after_hash text,
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index audit_logs_entity_idx on audit_logs(entity, entity_id);

create or replace function audit_logs_block_mutation() returns trigger
language plpgsql as $$
begin
  raise exception 'audit_logs is append-only';
end $$;

drop trigger if exists audit_logs_no_update on audit_logs;
create trigger audit_logs_no_update
before update or delete on audit_logs
for each row execute function audit_logs_block_mutation();

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
do $$
declare t text;
begin
  for t in
    select unnest(array[
      'organizations','users','drones','drone_maintenance','pilots',
      'buildings','building_elevations','drone_flights',
      'calibration_profiles','regression_runs',
      'inspection_jobs','defects','mbis_reports','audit_logs'
    ])
  loop
    execute format('alter table %I enable row level security;', t);
    execute format('alter table %I force row level security;', t);
  end loop;
end $$;

-- organizations: user can see only own org
create policy organizations_self on organizations
  for select using (id = auth.org_id());

-- users: within own org
create policy users_rw on users
  for all using (org_id = auth.org_id())
  with check (org_id = auth.org_id());

-- Generic tenant policy helper applied per table
create policy drones_tenant on drones
  for all using (org_id = auth.org_id()) with check (org_id = auth.org_id());

create policy drone_maint_tenant on drone_maintenance
  for all using (
    exists (select 1 from drones d where d.id = drone_maintenance.drone_id and d.org_id = auth.org_id())
  )
  with check (
    exists (select 1 from drones d where d.id = drone_maintenance.drone_id and d.org_id = auth.org_id())
  );

create policy pilots_tenant on pilots
  for all using (org_id = auth.org_id()) with check (org_id = auth.org_id());

create policy buildings_tenant on buildings
  for all using (org_id = auth.org_id()) with check (org_id = auth.org_id());

create policy elevations_tenant on building_elevations
  for all using (
    exists (select 1 from buildings b where b.id = building_elevations.building_id and b.org_id = auth.org_id())
  )
  with check (
    exists (select 1 from buildings b where b.id = building_elevations.building_id and b.org_id = auth.org_id())
  );

create policy flights_tenant on drone_flights
  for all using (org_id = auth.org_id()) with check (org_id = auth.org_id());

create policy calib_tenant on calibration_profiles
  for all using (org_id = auth.org_id()) with check (org_id = auth.org_id());

create policy regression_tenant on regression_runs
  for all using (org_id = auth.org_id()) with check (org_id = auth.org_id());

create policy jobs_tenant on inspection_jobs
  for all using (org_id = auth.org_id()) with check (org_id = auth.org_id());

create policy defects_tenant on defects
  for all using (org_id = auth.org_id()) with check (org_id = auth.org_id());

create policy reports_tenant on mbis_reports
  for all using (org_id = auth.org_id()) with check (org_id = auth.org_id());

-- Reports: only RI can sign (enforced at API; here gate UPDATE of signed fields)
create policy reports_ri_sign on mbis_reports
  for update using (org_id = auth.org_id() and auth.has_role('RI'))
  with check (org_id = auth.org_id() and auth.has_role('RI'));

-- Audit logs: read within own org (GovViewer can also read when cross-org share exists, handled at API)
create policy audit_read_tenant on audit_logs
  for select using (org_id = auth.org_id());

-- No insert policy on audit_logs for normal roles; inserts happen via SECURITY DEFINER function
create or replace function write_audit_log(
  p_actor_id uuid, p_action text, p_entity text, p_entity_id uuid,
  p_before_hash text, p_after_hash text, p_ip text, p_user_agent text
) returns void
language plpgsql security definer set search_path = public as $$
begin
  insert into audit_logs(org_id, actor_id, action, entity, entity_id,
                         before_hash, after_hash, ip, user_agent)
  values (auth.org_id(), p_actor_id, p_action, p_entity, p_entity_id,
          p_before_hash, p_after_hash, p_ip, p_user_agent);
end $$;

revoke all on function write_audit_log from public;
grant execute on function write_audit_log to authenticated;

-- ---------------------------------------------------------------------
-- Useful views
-- ---------------------------------------------------------------------
create or replace view v_drones_expiring as
  select d.*,
         (d.insurance_expiry - current_date) as days_to_insurance_expiry
  from drones d
  where d.insurance_expiry is not null
    and d.insurance_expiry <= current_date + interval '90 days';

create or replace view v_pilots_expiring as
  select p.*,
         (p.license_expiry - current_date) as days_to_license_expiry
  from pilots p
  where p.license_expiry <= current_date + interval '90 days';

-- ---------------------------------------------------------------------
-- Done.
-- ---------------------------------------------------------------------
