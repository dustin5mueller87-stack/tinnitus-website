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
(function() {
  // Prevent Voiceflow widget from yanking the viewport/scrolling the parent page on focus/load
  try {
    const originalFocus = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = function(options) {
      var el = this;
      var insideVoiceflow = false;
      while (el) {
        if (el.id === 'voiceflow-chat') {
          insideVoiceflow = true;
          break;
        }
        el = el.parentNode || (el.getRootNode && el.getRootNode().host);
      }
      if (insideVoiceflow) {
        if (!options) options = {};
        options.preventScroll = true;
      }
      return originalFocus.call(this, options);
    };

    const originalScrollIntoView = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function(arg) {
      var el = this;
      var insideVoiceflow = false;
      while (el) {
        if (el.id === 'voiceflow-chat') {
          insideVoiceflow = true;
          break;
        }
        el = el.parentNode || (el.getRootNode && el.getRootNode().host);
      }
      if (insideVoiceflow) {
        return; // Suppress scrolling for internal widget elements
      }
      return originalScrollIntoView.apply(this, arguments);
    };
  } catch (e) {
    console.warn('Focus/Scroll override omitted:', e);
  }

  var voiceflowLoaded = false;
  var timeoutId = null;
  var shadowInterval = null;

  var injectShadowStyles = function() {
    var shadowHost = document.getElementById('voiceflow-chat');
    if (shadowHost && shadowHost.shadowRoot) {
      if (shadowHost.shadowRoot.querySelector('#custom-vf-styles')) return;

      var style = document.createElement('style');
      style.id = 'custom-vf-styles';
      style.textContent = [
        '.vfrc-proactive {',
        '  animation: proactive-fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;',
        '  opacity: 0;',
        '  margin-bottom: 6px !important;',
        '}',
        '.vfrc-proactive__card {',
        '  position: relative !important;',
        '  border-radius: 18px 18px 2px 18px !important;', /* Rounded bubble with sharp bottom-right corner */
        '  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12) !important;',
        '  border: 1px solid rgba(0, 0, 0, 0.08) !important;',
        '  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;',
        '  font-size: 14px !important;',
        '  line-height: 1.45 !important;',
        '  background: #ffffff !important;',
        '  color: #1d1d1f !important;',
        '  padding: 12px 16px !important;',
        '  max-width: 260px !important;', /* Narrower, bubble-like width */
        '  word-wrap: break-word !important;',
        '}',
        /* Asymmetric double pseudo-element triangular tail */
        '.vfrc-proactive__card::before {',
        '  content: "" !important;',
        '  position: absolute !important;',
        '  bottom: -7px !important;',
        '  right: 19px !important;',
        '  border-width: 7px 7px 0 !important;',
        '  border-style: solid !important;',
        '  border-color: rgba(0, 0, 0, 0.08) transparent !important;',
        '  display: block !important;',
        '  width: 0 !important;',
        '  height: 0 !important;',
        '  z-index: 1 !important;',
        '}',
        '.vfrc-proactive__card::after {',
        '  content: "" !important;',
        '  position: absolute !important;',
        '  bottom: -6px !important;',
        '  right: 20px !important;',
        '  border-width: 6px 6px 0 !important;',
        '  border-style: solid !important;',
        '  border-color: #ffffff transparent !important;',
        '  display: block !important;',
        '  width: 0 !important;',
        '  height: 0 !important;',
        '  z-index: 2 !important;',
        '}',
        '@keyframes proactive-fade-in {',
        '  from { opacity: 0; transform: translateY(12px) scale(0.94); }',
        '  to { opacity: 1; transform: translateY(0) scale(1); }',
        '}'
      ].join('\n');
      shadowHost.shadowRoot.appendChild(style);
    }
  };

  var initVoiceflow = function() {
    if (voiceflowLoaded) return;
    voiceflowLoaded = true;

    // Clean up event listeners and timers
    window.removeEventListener('scroll', handleScrollOrTimeout);
    if (timeoutId) clearTimeout(timeoutId);

    // Load Voiceflow script bundle
    (function(d,t){
      var v=d.createElement(t),s=d.getElementsByTagName(t)[0];
      v.onload=function(){
        window.voiceflow.chat.load({
          verify:{projectID:'6a0977f2a62d285256e0577a'},
          url:'https://general-runtime.voiceflow.com',
          voice:{url:'https://runtime-api.voiceflow.com'}
        });
        
        // Listen for shadow host creation to inject styles
        shadowInterval = setInterval(function() {
          var shadowHost = document.getElementById('voiceflow-chat');
          if (shadowHost && shadowHost.shadowRoot) {
            injectShadowStyles();
            clearInterval(shadowInterval);
          }
        }, 50);
        setTimeout(function() { if (shadowInterval) clearInterval(shadowInterval); }, 8000);

        // Show proactive speech bubble after a tiny delay
        setTimeout(function(){
          if(window.voiceflow && window.voiceflow.chat && typeof window.voiceflow.chat.proactive === 'object'){
            var isEn = window.location.pathname.indexOf('/en/') !== -1;
            var messageText = isEn 
              ? "Tinnitus is not a life sentence. Got questions about my recovery path or the nutrient protocol?"
              : "Tinnitus ist kein Urteil. Hast du Fragen zu meinem Weg aus der Tinnitus-Hölle oder zum Nährstoff-Protokoll?";
            window.voiceflow.chat.proactive.push({
              type: 'text',
              payload: {
                message: messageText
              }
            });
          }
        }, 1200);
      };
      v.src='https://cdn.voiceflow.com/widget-next/bundle.mjs';
      v.type='text/javascript';
      s.parentNode.insertBefore(v,s);
    })(document,'script');
  };

  var findTargetElement = function() {
    // Try to find the specific paragraph about lying awake at night
    var paragraphs = document.querySelectorAll('p');
    for (var i = 0; i < paragraphs.length; i++) {
      if (paragraphs[i].textContent.indexOf('nachts wach zu liegen') !== -1 ||
          paragraphs[i].textContent.indexOf('lying awake at night') !== -1) {
        return paragraphs[i];
      }
    }
    // Fallback to "Warum diese Seite existiert" heading
    var headings = document.querySelectorAll('h2');
    for (var i = 0; i < headings.length; i++) {
      if (headings[i].textContent.indexOf('Warum diese Seite existiert') !== -1 ||
          headings[i].textContent.indexOf('Why this site exists') !== -1) {
        return headings[i];
      }
    }
    return null;
  };

  var handleScrollOrTimeout = function() {
    var scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    var totalHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Fallback: trigger if scrolled past 450px or 35% of page height on shorter pages
    if (scrollY > 450 || (totalHeight > 0 && (scrollY / totalHeight) > 0.35)) {
      initVoiceflow();
    }
  };

  // Determine if we are on the homepage (prevent subpages with trailing slashes from matching)
  var pathname = window.location.pathname.toLowerCase();
  var isHomepage = pathname === '/' || 
                   pathname === '/index.html' || 
                   pathname === '/en/' || 
                   pathname === '/en/index.html' || 
                   pathname === '/en' || 
                   pathname.endsWith('/index.html');

  if (isHomepage) {
    // 1. Try to set up IntersectionObserver for precise trigger on the homepage
    var targetEl = findTargetElement();
    if (targetEl && typeof IntersectionObserver === 'function') {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            initVoiceflow();
            observer.disconnect();
          }
        });
      }, {
        rootMargin: '0px 0px -10% 0px' // Triggers when the element enters the lower part of screen
      });
      observer.observe(targetEl);
    } else {
      // 2. Fallback to scroll position
      window.addEventListener('scroll', handleScrollOrTimeout, { passive: true });
      setTimeout(handleScrollOrTimeout, 100);
    }
    // 3. Backup timeout for homepage: load after 25 seconds anyway
    timeoutId = setTimeout(initVoiceflow, 25000);
  } else {
    // On all other subpages, load after a clean 15-second delay to prevent scroll jumps
    timeoutId = setTimeout(initVoiceflow, 15000);
  }
})();
