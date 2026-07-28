# EO Builder

App singola pagina (nessuna dipendenza da server) per comporre l'esame obiettivo cliccando le voci cliniche. Le schede paziente si salvano solo nel browser di chi la usa (localStorage), non su un server.

## Pubblicarla su GitHub Pages

1. Vai su [github.com/new](https://github.com/new) e crea un nuovo repository (es. `eo-builder`), pubblico, senza README/gitignore (verranno caricati questi file).

2. Carica **`index.html`** nella root del repository:
   - dalla pagina del repo appena creato, clicca **"uploading an existing file"**
   - trascina dentro `index.html`
   - clicca **Commit changes**

   (Il nome deve essere esattamente `index.html` — è quello che GitHub Pages cerca per servire la pagina principale.)

3. Attiva GitHub Pages:
   - vai su **Settings → Pages** (menu a sinistra del repository)
   - sotto **Build and deployment → Source**, scegli **Deploy from a branch**
   - **Branch**: `main`, cartella `/ (root)` → **Save**

4. Dopo 1-2 minuti la pagina sarà live su:
   `https://<tuo-username-github>.github.io/eo-builder/`

   (sostituisci `eo-builder` con il nome che hai dato al repository)

5. Aggiungila alla schermata Home dell'iPhone (Safari → icona Condividi → **"Aggiungi a Home"**) per aprirla con un tap come un'app, sempre con JavaScript attivo — niente più anteprima Quick Look.

## Aggiornarla in futuro

Per ogni modifica: carica di nuovo `index.html` sostituendo quello esistente (upload → stesso nome → Commit changes). GitHub Pages si aggiorna da solo in un paio di minuti, senza bisogno di rifare i passaggi 3-4.

## Nota sui dati

Le schede paziente restano **solo sul dispositivo/browser** che le crea (localStorage) — non sono condivise tra iPhone, iPad o computer diversi, e non transitano mai dal repository GitHub (il codice è pubblico, i dati dei pazienti no, restano locali). Se cancelli i dati di navigazione di Safari, le schede si perdono: il referto va comunque sempre copiato nella cartella clinica ufficiale.
