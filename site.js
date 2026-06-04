/* Tinnitus-Site — gemeinsame Lightbox-Logik
   HTML-Hülle wird automatisch eingefügt, wenn sie noch nicht existiert.
   Jeder <a data-lightbox="…" href="…/bild.png"> öffnet das Bild im Overlay. */
(function () {
  function initNavDropdownAria() {
    var dropdowns = document.querySelectorAll('.nav-dropdown');

    dropdowns.forEach(function (dropdown) {
      var button = dropdown.querySelector('button[aria-expanded]');
      var submenu = dropdown.querySelector('.submenu');

      if (!button || !submenu) return;

      function submenuIsVisible() {
        var style = window.getComputedStyle(submenu);
        return dropdown.matches(':hover, :focus-within') ||
          (style.visibility !== 'hidden' &&
          style.opacity !== '0' &&
          style.pointerEvents !== 'none');
      }

      function syncExpanded() {
        button.setAttribute('aria-expanded', submenuIsVisible() ? 'true' : 'false');
      }

      function scheduleSync() {
        window.requestAnimationFrame(syncExpanded);
      }

      dropdown.addEventListener('mouseenter', scheduleSync);
      dropdown.addEventListener('mouseleave', scheduleSync);
      dropdown.addEventListener('focusin', scheduleSync);
      dropdown.addEventListener('focusout', scheduleSync);
      window.addEventListener('resize', scheduleSync);
      scheduleSync();
    });
  }

  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn || btn.dataset.backToTopBound) return;
    btn.dataset.backToTopBound = '1';

    function onScroll() {
      if (window.scrollY > 600) btn.classList.add('is-visible');
      else btn.classList.remove('is-visible');
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    onScroll();
  }

  function injectOverlay() {
    if (document.getElementById('lightbox')) return;
    var overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.id = 'lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Bildansicht');
    overlay.innerHTML =
      '<button class="lightbox-close" type="button" aria-label="Schließen">×</button>' +
      '<div class="lightbox-frame">' +
      '  <img id="lightboxImg" alt="">' +
      '  <div class="lightbox-caption" id="lightboxCaption"></div>' +
      '</div>';
    document.body.appendChild(overlay);
  }

  function init() {
    injectOverlay();
    var overlay = document.getElementById('lightbox');
    var img = document.getElementById('lightboxImg');
    var cap = document.getElementById('lightboxCaption');
    var closeBtn = overlay.querySelector('.lightbox-close');
    var triggers = document.querySelectorAll('a[data-lightbox]');

    function open(href, caption) {
      img.src = href;
      cap.textContent = caption || '';
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      img.src = '';
    }

    triggers.forEach(function (a) {
      if (a.dataset.lbBound) return;
      a.dataset.lbBound = '1';
      a.addEventListener('click', function (e) {
        e.preventDefault();
        open(a.getAttribute('href'), a.getAttribute('data-lightbox'));
      });
    });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initNavDropdownAria();
      initBackToTop();
      init();
    });
  } else {
    initNavDropdownAria();
    initBackToTop();
    init();
  }
})();

/* Voiceflow Chat Widget Integration */
(function(d,t){var v=d.createElement(t),s=d.getElementsByTagName(t)[0];v.onload=function(){window.voiceflow.chat.load({verify:{projectID:'6a0977f2a62d285256e0577a'},url:'https://general-runtime.voiceflow.com',voice:{url:'https://runtime-api.voiceflow.com'}})};v.src='https://cdn.voiceflow.com/widget-next/bundle.mjs';v.type='text/javascript';s.parentNode.insertBefore(v,s)})(document,'script');
