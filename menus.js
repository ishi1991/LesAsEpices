/* ---------- Language (same choice as the home page) ---------- */
let saved = null;
try{ saved = localStorage.getItem("lang"); }catch(e){}
const initial = saved || ((navigator.language || "fr").toLowerCase().startsWith("en") ? "en" : "fr");
function setLang(l){
  document.body.dataset.lang = l;
  document.documentElement.lang = l;
  document.querySelectorAll("[data-set-lang]").forEach(b => b.classList.toggle("active", b.dataset.setLang === l));
  try{ localStorage.setItem("lang", l); }catch(e){}
  renderMenus();
}
document.querySelectorAll("[data-set-lang]").forEach(b => b.addEventListener("click", () => setLang(b.dataset.setLang)));
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Menus (fill this in) ----------
   Each menu has "sections" (Starters, Mains, Desserts…) and each section has "items".
   Example of a filled section:
     { fr:"Plats", en:"Mains", items:[
        { fr:"Poulet tikka masala", en:"Chicken tikka masala", diet:"meat",  price:"8 €" },
        { fr:"Dal tadka",           en:"Dal tadka",            diet:"vegan", price:"6 €" },
        { fr:"Paneer palak",        en:"Paneer palak",         diet:"veg",   price:"7 €" } ] }
   diet is "veg" (vegetarian), "vegan" or "meat". price is optional.
   You can also show a menu as a picture or a PDF:
     image:"images/menu-indien.jpg"   pdf:"images/menu-indien.pdf"                */
const DIETS = {
  veg:   {fr:"Végétarien", en:"Vegetarian", cls:"veg"},
  vegan: {fr:"Vegan",      en:"Vegan",      cls:"vegan"},
  meat:  {fr:"Viande",     en:"Meat",       cls:"meat"}
};
const MENUS = [
  { icon:"🍛",
    fr:{t:"Cuisine indienne", d:"Végétarien, vegan ou viande."},
    en:{t:"Indian cuisine", d:"Vegetarian, vegan or meat."},
    image:"", pdf:"", sections:[] },
  { icon:"🍲",
    fr:{t:"Cuisine africaine et orientale", d:"Des saveurs généreuses et parfumées."},
    en:{t:"African and Oriental cuisine", d:"Generous, fragrant flavours."},
    image:"", pdf:"", sections:[] }
];
const T = {
  soon:{fr:"Menu bientôt disponible", en:"Menu coming soon"},
  pdf:{fr:"Ouvrir le menu (PDF)", en:"Open the menu (PDF)"}
};
function renderMenus(){
  const l = document.body.dataset.lang || "fr";
  document.getElementById("menuGrid").innerHTML = MENUS.map(m => {
    let body = "";
    if(m.image) body += `<img src="${m.image}" alt="${m[l].t}" loading="lazy">`;
    if(m.pdf) body += `<p><a class="btn" href="${m.pdf}" target="_blank" rel="noopener">${T.pdf[l]}</a></p>`;
    body += m.sections.map(s => `<div class="menu-sec"><h4>${s[l]}</h4>` + s.items.map(it => {
      const d = DIETS[it.diet];
      return `<div class="menu-item"><span class="nm">${it[l]}</span>${d ? `<span class="badge ${d.cls}">${d[l]}</span>` : ""}${it.price ? `<span class="pr">${it.price}</span>` : ""}</div>`;
    }).join("") + `</div>`).join("");
    if(!m.image && !m.pdf && !m.sections.length) body = `<div class="soon-box"><span>🍽️</span>${T.soon[l]}</div>`;
    return `<article class="menu-card"><header><div class="ico">${m.icon}</div><div><h3>${m[l].t}</h3><p>${m[l].d}</p></div></header>${body}</article>`;
  }).join("");
}
setLang(initial);
