# Approvazione dei nuovi account via mail

Quando un nuovo utente conferma la sua email, arriva una mail all'amministratore con **Approva** / **Rifiuta**. Il link apre `approva.html` (nell'app), che chiede conferma con un pulsante; poi la funzione `approva-utenti` mette l'utente in `utenti_approvati` (o cancella l'account).

Prerequisito: `approvazione-account.sql` già eseguito.

## 1. Resend (chi spedisce le mail)
1. Registrati su https://resend.com **con l'email dove vuoi ricevere gli avvisi** (senza un dominio tuo, Resend spedisce solo a quell'indirizzo).
2. API Keys → Create API Key (permesso «Sending access») → copia la chiave (`re_…`).

## 2. La funzione in Supabase
1. Dashboard → **Edge Functions** → Deploy a new function → **Via Editor**.
2. Nome: `approva-utenti`.
3. Cancella il codice di esempio e incolla tutto `supabase/functions/approva-utenti/index.ts` → Deploy.
4. Nella pagina della funzione → Details (o Settings): **spegni «Enforce JWT verification»** → Save.

## 3. I segreti
Edge Functions → **Secrets** → aggiungi:
| Nome | Valore |
|---|---|
| `RESEND_API_KEY` | la chiave `re_…` di Resend |
| `ADMIN_EMAIL` | la tua email (la stessa dell'account Resend) |
| `APPROVE_SECRET` | una frase segreta lunga e casuale (la stessa del punto 4) |

## 4. L'avviso dal database
SQL Editor → incolla `supabase/avviso-nuovi-utenti.sql`, sostituisci `IL_SEGRETO` con lo stesso valore di `APPROVE_SECRET` → Run.

## Prova
Registrati dall'app con un'altra email, conferma la mail: entro un minuto arriva l'avviso. Se non arriva: Edge Functions → approva-utenti → **Logs**.
