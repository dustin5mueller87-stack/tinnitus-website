/* Tinnitus Bioregulation – Helles Studienportal: Navigation, Hash-Routing & Lightbox */
(function () {
  var body = document.body;
  var mode = body.getAttribute('data-portal-mode') || 'multipage';
  var hashMap = window.QP_HASH_MAP || {};
  var pageMap = window.QP_PAGE_FILES || {};

  // Active tab centering inside horizontal mobile register strip
  function centerActiveTab() {
    var tabsContainer = document.getElementById('qpTabs');
    if (!tabsContainer) return;
    var active = tabsContainer.querySelector('.qp-tab.is-active, .qp-tab[aria-current="page"]');
    if (!active) return;
    try {
      var targetLeft = active.offsetLeft - (tabsContainer.clientWidth - active.offsetWidth) / 2;
      tabsContainer.scrollLeft = Math.max(0, targetLeft);
    } catch (e) {}
  }

  // Build accessible modal lightbox cleanly on demand
  function createLightbox() {
    var existing = document.getElementById('qpLightbox');
    if (existing) return existing;
    var overlay = document.createElement('div');
    overlay.id = 'qpLightbox';
    overlay.className = 'qp-lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Bildansicht');
    overlay.hidden = true;
    overlay.innerHTML =
      '<div class="qp-lb-dialog">' +
        '<button type="button" class="qp-lb-close" aria-label="Schließen">&times;</button>' +
        '<img class="qp-lb-img" src="" alt="">' +
        '<div class="qp-lb-caption"></div>' +
        '<div class="qp-lb-ki"></div>' +
      '</div>';
    document.body.appendChild(overlay);

    var closeBtn = overlay.querySelector('.qp-lb-close');
    function close() {
      overlay.hidden = true;
    }
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', function (ev) {
      if (ev.target === overlay) close();
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && !overlay.hidden) close();
    });
    return overlay;
  }

  function initLightbox() {
    var triggers = document.querySelectorAll('a[data-lightbox]');
    if (!triggers.length) return;
    var overlay = createLightbox();
    var imgEl = overlay.querySelector('.qp-lb-img');
    var capEl = overlay.querySelector('.qp-lb-caption');
    var kiEl = overlay.querySelector('.qp-lb-ki');

    triggers.forEach(function (a) {
      a.addEventListener('click', function (ev) {
        ev.preventDefault();
        var href = a.getAttribute('href') || '';
        var innerImg = a.querySelector('img');
        if (!href && innerImg) href = innerImg.getAttribute('src') || '';
        var caption = a.getAttribute('data-lightbox') || (innerImg ? innerImg.getAttribute('alt') : '') || '';
        var fig = a.closest('figure');
        var kiNode = fig ? fig.querySelector('figcaption.tb-ki') : null;

        imgEl.setAttribute('src', href);
        imgEl.setAttribute('alt', caption);
        capEl.textContent = caption;
        if (kiNode) {
          kiEl.textContent = kiNode.textContent;
          kiEl.hidden = false;
        } else {
          kiEl.textContent = '';
          kiEl.hidden = true;
        }
        overlay.hidden = false;
      });
    });
  }

  // Standalone single-file Desktop Preview routing (#seite=..., #[section-id])
  function initStandaloneRouter() {
    var views = Array.prototype.slice.call(document.querySelectorAll('.qp-page-view[data-page]'));
    var tabs = Array.prototype.slice.call(document.querySelectorAll('#qpTabs .qp-tab[data-page]'));
    if (!views.length) return;

    function showPage(slug, scrollTargetId) {
      var found = views.some(function (v) { return v.getAttribute('data-page') === slug; });
      if (!found) slug = 'uebersicht';

      views.forEach(function (v) {
        var active = v.getAttribute('data-page') === slug;
        v.hidden = !active;
      });

      tabs.forEach(function (t) {
        var active = t.getAttribute('data-page') === slug;
        t.classList.toggle('is-active', active);
        if (active) {
          t.setAttribute('aria-current', 'page');
        } else {
          t.removeAttribute('aria-current');
        }
      });

      centerActiveTab();

      if (scrollTargetId) {
        var el = document.getElementById(scrollTargetId);
        if (el) {
          window.requestAnimationFrame(function () {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
          return;
        }
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    function routeFromHash() {
      var h = (window.location.hash || '').replace(/^#/, '');
      if (!h) {
        showPage('uebersicht', null);
        return;
      }
      if (h.indexOf('seite=') === 0) {
        var pageSlug = decodeURIComponent(h.slice(6));
        showPage(pageSlug, null);
        return;
      }
      if (hashMap[h]) {
        showPage(hashMap[h], h);
        return;
      }
      // Fallback: search which view encloses this element ID
      var el = document.getElementById(h);
      if (el) {
        var owner = el.closest('.qp-page-view[data-page]');
        if (owner) {
          showPage(owner.getAttribute('data-page'), h);
          return;
        }
      }
      showPage('uebersicht', null);
    }

    document.addEventListener('click', function (ev) {
      var a = ev.target && ev.target.closest ? ev.target.closest('a') : null;
      if (!a) return;
      var dataPage = a.getAttribute('data-page');
      var href = a.getAttribute('href') || '';
      if (dataPage && !href.match(/^https?:\/\//i)) {
        ev.preventDefault();
        var nextHash = '#seite=' + dataPage;
        if (window.location.hash !== nextHash) {
          try {
            history.pushState(null, '', nextHash);
          } catch (e) {
            window.location.hash = nextHash;
          }
        }
        showPage(dataPage, null);
        return;
      }
      if (href.charAt(0) === '#' && href.length > 1) {
        var id = href.slice(1);
        if (id.indexOf('seite=') === 0 || hashMap[id] || document.getElementById(id)) {
          ev.preventDefault();
          if (window.location.hash !== href) {
            try {
              history.pushState(null, '', href);
            } catch (e) {
              window.location.hash = href;
            }
          }
          routeFromHash();
        }
      }
    });

    window.addEventListener('hashchange', routeFromHash);
    routeFromHash();
  }

  // Multi-page redirector on Übersicht when arriving with legacy anchor (e.g. /wissenschaftliche-quellen#spaete-hoerkurven)
  function initMultipageHashRedirect() {
    var currentSlug = body.getAttribute('data-current-page') || 'uebersicht';
    var h = (window.location.hash || '').replace(/^#/, '');
    if (!h) return;
    var targetSlug = hashMap[h];
    if (targetSlug && targetSlug !== currentSlug && pageMap[targetSlug]) {
      window.location.replace(pageMap[targetSlug] + '#' + h);
    }
  }

  // Aside TOC active highlight on scroll
  function initTocHighlight() {
    var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.qp-aside-list a[href^="#"]'));
    if (!tocLinks.length || !('IntersectionObserver' in window)) return;
    var byId = {};
    tocLinks.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      byId[id] = a;
    });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && byId[entry.target.id]) {
          tocLinks.forEach(function (l) { l.classList.remove('is-current'); });
          byId[entry.target.id].classList.add('is-current');
        }
      });
    }, { rootMargin: '-20% 0px -65% 0px' });

    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  // Language dropdown clean outside-click & Escape handling
  function initLanguageSwitch() {
    var langDetails = document.querySelector('details.qp-lang');
    if (!langDetails) return;
    var summary = langDetails.querySelector('summary');

    document.addEventListener('click', function (ev) {
      if (langDetails.open && !langDetails.contains(ev.target)) {
        langDetails.open = false;
      }
    });

    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && langDetails.open) {
        langDetails.open = false;
        if (summary) summary.focus();
      }
    });
  }

  centerActiveTab();
  initLightbox();
  initLanguageSwitch();
  if (mode === 'standalone') {
    initStandaloneRouter();
  } else {
    initMultipageHashRedirect();
    initTocHighlight();
  }
})();
