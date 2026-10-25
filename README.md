# E.O. Builder

App a pagina singola (nessuna dipendenza da server per il funzionamento di base) per comporre l'esame obiettivo cliccando le voci cliniche. Include anche una mappa reparto, la vista Diari, la gestione ricoveri e alcuni strumenti clinici integrati (analizzatore EGA, calcolatore VFG, dosaggi renali dei farmaci).

## Cosa c'è dentro

- **Esame obiettivo click-to-compose**, per apparato, con referto generato automaticamente
- **Reparto**: mappa dei letti per settore, stato del diario di oggi (verde/viola), pagina dedicata "Parametri vitali" per aggiornare rapidamente SpO2/PA/FC/TC di tutto un settore
- **Diari**: tutti i diari scritti oggi in un'unica vista, modificabili direttamente
- **Ricoveri**: anamnesi e diario d'ingresso, generazione consegne in .docx
- **Strumenti clinici integrati**, richiamati scrivendo un trigger dentro un diario (in Diari):
  - `EGA:` → analizzatore emogasanalisi (equilibrio acido-base, anion gap, lattati); alla chiusura scrive un'interpretazione abbreviata nel diario
  - `VFG` o `Cockroft`/`Cockcroft` → calcolatore Cockcroft-Gault; stesso comportamento alla chiusura
  - `/Arixtra`, `/Inhixa`, `/NAO` o `/DOAC` → box informativi con i dosaggi renali (fondaparinux, enoxaparina, i 4 anticoagulanti orali diretti), che evidenziano la fascia giusta se nel diario è già presente una VFG

## EO Minimal

All'indirizzo `.../minimal/` (es. `https://<tuo-username-github>.github.io/eo-builder/minimal/`) si apre la stessa app con un'interfaccia essenziale e chiara: una home sobria: in alto la scheda **Reparto**, con i visti di oggi e i diari da copiare (scelto un settore, i suoi dati: visti, da vedere, diari da copiare e il tondo di avanzamento); sotto un elenco con un dato per voce: **Ricoveri** (con calendario e statistiche animate), **Calendario dimissioni**, **Aggiorna consegne** (nei weekend e festivi **Consegne Weekend**, in cima), **Rubrica** e **Strumenti** (tutto il resto, comprese le Impostazioni con l'account per la sincronizzazione); in fondo la nota sull'app; gli appoggi di ogni settore stanno sotto i suoi letti, col "+" per aggiungerne uno. Il **Reparto** si apre sulla mappa di tutti i settori, ciascuno coi suoi letti in piccolo (appoggi in coda): nei feriali grigi e trasparenti, nel weekend e nei festivi già coi loro colori e coi bollini delle consegne. Toccando un settore questo si colora, scivola al centro e si apre in una scheda sola, con gli appoggi (col "+" per aggiungerne uno) e i letti a tinta unita, quattro per riga (il tasto ? accanto a "Letti" apre la legenda di colori, bordi e bollini); sopra, "Tutti i settori" riporta alla mappa (come indietro) e a destra ci sono il nome del settore, i suoi dati e il tondo di avanzamento; sotto, "Altri settori" mostra il resto del reparto in piccolo e si tocca per passare a un altro settore. Una pressione lunga su un settore della mappa apre "Svuota settore". In alto due pulsanti, **Visita** e **Diari**, mostrano gli stessi letti con colori diversi: in Visita l'anello conta i letti visti oggi e un letto apre l'esame obiettivo con i tag (la stessa schermata dell'app normale), in Diari l'anello conta i diari copiati, i letti senza diario di oggi restano tenui e un letto apre il suo diario a tutto schermo (esame obiettivo, "Agli EE", referti e provvedimenti, con antibiotici, richieste e i pallini E/D/i). In basso una scena tenue disegnata (un letto e lo stetoscopio; in Diari i fogli e la matita). Ogni letto conta come pieno; una pressione lunga su un letto senza scheda lo segna vuoto e lo toglie dal conto. Se c'è l'esame obiettivo di almeno un ricoverato (aperto dal Ricovero) compare anche il settore **Ricoveri**, coi ricoverati di oggi. In Diari, sotto i letti, **Aggiorna consegne** è la tabella di fine giro dell'app normale, con le stesse funzioni. I dati sono gli stessi dell'app normale, sincronizzazione compresa; l'app aperta all'indirizzo normale non cambia. Per gli strumenti clinici c'è il collegamento all'app completa.

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

Il file è autosufficiente: non serve configurare nient'altro su GitHub per far funzionare né l'app di base né la sincronizzazione (le chiavi del servizio di sincronizzazione sono già incluse in `index.html`).

## Aggiornarla in futuro

Per ogni modifica: carica di nuovo `index.html` sostituendo quello esistente (upload → stesso nome → Commit changes). GitHub Pages si aggiorna da solo in un paio di minuti, senza bisogno di rifare i passaggi 3-4.

## Dati e sincronizzazione

Per impostazione predefinita le schede paziente restano **solo sul dispositivo/browser** che le crea (localStorage) — esattamente come prima. Se cancelli i dati di navigazione di Safari, le schede si perdono: il referto va comunque sempre copiato nella cartella clinica ufficiale.

**Sincronizzazione tra dispositivi (facoltativa)**: nella vista Reparto è presente un riquadro "Sincronizzazione tra dispositivi" con cui puoi creare un account (email + password) per far vedere le stesse schede su più dispositivi (es. iPhone e iPad). Se attivata:
- i dati (schede pazienti, ricoveri) vengono inviati a un servizio cloud esterno (Supabase), separato da GitHub — il codice dell'app resta pubblico su GitHub, i dati dei pazienti non transitano mai da lì
- la sincronizzazione è opt-in: senza creare un account, il comportamento resta quello di sempre, tutto locale
- restano valide le normali cautele sulla gestione di dati clinici quando si usa qualunque servizio esterno — valuta la conformità alle policy della tua struttura prima di attivarla su dati di pazienti reali
