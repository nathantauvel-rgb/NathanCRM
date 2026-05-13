-- Table prospects
create table prospects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  nom text not null,
  entreprise text not null,
  secteur text default 'Artisan',
  telephone text,
  email text,
  ville text,
  statut text not null default 'a_contacter'
    check (statut in ('a_contacter','contacte','en_discussion','proposition','client','perdu')),
  prochaine_relance date,
  notes text
);

-- Table interactions (historique des échanges)
create table interactions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  prospect_id uuid references prospects(id) on delete cascade,
  type text default 'note' check (type in ('note','appel','email','whatsapp','rdv')),
  contenu text not null,
  date_interaction date default current_date
);

-- Mise à jour automatique du champ updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger prospects_updated_at
  before update on prospects
  for each row execute function update_updated_at();

-- Index pour les relances (dashboard)
create index idx_prospects_relance on prospects(prochaine_relance)
  where prochaine_relance is not null and statut not in ('client','perdu');

-- Index pour le statut (pipeline)
create index idx_prospects_statut on prospects(statut);
