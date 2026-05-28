/* Tinnitus-Site — gemeinsame Lightbox-Logik
   HTML-Hülle wird automatisch eingefügt, wenn sie noch nicht existiert.
   Jeder <a data-lightbox="…" href="…/bild.png"> öffnet das Bild im Overlay. */
(function () {
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
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
