-- Core entities with LogLine ID as primary key
create table if not exists tenants (
  id text primary key,
  name text not null,
  created_at timestamptz default now()
);

create table if not exists logline_ids (
  id text primary key,           -- LogLine ID (universal identity)
  kind text not null,            -- 'person' | 'object' | 'contract' | 'tenant' | 'interface' | 'agent'
  tenant_id text references tenants(id) on delete set null,
  display_name text,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
create index if not exists idx_logline_ids_tenant on logline_ids(tenant_id);

create table if not exists contracts (
  id text primary key,
  tenant_id text references tenants(id) on delete cascade,
  workflow text not null,
  flow text not null,
  payload jsonb,
  meta jsonb default '{}'::jsonb,
  provenance jsonb default '{}'::jsonb,
  signatures jsonb default '[]'::jsonb,
  ts timestamptz default now()
);
create index if not exists idx_contracts_tenant on contracts(tenant_id);
create index if not exists idx_contracts_flow on contracts(workflow, flow);

create table if not exists identities (
  subject_id text primary key references logline_ids(id) on delete cascade,
  secret text not null,      -- placeholder; em produção use hash/keys
  trust numeric default 0
);
