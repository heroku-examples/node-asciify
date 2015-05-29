create table if not exists art (
  id serial primary key,
  uuid text,
  url text,
  ascii text,
  created_at timestamptz default now() not null
);
