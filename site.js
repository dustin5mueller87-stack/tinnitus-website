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
      '<button class="lightbox-nav lightbox-prev" type="button" aria-label="Vorheriges Bild" style="position: absolute; left: 24px; top: 50%; transform: translateY(-50%); background: rgba(20, 18, 14, 0.4); border: 1px solid rgba(243, 236, 220, 0.3); color: #f3ecdc; width: 48px; height: 48px; border-radius: 50%; font-size: 24px; cursor: pointer; z-index: 1010; display: none; align-items: center; justify-content: center; transition: background 0.15s, border-color 0.15s; outline: none; user-select: none;">‹</button>' +
      '<button class="lightbox-nav lightbox-next" type="button" aria-label="Nächstes Bild" style="position: absolute; right: 24px; top: 50%; transform: translateY(-50%); background: rgba(20, 18, 14, 0.4); border: 1px solid rgba(243, 236, 220, 0.3); color: #f3ecdc; width: 48px; height: 48px; border-radius: 50%; font-size: 24px; cursor: pointer; z-index: 1010; display: none; align-items: center; justify-content: center; transition: background 0.15s, border-color 0.15s; outline: none; user-select: none;">›</button>' +
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
    var prevBtn = overlay.querySelector('.lightbox-prev');
    var nextBtn = overlay.querySelector('.lightbox-next');
    var triggers = document.querySelectorAll('a[data-lightbox]');

    // Erstelle eine Liste von Triggern mit eindeutigen hrefs
    var uniqueTriggers = [];
    var seenHrefs = {};
    triggers.forEach(function (a) {
      var href = a.getAttribute('href');
      if (!seenHrefs[href]) {
        seenHrefs[href] = true;
        uniqueTriggers.push(a);
      }
    });

    var currentIdx = -1;

    // Zoom- und Drag-Status
    var scale = 1;
    var translateX = 0;
    var translateY = 0;
    var isDragging = false;
    var startX = 0;
    var startY = 0;

    function updateTransform() {
      img.style.transform = 'translate(' + translateX + 'px, ' + translateY + 'px) scale(' + scale + ')';
    }

    function resetZoom() {
      scale = 1;
      translateX = 0;
      translateY = 0;
      img.style.transform = '';
      img.style.cursor = 'zoom-in';
    }

    function open(href, caption) {
      img.src = href;
      cap.textContent = caption || '';
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      resetZoom();

      // Zeige Navigationspfeile nur an, wenn es mehr als ein eindeutiges Bild gibt
      if (uniqueTriggers.length > 1) {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
      } else {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
      }
    }

    function close() {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      img.src = '';
      resetZoom();
    }

    function updateImage() {
      if (currentIdx < 0 || currentIdx >= uniqueTriggers.length) return;
      var trigger = uniqueTriggers[currentIdx];
      img.src = trigger.getAttribute('href');
      cap.textContent = trigger.getAttribute('data-lightbox') || '';
      resetZoom();
    }

    triggers.forEach(function (a) {
      if (a.dataset.lbBound) return;
      a.dataset.lbBound = '1';
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var href = a.getAttribute('href');

        // Finde den Index in der uniqueTriggers-Liste
        currentIdx = -1;
        for (var i = 0; i < uniqueTriggers.length; i++) {
          if (uniqueTriggers[i].getAttribute('href') === href) {
            currentIdx = i;
            break;
          }
        }

        open(href, a.getAttribute('data-lightbox'));
      });
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });

    closeBtn.addEventListener('click', close);

    // Klick auf Prev/Next Buttons
    prevBtn.addEventListener('click', function (e) {
      e.stopPropagation(); // Verhindert das Schließen des Overlays
      if (uniqueTriggers.length <= 1) return;
      currentIdx = (currentIdx - 1 + uniqueTriggers.length) % uniqueTriggers.length;
      updateImage();
    });

    nextBtn.addEventListener('click', function (e) {
      e.stopPropagation(); // Verhindert das Schließen des Overlays
      if (uniqueTriggers.length <= 1) return;
      currentIdx = (currentIdx + 1) % uniqueTriggers.length;
      updateImage();
    });

    // Tastatursteuerung (Pfeiltasten links/rechts + Escape)
    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('is-open')) return;
      if (e.key === 'Escape') {
        close();
      } else if (e.key === 'ArrowRight' && uniqueTriggers.length > 1) {
        currentIdx = (currentIdx + 1) % uniqueTriggers.length;
        updateImage();
      } else if (e.key === 'ArrowLeft' && uniqueTriggers.length > 1) {
        currentIdx = (currentIdx - 1 + uniqueTriggers.length) % uniqueTriggers.length;
        updateImage();
      }
    });

    // Hover-Effekt für Navigations-Buttons
    var navButtons = [prevBtn, nextBtn];
    navButtons.forEach(function (btn) {
      btn.addEventListener('mouseenter', function () {
        btn.style.background = 'rgba(20, 18, 14, 0.7)';
        btn.style.borderColor = '#f3ecdc';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.background = 'rgba(20, 18, 14, 0.4)';
        btn.style.borderColor = 'rgba(243, 236, 220, 0.3)';
      });
    });

    // Mausrad-Zoom
    overlay.addEventListener('wheel', function (e) {
      if (!overlay.classList.contains('is-open')) return;
      e.preventDefault(); // Verhindert das Scrollen der Hintergrundseite

      var zoomIntensity = 0.15;
      var newScale = scale + (e.deltaY < 0 ? zoomIntensity : -zoomIntensity);
      newScale = Math.max(1, Math.min(5, newScale)); // Zoombereich: 1.0x bis 5.0x

      if (newScale === 1) {
        resetZoom();
      } else {
        scale = newScale;
        img.style.cursor = 'grab';
        updateTransform();
      }
    }, { passive: false });

    // Panning (Verschieben durch Ziehen mit der Maus)
    img.addEventListener('mousedown', function (e) {
      if (scale <= 1) return;
      e.preventDefault(); // Verhindert das Standard-Verhalten der Bild-Vorschau
      isDragging = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
      img.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;
      updateTransform();
    });

    window.addEventListener('mouseup', function () {
      if (isDragging) {
        isDragging = false;
        img.style.cursor = 'grab';
      }
    });

    // Doppel-Klick-Zoom als zusätzliche Premium-Geste
    img.addEventListener('dblclick', function (e) {
      e.preventDefault();
      if (scale > 1) {
        resetZoom();
      } else {
        scale = 2.5;
        img.style.cursor = 'grab';
        updateTransform();
      }
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
  var voiceflowLoaded = false;
  var timeoutId = null;

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
