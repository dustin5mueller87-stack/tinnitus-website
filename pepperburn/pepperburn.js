(function () {
  var header = document.getElementById('siteHeader');
  var burger = document.getElementById('navBurger');
  if (header) {
    var onScrollHeader = function () {
      if (window.scrollY > 8) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    };
    window.addEventListener('scroll', onScrollHeader, { passive: true });
    onScrollHeader();
  }
  if (header && burger) {
    burger.addEventListener('click', function () {
      var open = header.classList.toggle('is-menu-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var btn = document.getElementById('backToTop');
  if (btn) {
    var onScrollTop = function () {
      if (window.scrollY > 600) btn.classList.add('is-visible');
      else btn.classList.remove('is-visible');
    };
    window.addEventListener('scroll', onScrollTop, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
    });
    onScrollTop();
  }

  var params = new URLSearchParams(window.location.search);
  if (params.get('gesendet') === '1') {
    var box = document.getElementById('formSuccess');
    if (box) {
      box.hidden = false;
      if (box.scrollIntoView) {
        box.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'center'
        });
      }
    }
  }

  var form = document.querySelector('form[data-netlify="true"]');
  var status = document.getElementById('formStatus');
  if (!form || !status || !window.fetch || !window.FormData || !window.URLSearchParams) return;
  var button = form.querySelector('button[type="submit"]');
  if (!button) return;
  var submitting = false;
  var buttonLabel = button.textContent;

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (submitting || !form.reportValidity()) return;
    var body = new URLSearchParams(new FormData(form)).toString();
    submitting = true;
    button.disabled = true;
    button.textContent = 'Wird gesendet ...';
    form.setAttribute('aria-busy', 'true');
    var success = document.getElementById('formSuccess');
    if (success) success.hidden = true;
    status.hidden = false;
    status.textContent = 'Deine Nachricht wird gesendet ...';

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
    }).then(function (response) {
      if (!response.ok) throw new Error('Senden fehlgeschlagen.');
      window.location.assign(form.action);
    }).catch(function () {
      submitting = false;
      button.disabled = false;
      button.textContent = buttonLabel;
      form.removeAttribute('aria-busy');
      status.textContent = 'Beim Senden ist ein Fehler aufgetreten. Deine Eingaben sind noch da. Bitte versuche es noch einmal.';
    });
  });
})();
