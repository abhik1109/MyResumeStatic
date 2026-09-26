// Theme: auto by time (light 6am–6pm, dark otherwise) + manual toggle
(function initTheme() {
  const root = document.documentElement;
  const KEY = "theme-pref"; // "light" | "dark" | null (auto)

  function themeFromTime() {
    const h = new Date().getHours();
    return (h >= 6 && h < 18) ? "light" : "dark";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
  }

  function resolveTheme() {
    const pref = localStorage.getItem(KEY);
    return (pref === "light" || pref === "dark") ? pref : themeFromTime();
  }

  applyTheme(resolveTheme());

  const btn = document.getElementById("themeToggle");
  if (btn) {
    btn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || themeFromTime();
      const next = current === "light" ? "dark" : "light";
      applyTheme(next);
      localStorage.setItem(KEY, next);
    });
  }

  // If user has not set a preference, re-check around 6am / 6pm
  setInterval(() => {
    if (!localStorage.getItem(KEY)) applyTheme(themeFromTime());
  }, 60 * 1000);
})();

function yearsOfExperience() {
  const start = new Date(2017, 2, 16);
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  if (days < 0) {
    months--;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) { years--; months += 12; }
  return Math.round((years + months / 12 + days / 365) * 10) / 10;
}
const y = yearsOfExperience();
const yLabel = y.toFixed(1) + "+";
document.getElementById("heroYears").textContent = yLabel;
document.getElementById("aboutYears").textContent = yLabel + " years";
document.getElementById("yr").textContent = new Date().getFullYear();

function animate(el, target, decimal) {
  const t0 = performance.now();
  function tick(now) {
    const t = Math.min(1, (now - t0) / 1400);
    const v = target * (1 - Math.pow(1 - t, 3));
    el.innerHTML = (decimal ? v.toFixed(1) : Math.floor(v)) + (decimal || target === 7 ? '<em>+</em>' : "");
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
animate(document.getElementById("yNum"), y, true);
animate(document.getElementById("cNum"), 4, false);
animate(document.getElementById("tNum"), 7, false);

const nav = document.getElementById("nav");
const links = document.getElementById("links");
const backdrop = document.getElementById("navBackdrop");
const hamBtn = document.getElementById("ham");

function openMenu() {
  links.classList.add("open");
  if (backdrop) backdrop.classList.add("open");
  nav.classList.add("menu-open");
}
function closeMenu() {
  links.classList.remove("open");
  if (backdrop) backdrop.classList.remove("open");
  nav.classList.remove("menu-open");
}
function toggleMenu() {
  links.classList.contains("open") ? closeMenu() : openMenu();
}

window.addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 40), { passive: true });
hamBtn.onclick = toggleMenu;
const menuCloseBtn = document.getElementById("menuClose");
if (menuCloseBtn) menuCloseBtn.onclick = closeMenu;
if (backdrop) backdrop.onclick = closeMenu;

// Smooth scroll for all in-page links (with fixed-nav offset) + close mobile menu
document.querySelectorAll('a[href^="#"]:not(#waBtn)').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const id = this.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    closeMenu();
    const navH = nav.offsetHeight || 70;
    const top = target.getBoundingClientRect().top + window.pageYOffset - navH + 4;
    window.scrollTo({ top, behavior: "smooth" });
    history.pushState(null, "", id);
  });
});

// WhatsApp: decode number on click (not visible in plain HTML)
document.getElementById("waBtn").addEventListener("click", function (e) {
  e.preventDefault();
  const num = atob(this.getAttribute("data-c"));
  window.open("https://wa.me/" + num, "_blank", "noopener,noreferrer");
});


// Smooth section reveal on scroll
document.querySelectorAll("section, .goal").forEach(el => el.classList.add("reveal"));
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".reveal").forEach(el => revealObs.observe(el));
