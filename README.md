# E.O. Builder

App a pagina singola (nessuna dipendenza da server per il funzionamento di base) per comporre l'esame obiettivo cliccando le voci cliniche. Include anche una mappa reparto, la vista Diari, la gestione ricoveri e alcuni strumenti clinici integrati (analizzatore EGA, calcolatore VFG, dosaggi renali dei farmaci).

## Cosa c'è dentro

- **Esame obiettivo click-to-compose**, per apparato, con referto generato automaticamente (le cicatrici, non solo addominali ma anche cervicotomia, toracotomia, spalla, trocanterica e ginocchio, stanno su due colonne dalla testa ai piedi, col dx e il sx della stessa sede affiancati; tra le ernie, l'inguinale e l'inguino-scrotale hanno per ciascun lato riducibile/non riducibile e permagna)
- **Reparto**: mappa dei letti per settore, stato del diario di oggi (verde/viola), pagina dedicata "Parametri vitali" per aggiornare rapidamente SpO2/PA/FC/TC di tutto un settore
- **Diari**: tutti i diari scritti oggi in un'unica vista, modificabili direttamente
- **Ricoveri**: anamnesi e diario d'ingresso, generazione consegne in .docx
- **Strumenti clinici integrati**, richiamati scrivendo un trigger dentro un diario (in Diari):
  - `EGA:` → analizzatore emogasanalisi (equilibrio acido-base, anion gap, lattati); alla chiusura scrive un'interpretazione abbreviata nel diario
  - `VFG` o `Cockroft`/`Cockcroft` → calcolatore Cockcroft-Gault; stesso comportamento alla chiusura
  - `/Arixtra`, `/Inhixa`, `/NAO` o `/DOAC` → box informativi con i dosaggi renali (fondaparinux, enoxaparina, i 4 anticoagulanti orali diretti), che evidenziano la fascia giusta se nel diario è già presente una VFG

## EO Minimal

All'indirizzo `.../minimal/` (es. `https://<tuo-username-github>.github.io/eo-builder/minimal/`) si apre la stessa app con un'interfaccia essenziale e chiara: una home sobria: in alto la scheda **Reparto**, con i visti di oggi e i diari da copiare (scelto un settore, i suoi dati: visti, da vedere, diari da copiare e il tondo di avanzamento); sotto un elenco con un dato per voce: **Ricoveri** (con calendario e statistiche animate), **Calendario dimissioni**, **Aggiorna consegne** (nei weekend e festivi **Consegne Weekend**, in cima), **Post-degenze** (quante in sospeso e quante già da controllare), **Rubrica**, **Strumenti** (tutto il resto, comprese le Impostazioni) e **Account** (l'accesso per la sincronizzazione, con scritto se si è connessi); tra il Reparto e l'elenco, **Da fare oggi**: post-degenze da controllare, consegne da aggiornare (nei feriali, dopo il primo diario copiato) e lettere di dimissione per oggi e domani; finito un compito, la riga diventa teal col baffo a destra (le post-degenze si chiudono da sole, consegne e lettere si segnano col cerchio) e, quando è tutto fatto, il titolo diventa "Tutto fatto per oggi"; sopra l'elenco, quando c'è il blocco, il titolo "Sempre a portata"; in fondo la nota sull'app; gli appoggi di ogni settore stanno sotto i suoi letti, col "+" per aggiungerne uno. Il **Reparto** si apre sulla mappa di tutti i settori, ciascuno coi suoi letti in piccolo (appoggi in coda): nei feriali grigi e trasparenti, nel weekend e nei festivi già coi loro colori e coi bollini delle consegne. Toccando un settore gli altri svaniscono e i suoi letti crescono fino al loro posto in una scheda sola, col nome del settore come titolo, con i letti a tinta unita, quattro per riga (il tasto ? accanto a "Letti" apre la legenda di colori, bordi e bollini), e sotto gli appoggi (col "+" per aggiungerne uno); sopra, "Tutti i settori" riporta alla mappa (come indietro) e a destra ci sono i dati del settore e il tondo di avanzamento. Una pressione lunga su un settore della mappa apre "Svuota settore". In alto due pulsanti, **Visita** e **Diari**, mostrano gli stessi letti con colori diversi: in Visita l'anello conta i letti visti oggi e un letto apre l'esame obiettivo con i tag (la stessa schermata dell'app normale, che in fondo ha Copia referto e Fatto, come in alto, al posto di Azzera tutto); se il letto è in isolamento si apre subito la finestra col germe e i DPI, in Diari l'anello conta i diari copiati, i letti senza diario di oggi restano tenui e un letto apre il suo diario a tutto schermo (esame obiettivo, "Agli EE", referti e provvedimenti, con antibiotici, richieste e i pallini E/D/i). In basso una scena tenue disegnata (un letto e lo stetoscopio; in Diari i fogli e la matita). Ogni letto conta come pieno; una pressione lunga su un letto senza scheda lo segna vuoto e lo toglie dal conto. Se c'è l'esame obiettivo di almeno un ricoverato (aperto dal Ricovero) compare anche il settore **Ricoveri**, coi ricoverati di oggi. In Diari, sotto i letti, **Aggiorna consegne** è la tabella di fine giro dell'app normale, con le stesse funzioni. I dati sono gli stessi dell'app normale, sincronizzazione compresa; l'app aperta all'indirizzo normale non cambia. Per gli strumenti clinici c'è il collegamento all'app completa. Lo stile è uno solo ovunque: freccia indietro in alto e titolo grande sotto (il titolo piccolo centrato resta solo nell'esame obiettivo, accanto a Fatto); cinque misure di testo e tre raggi d'angolo; blu notte per azioni, link e scelte, teal solo per tag e diario; pulsanti primari blu notte pieni e secondari grigio chiaro; le scelte Sì/No con lo stesso selettore di Visita/Diari; elenchi a righe dentro un riquadro, come nella home; card bianche con un filo sottile, l'ombra solo per ciò che galleggia (la scheda del diario, le finestre). **Consegne Weekend** si apre sul riepilogo: un riquadro per letto con le lettere e la loro parola (V Visitare, E Esami, S Strumentali, C Colturali); toccata, una lettera diventa teal col baffo (fatta) e in cima c'è il conto da fare/fatte; la freccia a destra di ogni letto apre il testo della consegna. Sotto, l'inserimento in un riquadro solo (reparto, Allega file, Incolla testo, casella, Analizza: con del testo nella casella diventa il pulsante principale), che dopo l'analisi si svuota e si chiude in una riga con Allega altre; ogni reparto (Geriatria, Medicina C1, Medicina C2) sostituisce solo le proprie consegne, così se ne possono avere più insieme, raggruppate per reparto; "Come funziona" spiega le parole cercate e "Cancella tutte le consegne", in fondo, chiede un secondo tocco. Nel weekend e nei festivi le consegne stanno in Da fare oggi (da allegare, poi quante da fare, poi il baffo). In Impostazioni → Tema si sceglie tra chiaro e **Scuro** ("notte"): la stessa grafica in blu notte, coi letti che tengono i loro significati (blu visto, rame da copiare, verde copiato, viola critico) e "Copia il diario" in teal; vale solo per EO Minimal, non cambia il tema dell'app normale.

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
