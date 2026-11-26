// EO Pocket — approvazione degli account nuovi via mail.
//
// 1) Un utente conferma la sua email → il database (trigger su auth.users,
//    vedi supabase/avviso-nuovi-utenti.sql) chiama questa funzione con
//    { tipo:'nuovo', user_id, email } e l'intestazione x-trigger-secret.
//    La funzione manda all'amministratore una mail con due link: Approva e
//    Rifiuta. I link portano alla pagina approva.html dell'app, firmati.
// 2) La pagina approva.html chiede qui chi è l'utente ({ tipo:'info' }) e,
//    premuto il pulsante, esegue ({ tipo:'esegui' }): approvare = metterlo
//    in utenti_approvati; rifiutare = cancellare l'account.
//
// Segreti (Edge Functions → Secrets):
//   RESEND_API_KEY   la chiave API di Resend (resend.com)
//   ADMIN_EMAIL      dove arrivano le mail (la stessa dell'account Resend)
//   APPROVE_SECRET   una frase segreta lunga: firma i link e protegge la chiamata dal database
//   APP_URL          (facoltativo) indirizzo della pagina di approvazione
// SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY li mette Supabase da solo.
//
// Va pubblicata con «Enforce JWT verification» SPENTO: la chiamano il
// database e la pagina, senza login. Ogni richiesta è comunque verificata
// col segreto o con la firma.

import { createClient } from "npm:@supabase/supabase-js@2.119.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") ?? "";
const SECRET = Deno.env.get("APPROVE_SECRET") ?? "";
const APP_URL = Deno.env.get("APP_URL") ?? "https://aurex-cmd.github.io/EO-Builder/approva.html";
const VALIDITA_MS = 14 * 24 * 60 * 60 * 1000; // i link valgono 14 giorni

const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, x-trigger-secret, apikey, authorization, x-client-info",
};
const json = (dati: unknown, status = 200) =>
  new Response(JSON.stringify(dati), { status, headers: { ...CORS, "Content-Type": "application/json" } });

async function firma(testo: string): Promise<string> {
  const chiave = await crypto.subtle.importKey("raw", new TextEncoder().encode(SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", chiave, new TextEncoder().encode(testo));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
// confronto a tempo costante
function uguali(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
async function firmaValida(azione: string, id: string, t: string, sig: string): Promise<boolean> {
  if (!SECRET || !["approva", "rifiuta"].includes(azione) || !/^[0-9a-f-]{36}$/i.test(id) || !/^\d+$/.test(t)) return false;
  if (Date.now() - Number(t) > VALIDITA_MS) return false;
  return uguali(await firma(`${azione}:${id}:${t}`), String(sig || ""));
}
async function link(azione: string, id: string, t: string): Promise<string> {
  const q = new URLSearchParams({ azione, id, t, sig: await firma(`${azione}:${id}:${t}`) });
  return `${APP_URL}?${q}`;
}
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

async function avvisaAmministratore(id: string, email: string) {
  const t = String(Date.now());
  const [si, no] = [await link("approva", id, t), await link("rifiuta", id, t)];
  const pulsante = (href: string, testo: string, colore: string) =>
    `<a href="${esc(href)}" style="display:inline-block;padding:12px 22px;margin:0 8px 8px 0;border-radius:10px;background:${colore};color:#fff;text-decoration:none;font-weight:600">${testo}</a>`;
  const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;font-size:16px;color:#1b2430;line-height:1.5">
    <p style="font-size:20px;font-weight:700;margin:0 0 8px">Nuovo account EO Pocket</p>
    <p style="margin:0 0 18px"><b>${esc(email)}</b> si è registrato e ha confermato la mail. Finché non lo approvi non vede né salva nulla sul cloud.</p>
    ${pulsante(si, "Approva", "#13756f")}${pulsante(no, "Rifiuta", "#b8493b")}
    <p style="margin:16px 0 0;font-size:13px;color:#6b7684">Il link apre una pagina con un pulsante di conferma. Vale 14 giorni.</p></div>`;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: "EO Pocket <onboarding@resend.dev>", to: [ADMIN_EMAIL], subject: `Nuovo account EO Pocket: ${email}`, html }),
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
}

async function giaApprovato(id: string): Promise<boolean> {
  const { data } = await admin.from("utenti_approvati").select("user_id").eq("user_id", id).maybeSingle();
  return !!data;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ errore: "metodo non ammesso" }, 405);
  let corpo: Record<string, string> = {};
  try { corpo = await req.json(); } catch { return json({ errore: "richiesta non valida" }, 400); }

  try {
    // dal database: un utente ha appena confermato la mail
    if (corpo.tipo === "nuovo") {
      if (!SECRET || !uguali(req.headers.get("x-trigger-secret") ?? "", SECRET)) return json({ errore: "non autorizzato" }, 401);
      if (await giaApprovato(corpo.user_id)) return json({ ok: true, nota: "già approvato" });
      await avvisaAmministratore(corpo.user_id, corpo.email);
      return json({ ok: true });
    }

    // dalla pagina di approvazione
    const { azione, id, t, sig } = corpo;
    if (!(await firmaValida(azione, id, t, sig))) return json({ errore: "Link non valido o scaduto." }, 403);
    const { data: u } = await admin.auth.admin.getUserById(id);
    const email = u?.user?.email ?? "";

    if (corpo.tipo === "info") {
      return json({ email, esiste: !!u?.user, approvato: u?.user ? await giaApprovato(id) : false });
    }
    if (corpo.tipo === "esegui") {
      if (!u?.user) return json({ ok: true, email, esito: "non esiste più" });
      if (azione === "approva") {
        const { error } = await admin.from("utenti_approvati").upsert({ user_id: id, email }, { onConflict: "user_id" });
        if (error) throw error;
        return json({ ok: true, email, esito: "approvato" });
      }
      const { error } = await admin.auth.admin.deleteUser(id);
      if (error) throw error;
      return json({ ok: true, email, esito: "rifiutato" });
    }
    return json({ errore: "richiesta non valida" }, 400);
  } catch (e) {
    console.error(e);
    return json({ errore: "Errore: " + (e instanceof Error ? e.message : String(e)) }, 500);
  }
});
