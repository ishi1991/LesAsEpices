/* ---------- Language ---------- */
let saved = null;
try{ saved = localStorage.getItem("lang"); }catch(e){}
const initial = saved || ((navigator.language || "fr").toLowerCase().startsWith("en") ? "en" : "fr");
function setLang(l){
  document.body.dataset.lang = l;
  document.documentElement.lang = l;
  document.querySelectorAll("[data-set-lang]").forEach(b => b.classList.toggle("active", b.dataset.setLang === l));
  try{ localStorage.setItem("lang", l); }catch(e){}
  renderEvents();
  renderPay();
  renderReviews();
}
document.querySelectorAll("[data-set-lang]").forEach(b => b.addEventListener("click", () => setLang(b.dataset.setLang)));
document.querySelectorAll(".nav nav a").forEach(a => a.addEventListener("click", () => document.body.classList.remove("menu-open")));
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Events (add your real events + photos here) ----------
   Put files in the /images folder and list them in "media":
     {t:"img",   src:"images/photo.jpg"}
     {t:"video", src:"images/film.mp4", poster:"images/film.jpg"}
   An event without media shows a "photos coming soon" card.            */
const R = n => ({t:"img", src:`images/ruchidee-${n}.jpg`});
const AN = n => ({t:"img", src:`images/anniversaire-${n}.jpg`});
const V = n => ({t:"video", src:`images/ruchidee-video-${n}.mp4`, poster:`images/ruchidee-video-${n}.jpg`});
const EVENTS = [
  { icon:"🍛", 
    fr:{t:"À la Ruchidée", d:"Nous avons tenu notre stand à la Ruchidée : naans, wraps, nems, momos, beignets, douceurs indiennes et gâteaux, tout fait maison."},
    en:{t:"At La Ruchidée", d:"We ran our stall at La Ruchidée: naan, wraps, spring rolls, momos, fritters, Indian sweets and cakes, all homemade."},
    media:[R(1), V(3), R(3), R(4), R(2), R(5), V(2), R(6), R(7), R(8), V(5)] },
  { icon:"🎂", 
    fr:{t:"Anniversaire et fête de l’amour", d:"Deux belles fêtes partagées autour de nos plats : riz parfumé, currys, galettes et pains naan."},
    en:{t:"Birthday and celebration of love", d:"Two lovely celebrations shared around our dishes: fragrant rice, curries, patties and naan bread."}, media:[AN(1), AN(2), AN(3), AN(4), AN(5), AN(6)] }
];
const SOON = {fr:"Photos bientôt disponibles", en:"Photos coming soon"};
let LB = {list:[], i:0};
function renderEvents(){
  const l = document.body.dataset.lang || "fr";
  document.getElementById("eventGrid").innerHTML = EVENTS.map((ev, k) => {
    const head = `<header><h3>${ev[l].t}</h3><p>${ev[l].d}</p></header>`;
    if(!ev.media.length) return `<article class="event-block soon">${head}<div class="soon-box"><span>${ev.icon}</span>${SOON[l]}</div></article>`;
    const items = ev.media.map((m, j) => m.t === "video"
      ? `<figure class="g-item"><video src="${m.src}" poster="${m.poster}" controls preload="none" playsinline></video></figure>`
      : `<figure class="g-item"><button type="button" data-ev="${k}" data-i="${j}" aria-label="Zoom"><img src="${m.src}" alt="${ev[l].t}" loading="lazy"></button></figure>`).join("");
    return `<article class="event-block">${head}<div class="gallery">${items}</div></article>`;
  }).join("");
}
/* Lightbox */
const lb = document.createElement("div");
lb.className = "lightbox"; lb.hidden = true;
lb.innerHTML = '<button class="lb-x" aria-label="Close">×</button><button class="lb-p" aria-label="Previous">‹</button><img alt=""><button class="lb-n" aria-label="Next">›</button>';
document.body.appendChild(lb);
function lbShow(){ lb.querySelector("img").src = LB.list[LB.i].src; }
function lbMove(d){ LB.i = (LB.i + d + LB.list.length) % LB.list.length; lbShow(); }
document.getElementById("eventGrid").addEventListener("click", e => {
  const b = e.target.closest("button[data-ev]"); if(!b) return;
  LB.list = EVENTS[+b.dataset.ev].media.filter(m => m.t === "img");
  LB.i = LB.list.indexOf(EVENTS[+b.dataset.ev].media[+b.dataset.i]);
  lbShow(); lb.hidden = false; document.body.style.overflow = "hidden";
});
function lbClose(){ lb.hidden = true; document.body.style.overflow = ""; }
lb.addEventListener("click", e => {
  if(e.target.matches(".lb-x") || e.target === lb) lbClose();
  else if(e.target.matches(".lb-p")) lbMove(-1);
  else if(e.target.matches(".lb-n")) lbMove(1);
});
document.addEventListener("keydown", e => {
  if(lb.hidden) return;
  if(e.key === "Escape") lbClose(); if(e.key === "ArrowLeft") lbMove(-1); if(e.key === "ArrowRight") lbMove(1);
});

/* ---------- Reviews ----------
   Reviews you collect yourself (WhatsApp, in person…) go here:
     { name:"Marie", rating:5, text:"Un délice, merci !" }
   Reviews sent through the site are saved in Supabase and appear here once you
   set approved = true on them (Table Editor > reviews).                        */
const REVIEWS = [];
let LIVE_REVIEWS = [];
const NO_REVIEWS = {fr:"Pas encore d’avis : soyez le premier à partager votre expérience !", en:"No reviews yet: be the first to share your experience!"};
function renderReviews(){
  const l = document.body.dataset.lang || "fr", all = [...REVIEWS, ...LIVE_REVIEWS];
  document.getElementById("reviewGrid").innerHTML = all.length
    ? all.map(r => { const n = Math.max(1, Math.min(5, Number(r.rating) || 5));
        return `<figure class="review"><div class="rs" role="img" aria-label="${n}/5">${"★".repeat(n)}<span>${"★".repeat(5-n)}</span></div><blockquote>${esc(r.text)}</blockquote><figcaption>${esc(r.name)}</figcaption></figure>`; }).join("")
    : `<div class="soon-box"><span>💬</span>${NO_REVIEWS[l]}</div>`;
}
async function loadReviews(){
  if(!sb) return;
  const { data, error } = await sb.from("reviews").select("name,rating,comment").eq("approved", true).order("created_at", {ascending:false}).limit(30);
  if(!error && data){ LIVE_REVIEWS = data.map(r => ({name:r.name, rating:r.rating, text:r.comment})); renderReviews(); }
}

/* ---------- Donation info ---------- */
function esc(s){ return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function renderPay(){
  const c = window.SITE_CONFIG || {}, l = document.body.dataset.lang || "fr";
  let h = "";
  if(c.DONATION_LINK && /^https:\/\//.test(c.DONATION_LINK))
    h += `<p><a class="btn" style="color:#fff;border-color:#fff" href="${esc(c.DONATION_LINK)}" target="_blank" rel="noopener">${l==="fr"?"Donner en ligne":"Donate online"}</a></p>`;
  if(c.IBAN)
    h += `<p style="margin-top:12px">${l==="fr"?"Virement":"Bank transfer"} – ${esc(c.IBAN_HOLDER||"")}<br><strong>${esc(c.IBAN)}</strong></p>`;
  document.getElementById("payInfo").innerHTML = h;
}

/* ---------- Amount buttons ---------- */
document.querySelectorAll(".amounts button").forEach(b => b.addEventListener("click", () => {
  const f = b.closest("form");
  f.amount.value = b.dataset.amt;
  f.querySelectorAll(".amounts button").forEach(x => x.classList.toggle("on", x === b));
}));

/* ---------- Supabase forms ---------- */
const cfg = window.SITE_CONFIG || {};
const sb = (cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase)
  ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;

const MSG = {
  fr:{ok:"Merci ! Votre message a bien été envoyé. 💛", err:"Une erreur est survenue. Écrivez-nous à lesasepices@gmail.com.", off:"Le formulaire n’est pas encore activé. Écrivez-nous à lesasepices@gmail.com.", wait:"Envoi…"},
  en:{ok:"Thank you! Your message has been sent. 💛", err:"Something went wrong. Please email us at lesasepices@gmail.com.", off:"The form is not active yet. Please email us at lesasepices@gmail.com.", wait:"Sending…"}
};
document.querySelectorAll("form[data-table]").forEach(form => {
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const l = document.body.dataset.lang || "fr", st = form.querySelector(".status");
    const data = Object.fromEntries(new FormData(form).entries());
    if(data.website) return;            // honeypot: bots fill this hidden field
    delete data.website;
    st.className = "status";
    if(!sb){ st.textContent = MSG[l].off; st.classList.add("err"); return; }
    if(data.amount) data.amount = Number(data.amount);
    if(data.rating) data.rating = Number(data.rating);
    data.lang = l;
    st.textContent = MSG[l].wait;
    const { error } = await sb.from(form.dataset.table).insert(data);
    if(error){ console.error(error); st.textContent = MSG[l].err; st.classList.add("err"); }
    else { st.textContent = form.dataset[l === "fr" ? "okFr" : "okEn"] || MSG[l].ok; st.classList.add("ok"); form.reset(); form.querySelectorAll(".amounts .on").forEach(x=>x.classList.remove("on")); }
  });
});

setLang(initial);
loadReviews();
