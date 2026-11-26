-- ============================================================
-- EO Pocket / EO Builder: account da approvare
-- Chiunque può registrarsi, ma legge e scrive i propri dati sul cloud
-- solo dopo che l'amministratore lo ha messo in utenti_approvati.
--
-- Da eseguire UNA volta in Supabase: SQL Editor → New query → incolla → Run.
-- PRIMA sostituisci LA_TUA_EMAIL con l'email del tuo account, così il
-- tuo resta approvato e la sincronizzazione non si ferma.
-- ============================================================

-- 1. la tabella degli account approvati
create table if not exists public.utenti_approvati (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  email        text,
  approvato_il timestamptz not null default now()
);
alter table public.utenti_approvati enable row level security;

-- ognuno può solo sapere se lui stesso è approvato; nessuno può
-- aggiungersi da solo (non c'è nessuna policy di scrittura)
drop policy if exists "vedo solo me" on public.utenti_approvati;
create policy "vedo solo me" on public.utenti_approvati
  for select to authenticated
  using (user_id = auth.uid());

-- 2. il tuo account: approvato subito
insert into public.utenti_approvati (user_id, email)
select id, email from auth.users where email = 'LA_TUA_EMAIL'
on conflict (user_id) do nothing;

-- 3. eo_data: via le regole vecchie, al loro posto una sola regola:
--    solo le proprie righe, e solo se l'account è approvato
alter table public.eo_data enable row level security;
do $$
declare p record;
begin
  for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'eo_data' loop
    execute format('drop policy %I on public.eo_data', p.policyname);
  end loop;
end $$;
create policy "propri dati, account approvato" on public.eo_data
  for all to authenticated
  using      (user_id = auth.uid() and exists (select 1 from public.utenti_approvati a where a.user_id = auth.uid()))
  with check (user_id = auth.uid() and exists (select 1 from public.utenti_approvati a where a.user_id = auth.uid()));

-- controllo: deve comparire il tuo account
select * from public.utenti_approvati;


-- ============================================================
-- USO QUOTIDIANO (query da salvare nel SQL Editor)
-- ============================================================

-- chi si è registrato e aspetta l'approvazione:
-- select id, email, created_at from auth.users
-- where id not in (select user_id from public.utenti_approvati)
-- order by created_at desc;

-- approvare qualcuno:
-- insert into public.utenti_approvati (user_id, email)
-- select id, email from auth.users where email = 'collega@esempio.it';

-- togliere l'approvazione:
-- delete from public.utenti_approvati where email = 'collega@esempio.it';
