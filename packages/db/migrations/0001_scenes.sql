create table scenes (
    id uuid primary key default gen_random_uuid(),
    description text not null, 
    media uuid references storage.objects (id) not null,
    available_at timestamptz not null
);
