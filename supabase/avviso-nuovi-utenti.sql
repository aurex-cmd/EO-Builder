-- ============================================================
-- Mail all'amministratore quando un nuovo utente conferma l'email.
-- Da eseguire UNA volta nel SQL Editor DOPO aver pubblicato la funzione
-- approva-utenti e impostato i suoi segreti.
-- PRIMA sostituisci IL_SEGRETO con lo stesso valore di APPROVE_SECRET.
-- ============================================================
create extension if not exists pg_net;

create or replace function public.avvisa_nuovo_utente()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email_confirmed_at is not null
     and (tg_op = 'INSERT' or old.email_confirmed_at is null)
     and not exists (select 1 from public.utenti_approvati where user_id = new.id) then
    begin
      perform net.http_post(
        url     := 'https://bapfuaxjdjnfvkroznxl.supabase.co/functions/v1/approva-utenti',
        headers := jsonb_build_object('Content-Type', 'application/json', 'x-trigger-secret', 'IL_SEGRETO'),
        body    := jsonb_build_object('tipo', 'nuovo', 'user_id', new.id, 'email', new.email)
      );
    exception when others then
      -- un problema con la mail non deve mai bloccare la registrazione
      raise warning 'avviso nuovo utente non inviato: %', sqlerrm;
    end;
  end if;
  return new;
end $$;

-- solo il database può eseguirla
revoke all on function public.avvisa_nuovo_utente() from public, anon, authenticated;

drop trigger if exists avvisa_nuovo_utente on auth.users;
create trigger avvisa_nuovo_utente
  after insert or update of email_confirmed_at on auth.users
  for each row execute function public.avvisa_nuovo_utente();
