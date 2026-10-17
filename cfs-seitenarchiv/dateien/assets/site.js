/* ============================================================
   CFS — Dustins Weg · site.js
   Injects header + footer chrome, handles Ruhe-Modus (theme),
   Kurzfassung/Ausführlich toggle, mobile nav, stadien scale,
   scroll reveal. Content lives as real HTML in each page.
   ============================================================ */
(function () {
  'use strict';

  var THEME_KEY = 'cfs-theme-v2';

  // ---- Site map (reading order) ----
  var PAGES = [
    { slug: 'start',       href: 'index.html',                 nav: 'Start',              title: 'Startseite' },
    { slug: 'biografie',   href: 'biografie.html',             nav: 'Meine Geschichte',   title: 'Vom Zusammenbruch zurück' },
    { slug: 'was-ist-cfs', href: 'was-ist-cfs.html',           nav: 'Was ist CFS',        title: 'Was ist CFS?' },
    { slug: 'pem',         href: 'pem-und-laktat.html',        nav: 'PEM & Laktat',       title: 'PEM und Laktat' },
    { slug: 'nitro',       href: 'nitrosativer-stress.html',   nav: 'Nitrosativer Stress',title: 'Nitrosativer Stress' },
    { slug: 'darm',        href: 'darm-und-naehrstoffe.html',  nav: 'Darm & Nährstoffe',  title: 'Darm und Nährstoffe' },
    { slug: 'mein-ausweg', href: 'mein-ausweg.html',           nav: 'Mein Ausweg',        title: 'Mein Ausweg aus CFS' },
    { slug: 'studien',     href: 'studien-und-belege.html',    nav: 'Studien',            title: 'Studien und Belege' },
    { slug: 'produkte',    href: 'produkte.html',              nav: 'Meine Produkte',     title: 'Meine Produkte', aside: true }
  ];

  var MARK = '<svg class="brand__mark" viewBox="0 0 60 34" fill="none" aria-hidden="true"><path d="M2 6 C 10 6, 14 28, 22 30 C 30 32, 33 16, 40 13 C 48 10, 52 5, 58 4" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><circle cx="22" cy="30" r="3.2" fill="currentColor"/></svg>';

  function el(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }
  var current = document.body.getAttribute('data-page') || 'start';

  // ---- Theme (Ruhe-Modus) ----
  function applyTheme(t, store) {
    document.documentElement.setAttribute('data-theme', t);
    if (store) { try { localStorage.setItem(THEME_KEY, t); } catch (e) {} }
    document.querySelectorAll('[data-theme-btn]').forEach(function (b) {
      b.querySelector('.tlabel') && (b.querySelector('.tlabel').textContent = t === 'quiet' ? 'Hell' : 'Ruhe');
      b.querySelector('.ticon') && (b.querySelector('.ticon').innerHTML =
        '<svg viewBox="0 0 24 24" width="16" height="16">' + (t === 'quiet' ? SUN : MOON) + '</svg>');
    });
  }
  var MOON = '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>';
  var SUN = '<circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>';

  // ---- Build header ----
  function buildHeader() {
    var isQuiet = document.documentElement.getAttribute('data-theme') === 'quiet';
    var navLinks = PAGES.filter(function (p) { return !p.aside; }).map(function (p) {
      return '<a href="' + p.href + '"' + (p.slug === current ? ' aria-current="page"' : '') + '>' + p.nav + '</a>';
    }).join('');

    var head = el(
      '<header class="site-head"><div class="wrap"><div class="site-head__bar">' +
        '<a class="brand" href="index.html">' + MARK +
          '<span><span class="brand__name">Dustin Müller</span><span class="brand__sub">Zurück aus Stadium 8</span></span>' +
        '</a>' +
        '<nav class="nav" aria-label="Hauptnavigation">' + navLinks + '</nav>' +
        '<div class="head-tools">' +
          '<button class="icon-btn" data-theme-btn aria-label="Ansicht umschalten"><span class="ticon" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16">' + (isQuiet ? SUN : MOON) + '</svg></span><span class="tlabel">' + (isQuiet ? 'Hell' : 'Ruhe') + '</span></button>' +
          '<button class="icon-btn nav-toggle" data-nav-open aria-label="Menü öffnen"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>Menü</button>' +
        '</div>' +
      '</div></div></header>'
    );

    var drawerLinks = PAGES.map(function (p, i) {
      return '<a href="' + p.href + '">' + (p.aside ? '' : '<span class="n">' + String(i + 1).padStart(2, '0') + '</span>') + p.nav + '</a>';
    }).join('');
    var drawer = el(
      '<div class="nav-drawer" id="site-drawer" data-drawer aria-hidden="true" inert>' +
        '<div class="nav-drawer__head"><a class="brand" href="index.html">' + MARK + '<span class="brand__name">Dustin Müller</span></a>' +
        '<button class="icon-btn" data-nav-close aria-label="Menü schließen"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>Schließen</button></div>' +
        drawerLinks +
      '</div>'
    );

    var skip = document.querySelector('.skip');
    document.body.insertBefore(head, skip ? skip.nextSibling : document.body.firstChild);
    document.body.insertBefore(drawer, head.nextSibling);

    head.querySelector('[data-theme-btn]').addEventListener('click', function () {
      applyTheme(document.documentElement.getAttribute('data-theme') === 'quiet' ? 'warm' : 'quiet', true);
    });
    var openButton = head.querySelector('[data-nav-open]');
    var closeButton = drawer.querySelector('[data-nav-close]');
    openButton.setAttribute('aria-controls', 'site-drawer');
    openButton.setAttribute('aria-expanded', 'false');
    function closeDrawer(returnFocus) {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      drawer.setAttribute('inert', '');
      openButton.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (returnFocus) openButton.focus();
    }
    openButton.addEventListener('click', function () {
      drawer.removeAttribute('inert');
      drawer.setAttribute('aria-hidden', 'false');
      drawer.classList.add('open');
      openButton.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      closeButton.focus();
    });
    closeButton.addEventListener('click', function () { closeDrawer(true); });
    drawer.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') { event.preventDefault(); closeDrawer(true); return; }
      if (event.key !== 'Tab') return;
      var focusable = Array.from(drawer.querySelectorAll('a[href], button:not([disabled])'));
      if (!focusable.length) return;
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  }

  // ---- Build "weiterlesen" + footer ----
  function buildFooter() {
    var READ = PAGES.filter(function (p) { return !p.aside; });
    var idx = READ.findIndex(function (p) { return p.slug === current; });
    var next = idx >= 0 ? READ[idx + 1] : null;
    var main = document.querySelector('main') || document.body;

    if (next) {
      var nx = el(
        '<section class="next"><div class="wrap"><a href="' + next.href + '">' +
          '<span class="eyebrow">Weiterlesen</span>' +
          '<span class="next__t">' + next.title + ' <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
        '</a></div></section>'
      );
      main.appendChild(nx);
    }

    var footLinks = PAGES.map(function (p) { return '<li><a href="' + p.href + '">' + p.nav + '</a></li>'; }).join('');
    var foot = el(
      '<footer class="site-foot"><div class="wrap">' +
        '<div class="site-foot__grid">' +
          '<div><div class="site-foot__brand">Dustin Müller</div>' +
            '<p>Ein persönlicher Erfahrungsbericht über den Weg aus CFS / ME-CFS — und die Biochemie dahinter. Keine medizinische Beratung.</p></div>' +
          '<div><h4>Seiten</h4><ul>' + footLinks + '</ul></div>' +
          '<div><h4>Kontakt &amp; Rechtliches</h4><ul><li><a href="kontakt.html">Kontakt</a></li><li><a href="impressum.html">Impressum</a></li><li><a href="datenschutz.html">Datenschutz</a></li><li><a href="' + (document.getElementById('disclaimer') ? '#disclaimer' : 'impressum.html#disclaimer') + '">Wichtiger Hinweis</a></li></ul>' +
            '<h4 style="margin-top:1.6rem">Sprache</h4><ul><li>Deutsch · English folgt</li></ul></div>' +
        '</div>' +
        '<div class="site-foot__legal"><span>© ' + new Date().getFullYear() + ' Dustin Müller · Persönlicher Erfahrungsbericht</span><span>Kein Arzt · kein Heilversprechen</span><span>Version 3 · Umbau vom 11.10.2026</span></div>' +
      '</div></footer>'
    );
    document.body.appendChild(foot);
  }

  // ---- Kurz / Ausführlich toggle ----
  function initReadmode() {
    document.querySelectorAll('[data-readmode]').forEach(function (group) {
      var key = 'cfs-read-' + current;
      var buttons = group.querySelectorAll('button[data-set]');
      var scope = group.getAttribute('data-scope');
      var container = scope ? document.querySelector(scope) : document;

      function set(view, store) {
        buttons.forEach(function (b) {
          var active = b.getAttribute('data-set') === view;
          b.setAttribute('aria-selected', active);
          b.setAttribute('aria-pressed', active);
        });
        container.querySelectorAll('[data-view]').forEach(function (v) {
          var active = v.getAttribute('data-view') === view;
          v.classList.toggle('is-active', active);
          v.setAttribute('aria-hidden', active ? 'false' : 'true');
          if (active) v.removeAttribute('inert');
          else v.setAttribute('inert', '');
        });
        if (store) { try { localStorage.setItem(key, view); } catch (e) {} }
      }
      buttons.forEach(function (b) {
        b.addEventListener('click', function () {
          set(b.getAttribute('data-set'), true);
          var top = group.getBoundingClientRect().top;
          if (top < 0) group.scrollIntoView({ block: 'start' });
        });
      });
      var saved; try { saved = localStorage.getItem(key); } catch (e) {}
      set(saved || group.getAttribute('data-default') || 'kurz', false);
    });
  }

  // ---- Stadien scale ----
  function initStadien() {
    var scale = document.querySelector('[data-stadien]');
    if (!scale) return;
    var rows = scale.querySelectorAll('.st-row');
    var detail = document.querySelector('[data-stadien-detail]');
    if (!detail) return;
    var data = JSON.parse(scale.getAttribute('data-stadien'));

    function show(n) {
      rows.forEach(function (r) { r.setAttribute('aria-selected', r.getAttribute('data-n') === String(n)); });
      var d = data[n];
      detail.classList.toggle('is-me', !!d.me);
      detail.innerHTML =
        '<div style="display:flex;align-items:center;gap:.8rem;flex-wrap:wrap"><span class="st-detail__n">' + n + '</span>' +
        '<span class="st-detail__me">Hier war ich · Stadium 8 von 8</span></div>' +
        '<h3>' + d.t + '</h3>' +
        '<p>' + d.d + '</p>' +
        (d.draft ? '<p class="draft">' + d.draft + '</p>' : '');
    }
    rows.forEach(function (r) {
      r.addEventListener('click', function () { show(parseInt(r.getAttribute('data-n'), 10)); });
    });
    show(8);
  }

  // ---- Scroll reveal ----
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (typeof window.IntersectionObserver !== 'function' || !els.length) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io;
    try {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      els.forEach(function (e) { io.observe(e); });
    } catch (error) {
      els.forEach(function (e) { e.classList.add('in'); });
    }
  }

  // ---- Init ----
  function init() {
    buildHeader();
    applyTheme(document.documentElement.getAttribute('data-theme') || 'quiet', false);
    buildFooter();
    initReadmode();
    initStadien();
    initReveal();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
