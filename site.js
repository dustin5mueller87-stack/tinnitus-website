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

  function ensureKoreanLanguageOption() {
    var koreanRoutesByGermanPath = {
      '/': '/ko/',
      '/tinnitus-geheilt-erfahrungsbericht': '/ko/tinnitus-geheilt-erfahrungsbericht',
      '/meine-geschichte-teil-1': '/ko/meine-geschichte-teil-1',
      '/meine-geschichte-teil-2': '/ko/meine-geschichte-teil-2',
      '/laermbedingter-tinnitus': '/ko/laermbedingter-tinnitus',
      '/stressbedingter-tinnitus': '/ko/stressbedingter-tinnitus',
      '/medikamente-gifte-tinnitus': '/ko/medikamente-gifte-tinnitus',
      '/mein-loesungsansatz': '/ko/mein-loesungsansatz',
      '/wissenschaftliche-quellen': '/ko/wissenschaftliche-quellen',
      '/produkte': '/ko/produkte',
      '/erfahrungsberichte': '/ko/erfahrungsberichte',
      '/faq': '/ko/faq',
      '/kontakt': '/ko/kontakt',
      '/impressum': '/ko/impressum',
      '/datenschutz': '/ko/datenschutz'
    };

    document.querySelectorAll('details.lang-switch .lang-menu').forEach(function (menu) {
      if (menu.querySelector('a[hreflang="ko"]')) return;

      var germanLink = menu.querySelector('a[hreflang="de"]');
      var germanPath = '/';

      if (germanLink) {
        try {
          germanPath = new URL(germanLink.getAttribute('href'), window.location.origin).pathname;
          germanPath = germanPath.replace(/\/+$/, '') || '/';
        } catch (error) {
          germanPath = '/';
        }
      }

      var koreanLink = document.createElement('a');
      koreanLink.href = koreanRoutesByGermanPath[germanPath] || '/ko/';
      koreanLink.setAttribute('hreflang', 'ko');

      if (document.documentElement.lang.toLowerCase().indexOf('ko') === 0) {
        koreanLink.classList.add('active');
        koreanLink.setAttribute('aria-current', 'page');
      }

      var languageCode = document.createElement('span');
      languageCode.className = 'lang-code';
      languageCode.textContent = 'KO';

      var languageName = document.createElement('span');
      languageName.className = 'lang-name';
      languageName.setAttribute('lang', 'ko');
      languageName.textContent = '한국어';

      koreanLink.appendChild(languageCode);
      koreanLink.appendChild(languageName);
      menu.appendChild(koreanLink);
    });
  }

  function ensureIndonesianLanguageOption() {
    var indonesianRoutesByGermanPath = {
      '/': '/id/',
      '/tinnitus-geheilt-erfahrungsbericht': '/id/tinnitus-sembuh-kisah-saya',
      '/meine-geschichte-teil-1': '/id/kisah-tinnitus-saya-bagian-1',
      '/meine-geschichte-teil-2': '/id/kisah-tinnitus-saya-bagian-2',
      '/laermbedingter-tinnitus': '/id/tinnitus-akibat-kebisingan',
      '/stressbedingter-tinnitus': '/id/tinnitus-akibat-stres',
      '/medikamente-gifte-tinnitus': '/id/tinnitus-akibat-obat-dan-zat-beracun',
      '/mein-loesungsansatz': '/id/pendekatan-saya'
    };

    document.querySelectorAll('details.lang-switch .lang-menu').forEach(function (menu) {
      if (menu.querySelector('a[hreflang="id"]')) return;

      var germanLink = menu.querySelector('a[hreflang="de"]');
      if (!germanLink) return;

      var germanPath = '/';
      try {
        germanPath = new URL(germanLink.getAttribute('href'), window.location.origin).pathname;
        germanPath = germanPath.replace(/\/+$/, '') || '/';
      } catch (error) {
        return;
      }

      var indonesianRoute = indonesianRoutesByGermanPath[germanPath];
      if (!indonesianRoute) return;

      var indonesianLink = document.createElement('a');
      indonesianLink.href = indonesianRoute;
      indonesianLink.setAttribute('hreflang', 'id');

      if (document.documentElement.lang.toLowerCase().indexOf('id') === 0) {
        indonesianLink.classList.add('active');
        indonesianLink.setAttribute('aria-current', 'page');
      }

      var languageCode = document.createElement('span');
      languageCode.className = 'lang-code';
      languageCode.textContent = 'ID';

      var languageName = document.createElement('span');
      languageName.className = 'lang-name';
      languageName.setAttribute('lang', 'id');
      languageName.textContent = 'Bahasa Indonesia';

      indonesianLink.appendChild(languageCode);
      indonesianLink.appendChild(languageName);
      menu.appendChild(indonesianLink);
    });
  }

  function initHeaderControls() {
    ensureKoreanLanguageOption();
    ensureIndonesianLanguageOption();

    var header = document.getElementById('siteHeader');
    var burger = document.getElementById('navBurger');
    var primaryNav = document.getElementById('primaryNav');
    var languageSwitch = document.querySelector('details.lang-switch');
    var languageSummary = languageSwitch && languageSwitch.querySelector('summary');

    function closeLanguageSwitch(returnFocus) {
      if (!languageSwitch || !languageSwitch.open) return;
      languageSwitch.open = false;
      if (returnFocus && languageSummary) languageSummary.focus();
    }

    function closeMobileMenu(returnFocus) {
      if (!header || !burger || !header.classList.contains('is-menu-open')) return;
      header.classList.remove('is-menu-open');
      burger.setAttribute('aria-expanded', 'false');
      if (burger.dataset.labelOpen) burger.setAttribute('aria-label', burger.dataset.labelOpen);
      if (returnFocus) burger.focus();
    }

    document.addEventListener('click', function (event) {
      if (languageSwitch && !languageSwitch.contains(event.target)) {
        closeLanguageSwitch(false);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      if (languageSwitch && languageSwitch.open) {
        closeLanguageSwitch(true);
        return;
      }
      closeMobileMenu(true);
    });

    if (primaryNav) {
      primaryNav.addEventListener('click', function (event) {
        if (event.target.closest('a')) closeMobileMenu(false);
      });
    }

    if (burger) {
      burger.addEventListener('click', function () {
        closeLanguageSwitch(false);
      });
    }

    if (languageSummary) {
      languageSummary.addEventListener('click', function () {
        closeMobileMenu(false);
      });
    }

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1100) closeMobileMenu(false);
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
    var pageLang = document.documentElement.lang.toLowerCase();
    var labels = pageLang.indexOf('en') === 0 ? {
      viewer: 'Image viewer',
      close: 'Close',
      previous: 'Previous image',
      next: 'Next image'
    } : pageLang.indexOf('fr') === 0 ? {
      viewer: 'Visionneuse d’images',
      close: 'Fermer',
      previous: 'Image précédente',
      next: 'Image suivante',
      translationRegion: 'Traduction française du document'
    } : pageLang.indexOf('es') === 0 ? {
      viewer: 'Visor de imágenes',
      close: 'Cerrar',
      previous: 'Imagen anterior',
      next: 'Imagen siguiente'
    } : pageLang.indexOf('tr') === 0 ? {
      viewer: 'Görsel görüntüleyici',
      close: 'Kapat',
      previous: 'Önceki görsel',
      next: 'Sonraki görsel'
    } : pageLang.indexOf('pl') === 0 ? {
      viewer: 'Podgląd obrazów',
      close: 'Zamknij',
      previous: 'Poprzedni obraz',
      next: 'Następny obraz',
      translationRegion: 'Polskie tłumaczenie dokumentu'
    } : pageLang.indexOf('nl') === 0 ? {
      viewer: 'Afbeeldingsweergave',
      close: 'Sluiten',
      previous: 'Vorige afbeelding',
      next: 'Volgende afbeelding',
      translationRegion: 'Nederlandse vertaling van het document'
    } : pageLang.indexOf('ru') === 0 ? {
      viewer: 'Просмотр изображения',
      close: 'Закрыть',
      previous: 'Предыдущее изображение',
      next: 'Следующее изображение',
      translationRegion: 'Перевод документа на русский язык',
      translationShow: 'Показать перевод документа на русский язык',
      translationOriginal: 'Показать оригинал на немецком языке'
    } : pageLang.indexOf('cs') === 0 ? {
      viewer: 'Prohlížeč obrázků',
      close: 'Zavřít',
      previous: 'Předchozí obrázek',
      next: 'Následující obrázek',
      translationRegion: 'Český překlad dokumentu',
      translationShow: 'Zobrazit český překlad',
      translationOriginal: 'Zobrazit německý originál'
    } : pageLang.indexOf('ja') === 0 ? {
      viewer: '画像ビューア',
      close: '閉じる',
      previous: '前の画像',
      next: '次の画像',
      translationRegion: '文書の日本語訳',
      translationShow: '日本語訳を表示',
      translationOriginal: 'ドイツ語の原文を表示'
    } : pageLang.indexOf('ko') === 0 ? {
      viewer: '이미지 뷰어',
      close: '닫기',
      previous: '이전 이미지',
      next: '다음 이미지',
      translationRegion: '문서 번역',
      translationShow: '문서 번역 보기',
      translationOriginal: '독일어 원문 보기'
    } : {
      viewer: 'Bildansicht',
      close: 'Schließen',
      previous: 'Vorheriges Bild',
      next: 'Nächstes Bild'
    };
    var overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.id = 'lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', labels.viewer);
    overlay.setAttribute('aria-describedby', 'lightboxCaption');
    overlay.innerHTML =
      '<button class="lightbox-close" type="button" aria-label="' + labels.close + '">×</button>' +
      '<button class="lightbox-nav lightbox-prev" type="button" aria-label="' + labels.previous + '" style="position: absolute; left: 24px; top: 50%; transform: translateY(-50%); background: rgba(20, 18, 14, 0.4); border: 1px solid rgba(243, 236, 220, 0.3); color: #f3ecdc; width: 48px; height: 48px; border-radius: 50%; font-size: 24px; cursor: pointer; z-index: 1010; display: none; align-items: center; justify-content: center; transition: background 0.15s, border-color 0.15s; outline: none; user-select: none;">‹</button>' +
      '<button class="lightbox-nav lightbox-next" type="button" aria-label="' + labels.next + '" style="position: absolute; right: 24px; top: 50%; transform: translateY(-50%); background: rgba(20, 18, 14, 0.4); border: 1px solid rgba(243, 236, 220, 0.3); color: #f3ecdc; width: 48px; height: 48px; border-radius: 50%; font-size: 24px; cursor: pointer; z-index: 1010; display: none; align-items: center; justify-content: center; transition: background 0.15s, border-color 0.15s; outline: none; user-select: none;">›</button>' +
      '<div class="lightbox-frame">' +
      '  <div class="lightbox-document-stage">' +
      '    <img id="lightboxImg" alt="">' +
      '    <div class="lightbox-translation-panel" id="lightboxTranslation" role="region" aria-label="' + (labels.translationRegion || 'Dokumentübersetzung') + '" tabindex="-1" hidden></div>' +
      '    <button class="lightbox-translation-toggle" id="lightboxTranslationToggle" type="button" aria-controls="lightboxTranslation" aria-pressed="false" hidden></button>' +
      '  </div>' +
      '  <div class="lightbox-caption" id="lightboxCaption"></div>' +
      '</div>';
    document.body.appendChild(overlay);
  }

  function init() {
    injectOverlay();
    var pageLang = document.documentElement.lang.toLowerCase();
    var translationDefaults = pageLang.indexOf('fr') === 0 ? {
      show: 'Afficher la traduction française',
      original: 'Afficher l’original allemand'
    } : pageLang.indexOf('ru') === 0 ? {
      show: 'Показать перевод документа на русский язык',
      original: 'Показать оригинал на немецком языке'
    } : pageLang.indexOf('nl') === 0 ? {
      show: 'Nederlandse vertaling bekijken',
      original: 'Duits origineel bekijken'
    } : pageLang.indexOf('pl') === 0 ? {
      show: 'Pokaż tłumaczenie',
      original: 'Pokaż oryginał'
    } : pageLang.indexOf('cs') === 0 ? {
      show: 'Zobrazit český překlad',
      original: 'Zobrazit německý originál'
    } : pageLang.indexOf('ja') === 0 ? {
      show: '日本語訳を表示',
      original: 'ドイツ語の原文を表示'
    } : pageLang.indexOf('ko') === 0 ? {
      show: '문서 번역 보기',
      original: '독일어 원문 보기'
    } : {
      show: 'Übersetzung anzeigen',
      original: 'Original anzeigen'
    };
    var overlay = document.getElementById('lightbox');
    var img = document.getElementById('lightboxImg');
    var cap = document.getElementById('lightboxCaption');
    var translationPanel = document.getElementById('lightboxTranslation');
    var translationToggle = document.getElementById('lightboxTranslationToggle');
    var documentStage = overlay.querySelector('.lightbox-document-stage');
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
    var currentTrigger = null;
    var translationMode = false;
    var translationShowLabel = '';
    var translationOriginalLabel = '';
    var lastFocusedElement = null;
    var inertedBackgroundElements = [];
    var inertObserver = null;

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

    function setBackgroundInert(makeInert) {
      if (makeInert) {
        inertedBackgroundElements = [];
        if (inertObserver) inertObserver.disconnect();
        Array.prototype.forEach.call(document.body.children, function (child) {
          if (child === overlay || child.hasAttribute('inert')) return;
          child.setAttribute('inert', '');
          inertedBackgroundElements.push(child);
        });
        inertObserver = new MutationObserver(function (mutations) {
          mutations.forEach(function (mutation) {
            Array.prototype.forEach.call(mutation.addedNodes, function (node) {
              if (node.nodeType !== 1 || node === overlay || node.hasAttribute('inert')) return;
              node.setAttribute('inert', '');
              inertedBackgroundElements.push(node);
            });
          });
        });
        inertObserver.observe(document.body, { childList: true });
        return;
      }
      if (inertObserver) {
        inertObserver.disconnect();
        inertObserver = null;
      }
      inertedBackgroundElements.forEach(function (child) {
        child.removeAttribute('inert');
      });
      inertedBackgroundElements = [];
    }

    function getFocusableElements() {
      return Array.prototype.filter.call(
        overlay.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
          'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ),
        function (element) {
          return !element.hidden && element.getAttribute('aria-hidden') !== 'true' && element.offsetParent !== null;
        }
      );
    }

    function focusWithoutScroll(element) {
      if (!element || typeof element.focus !== 'function') return;
      try {
        element.focus({ preventScroll: true });
      } catch (error) {
        element.focus();
      }
    }

    function setTranslationMode(showTranslation) {
      translationMode = Boolean(showTranslation && currentTrigger);
      translationPanel.hidden = !translationMode;
      translationPanel.setAttribute('aria-hidden', translationMode ? 'false' : 'true');
      if (translationMode) img.setAttribute('aria-hidden', 'true');
      else img.removeAttribute('aria-hidden');
      translationToggle.setAttribute('aria-pressed', translationMode ? 'true' : 'false');
      translationToggle.textContent = translationMode ? translationOriginalLabel : translationShowLabel;
      translationPanel.scrollTop = 0;
      resetZoom();
      if (translationMode) {
        focusWithoutScroll(translationPanel);
      } else {
        focusWithoutScroll(translationToggle);
      }
    }

    function prepareTranslation(trigger) {
      currentTrigger = trigger || null;
      translationMode = false;
      translationPanel.hidden = true;
      translationPanel.setAttribute('aria-hidden', 'true');
      translationPanel.innerHTML = '';
      img.removeAttribute('aria-hidden');
      translationToggle.hidden = true;
      translationToggle.setAttribute('aria-pressed', 'false');
      documentStage.classList.remove('has-translation');

      if (!currentTrigger) return;

      var sourceSelector = currentTrigger.getAttribute('data-lightbox-translation');
      if (!sourceSelector) return;

      var source = null;
      try {
        source = document.querySelector(sourceSelector);
      } catch (error) {
        return;
      }
      if (!source) return;

      var translatedDocument = source.cloneNode(true);
      translatedDocument.removeAttribute('id');
      translatedDocument.removeAttribute('aria-labelledby');
      translatedDocument.querySelectorAll('[id]').forEach(function (node) {
        node.removeAttribute('id');
      });
      translatedDocument.querySelectorAll('[aria-labelledby]').forEach(function (node) {
        node.removeAttribute('aria-labelledby');
      });
      translatedDocument.querySelectorAll('table').forEach(function (table) {
        var wrapper = document.createElement('div');
        wrapper.className = 'translation-table-scroll';
        wrapper.setAttribute('tabindex', '0');
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      });
      translationPanel.appendChild(translatedDocument);
      translationShowLabel = currentTrigger.getAttribute('data-translation-show') || translationDefaults.show;
      translationOriginalLabel = currentTrigger.getAttribute('data-translation-original') || translationDefaults.original;
      translationToggle.textContent = translationShowLabel;
      translationToggle.hidden = false;
      documentStage.classList.add('has-translation');
    }

    function getTriggerAlt(trigger) {
      var explicitAlt = trigger && trigger.getAttribute('data-lightbox-alt');
      if (explicitAlt) return explicitAlt;
      var preview = trigger && trigger.querySelector('img');
      return preview ? (preview.getAttribute('alt') || '') : '';
    }

    function open(href, caption, trigger) {
      lastFocusedElement = trigger || document.activeElement;
      img.src = href;
      img.alt = getTriggerAlt(trigger);
      cap.textContent = caption || '';
      prepareTranslation(trigger);
      overlay.classList.add('is-open');
      setBackgroundInert(true);
      document.body.style.overflow = 'hidden';
      resetZoom();
      window.requestAnimationFrame(function () {
        focusWithoutScroll(closeBtn);
      });

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
      if (!overlay.classList.contains('is-open')) return;
      overlay.classList.remove('is-open');
      setBackgroundInert(false);
      document.body.style.overflow = '';
      img.src = '';
      img.alt = '';
      prepareTranslation(null);
      resetZoom();
      if (lastFocusedElement && document.documentElement.contains(lastFocusedElement)) {
        focusWithoutScroll(lastFocusedElement);
      }
      lastFocusedElement = null;
    }

    function updateImage() {
      if (currentIdx < 0 || currentIdx >= uniqueTriggers.length) return;
      var trigger = uniqueTriggers[currentIdx];
      img.src = trigger.getAttribute('href');
      img.alt = getTriggerAlt(trigger);
      cap.textContent = trigger.getAttribute('data-lightbox') || '';
      prepareTranslation(trigger);
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

        open(href, a.getAttribute('data-lightbox'), a);
      });
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });

    closeBtn.addEventListener('click', close);

    translationToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      setTranslationMode(!translationMode);
    });

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

    // Tastatursteuerung: Fokusfalle, Pfeiltasten links/rechts und Escape.
    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('is-open')) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'Tab') {
        var focusable = getFocusableElements();
        if (!focusable.length) {
          e.preventDefault();
          focusWithoutScroll(closeBtn);
          return;
        }
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        var active = document.activeElement;
        if (e.shiftKey && (active === first || focusable.indexOf(active) === -1)) {
          e.preventDefault();
          focusWithoutScroll(last);
        } else if (!e.shiftKey && (active === last || focusable.indexOf(active) === -1)) {
          e.preventDefault();
          focusWithoutScroll(first);
        }
      } else if (e.key === 'ArrowRight' && uniqueTriggers.length > 1 && !translationMode) {
        currentIdx = (currentIdx + 1) % uniqueTriggers.length;
        updateImage();
      } else if (e.key === 'ArrowLeft' && uniqueTriggers.length > 1 && !translationMode) {
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
      if (!translationPanel.hidden && (e.target === translationPanel || translationPanel.contains(e.target))) return;
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
      initHeaderControls();
      initBackToTop();
      init();
    });
  } else {
    initNavDropdownAria();
    initHeaderControls();
    initBackToTop();
    init();
  }
})();

/* Voiceflow Chat Widget Integration */
(function() {
  var voiceflowLoaded = false;
  var timeoutId = null;

  var injectGlobalStyles = function() {
    if (document.getElementById('custom-vf-global-styles')) return;
    var style = document.createElement('style');
    style.id = 'custom-vf-global-styles';
    style.textContent = [
      '@keyframes vfrc-fade-in {',
      '  0% {',
      '    opacity: 0;',
      '    transform: translateY(20px) scale(0.95);',
      '  }',
      '  100% {',
      '    opacity: 1;',
      '    transform: translateY(0) scale(1);',
      '  }',
      '}',
      '.vfrc-proactive__card, .vfrc-proactive-message {',
      '  animation: vfrc-fade-in 2.25s ease-in-out forwards !important;',
      '  transform-origin: bottom right !important;',
      '}',
      '.vfrc-proactive {',
      '  display: block !important;',
      '  visibility: visible !important;',
      '}',
      '.vfrc-avatar {',
      '  background-image: url("data:image/png;base64,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") !important;',
      '  background-size: cover !important;',
      '  background-position: center !important;',
      '  background-repeat: no-repeat !important;',
      '  content: url("data:image/png;base64,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") !important;',
      '}',
      '.vfrc-avatar img {',
      '  opacity: 0 !important;',
      '  display: none !important;',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  };

  var injectShadowStyles = function() {
    var shadowHost = document.getElementById('voiceflow-chat');
    if (shadowHost && shadowHost.shadowRoot) {
      if (shadowHost.shadowRoot.querySelector('#custom-vf-styles')) return;

      var style = document.createElement('style');
      style.id = 'custom-vf-styles';
      style.textContent = [
        '@keyframes vfrc-fade-in {',
        '  0% {',
        '    opacity: 0;',
        '    transform: translateY(20px) scale(0.95);',
        '  }',
        '  100% {',
        '    opacity: 1;',
        '    transform: translateY(0) scale(1);',
        '  }',
        '}',
        '.vfrc-proactive__card, .vfrc-proactive-message {',
        '  animation: vfrc-fade-in 2.25s ease-in-out forwards !important;',
        '  transform-origin: bottom right !important;',
        '}',
        // Make the launcher button a clean circle and hide the text label
        '.vfrc-launcher {',
        '  width: 48px !important;',
        '  height: 48px !important;',
        '  min-width: 48px !important;',
        '  max-width: 48px !important;',
        '  border-radius: 50% !important;',
        '  padding: 0 !important;',
        '  display: flex !important;',
        '  justify-content: center !important;',
        '  align-items: center !important;',
        '  box-sizing: border-box !important;',
        '}',
        '.vfrc-launcher__label {',
        '  display: none !important;',
        '}',
        '.vfrc-launcher svg {',
        '  display: block !important;',
        '  width: 24px !important;',
        '  height: 24px !important;',
        '  margin: 0 !important;',
        '}',
        '.vfrc-proactive {',
        '  display: block !important;',
        '  visibility: visible !important;',
        '}',
        '.vfrc-avatar {',
        '  background-image: url("data:image/png;base64,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") !important;',
        '  background-size: cover !important;',
        '  background-position: center !important;',
        '  background-repeat: no-repeat !important;',
        '  content: url("data:image/png;base64,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") !important;',
        '}',
        '.vfrc-avatar img {',
        '  opacity: 0 !important;',
        '  display: none !important;',
        '}'
      ].join('\n');
      shadowHost.shadowRoot.appendChild(style);
    }
  };

  var initVoiceflow = function() {
    if (voiceflowLoaded) return;
    voiceflowLoaded = true;

    injectGlobalStyles();

    // Clean up event listeners and timers
    window.removeEventListener('scroll', handleScrollOrTimeout);
    if (timeoutId) clearTimeout(timeoutId);

    // Load Voiceflow script bundle
    (function(d,t){
      var v=d.createElement(t),s=d.getElementsByTagName(t)[0];
      v.onload=function(){
        var pageLang = document.documentElement.lang.toLowerCase();
        var isEnglishPage = pageLang.indexOf('en') === 0;
        var isFrenchPage = pageLang.indexOf('fr') === 0;
        var isDutchPage = pageLang.indexOf('nl') === 0;
        var isRussianPage = pageLang.indexOf('ru') === 0;
        var isCzechPage = pageLang.indexOf('cs') === 0;
        var isJapanesePage = pageLang.indexOf('ja') === 0;
        var isKoreanPage = pageLang.indexOf('ko') === 0;
        var czechAiDisclaimer = 'Odpovědi umělé inteligence mohou obsahovat chyby.';
        var japaneseAiDisclaimer = 'AIの回答には誤りが含まれる場合があります。';
        var koreanAiDisclaimer = 'AI 답변에는 오류가 포함될 수 있습니다.';
        var voiceflowReady = window.voiceflow.chat.load({
          verify:{projectID:'6a0977f2a62d285256e0577a'},
          url:'https://general-runtime.voiceflow.com',
          voice:{url:'https://runtime-api.voiceflow.com'},
          assistant:Object.assign({
            stylesheet: 'data:text/css;base64,QGtleWZyYW1lcyB2ZnJjLWZhZGUtaW4gewogIDAlIHsKICAgIG9wYWNpdHk6IDA7CiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMjBweCkgc2NhbGUoMC45NSk7CiAgfQogIDEwMCUgewogICAgb3BhY2l0eTogMTsKICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKSBzY2FsZSgxKTsKICB9Cn0KLnZmcmMtcHJvYWN0aXZlX19jYXJkLAoudmZyYy1wcm9hY3RpdmUtbWVzc2FnZSB7CiAgYW5pbWF0aW9uOiB2ZnJjLWZhZGUtaW4gMi4yNXMgZWFzZS1pbi1vdXQgZm9yd2FyZHMgIWltcG9ydGFudDsKICB0cmFuc2Zvcm0tb3JpZ2luOiBib3R0b20gcmlnaHQgIWltcG9ydGFudDsKfQoudmZyYy1sYXVuY2hlciB7CiAgd2lkdGg6IDQ4cHggIWltcG9ydGFudDsKICBoZWlnaHQ6IDQ4cHggIWltcG9ydGFudDsKICBtaW4td2lkdGg6IDQ4cHggIWltcG9ydGFudDsKICBtYXgtd2lkdGg6IDQ4cHggIWltcG9ydGFudDsKICBib3JkZXItcmFkaXVzOiA1MCUgIWltcG9ydGFudDsKICBwYWRkaW5nOiAwICFpbXBvcnRhbnQ7CiAgZGlzcGxheTogZmxleCAhaW1wb3J0YW50OwogIGp1c3RpZnktY29udGVudDogY2VudGVyICFpbXBvcnRhbnQ7CiAgYWxpZ24taXRlbXM6IGNlbnRlciAhaW1wb3J0YW50OwogIGJveC1zaXppbmc6IGJvcmRlci1ib3ggIWltcG9ydGFudDsKfQoudmZyYy1sYXVuY2hlcl9fbGFiZWwgewogIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDsKfQoudmZyYy1sYXVuY2hlciBzdmcgewogIGRpc3BsYXk6IGJsb2NrICFpbXBvcnRhbnQ7CiAgd2lkdGg6IDI0cHggIWltcG9ydGFudDsKICBoZWlnaHQ6IDI0cHggIWltcG9ydGFudDsKICBtYXJnaW46IDAgIWltcG9ydGFudDsKfQoudmZyYy1wcm9hY3RpdmUgewogIGRpc3BsYXk6IGJsb2NrICFpbXBvcnRhbnQ7CiAgdmlzaWJpbGl0eTogdmlzaWJsZSAhaW1wb3J0YW50Owp9Ci52ZnJjLWF2YXRhciB7CiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUlBQUFBQ0FDQUlBQUFCTVhQYWNBQUJ4dzBsRVFWUjQydFg5ZDZDbFoxVXZqcS8xbExmc2R2YnAvVXc3MDJzeW1TU1Qza01TRWpvQ2doUkZWRUNVcTk0cnFIaFY3bFd2SW9LVlhpU0FsQUFoaElUMG5zeE1wdmQ2ZWorNzc3YzhaZjMrZVBjK00xUUZVWC9melNSTVR0bmxXYy9xbi9WWmFLMUZCQUNFSC9XZ0gvZU5uL2tIZitRdkUxbExBTVE1di9EcjVVcDVabnBtWW1KeVltcHFlbnA2Zm02K1dDeVZLOVdnWG8raXlCaHJpUUFBR1FyR1hNL3pVNmxjSnQyYXozZDBkdlIwOS9UMzkvYjE5ZlgwZEdlejJRdWYxaGdEZ0l3aDRzLytudi9qbnpwNW9DV0wvK0ZuK1puUG5ZZ0FnREcyOUluR3hzZU9IVDl4OU5qeE0yZE9UMC9PRklyRmVoZ29iU0E1YThER28zRm5jT201TEFCWXNtU0JpQUFZb2hEQ1QvbjVmRXRmWCsrcWxTdlhybDJ6YnUzYXdjR0JwWE8zMWdMQTB2UDl0enpRV3Z0Zi8vTFdXcUx6OTcxU3FSdzZkSGozbmozNzloOGFHUjBwbGNyR0dNWVk1NEl4aG9oQUFJa0VtcEs3VUdjUm9QRXRSRmo2RmlJZ0VsbHJyRGJhV2hLQzUzTFo1VU5EVzdaczNuSEpKWnMzYjF6U0RHTU1JcDYvQi8vbEFnRDRyMUtDNU5JbEh6VU13MTI3OXp6KytCTjc5KzJmbXB5S29wZ0p6b1ZneU01clIvT0VsMjVKNDNDWC9nNUFpUzBnSUtDbVBNNy9jbE0waUloa3JkYktXdXM0VG45djc3YUx0MTEzN2RXWGJOL3VlZDZTUnY0WGkrRy9UZ09zdGNoWThrcW5UcC8rM3ZjZWV2enhKOCtlSFltVmNoeUhjUTdKa1JNbDU0cUlkTUdKNDlJZC8zR2ZCQnA2OHNPS1FvMi9zK1N2aVRDc01iRlNqaU5XckZoeHpWVlgzbkx6amNQRHcwc0s4UVBlNlAvYkdtQ3RYYnBXenp6NzNEZnUrZFlMTDd4UUxKZUZsSUlMV2pxcEMwNTV5YXFjTi9ZLy9DNmI5Ny81dzgyelQxVGdRaUUwL3JyMFBadG9ERElrUUd1MDFqcVh5KzdZc2YzbEw3dnp5aXV1U0Y3cndyZjkvMVVCSk9xVmZKNkhIM24waTEvKzE3MTdEMWl0cGVNd3hrelRCeVl2Zjk3UUlDYi9pVXUySEttcEJBU0ljRDVzYU1RaGlmbEpqcmh4NUlrNk5VWFEvQXMyWGJaRkFBSzBSSWpBR1FPaU1JNGNJYmRzMmZRTHIzM05qVGRlenhqN0x6QkthSzF0Zmg3OCtVWTQxdHBFa1o5NjZwblBmdTd6ZTE3Y2F5eTVyb3ZXR2lKazdNSzduUndISURBQWhnaUFqRUh5eGhBVG93R0l3SkFRR1RZdEVRRWw3OTFDdy9EYmhpekFXaUxDeHJrVEVJRUZTTUpXb0lhc2FNbDdBNkMxZ0l3eEZxa1lBYlp1Mi96bU4vN2lkZGRkbTFpa1JpencveFVCTENudjhlTW4vdWxqbjNqaWlhZTBOYTdqV2t0RWxnRUF3L1BlbEJDVGcyYUlBSXd4aG9RSURKRWhjQWFNSWNQa0Q3RGs5aU94SlJ2VlZBUUF0RVFFWUltSXdGb3daQnYvSnJDRVpJRUlMQUV0NVIwQW1BaXZLUlVMZ0lDY3NVakhpSGoxbFZmOCtqdmV2bjc5dXY4OGk0U1dUS0xtUDkrTFg2L1hQL0hKVDMveGkvOWFxZFY4MzdlV0xCRy93S3dzQ1lBQk1nVEdFQmx3Uk1hQUkzREdPS0pnd0JrazU4NFpDc1lFUjhHUU1kWklvNXFhWUFuSVdtT3NzZFlZMHBhMEpVUFdFck1XTlZsRFpBMW9BbVBKV0NCTGxzQTJ2SDdET1Zockc0RXNFU0FpWTJFWVpqTHBYM2p0cTkvK3kyOU5wOVBHMko5SCt2YWpmY0RQUVFPVzdzaHp6ejMvVjMvOTRTTkhqL21wRkFCclhDeUFKSzVaeXFRYU41b2haeUFZQ29hQ28wRGtERG1TNU9CSjZibFNPbElLeWJpd3dKSzdiSWlNcFdZZURBaklFRGtTWThpUU9BQ0FzVnBwYlpSU1Vhd2liYlFCYlVFVGFtdVZzY3BhWTlIYXhGS1JwZk1SRkJFbGJzUVNNY1lCb1I3VTFxMWQ4ejkrK3oxWFhuSEZqMUdGbnowbC9ya0pJQW5kb2pqK3lFZi8vZ3QzZjlsYWNoekhHTDBVM1N4NWVvYklXWExySVRsNnlabkRtV0FrR1BpUys1N3JlNTV3WEUwODFGU1BkRDFXVVd5aVdHbGpyQ1ZyRzdZZUFHd2lBQUFFWUF3Wlk0SXpLYm5yQ044UmFWZDRnZ2t3VnNkUkZOYkNPRlFtTnFBdEtVdXhKbU9zdG1RSmphV0dJd0ZJWFBSUzdzYzVpK0tZTVh6RDYxNzdudDk4bCt1NlA4YzQ5ZWZnQTViTXpvbVRKLy80ai85c3o5NjltWFEyZWRybUJXMVlIY1lBRVRrQzU4QVpTbzRPWjVLaHc4aDNlQ2JsZVg3S29xekZWQWxVT1lpQ01OYkdKS3JERUJtd3hPcGNZSHlXTGlBUU5VSWRTbXdMa1NGQ1pKSnp6NVc1bE5PU2N0SVMwYW9ncU5mcVVhQk1iRUFaaW8xVnhtb0NZOEFtVHNMYTVFb256NGxrQ1JuanJGYXRYclIxeS8vKzR6OWNzMmIxejBzRy85RXdkQ216L2ZaOTMvbXpELzVGcFZMeFBNOW9nNGpJa0M2SWM1S0x6eGx3RHBJemp6UEp3UldROVoxTU9vUENLNGRtc1JxVmFrRWNLd0xnREFWbm5ETU8wSFFNeUJreWhneUJMeFZ3R29rdldBSURKakh4eHBLeFpBa3RnYkdrRFJteUNPaElrVTA1N1JrdjUzTFFZYlZXcXdaeFpEQzJGQnFydE5XR0xERnJiTk05QUFFd0lFTUFRSUtMSUtqbmNybjMvZjd2M3ZuU081YlNsLzgyRFZpeWhuL3o0WTk4N09PZmNseVhNZGJRM3dzdUtXZU1BWEFPZ29QRDBlRmNNdkFGNXJOK0twME9ESityeEF1Vm1vNDBJQWpPUkZNL0pFZkptY05RTXVCQURDd0hRaUNPeEJFUkliSEVsb2dBTFlFQklFQURxSkZaUUcweE5xUTBLV09WSldOSkdWTGFBcERyT0cyNWRGZk9jVUhYYTlWU1BRdzB4SnBpWTJOanRZWkVjc2t6STlCUy9NcVFFVkVZaFcvL2xiZSs5N2ZmYytFaEVOSFBJQXkwMXNENXUvUlRHLzBnQ043M0J4KzQ5OXZmeVdWenhwZ2ttdnpCaTgrUk1aQWNQTTVjaHE2RTFveVh5ZVFxbWs4dVZndVZ1Z1Z3T0xxY2NZYVNreWU0SjVsRTRLUTVXVSt3ZEVxMjVEUDV0cFo4VzBzdW4wbG4wcTd2UzhmaFFnQ0FOVHFPNDZnZTFxclZTcWxhV0NnVkZrdmxVclZlanlPREZwa0dIbHNJalEyVlVacVVCV1ZKYWNzWXRtVDhubnc2SzIxUXF4U3JZYUFoTmpiU05qWmdESmhHdk5wSUlKREFBaUVBNDd4Y0x0OSsyNjEvL24vK0xKWHkveVBtS0NsSC85Uk9PSG5KaGNYRjMzelBlNTkvWVhkTHJrVnBqVWxheEJvV0xRbmVPUWZCMGVYb0N1Wnl5cWVjWEM1WDBYeGlvVmFxQm9nZ0paY01IUTYrWkw1a0RsaE9KaVd3dFMwOTBOKzFiSGl3YjFsdmEzdXJtL0lBU01VbUNzS3dGc1pSRk1kR2F3TkFuRFBIa1k0blBkOXpmVSs2RWhDaUlDek1GeVpIcHNiT2pFK016UzBXcTZFQ3pYaGtXUkNiUU52WWtqSVFhME9BTFdtdnZ5MlRGYVpTS1pmcUt0SVFhaE1hcXcwWUM5YVNJVW9TYnRzTWx4d3BpNlhTcFR1MmYrVERmOTNSMGZFenl3QnR3Mkw4RkFKSVhteHljdXJYM3ZudW8wZVBaeklabzAwanhHOWFIb2JJR1hBR0RrZFhjbzlqeHNYMmZFdk0zSkc1NmtLNUpoR2w1SktqeXlEbGNsK2d0TnBsdHE4N3YzN1R5bldiVjNmM2RRSFp3a0pwWm54NlptSm1jYjVZTGRlQ2VxUzEwY1lhUzBzRm4rUzljNGFDb3hUYzk5MTBMdFBXbWUvdTcrNGU2TXAzdENEaTdOVDg4WU9uanh3OE16MWJDZzJMa1FYSzFwUU5EUmtEU2xzTjBKNU5MZXZJT0JUT0Y4dlZ5RWFHUW1WaVE4YUFOdERNc2FtUmdWdGdRdFpxbFRYRHEvNzVILyt1ZjZEL1o1UEJrZy80NlU1L2ZIemliVzkveDhqSW1KL3lqVEtzZWVzSkVSRjQ0bTg1dVlMNWdyc2MyckplT3B1ZkxFWGpjMlZMMXBWY012QUVaQnpoQzVCVzV6UE9oZzNMdDErMmNXQlpUMUFMUjA2Tm5qNCtNajB4WDY3VWxiWVcwVEpCeUFBWkVSQWtOWWJ6UlRac1pBT0FRQXdJeURKckdGakpXVGJyOWZaM3Ixdzd0R3pWZ0pmMkprYW1kejkzK01qUmM0V3FVa3dFR21xeGlUVXBna2daaHRqWDN0TFg0Z1QxY3FFU2hCcENiU0psbFVGanlSQTE0cUxFUDF1U2t0ZnF0ZVZEeXo3eDhYOGNIQno0R1dUdzAyWENpY09abUp6NjVWLysxVFBuUnRLcGxOSVdHeFVDSUFCc1hud3AwQlBNRXl6anNNN1dscXAxVHM4VXdpQjJKQmVjdVJ3eURrdEpGRmIxdEtaMjd0eTAvZkxOVW9wVFI4NGMzbjlpWW55dUZpcURQRGwwUzJBTUtXMlYwc29ZWTJ3U2VwMFBRSkl5VzhQaWNTbTVsRndLempreUJFNldqT0drVTQ3c0grallzSFY0OVlibFN1azl6eDkrOXBtanM4V2FabTVkMjJxa1E0TmFVNmkxN3ptcmVscHpYTTBYaXRXSUFtTURaWFdpQ2tTV0NBR3BXVkJpbklkQk1EZzQ4SmxQZmF5L3YvK25yVmo4RkJxUVBQWEM0dUl2dmZtWFQ1dzY3ZnNwTWlhcDJyTm1CWjh6NUl3Y0FiNFFyc0MydE16bFdzZUswZGg4VVNCekpaTU1NZzdMZWtMYXVEM3JYblBsbHN1djJCd0U4WjRYRGgwOWZMcFlEZzBURnJrbTFNYUdrUTRqWmF3UlFtVFNmbnRidHFPOUpkK2F6YldrVWluZjkxd3VPUUlhWTZNb3J0V0NVcWxhV0N3dExKUVdDdFZLTlREYVNDRmNSN2lPa0p3SkpMU0dXWlhMZWhzMnJ0aCsyWWFVN3ovMzNLR25uam80VzRvVWs1VklWMk5TRmlKanJJWEI5cGJCVnFkY0xoUnFLdFFRYUIxck1BYVNsSTJhY1pFbGtrTFU2clhWdzhPZis4d24ydHZiZnlvWi9Ic3pZYklFQ0VFWXZ1MXR2N3ByOTU1TU5xZTE1Z3liVlV6aW1KUm93QlBnUys0SjZHeEpDemQ3ZkxKWXF0WTlWMG9PdnNBV2ozdU1NZ0t1MnJueGhoc3VDZXIxSngvZmMrellXRjFaeTRXMlRCc0lJMVdQWW9iUTBaNWJ2YkozOWZCQWYxOW5KcE1DeG9Jd3JsVERhclZlQzRJb2lyV3hDQ2dFZDEwbm5mSXpHUytYOFZNcGw4aFd5dld4aWRtVEo4ZFBuWm1hV3lpakJkOTNQRmRJanB3Ukt1VUozTGgrNk9ycnQvdSsrL0REdXg5LzVraE5RMGk4SEpqQWdMWVVLNTFOK1d2N1dpQ3V6QmJyZ2FhNk1xRzIxcUN4WUsybHBjWURFZWVpVXExY3N2MmlUMy95WTc3dkUwR3orZlR6MElDbFhQZmR2L25iOTM3N095MzVWcTFWdytZMkMvaUNJZVBnQ3ZRbFN3bnNibXNKeVQwMk5xZXRkYVZ3R0tSZGJIRTVOL0g2bGQydmVlVjF1VnptOFVkMzdkdDNzcWJKTUtFTXhJcHFZV3l0N2V2T2I5dTRZdlA2WlcxdDJYSXRPRGMrZCtyY3pOamsvRUtoR2dTeDBvYU1UWHp3K1V3TUVCRVlRMGZ5ZE1ydGFNc045bmVzWE42emJLQXptM1lYRnNzSEQ1OTk4ZUM1cWRtaTREemp1NDVBeVlGYmt4S3dkY3ZLYTY3ZlhpN1h2bnJQa3lmT3pXcm1sa0pUaVkweUVHa2pHRnMzMko3R2VHYXhWTk1RS0JNcWEweFN1bWk0QkNBaVMwTEtRcWw0NSswditlaEgvaVpSZ2g5T0MzNDRWL2gzaGFGYWF5SEVYLzYvRC8zZDMvMWphMXViVW9weEJnU0pBSklhc2hEZ0MvUUVTMG5vN1dpYkQvRDA1RHhqS0FWM09lUTltUkkyeGVuT203ZGZlL1htUFh0T1BQbjR2bEtvWWlaQ1RiR3l0WG9rQmI5b3c5RFZsNjd2NmNwUHpCVDNIamwzNU5URTlIdzVWcG94em9VUVhDUjFVSUJHVlRtSnpSdHZIQnUrMFZxcmpkWmFHV05kS1hvNmN4dlhEbHkwY1hsZlYzNXladkhKNTQvdE96S3F0YzJsUEVjeXlZSHBPT1B5NjYvZGR0bGxHNTUrOXZDOUQreXV4bEExV0FwMFpDalcxbGc3M05mZTRkUHNZcWtXVTZCTW9LM1dhTWdhUzlqb1JoTVJDQ2tXRnd2dmV1ZXYvZDd2dnZmZjZaQXh3WFA4QkFFa1QvU3RiMzM3UGIvMU81bGN6aGlMUUt6cHRwTUNneERnQ2ZRRXkwanM2ZXlZS09sejB3dXVJd1RIbElCVzMzRklyZWh0ZWNzYmJuWUUrL285ajU4ZFh5REhEVFhGMmxicXNSRHNxb3VIcjd0MExTSjcvc0NaNXcrY21aNHZBNkRqT0VMS3hNMFlTMHFiT0RiYVdNSFJrU0lCUzF6UU9BYkVSanVza1ZnaUlJRFdPb29WZ08zdmJybHMyL0RsVzFlU3RZOCtlL1RwUGFlVU5ybVVLd1Z6QktDS2h3YzdYdlh5YTVTMm43bjdlMmVtU3pIS1loQUhLa2tYN0ZCMzYwQk96Qzh1bEtORUJxQTBtVVl4bFpKN1lBZ0VGNVZ5OFc4Ly9OZDMzZlhTZjQ4TS9nME5TRlRwNU1sVHIzck42NVEyMkNnN0VrTUFSQWJBT1JPY2ZJbWVFR2tIdXR2YlJndHFZcmJnT2xKeVNFdk0rNUtiOE9ydHE5LzBtcHYyN2p2MjdRZWVyeHVNZ2NVYWFxR3l4bHk1ZGVWdDEyd0pZdlhBMDRmMkhoME5ZKzM2cmlzbElsZ0xTbXVsamJYZ3VqeVg4ZHB5ZnRyajFkQk16dGZyZ2VaOHFYbDV2aDFzQ2F3bGV4NFowYmd1MnBnd2pIMVhiTjg0ZE91VjZ6MUgzUGZZZ1dmM24zV2t6SHJTa1V3QytjemVmdlBGbDF5MCt1NnZQZkhFbnRNazNNVzZxaXFyRFViSzlIZTBMRzl6NWhZWEt5SFZ0QW1WMVJwTjB1QkxMaXNoSWhCWnlmbFgvdlh1Tld0Vy81c08rU2M1NGFRakdzZng2OS93cHYySER2dWViMjBTNkJNZ01rVEJVQWh3T2FZY25wYlEwOUYrYmpHZW1DdDRqaFNjc2c1djhZU3c4V3R2dS9UbWF5Lyt5ajJQN2oxNHhqcGVYZGt3dHFWYXNMSy83UTIzWEpKTytkOTUrdER1d3lNRTZQbU9ZQXdSdExGYWFkZmhQZTJaNWYzNXdlNXNQdWN6eHFZTDlYMG5aczlPbHNMSU5JcllIRGtpYS9RbGtRaVNib3cyVmhuUzFtb0wxalo2TEl3aEVJUmh4TkR1MkRSMDUzV2I2a0gwcncrOGVIYThrTTk0RG1lZVJGRGhKUnVYdmZhVjF6N3kxSUd2M2I5Yk1hY1k2SEpzdGNVdzFuMGRMU3Zhbk5uRnhVcEU5ZGlFaXJRQm5kUXJBQ3doZ0dXTUIwR3djY1BhZi8zU0Z4ekgrY25BcjU5a2doSU4rdE1QL3ZuSFB2YUpmTDVWRzVzZ3BKS0NNT2RNY1BRNHBSeVJkckM3TFQ5YTBCUHpCVWNLeVNIcnNCYVBlNkRmL3JvYk42NGQvTVJuN3h1YkxWbmgxR05iajdReDVoWFhicjVpODhxSFhqaiswTzRUUkpEMlhjNlJJV3F0R2NKQVoyYlQ2cTdsL2EyTTRjUnM1ZVJFWVdTNk9sc01hNEVTaUdsUGVnSUZHUW5hNVNBNVR4cG5DR1FzYUVNYW1FSWVBNCswRFpXSk5HaHJyU1VORmdna1l3aFlqMEpId0swNzE5MjZjLzN6Qjg1OS9aRUREQ0R0U3RkaHdxcUJqdXpiMy95U1UyZG5QdkhGaDBNU3hZaEtrVllHb2xqM2Q3WXNiNVV6aTRVTFpiQ1VveVVCcWhDaVVDajgranZlL3Y3My9kNVBOa1JMQXNBZmFYeWVmdnFaTjc3NWwxT3BsRFVXa0FFUVMvcUlqQW1Pbm9DVTVDa0hlanRhSjhwbVpIclJkYVJnTnVQeVZsZWt1ZjNOdDk3ZTFaYjlwMC9mV3d4TlRDeFV0bFNQK2p1eWI3L3pxaUNLUG5mL0M3T0ZhamJ0QzQ1U01DRHJDYlo2V2R2RjYvdHlhZmZjVkhIZmlkbVRZNFg1U2hnVENzNVRqc2g2VWxvbHJjcWwvZTYrenI1bGc1MTlmZm0yZGkrVllveGJyWUpxdFRnL056YytOalUrTVQrM1VJMk00bTVnc1I2YVNGdGxTWU1sSUVib01BWUF0U0FZNk15KytZNUxVNTc4Mk5lZm5weXZ0bVk4MzJFTzJoWmZ2T09YWGxJcTF6L3ltZS9XREMrR3Bod1piU0dJOVlydTF2NGNtNTR2Vm1LcXhTWTJTZEc3VWFwTEd2NmNzU0FNUHYvWlQxMng4M0pqRFdmOHAvQUJpZkVKd3ZBVnIzak5xVFBuWE5kZGlwOFlBa2RnbkxrQzBwS25KSFMzWm91eFBENHg3d2d1QmVRa2EvRjRtcHYzL3NxZDJaVDc4Yy9lVnpkWTFSQXBLdGJxT3pjTXZ2N0dTeDdiZCtxQjU0OUpSM3FTU3dFY3llVzRhYmhyeDZZQkluangyTlMrNHpPVGhVQlpCTVlTZStkd0ZFWUpvMVlQRCsyNFp1ZUdpN1oxOTNWSzN3UE9BQklBQlM2aFcwREgxVko1NHRTWnc3dDJIZG05ZjNheEhIT3ZycWtXMjhoWURaWUkwSUluT0RKUVNrZFJkTWNWNjI3YnVlNUxEKzE5N3ZCWVd6cmxDUFFGT0dEZThVdTNXb0svL3NSOVZZV2wwSlJpcXpSRnNWNDcyTm5tNktuRlNrM1p1cktSQm1Pc3VRQ2ZoSWh4Rks5WXVmd2JYLzlYMy9OK25DSDYwUUpJdE9iLy9mWGZmUGpEZjlmYTFxYTFodlAxRmhLY0N3NHBpU25KdTF0Y3pkTUh6ODBKd1FUSGpNUldYNlpRdi9lWFg1cEx1Ly84Mlc5SElDcVJqVFJWYThITHJ0cDQxWmFWbi9udUM2ZkdGM0pwWDNEd0pES3lLL3BhcnRteDBuZkZjL3RIWHp3Mlc2Z3BCVHkyRkd0ckxRbkJmSUVVMXBjTmROLzJpbHN1dStveVA1T0dLQVFWRzJ1SUlLa1JRZU1URW9KRnhoam40THJBNWR6RTlMTVBQdkxjdzA4dDF1S1lPNVhJMUdQVG5rOUpEcE56TmQ4VlNibS9YQTAyTEd2L3RWZnNmTzd3NkRjZVA1enhYRmVnN3pCSjZqZmVmRnRzNkVNZnZ6ZXdZakhRNWNnbThjK201WjNDVkdkTFVTMDJnU0tsUVZ0cnpwZW9TQWl4dUZoNDcyKy8rM2ZlKzFzL3poQXRDUUIvTVBJNWRlcXVsNzJLQ0FoWXM2bHJHVU9PS0J2eFBtdEx5Mncydi9mY25EYldrU3d0b2QxM3BZM2U5YVpibHZkM2Z2UVQ5OVF0cTBZVUtZcmkrSzB2dVdTZ0svLzMzM2lxR3VtYzc3b0NYUUU1VDF4OXliSlZReDE3ajB3OGQyQmlvYXBDZ3pWbFFrM2FFaEE1Z3J1TXBGVzN2L1NHbDcvbTlvelBvVlEwUkpaTHhpVjNYWEFsY0FZY2dTRVFnQ1ZRbHVMWXFoaXNSckxNOVNDZEhUczc4ZTB2ZkczLzNzTktwaXF4RFpTNWFrdGYybUVQN3hubmpBbUIxa0l0aWx0VHptKzk1c3J4MmNKbnZ2T2k3N2hTWU5wbERxbmZmTWRkODR1VnYvdjAvU0U2Q3pWZDB4VEhsbkcyYlhsN3JWSllxTnQ2ckVORnlwQzJGd0xER3NIeHQrNzV5dXJWd3o4eUl1SWYrT01QNEEvWkgwUjgzL3YvNlBEaFk2N3JVS1BFU1FqQWtIR09EZ05mc3F5REhmbjhpZWxxTllnY3lUME9iYjZVTnY3RmwrMjhhTlBLajN6OG5wcUNhZ1NSdGlxT2YrMnVLOXR5cWIrLzUzRk5tUFdjdElzcEFjTURMUysvZVpOZytLMkhqN3g0WXJZY1F5V3l4VURWWXFzc0FaRERPUnFWbGZ4ZDczbnI3Uys5WHBZV1RMbGtMVERHUk1abFBnOHFoZkV6WjAvc1AzQjg3NEZUQjQ1TW5ENVZtcHNCRTZRekRzdjR6SUtORklVaGxBdjVmSGI3dFZjZ3d6T0hqM011TE1HeDBjVk5LOXB1dXJodmRLWVVoc1p6dWNOWnBNelQrODljdldYWlJjTjl1NDZPSVRKTGhCd1BIamgxMjAyWHRPZFRCNDZjZFZ4SGFXTUFJNlhybXZyYU1rb0Z4cUlsYXkzUTk2RWtnVEZXcmRabVoyZnZ2UE9PSDlreSswRndicUlwVHozMXpKdCs2YTFlS20yTkJvUUVqTWFTMW9mQWxNUzBaUDN0bWRtQW5acGM4QjNIRWREbWN3L01qWmNOditVWGJ2cWJ2L3ZxNUdJOTBCaHBpdVBvMSs2OHd2ZmtQOTM3bE9jNHJ1UVpsN25jWHJKcDRMSnRLL2JzSDMxNjMwZ3hvbEpveTZFdUJvb0FCT01FNUhMR2pHN0x1bi93dmw5YnU3SlBUVTF6NlJCblBPY1RSYy92T3ZERWsvdE9IajIzdUZBTWcxZ2JTd0NNb1JBOGsvRUdCcnEzWEx6K211dDJMRis5SE9ySzFHSWtBOGhZYis4TFQrLyt6RC9jWFRkWXNWQ29SdGR2N2JscCsrQlQreWFQbkYwVWtzV3hqWlNOVlB3YmQxMUtGajUrM3k1WE9rS2dKMnhYenZ1ZDMzejFsKzU1OG52UEhBdEJMTlJVWkRCVWVrVnZhM2VLcGhZcTFkaldsTkVhdGFVbFEyU3RGWnpYNnNHL2ZPNlRWMTkxNVE4Ykl2NkJEM3pnKzV2eVNFUy8rM3YvYTN4aVVnaHhIdENBamVhaUo5QVZ2QzB0MEVrZkhWOU0vRUhPWVZtSnF3Znk3MzdiSFovLzhrTW56czNGeEpURk1JcmU5cElkcmRuVVA5MzdwTzg2YVlmbjB6enJzbHV1V3J0eFRkOTNIejI4KzloME9ZYjVxbG1zcVlWYTFKZExEWGZscHlvMXlaZ2c4aDMydi8vdzE5ZjJ0a1VUVTB4SVpNamJVbnRlUFBoLy8rTFRkOS85dldQSHg4dUJVc2hKU0hCY2RGeHdCS0dveHpRMVZkaTkrK2dqMzN0dTlOelk4cFU5K2U1MlUxZGdqRmxZSEZxM3NuK29mODl6ZTYwRkx1WFJzZExVZlBXdXExWjE1Tnp4cWJLVURCRTVZeThjSGIxaXc5Q0dvYzQ5SjhZNTR4WlpHSVl6VTNPLzlQcWJqeDAvVnl6VkNURTJGZ0FMMWJDcnRjVkZIV2xqaVhRVElYQ2hOMVlxbnBpY2V0VXJYLzdEcmpnUkFGNXcvZGxERHoveWQzLy9UOWxNeHBCWitwWkFaSnc1bkh6Qk15NjI1VnVPVDFYcXNYSUVTd2xzOVVYT2dkLzk5YnYyN2ovMXlGT0hySEFpVGZVd2ZQVTFXOWNNZHYvRE41NXdwWk4yZUd1RzUzMSt4MDJiTzFvejMzcGczOW1aYWlHa3ViS2FyMFhHMm11SCs3Y1BkTzZkbkMrRmNWcHlHMFcvOTU0M1hyeG1JSmljNWxJeWppekwvK2tUWC92ckQzOXBZcVlrL0JTNmptRkNBMU9FeVI5TnpDS3ppTVM1Y0Z4bDZOQ2gwNDg4OUh6S1l4dTJEa09nZ1VBdEZnZFdEM1YwdHozMzlJdE1TQ25FZkNVK2NucnU2bTBEdy8zWmtZbUNJemtpTWNiMm5CeS9hZnZxcm54bS8ra0p3VGpqWW42dWtITEZiYmZzZU9iNXc0WlFXNnN0S20zcXNSM295T2dvMGhhTXRZYVNLaWxDRXVJVE9ZNTc1c3laTFZzMkQ2OWFtU0JOZjhBSFhBZ0xoL2U5LzQ4bXhpZTRrQmVDWnhsRHdkSGp6SlBRbFU4VlFqYTJVUEtrY0FTMStzSWg5VXV2dUtJOW4vbnNseDgxM0FtMHFVZngxWnRXM0hMcGhuKzg1MUZMa1BGNVBpMWFVK0tsdDJ4MXBmajJBL3VtS3ZGc1djMlYxVncxNnMybFhyRjV1SzdOUFFmUExRUngxcFZCcGZLcU82OTkxYTA3ZzVGeExpVnlaajM3dmc5KzhpdmZmTXJMWkVCSURhaUIxdzJGaGpRbUlDK3VDR3V4Q1JVaDQ4Q1lKcEtlR3luejJHTXZGZ3ZGblZkdWdzaUNKYlZZV3JGaHBUTG00TDdqM0hFSUlkWjA1TlRjeGV0Nk5xMXFIeDFmRklJekJHdGgzNm1KVjE2ekpWYjZ6TlE4WTB4Nnp1bFRJNWRzVzlYWDIvYml3Vk5DaU1oWUMxZ05Jcy96V2xPOEhzZkdnaVpMMUFDcUx1SHNsVEhUTTlPdmZ0VXI4UHVycE9jMUlKSE1NODg4OStHUC9GMHFuYlprbXpoTzVJaWNnU3ZBRTlpU0VsNHFlM1NpQ0FBdXg1ekxVaHd2V3RQem1wZGUvckhQZmJkWVY0R3hTcHZsWFMyL2N0ZlZuN3YveVlWS3JTWGx0S1pscTg5ZWN2Tm15ZGdERHgrY3E1bXBRanhiVnZQVjhOS2hyaHZXTG4vazlNVERweWFCY1U4d0cwVkR2ZTN2ZitkcmFHYWVrQUdCMitiKzRWOTk3aHZmZXpIZjNoWmJJQ1pDWUV6dzRlNjI2emNzdS9PU05TKzdmUDJkT3pmY3NIMTQ2OXErbHBiMGZMaytYNnhKeDBYR0xhSG5lN3YySEp1WW1ybisrbTBVYUNBd3hlcm1TellkT3preU9iVkFUR2hMeVBIVXVZVXRhN28yck80Y215Z2dBd0NzUitiTTVOeWJicm5zelBoc29Sb0FBakorNnRUb2ExOSt4ZWpZN094OEJRQWpReGFnWEk5NzJyTm80MWczOFN3MlFWOWpVaXAxWGVmY3VaRWRPeTVadm16b1FpWDRRUTM0c3cvKzN4TW5UanF1MjJ6elFkTGpsUng4eVZJTzc4eG5Kb3BxdmxMekpQY2x0SG95NjlCN2Z2bldGM1lmZitIQU9jdUZzU1FSZnV0MXR6eDc0UGkrRTZOdDJWUStMVm84ZHVQMUc3TysrOTJIRHM3VnpNUkNPRk5XcFhwOCs4Ymx3OTF0bjl0MTdPUmlOZVZLQkJJSVFhMzI2Ny80a3MzOW5mVmlGUWhTbmRuUDN2UHd4Ny8wU0d0N215YTBYRVNBRzNvNzNuanB1bGR1WDcxMWVYZEhheTZkU2VWYlVpc0hPN2J2R0w3eDVzMjNYYjBoM2RaNjh0eE10Ulk1cnFPVVNhVzhmUWZQVkd1VmE2L2VwTXF4TlNRQmhsWXZmL3pKM1lwSUdTQUFLZGpZK09KRjYzdVg5YldNVHl3Q1E4NzRYTEZLMXQ1MXpVVXZIRGxqTFJGZ3BSSWcyZHR1dXZqWjU0OEJzdGdZYlRHSU5XTzhLK2NHY1d3c2Ftc3RKYmhycE9hSVZCaUdZUkRjZWVjZEY4SzVHZ0pJUXRUVFo4NzgyZi81YytuSUN3YXNHQWZnSEIwT3Z1RDV0T0JPNnZoa1FUS1dWUGxkVWkrOWZ0T3FaVjJmLzlmSExaZmFrZ3JpTjd4a3ArK0lleDUrdmpXWHlmcWl4WVhMTDF1OWJLajdldy91bjZuRW93dmhiQ211UmVvWEw5dVljdDEvZnZwQVJWbFhNa3ZFRUV3Y0wrOXRlOC9yYm9vWGlvVE1UemtqODdQLzYvL2RMVjBmdUxCQ0dHUTNyKzUvL2NYRHJ1YzhlWGIycXkrZStlcXVVOS9ZZGZLYno1Kzg5L2tUVCs0OVV5M1hOMjladWZPbDExMTcrZm96WjZiT2pNNTVyaE5yNC92ZTh5OGVIK3B0M2JoK1pWeU40MXJRMjk4eFZ5b2ZPSEpXZXE3U2xoQmR3U1luRnkvZE5wUkx1ek16UldEb0NIRnFmR2JEeXY1Vi9WMTdqcDVqbkVrcHgwYW5yN3A4UThxVHg0NlBBK094SWd0WURlTHVmSmFEamhVWmF3d2xBeUNOR2kwUnVkSTVOenAyKzIyM3RyZTNMUVdmalNqSVdtS01mZUlUbjNyazBTZFNxZFQ1TUJhQkl3cU9ubVMrQTUwdG1mRmlWS2dFanVBcGlTME82MnZ6Zi9rTk45MXo3ek1UY3hVTlRNVjY4NnIrTzYvZC90bHZQTXdaejZSa1BzVTJydXU5K0pKMWozOXYzOWg4ZmJ3UXo1YmpTcWgrYWVjMmkreGpUKzAzeURsalpDMEFTTWJDV3YzVnQxeDJ4WnFoVXJFS1pEUHRxYi81L0hmMkhCNUxaOUtHY3czODlqWDkxdy8zUG5GMjlyTzdUejAvTWo5YkRrTmx0TUZZMjFJdE9qTlpmR3pYbWU4OWZUVHR5TXV2MjNyYnRSdkhSbVlQSEovd1BVY2J5N25ZZi9qTXpkZHRUZ3RQSzBWaGJXQ281N0huRDBhR0NOQWFBTVlrdzhXNThyVlhEYXN3THBjREM4QVFUNDVOM25uMTF1bjUwdlJDUlNBaVFLVll1Zk9Pblh2M25xeUZLclpXVzRpVkFTNTdjbTQ5Q28wRmJhMGx2SEJZa0hOZUxCWHorWllycjd4aUtTbGpnRUFFblBNd0RMOXovd08rN3hscno5Ly9aT0NXZ2VTUTlZUWlNVldvQ2NFbGc0emt6S3JiYnRnNk4xODhkSFFVaFNCakpZZlh2bVRuWTgvdksxZnFHZC9KcC9oQWQyYm5OVnYzN1RveE9sV2NMY2VGaXFvRjBTL3UzRUtNZmZ5SkYxRUlaS2l0amJVRkFtTzA3OG5MTnErcGxLckdHaWx3WkhMeXdhY1BaYkpweTNobzJiYmUxb3Y3Mjc1OFlQU3JoOGFyaXRLTzlKdndCMFFtaEVpbnZGd3VQVGxUK2YwLy90d0hmdjlUWlBXZi9mNHJycjk4ZGFtdXVDTWR6NXVhcjM3cUt3KzdHVFJLMWNyMWdYem04b3ZXUmtHRWlOcmFTcWpMa1psZXFEMy93dG1ycmx6WDM1SE9lZHh6WmFVV1B2emNvVmZkZUlrdmtRRXd4ZzhkRzUyYW5MMzF4czFvVkZweXdVaHdObE9vS01zenJoQ2NDWTRNa3o1QkF1b2lZNHp2K2QrNS80RXdERGpuaVdoWW95ME04T3h6ejU4OGVjcnpQR2hPaURad1ZnMEVPZVY4YjdvY3hVcExocDVBajhOQVorYnk3YXNmZkhpUFlkd2FVRkYwMDJXYkVlR0ZBOGRic243YTU2MHBmdm5WbTJjbkY0NGRHMXNNYmFHcUt2WG9wUmV0YTgya1AvWEVIaTQ0QUJsalBBSExPdFBhV2hXcnpueTJ2NzJsVks3RmtYSmQvc1RlazdPRk9uZWtScDVQZWR2N1dyOTFiUEw1c1VMR2NUaGlVdnBQZWxJV3lCSVpZNVUyUW9pV1hPNExYMzN5Zi83UnZ3RFFINy9ySlNzRzJtS0xsbUVxbS8zV1EvdE9uQnZ4SkNxbGczSnc3ZllOa2lYNEJxdU5MZFpWemVESk0zUFQwOFdycjk2UTgxamFZN20wLytMUnM4YlNyVHMzeFNxMmdBYkYvUS91dm1UYmlzSHVuTXZSNDB3d2pKV2VMb2ZabE9keWtBdzVRMzUrZ0FjSXlIWGRrNmRPUC9mY0N3QmdyVWtFMEhqY2Q5LzlTcHNsUkMwUllhUGJEcEpqV25KaWNxWllFNHdKaG1uSm1WVTNYTFZoYW1iaDJPbEo1SUtzN2NpbmJyaGk2NE5QN2hLYytSN1BlcmhoMDFDdXRXWHZzMGRMRWMyVm8wSXQyREU4ZVBHcUZaOTRkSmRGSkVDeXhrWHpycGR1N0d2M2xUYXgwbDJ0YVNldUIvVkFhVU9NOWg0YlE4NHRFeHJZc256cThHeDV6MVRKZDZTMlpCdGhSbk1janhxekxVU1lZQm82MnZMZmVQREEzMy9zd2JiQjd2L3hpOWNiQXVDU1N6NWZDdTk5WXEvcms5YW1YS3l1NnV2czcyNVZjVXhBeXRnd3RzV2FxaGw0L29WVExXM3BqUnNHMGhKZGgwc3BIbjUyMzdXWGJlNXV5eHB0Q05tcHN6T1RFd3MzWDdPSkc1VnlPR2ZBR1U0VmF4WkZ5dVdTSTBkQ0Jnd3VtTnBFMEZyZmQvOERGOWdZSXM1NXRWcDk2dWxuZk4renhpeVZScGZzajJDUTlkMUNYZGZEV0hKMEdIZ0N1bHI5SFJldmZ1eXBRNFFjaUZRYzNYelY5a0twY25aa01wUDJzNzdvYXZQWGIxOS83TVZUQytWb29hcktkZFdUeTc3OGltMWZmR3AzTlZLTUlZSkZvMy83bGR2bXl1Rnp4K1l5bmhPcHVDdWZNV0VRMVVPcmRCRHJrZW1DOUZ3TFRESTJVMU83cHl1T2tMYlpmMnhXb3B1ZDRVWTV1bkhuWW0zeUxkbFBmbVBYd1JkT1gzZlptc3MzRGxVQ1k0RjVLZS94UGFkTEttSUE5VnJkQTd0NnFEdU1ZbTF0UHUzbVUyNHRWSVc2V2lqSEwrNCt0ZTJTMVQydGZzWmo2WlF6TWpFN05iZHd3ODdOc1lxQWdKQTkrZlNSU3k1YTFkT1c4amhKVHB5emVoZ3YxRlRHY3lWbmtpRkR1bURvRnF3eHZ1YzkvZlF6dFZxTmMwNUVMTEUvZS9ic0hSa2RjeDNuZ2xsT0FBVEdTREJ3QlRxT00xTUtFb2w1RXRHb1M3ZXRqQ0oxN01RNGQ2UzF0cXMxYytuRkc1NTVZYS9uT1dsZjVGemN1SDF0dlJxY096RmVERzI1YnNIUUcyNjgvS2tqcHcrUFRRdkJCS0tOMVR0ZnRya2F4cC84N2hFcEJRRVJzSXp2cWtoSFlhVGp1RnF2RldzUmx6SXhoWXRCVXFPajcrc2VOZVkxRWxOTEFCYklRaklUQ1lBTXc1Zys4ZlhuZ09pT1MxWmFzaGFGNjdralUrWFRzMFZIY2gycHVGd1o3bSt6MWxwTGtyTmJ0NjRCb25KZFZ6U2RQajFUcllZWDdWaWJrK2c3M0hXZEozY2R2R2pqcXE2Mk5GbkRoWFBzMUZSUWp5N2J2Z3FOOGlVeUpJWXdXd3FrbEI1SHlaRXpZSGplRDFzaXgzRkdSa1ozNzk3VEtEd241djd4SjU5VVNpWDJwMW5CU0thM2lIUDBIUjVxVnF5RmtqUEJNQ1ZaU3JLZE85YTh1TzlVcklrQmtsSlhiTjlZcnBUSEpxYXlhUy9yODk3ZS9NRHcwSWs5SndwMVhhaXBXaERkdkgyRGtQTGVGdzQ2am9zQUtvNS84ZGIxM1cyNWY3cjNrTzlKYTYweFJJQkNpRGpXVWFDaU1BcWpVQmxDeGdIWjBrQXdBakFnenBJL3dGZ3k2b1NNQVVOaVNlVGRsSkEyNUhuT1V3ZEdEaDA4ZTltS3p2NjJkR2lJU3hrb2MvajB1SEJJUmFwV3JnMjA1eVJua3JHeGhiTHJ5TXRXRDVXRHFGelhnWUtETDU0YVdqM1EzNXRQdStqN2NtSnFkcUZRdW5ySEpoV0hpQmhwMnIzbjVHWGJWNmNjNWdnVW5EaGp4WG9VYWtpN1hERGtTMzJLcFJJcFloenJ4NTk0TXZrS1N4VGgrZWRma05JaDIvRGFRRW54bVRnRHdTRGx5b1ZhSEd2REdEb0NCZG1WZzIzdHJabjlCODRLNlNCUTFuY3UyYjdoeFgySEJCZSt5ek1PcnRtMnRyeFFuaHlkSzBXMkZ1aWVYT3I2UzdkODVmSGRPaG41MGZyS1RUMDNYemI4RDkvWXk1SmhlWnNVdkRHS2xJbU5DbFZVamRGWVJ3cHFRbjYwdFF5aE1jdkgwZUhnY0hJRk9CeGswK2t4aHJ3eHVFSE5NV3NzMUtMN256M2VtVTV2SE94UXhpRG54UGl4czlPV2xJbmpvQmEycGYxTXlqUEdHcUt2UDM5NHg1cmwzUm0vSHFoS1pLY25DZ3Z6cGZVWEQyZGM5RjB1aGRoejROajJiV3Z6YVplc0ZWTHVPM1N1SmV1dkdPcmdGaHpPT0VPdHpVSTE5bDBwT1FwTVlxSHo4YWkxNExqeStSZDJKVmczaG9qajR4T25UcDMyWE1kWW9pYmFMTUc2Q2dTUG95TmtvUm95Qkk3a1NRWldYN1JwMmNUa3d1eENoVXR1ZEx4KzdUSXAyZGt6byttVW0zR3h1elBYdGJ4LzVOQ1pjbVFxZ1k0amRmUGwyNDZOVGgwK08rNUl3Y0MyWmZoYlhyYjl5dzhjV0N5Rm5LTXhvRzJTdU1CQ3FhcTFpV05WRHlJQjBOcmlXMHNFNURMVzZrbHRpVE53T1hvY2ZjRjh3WDNPVWdKOWpoNUhsNEhES0xsM0RKcjZiSUV6OXNLSnFVb1FyZXRyUjJRRXlMZ1luUzVHY1dTMERvTFlGekxqTzdIV2p1Q25adVpQVEM3Y3NtMkRpbFcxcm11S1RoNDgyN084cjZlekplMWcybmRIUnlhUnNjM3JWaG9kY1M3bUYyc1RFM003dGk3ajFuaWNKMTZvVUl1NWtJNUF3UmhqZ0kxNEZJalFXdU00enNtVHA4ZkhKeENSQWNDQmd3Y0xpd1VweFFXQU0wQUFqc1NSZVpJcGk5VWdGb3dKQkpkQjJ1VWIxL1FmUEh3dTZkTXpheTYrYVAzWnM2TXEwcjRyMGhJSDE2MElhOUhNMkV3MW9pRFFnNTJ0YTFZT2ZldUpQVnhLQkxJcWZ0M3RXeWZuS2svdEhYVmRhWXdGb2hhWEc2czU0K056eFRDc2E2WENXRk5zVi9TMktrMUFvSTNaMUpsWjE1RUdNdFpvQWVBeWxoSXNJM2xLQ0Yvd3hEQjZnamtjR3RhcE9mM3JjajR4WDUxYXJQVzNaZ1ZuMWdKamZLRmNEMVJzRElWUmpOcTRraXR0dENGSE9nL3RQejQ4Mkx1c3M3VVdxRnBNczVNTHRVcXdjc1B5akVUZjRWcWJVNmZHTHRxNlRwQkZJQU40NFBESWhqWDlPWjg3RERnanhyQVNSTXFBTDdsZ3lBSHdnbVk5QUFraENvWGl3VU9IR21Ib3Z2MEhqTEYwUWZ5QUJBeEpJRXBFMzVIbFVBZEtNd1RCa1FFTmRPZGJzdWtUcDZhNEZOYm85bngyY0xEMzFQRXpudXY0RHN2bi9PNlZ5NmFQbmEzVVZTMDBLbzZ2dm1UejhiSFprYWw1empsWnMyNTUrNDZ0eTc3eXdENHVoU1ZRV2w4eTJIYjE2dDU2Rkx1Q2pjd1VDdldRQWFnNExzNVh0NjdvSWt0SUVDa0xBRGNzYjMvbCtyNHJsM1d1YUUrMWVzeG41SUhKQ21wMVdkWmhLWWtwd1h6QlBBWUNnU01sTXVBTXE1R2VXYXhuSlplSXhoSWlDMElkSzJXMWppTnRsT1lNdENWakFSbU9MNVNQanM5ZXVXbTEwYW9hbVZwb0prNk85UTRQdGJiNHZzTTkxejE1OGt4L1gxZFhlNHUxaWd0KzZzeE1McDBlN0czbFpCMkdBakZXdWh3b1gzS08xSmp1dDRsaGJ4Z2lZODMrL1FjYUFqaDY1Q2dYbkM1SWdCTXZuSlNnSFNGSzlSaUlFTUhsREl4WnQ2cTNYSzR2TGxZbDU2VDFpaFVEUnNkenMvT2VMMzJIZFE1MENVZk9uSjJzS1FnaTNaSExyQjVlL3RnTEI1Qnh4a2lTZnNWTHR1MDlNajQ2VlFMR2pMRUQrY3h0MjlidUhabDFwQkNDTDlhaTB3dmxWTXJSV2s5UEZkWjM1cnJ5cnRLV01iWnZzbGlPMU5hZWxwZXM2WDcxcHNIWDd4aCsvVlZyYjd0MDFjWmwrWFlQT2x6b1NNbWN5OUtDcFFUM09BaVdmSGdDeE1qUVhMR0t4alE0blJBdG9URmtZbU5pWTVTeHpjRklaUWc1Zi96QXlWVkQvZDB0NlNoU2RRM1RJOVBjYzNzR3UxSU9lcjVZbkMvRWNUdzhQRUJhYzg0WENyWEZRblh0cWg2MHh1RkoyRW1GdWhKQ1NKNUFtS2xaYzBqY0FIRXVqaHc5QmdDc1ZxK2ZQVHZpT0k0OVQ1RkVtSXlhSUVrR2dLd2FxbVNxWFhLVWFOZXM3RDQ3T3FPTTRReVI3T3JWUXpOVDAxcHIxK0ZwQjdwV0xhc3NsRXFsYXFCQngycmptdVVMbGZySmtVa3VPUmk5ZG1YbjhLcmVoNTg4SmwySENLeFJyN3Zxb2pOenBiSEZTa29LaGlDRWVQYmt1Si8xckRXbGNvRFY2SmJ0eTZwaEpCaVVRdjNOSTVPUG5aMmJxVWV1SjNwYlVpdGFNdHQ2Mmw1MjZmcGZ2UE95aXpiMGRialVuUkY1anlmalpoNW5ralU2OXBac3FSWkdVYndVWnpPT0FCQXJyZUpZS2FXVWFjS2NnWE4rZW5KdXZocHNXN05jUlZHb2JhVmNMODhXdWxjT3BCMzBKRGRHVDA5UHIxNjluQkZ4aHNyWTAyZG4xcXpva1l3a3g2U2ZVdzJVQlZ3QzdpWGpRNDNZd0JwSHlyTm56OVZxTlRZMk5qNDdOeWVrYk5DNkVDV0Q1d3lJQVRxQ0t3djFTRE5FRGlnUU1wN1QxOTE2ZG5RV09TT3dLYzhaR09nZUc1MFFuRHVTWlROZVMxL2Y0c2gwRUp0UUdZbXdZZjN3aTRkT2hMSG1ETG5WMTErNytmVFkvUFJjbVRPdWxkNDAyTFdpcCszaEF5ZHl2Z2RFbkVFdTdlNGZtWmtKb3F6dk1JYmpvNFU3dGkzcmFYVkRaUnpCeXNyY2UyVDhIeDQvOHVtbmozL24wTWl4eFJMNVR0cno4NWJmY2ZWRmQ5NTFhVStXZDZWRmk4dFRndmtTSFo0UXJBQUNSRkZjcnNmYVdnU3dCSjRuR1dJVXhXUnRwRlFsVk5pa3VsR1dsTFY3anAvYk1MemNaVnpGTm83dC9OaDB2cmNubDNGZGlWTHk4YkhKdnY2dWJNb0ZJc2I1dWRHWjdzNldURW95Skk2QURHdXhVcG9jemppZXoxV1d4anFrbExOejg2Tmo0K3pjdVhQVld1M0NKbG1UU0srQlFBbVVqWTFoRERrSEpPcG9UYnVlbko0dENpbkkybzYybkoveTUyYm1IVmY2QWxzNjJyanJsV2JtWXN0MWJEdGFXM0t0K1lOSHozQWhnR3huVzJyOXhxSGR1MDh3SVFDSmczbnBaWnVmUFg1MnNSWktnVklnQTBnSlRwWWUySGV5clQzdHVtZ1JlQzE2MjAxckl4VW4xQ1pTeUxyR1E1UEZlM2VmL1lkNzkvemxsNTk0OE1nWnB6ZXZ5OEhxOXE2N1huVnRkNVoxcG5uVzVaNUFSNkJrZ0VBY2dJaG15M1ZsQ0JrYVEyMjV0RUNJbzRnekNPSzRVbzhZNXhZb0lWaGhnaDA4TlpySlp2bzc4am8yc1dXbHFYbnVPaTBkTFo1QXg1SHpjL08rNTdSM3RJQXhqaERUTXdVcGVXZGJoZ0Z4QmtDa2xBbTFkVGhqaUl3UllsS3lvc1RDTU01cXRkcTVjeVBzOUptelNpbTRnQlF2VVJTR3dCaEp3UUpsckNXR0lCa2kyYjZ1bklyalFxbkdPU05ydW5vNnRJcnIxWnJuU29kRHRxZFRoMUc5Vkk0TWtEYkxsL1VYS3JXcHVRVWhCUm0xYnQyQUJuUG05RFFYd2hpOXByOWpxTGZ6bWNObkhFY1FrY3R3VFZlTEoxbGJ4dDkzYnVib1FxbTNPKytsNU14Yzlhb1ZYYSs4WXZsQ3BjNTVRdk1BQmprNWp1WnlvaEI4L3R1N1AvQjMzNXJ6cE9DOHg4dmNlTWZPZGcvYVV0SVgzQlBvY0lab09RT0pNRjZvYVVzTXdGamIyNWxGQTlwYUlYQ3hGdFRDR0JGU3J1aktPOVlTQVp0WkxDMVU2OHNHZTZ6U2lyQldxc1pCbU8vcmRqZzRrdGRyOVRpS2Uzbzd5QnJHV2JFU1JFSFUzOTNDTEVtR0NHQ0lnc2h3d1ZnRHQ5cUEwQ2QyQmdHMDBtZlBubU9qSTZQZng3Y0FnRUNNSlFCUVlJelZZMDNOM2dCWTI5MlpxNVRyWWFnNDQyQnRkM2Q3dFZUV1drbkpQWWRsdWpyQ3dtSVVLbU1BeVE0dEh4aVptQXNpeFRsS01PczNEWTZlbTZuVll3QzBXbCt4WmQzVVlubXhYSkdjVzYxWHRLZHYzandva0h6Sk8zS3BodytmcXhMbE1wNlhjcWNteTIvWXNlekdUZDJGV3Bpa3ZKb3dORlRSdGtiSS9OVDRUT1dQLysrWFR3U2hRTHRxYVBtMnk5Ymx1TTU1MGsvY0FLQW5HQkNNbG1xQVFBREdtbFY5clNZeUJPQjVjcUpRRHBYV3h2YTIrVHZYZFNtbENDQlMrc3o0N0xLQlhvR2d0QTFEVlZzczVicTdYQWVsNEZxWlVySFUyOXVGWkJsamtkS2xjcjJ2SzQ5a0V5b1NBS2dyd3hsTGdNUG51YUdvUWNpQ1FDT2pvMnh5YWdxYmJJOFh5b0FqY0FSRURDT0RSQWpBRVlHb295MnpVS2cybUw0UU90cno1VUlKQWFWZ25pZjkxbng5ZmpIVzFoanJDTkhXM2pvK1BvM0lBQ2lUa29QTGUwK2RtTENBUUpSMjVLYlZLdzZkR2VXQ013UWtzM050LzNTcHlnQlNEcy83a2pPNGY5OUpjRVJyUzRwelhKeXJ2ZXVHZGEvYU1WZ1BvMGhieHBnRk5NUWl3MHFSaWJpb0cvenJEMzJ0bE1zSnBiZGR1cW1uSzV1VDZITG1jT1FJT1ZmVWxSb3IxQ1ZEWTYwVXVMcXZ0VllKdWNPY2xITjZwbWlJQUpBanJPN0xwUVFqc3Bid3pNUnNXM3ViNXdpdHJUSlVYeXo1cmEyK0o2VkF4ckJVS0haMDVBVUhBTEtXRmhZcm5hMDVCcFIwYklBb1VvWUJjcnh3Q0xWUlpTQUVaR3hpWW9JdHpDOXd4dWpDQUxUWml1RUlBS2kwYm9LOGdETm96ZmlMaFFvQll3U080TGxjdGxRc0krT1NnNXR5cEpjS0NtVnRVR21iU2ZtTzYwMU56M0hPa1V4Yld6YVZ5MHlOTHlCalJ1dStqdFpzUytiTStKUWpCUVBUMjVwYVBkaDViSHd1Njh1VVpKNWs3V2tYa1o0OGVxWVVCT21VNnpxeXNGQi96YmJCMzc1NWRYK0xVNCtWc1VBSUZrQVRWcFNOdVZnb0JGLzY2aE5PbTkrYXpxM1p1c1lEN1VudWNBWkFIV2wzc1JyTzFVS0JMSXAxVDF0cVdYdTJYQW85ejBWSG5wcGVURGhLWnhZcXJibE1WOTVYeW5ETzUrWUx3bld6YVkrTTFSYURZa1g2YVMvbGN3YUM4MHF4a3Nta2tqSWlBQzRXYS9tY0x4bHliS1Mrc1RhVU1LMUJndS9FNU9KanN3bzBQemZQU3FVU3V4Q3JSWVJFeWR3MVF3UUNaV3dpUVFZa09hWlRicmtjTkFwN1V2cXVXNjNXT0dlY29ldDd5RVJVcVdtTFpHd202MXVrWXJFQ2pJRTFQVDF0eGtDcFVPVk1HRzBHKzdycXNTb1VLNXd4cTgzbUZYMWNPcVZ5UGVVSVYyTEc1V2xQZExXa09HTUh6MDRFU3Z1ZTY3dE9vUlF0ei9tL2NzWGc3ZXZic3c0cWJRbkFBaHJDbXJLWThwNTY0c0RwK1pwTVpRWlhEV1Y4bmhKY01rU2dGbGVNRkdyS0FtTVlCTkdXNGE0MHNub1laZEplSVZSamMyVXBKU0xWQW9XTTkzVmtqTFdDczFLcHFpemxXekprclFGVXRSQzQ0NmRURW9FeHJGV3FudXQ0cmdORXdMQlNxYWQ5UjBxR1FBaUVESlN4WklHejgrVzRDNDRaR0dQRlVwbFZxN1dFS0hXSjRiVGhwd0VRMFJKb1E5aE1wcVVRamhUVmVvU0lST1E2VWdvZUJTSG55SkFjendPaU9Jd01BWkhONWRKaEhOZnJBVElHMW5SMHQ5YnJjUkJFeUpDTTZlMXJYeWlYSXEwNVkyVE4ycFg5aTdXSUl6Z0NQWUZwVitSOG1mSDRRRWYyK3AyYiszdGIwN20wa1pJN1Vsc0tRN095MWI5NXVIVXc1K2pHbUJab0N4RkJ0UllmT0RJR1B1dm9hRzF0enpvTU9LTExFUkJPTDlZRlkwUmdqTDU2ODJCMW9ZNk10K1RUaDhibml2V1ljY1lZR20xcm9lcnZ5QW13eURBTTR6QldMWmswR0V1RWNSZ0RNVGZsY1VhYzh5aU1KT091SzVHSUlWWnJrU09GSTBTRDFBaFFKMFJ0Z0t3Sk9yekF6QkFpVm10VkVZUWhNbVovZUh3U2dDRllvb1E3SjZrUFNjRUVaMEdva0NFUlNTa1FLSTRWU3docFhKZTBOcEV5UkVRbWxmYkRLSXFWUmlZWVFLNDFWNitHMWhnUXdCbTFkYlFzbEVyR0VnSklqcjA5N1NkT2pUbVNTdzZ1NEw3RGM3NmJkbUR6Mm9HVnd3UG5KaGYvNXZPUG5Kd3V1WjdiMTVJYXluc2NJSWpOeXJ3Ykd6dGIwOEFRaUpRbGw3RnpKOGRBWEpsdXllVmFzM3lzekJtbUhENVhpK2Fxb1dRc2p0V3ludHdsS3p0bmpzMzdLZGZ4bmVlT2pURXVpRkF5UmdoaGJEdGFNeHlJSVNpajYxR1V6dmlNeUJMWVdKSFZ3dmM0SThZeFZocXQ5UndIcUE2SVVhdzVZMUl5YUJxWmhGMDhpV2lTV2NydjB3REVLSXlFMXJycGhCTnVuR1Q4bDVJeTlvWHBzYldFZ0VoTUtaMHdtd3JCd1ZxakRUTEdnSmdRVmh0dHRDRUNDNjRqVmFTMHRjQUlFZnhNS29xaTVuUS9UNmY5eWFtRnBQcnFPNktsTFZPdTE2VmduREVwbU9jSVgySlhXMlpvMVpEWGt2cjBKeDU4Wk84NVA1dUpLdWI0ZE0yVGJIVm5wanZqVkVLZGxWamtvQ3d4QkF0QWlLVlNGWmdyZmVhNGtpTWhnbUJzcWhKWlMweGd2UjY5OWM3TkdTWkhJdDNXbmoyM1dEcDRic2J6WEFEaUNNQlFXV2pKcFRrUUloaHRvMWg3S1o4ekpDSmp0RFZhU01rUU9XTkdLN0JHQ0U1RURKbFNHb0VZWjlBc0taT2xabm1aa003M3habzlkelRhTUd0TWd4c2JFSnA4ZGQ4bnE2WmhTaUNuUktBTUFTRVJJQU8wMWxqVEpDeG5ZSTIxTnVuWElrTmpUTk80RVpkQ2FXT0pnSWd4RUs2TWxFcVNFMDhLSitXRldqVlk1RGh6QkhNNVpqSmVxclBOZU82NThkbGNOc1VFRjV5bFhBSElEazFYajgzV0lrT1J0aDV2QmhtVTlGQVpTQUJITklmSUlUSzJHaG5PTUk1MWU5NTl4YldiNW1kcjBuZnllZi8rUFNjcXNXYWNKWXdYa2lGeVRLZGQzckFhcEkyVmpraUFjdFlhc2haWUE2eFAxaEpaemhvajA4YllKSDlxc0VoZ295c0hEYXJDNUlEcFF1WnhhdzI3TVB0cVZ0Q1grT0NwS2EwbFVqYVR3QThzSmY4UUdkdG9pU2VXR0d5Q1RxQkU5blNoMUcyVDc0V1M2Z0FDTFBYVmswSnJnc05vMUowazV3eTFRTjdWdG5ITGFoVkZpVTh5QkJiQUZXeXVGaGNpclltU0hpVUNjQVljcUtPOUJWS2VObkVjaEJZWldhaEdSbHVTbkpYS3RWZmN1S0hMbGVWcTFOYWVuYTFIRDc5NEt1VzVsaHJWQXNuQmNhVndaWE1HdlZGR2FOUnlrc0ZrYWxETEpmeXdEZVBSSEErekRWQUpZWlBONC93STdmZjNVaHUzbGpFR1MzTUZGNlJrRFpvb2FvNmZOK0RUMWhyTEdUTzJ3VTRMMWlLZ01XUU42Rmd0L2JZbFVMRVNqR0V6QjFlUmtsd2tLbWFzaVlQUWtSSUlHYklvMW1FWWVhNTdubnVZQUJuR3RXcTlXZ2JIZitPYmJzbG5mV3JVTWhzNEZDSW9oVG95VmhFaEVrTkljU2JJTEYvZEQ4S3BGU3ZseGJJbDFJWXFnVUdBTU5iOTNlbTMzSEh4NU1nc2QwUlhYOGMzbmo5ZXJNVmM4S1FEeXdFa29wOUtFVFlHMFJtUzZ3aGpUT1BrR0VNR1JobEtGaFV3aG9SSkZHREpNb2JXVXRKWVRTQWFEZEpsUW1wY1NyZ3czTGRrT1dmTWRSeVRmR0pyaytHWUpVN2FaZ3N6MFRaTFFNcVFNVllJYnF3bGdGaHAwc0FaMDhab1N5cUtBQWlaU081SVVBK2tZSXdqRUZpTHRWTE44eHdpdE1ZcVk4dmxXa3MybmJBUTF5SlZtQ3ZrTTJtbERWbHJyTldXWWtOaHJPZlBqTmxLYmVXYXJtdXUzUnpVUTlaa3pFM1VPTFlVYXJJQUROQmw1RFBxYXM5c3UzZ2xWS3Z6NDdQRllqVXl0aExwMEZqQmVhVmNmYyticjhzaXIxVERqbzcwNmRuRjd6eHpOSnZOeE1uWm9PVU1KWWVXZkM2TURGSkNvY3RkMTRuRHNJRlJFd0lSZEJRcVM5b1FZeHdCdGRZRWFJaWs0RWJaV0psa1VDcWhzdUFKbnk5OVg1WmxHL2daRUZ5d2RDWnRiSE5NakpZbzVJbkFKbUJORHRpY2Y0VlkyemhTdmllTnRVUVlSTXBvTGJoUXhtcExjVDFDSUJRY2lJeUZTcVh1U2VFNmtnZ000ZUo4MGZjZGhzd2FNZ2JtWnd1ZHJYbUdvSXlKRFkyZG0rN01wbU50bENGdGJLUjBFS3JRc0psekU3V3BhVkt3YmRNcU1nYWIwSjhramlNQWJRa0lKRkxPRTZaV3UvN1d5L3I2ZTZoY1ByWC9jS1Z1YTVHWnI4V004WEs1ZHQzT1ZhKzhkc1BFeUd3cTQ3VzBaZjdocTAvVUltTVFPOU9wRlcxWk1qWnBOYmUydHBTS05RQkVJbGZLbE9mVXFyVUU1OCtGUk9SeFBUUVdyTEZTY0d0TkdDa0VNTVo2cnFPVWpaVnUwSWduOFErUVRYQWF0R1NJbThVR2EvMlV6N0taakxVSlpYSml0NUlmd29RZmxRRXdCcWJKeVJ4cFhhOUhPZDh6aG9nZ0RPTTRqanpQVFRMMW9CNlEwZEtSQ2RTaVdLcEo2YVJTWGdKam1wbGM4QnpoZW80eEJoaWJHSjl0emFRZHgxSGFJT2RIVDQ2bk9BTGp5cERTRk1hbUZxcHFxQllMMWFoU2hTRG1EWHJicGF5ZUdObGtOTjFCeVB0QzFJUE5XNWE5NGxWWFFhVStQVGw3Yk8rSnF1R0x0YmdVYXFOTlB1Zit5WHZ1S283Tkcyc0doanJ2MzNYeThSZlBwREorckduN1VHZEtNczZBSTZVOXB5V2ZucDFlNEl5RHBiVHYrcDViS1ZjdElCSTVqZ3Rrb2xwZ0xHaGpYRThxcllNd0lrUnJiY1ozdzFCRnNURUFDVkl2b1haTWdEOE5wclB6Tkd0b2pNbG1NcXl0cmMxcWsxQ0JZVk83S1dFSXRnUkFraU1RV1V1R1FHbGJxQVQ1YkNwUjJpQlNsV290ay9hVU5yR21halhRVWVTbGZRUUxpS1ZLSFpWcWE4a1lheXpnNU5RQ0dwMXZUUnRqbU9DakU3UFM2dFpjSmxhR01YNTBaRGFzQnUzWlZCU2JTSmtnMXBWUXpTMVd0WnRPU1ErTGhYTWpNODJHTlNFUkVuRUFYMkJXOGpSYVV5NWZ2SDNWNy8zQld6TmFLOUpQZmZ1eCtiSXVCbXFzRkJHeVNxWDZCNzkxMTJER0x5eFVPenR6Yy9Yd2I3L3dxSi8ydGFHMEkxWjB0ZFZpblhJRXM3YXpvOFgxNVBqNERPTUNqR25ONXh6QnkrVTZBVEN5TXUyVGl1dlZ1cmFnalUyblV2VjZXSXNVQVJwclc3TitwUmJHMnRna0dpR1FIQkdnNlNQT2h6T0paZGZHdExXMXMrN3VybVlrZWdGK0NJZ2F4R0RrU3A1OHp4Z3lCSE9MMWJac0txR0hqNDFkTEZXejZaUXhGQ3BUcTBkUnRaTE9wUkdJTVN6WHcycTExdHZacHJVeEJQT0ZXbkdoTkRqVVpiUkI1Qk1McGZuWmhaWDlIVkVjYTJMejFmRDQ2TnlxbnZacUZBZUdhcEd1Qm1xK0hLeGJzNUlwVzF5c1BQallYc2QxcmJXSmF2dVMrUndnRERDcUxlOXIvZlhmZVBrZi9zRWJPeGdaMzMvMDJ3OGZPenhTMVRoUmlxcUtDb3VWWDN6bDVhKzVmdVBZNlFrLzY3ZjN0bi93RTkrZExkWWQxMUdXVm5TMnBGTnVKUWhTRGtkamxpM3JxVlhyczdORlpJeXM2ZTNyVUdGUXJ0WVFHVVB5V2pKeHJSYldRNjNCR3B2UFpRckZTaFJyQzBDV1dyUHB1VUpGbVFhRkNoQTVnZ0dRc1Eyc2cyMDJ4YUJ4bnFhbnA0c05EUFEzZGFUSkdrRU5KaTV0eVpMMUpFdGtwNGtJMk5SOHFTWGxTYzZOc1FaZ1pySFlrazViZ0VqWldoaVg1Z3JwZkZZd1JJUjZyS2RtNWdlNjJ5eFpTMUFMMWVuVGsydFc5d05hUzFCVmVzK1JzNXVXOVNXMkRwbDQ0ZlJFV2dwa3JCNmJ1cUs1VW4zbmpvMmREZ3BHSC8zaWs2ZEdGN2dVMWhKbjVIQ01hN1VXQjI2L2Flc0gzdi82ai96VnI3N3VWVmY1REtvbS91NVg3dHZ6OUpGQ3pLWks0WFJkVjZ2QnhadjdQL0R1TzZaUGpqS0dLNFo3UDNYdnJ1ODllenlYenhoQ1kreWxhd1lYZzdyUzJ1Rk1BbTNhdlBMTXliRmFFRE9HWk8yeW9aNkYrZmxLUFVvWVpkTnRMZlhGaFhvWXg4WVFRR3RMZG1hK29JMjFsaGpEdG14cWFxRk1BTXJhaE5Nc09UcERsQVR2VFM0SklFcHdzWFp3Y0lDdFhMRUNHWjVmUmRFdzkyQUFyTFhHV045SmFHRkJHd3VBa3d0VjMzVlN2cU90QmNDSjJVTGFjem5uVWF5RHlNeFB6YWRhc283bk1BWVc4TVNaOFlITzFwVHJLR01Oc2dNSFIvcDcyN0laVjF2TnVIanEwT25PdE5lYnoyaHRBSEdxSEQ1M2F0SllpTFJlS05jSGV0czM5SGRKeC9uMHZjOTk3dXRQcDdOcFl5d3lRTEkyREY1NzIvYVBmZWhYLy9SOWI3amxwb3Z6YVJtV2lzZU9uZm5hSisvWjlkeng2UURucTJxMEhCZHJVV3VMKzNmLzl5MVVMQWIxY0dDby9hbEQ1ejcweVFkYldyTEdJaUYwWk56dGEvdVBqa3k1VWdCUUx1T3RYcnQ4NzU3amxna0FUSG5Pc3Y2T2tUTmpzU0dHNEhneTNacGJuSnlweFRhT3JlQThtODVNemhRSW1OYkdkMFUyNVkvUEZBbVpOZ21OTmZpU0syTzBhYnF2SmlnQ3dUS3lESEhsaWhWczVjb1ZydXRhWS9IN2lDS0FDQXhCckUzS0Vad2hFUmhMeUhDbVdMWFdkdWJUU2h0QU5yMVFSR0l0YVQrTVZLUnBkbnBCY01xMHBnVVFjand4T3VVSlB0alpHaXNObkI4NU5SSFZnOVdyZW1PbEFIQmtybmhrZE9hNkxjTkJIQUdBc25CeXZsd080akMyMnRwdGc5MHNDcDQrTWZWWC8vS1ltL1pqUTBrS0NqciszKysrOHdPLzgrcVZRMjFVTGswZlA3ZnJ5UmUvOFMvZi90Ym43ejl4ZG5FMmhQbHFORklLNSt2YXFQaERIM3pMaXJaVVliN2MxWnVmcmdlLy9hZGZCTTZKTWNhWml1TGJkcXl4Wk01TUxiaU9zSEc4ZHQwZ2tqMTgrSXh3cE5GNm9LZWpMZU9mUEROR1RBaEcyWmFNZE9UTTVHeW9iUlRyVE5wbnlDWm5Gd0I1ckUxN1M1b2hHNThyRVRKdHdWcmdDQ25Ka3VUZkVObEdrWUdXc21qSGRWZXVYTUdXTDErZWI4MHJyUkdBWGNCellLeTFCTEVtVHpCSE1HdXR0cUFKU3JWd29WUWI3TXhIU2dQZ1lyVmVMRlg2MnZOaHJDSkY4d3VsYXJIYzBaM25vQm1EdVZKdGNucitvcldEWkt3aHRsQ0puOXQ5WXNlV1pWb2JJZ0xHdi92aXNRMkRQVjI1ZEtTVU1ZWXNob1lxb1VyN2Z0NVBoOXA4OHB0UEswRGl6QkF4eERpTWYvOXR0NzdpaHMxbVlmN1VnZE5mdXZ2QkwzejYzdnZ2ZmViQXNlbUpHazFXMVdJMW1xM0dzMVZkWEN5Kzc3ZGZkZVBPZFhQbnBuTDVETXY0Ny9yQTNkTUxOZUU2QnBBeDFwUDFYMzNObGtkMkgyMFVpNDIrL3BxdGUzY2ZtU3ZVR09kVzZ5M3JsaGNXQ3RQekpTYTRSTnZXMXhsV2F3c3ppNUdpS05iZEhXMmxTbTIyV0FGa1N1dkI3dFpTdFQ1ZnFadGtSd1Jad1praldheXB3ZkJueitkaGlLaTBibTFwV2JGaU9ldnE2aHdhR0lpaUtHRUd3MmE0YWdpTW9WaFpEcFJ5UkRMNXA0d050VDA1TnIrc3F6V3BMWVN4T1RVeFBkVGRicTBObEMzWDFmaklURTlmaHhUb01GUUVMeHc1dlhYRlFOYVhXaE14OGIyblRuVG4vY0dlbG1SZzZQaDBZZmVKMFJ2V0x5L1hRMDBVR3hzckd5aHJMSUF4aXpVMVBsY1Z3akVHaFJERmN1M21TNGRmYy8zbVdySHk0T1A3UC9yUDl6Mi85K3pvZkRoWm82bXFucTNHcFZBdDF2VlVUUzhVS3ErODg5SmZlL04xbFhQalh0cHY2Vy83L2IrOFo5ZitrVnhMV2x0eXBkQmgrTGJiTDYzVWd6M0h4eHpYTVZvUDlyZXZYdG4xNEVON1FEclcycFFqTDE2My9NREJFNkVCeWNGeldOZFE3OHpJZUtrU3hqRVlhd2U2T3M2TVRZZVJTUkw3NGQ3MjB4UHo5ZGdxUThhUXRlUTdYSEtNdGRXV3pCTERIVFNtTHNJbzZodm83K3JxWW9pNFllUDZLSXFiTlF0cW1pQ3kxaXByTGRtY0p4TEhIaHRya1IwYW1lbHV5YVpjR1J0RGdFZEhKdHRic2luWENTSmRWK3prcWZGTXhtOXR6VHBvSGNIM25aNGthemN1NjQyVkl1Qm5wOHZQN3p0MysxVnJ0ZEtJaUNqdTJYWFU1YkNxTTErTGpDSFNob3loaFVwWXJOU2wwWjM1VkRsUUFGQ3VoYjN0NlhlOFpKdXFWWjdhYy9yalgzdHVQcUs1aUthcThWdzFXZ2hVT1ZTVjBFeFZWYWtTcmgzdS92UDMvNEtlbVFOcmMwTWQvL2k1Ui8vMVd5KzB0YlhFQnJnUXBQVFc1VjB2dlhiVDUrNTdtbk9CUUNhSzc3cDUyLzc5SjQ2ZG1lRmM2Rmh2WE5uZmt2WmZQSEthY2U0S2JHbk5aZk9wMFpNamRRVmhyRjBwTzl0YWpwd2VKV0RLR0ZmeWdjNjJ3MmVuaVREV0NUOFg1WHhCWkpVbFE1VFVlaEFBRTVKQmhEaU8xNjlmbTVUeDRaTHQyeHQxMENVYVJnQnJRUk1aQTVIV0xiNUVJQ0tJTlJIaHFja0ZNcmEvUFJmRkdoay9PN05ZRDlSQVYxc1F4VUZzeHlZTGhZWGlpbFc5QXNtVnJCQkVUeDg2ZmUzbTFVaFdhUXRjZk8zUlk4dTdXellzNzRoalRRaUZRSDE3L3luSm1MVmdMU2hqQ1hDcVdEc3dPbThDL1picnQ2d2R6R3V0Vm5hbS8vaVhyaC9xeUI0OU0vM1JMejlSTjZ3VW1zVzZLb2U2SEpweW9NdUJtYTdFb1NhRzlKZC84QXQ1WDhTMUtOdVhmK1R4QTMveDBXKzF0T2FVQmNhNXc1aUw5Zy9lZXNzM0h0NTlZbXlSUzJHVVdUM1VjZEdHd2J1Ly9pd3dTWVRNMnBzdTI3TC95TW5wWWxWSTVqSWFXTmxYTFpiR3gyWkRSZlVvN3Uxc2pTTjlabUlPR0F0ajNkK2VkemsvT2pZTHlPUG1pRjFyU21xamxiSEdMbzN3UUhOeERWcGpMdHEyclFGTnZQamlpekxaakRZR216MzdKQ1kxRnJTbE1ESlpqM3VDR3lKTm9BZ1dhOUhacWNWTmcxMUthU0tzaHZydzJmRzFRLzFLMnpEU2xibzZkT2pjOHVVOTZiVGpDWFNsZlBUQXlaYTB1Mkd3TzRpVkJaaGFETzU5L05qTHIxMUgxaVRyOWM0VmdxT3pKY1pRTW9ZSWtUSEU0RHRIUnM0dDFsZTNaUC9QYTYvODBGdXUvL0Jicjl2ZTJ6SXhWLzJycnp3M1dZcnFta3FCcm9TNkVwaEtvT3F4TGdZcXRsZ3UxMzc1RGRmc3ZHSjlPRi8yMnpJVDA0WC84VWVmNTlJeGlNU1lMMFVjQkgvd3h1c0xpNlV2UFBDaWNGMGdJcTNmOXVvckhucjY4UEdSUlM2RVZucmRzdDRWUGEzZmUzWS9jdWtKVEhsaWFHWGZ5VU9uU3hVVlJGWnBzMzdGd0ltUnlWSTlJc0JJcVUzTGVzN05GbWRMZFVPZ0xWZ2loMlBXRjZFeUNkUHVVaWtoS1VrWVkxS3AxUGFMTDJvSVlQWHFWYXRXclF6Q2dEZ3VWWXNzZ0NFeTFrWmFDNlI4U2hwTGxpQlVWaE43NGRUNG12NU9WL0pZRzBLKzY4UklaeTdibWttRm9RcGpPSHg4VWl1MWNtVVBCL0lrbjYzVUg5MTM0cmJ0NnhGSUcrSlMzdnZjdVZLcGR1UDJ3Vm85Wm93aDQ4aDRiS3pMV2Q1MWd0Z2c4TGxhL0pISERqNThkS0pXanZzem1UQXczOWx6NW45OC9NSDk1eFlZNTVWUTFXSmRpMDFONmNEWVFGTm9JSWppb2Y3OGU5NTZneTNYdUNQQkYvL3JUNzg0UFZkMVBOY0N1bExVNi9WMzNuSHB1c0d1UC92ODkxQzZocUJhRFcrL2FrMHU3WHorbTd1RTR4SWdXUFBLYTdjL3MvL1l1Ym1TZElTTHRHeGxMNEE1Zk9oc1RXRVE2WmFNMzlmUnV1dm9HVUt1clhVNDI3Q3M2N2tqSTlxeVFKT3hZSXh0U1VsWFlCamJ4aGloYld4c0FnQ09HSVhoOHVYTDFxMWZDd0JNYXkyRXZPeXlIVUU5Wk1Cb3FXOXB5VmpRUk1xQU5yb3o2d0ZaSklpTkpjRERvM09jOFZXOTdVR3NDZG5JZkhseWRuSExpdjRnanV1Um1TOUhlL2FkM3JSeDBIT1lKNWpuT0Evc08rRUt2SHJ0VUJCclpXMWs2UisvdlgvYnNyYmgzbXdRRzRhTnpOc1ZyRFBqQTBCc2lETStXUXIvNFlramYzemZudmQ5N2VuZisvS3pIL3ptaTZmbmFseUtRRkZzSURJVUdZb3R4QVpDUmNpd1hnOS84ODNYdEhTbVZUV1E3ZGwvK2VJVER6NStxS1UxcXl3Snp1cjE0RzNYYmIxeDg4by8vT1IzYXdvSldCaXBsWDI1WDdoMTY0Yys4MmdwSUVBZVJmSFZtMWIxdEdhLzhlU0wzSEZUa3FWY3ZtSHJ5b1A3VDg4czF1dVJEV08xY1huZjFOemk2YWxGWkNLSTFNcWVOczl4OTU2ZUpHUkpnbWFKT2pLdVVpcldWbG1iRk9QT04zb1oxdXZCNVpkZDZycWVNYVpCSEhIakRkZXpwSmRqNGJ3YklGQ1dsSUZhckZ2VHd1Rk1XNXVzWjFtc2gzdlBURjY2ZWtnWmJTeG9pNDhkUEwxaG9EZnRPcEhTZ2FiZEI4ZXNOaHZXOW5JeWFVY0d5bnoxNmYxM1hMeTJMZTNHeGxxRThVTDRwU2RQdmZxS1ZhMHBHUnRyTFJsdFczMjNLK3NuTDZTTjVRaUM4NWx5ZUh5bVBGbXN1MUpLem1OdGRiSXB6SUF4cERWcFl3bHNQWWkycnUxOTdXM2I0K21pNERCMWJ1cEQvL3lkYkV2R0lsckVJSXplZHRXR3E5WU92Tzl6RDB5V1FrU2hqUEVrL2Q2YnJycjcvcjI3anM4eUljaFNteTlmZitPT2YzMzB1ZmxhNURuTVozYk5tajRoMko0OUorc0tvbGg3a205YzF2ZlkzdU9oQm0wcDF1cUtEY3NPbjV1YUtRZktrakpraUNTRGpvd01JaE1iU254QU13MXVWcHVCYnJ6eCtzYUlVdUtIcjd6eWlvSCt2aVFZWFZwR1pCcnNtNllXYWNtZ1BlMG9Zd3hob0MweC90aVJNME1kK2E2V2RLZzFJVHM4UGp0ZnFsKzBhaUJRcWhhWitVcjAyTFBIdDI5WmxzMElYMkxXOC9hZW16bHdidUsxbDYwUHcwaGJFa0s4T0ZKODl0ajBUWnQ2WTJXTUpjNmdMK2QzcGozSm1ERmtFd1pRWXhsRGgzT2VpSjhhNm15TTFXUTFrUUZLRUFWQkVMM2xGWmU0VWxZWGExelMzLzd6dlpOelplazZnWUdVNU8rK2JsdHZTK2I5WDNwMG9oUVI0OHBhbzlYL2VzUE9YVWNudnZEUVVlRTZBS2hWL0tZYmR4d2JtWGprd0duZjkzTU95NlhsOW90WFBmWGt3ZGxpR01ZMmpLTnR3d1BsZXJUdnpDUndGbXJkbmsydDd1OThhUDhwUWxaWFJoTm9ZOW95amlPd0dtblYySkhWdU0xQWdJaFJIUFgwZEY5MTFWVkpjNXdob2pFMm44OWZmYzNWMVdxVk5WRjBpYkMwaGRqYVdFTVlxOTRXRDRtSUtESldXenc5VXpvelBYLzF1dVZCRkJzQ2JmRjdlMDlzWFQ2WWRwMVkyY0RnN3FPVE0vUGxLeTlaQ1ZhblhPNDR6dDNQSHNxNDh2cDFROVVnTmhZWmx3OGRtWDMwOExURG1UWTJKWGhmTnBWeFpMUG5sZnlQckxYR2tqWFUzQ0RXY0ZFRVNJMm9Ec1BJckZuZWZ1ZlY2MHNUaTJsUEhEeHc1a3ZmM3BYTnBRTk5henBhZm1uSHVzbHk3Y01QN1MwcnNNZ2liYlNLM3ZmNlM0dlYrRysvOWlKM0hBQlFrYnAxMitwbDNXMGYvKzZ6S0p5MHd4eTBsKzhZTHBacXorODlXOWNVS3UwNzRwSjFLNyszKzFpZ3lWcW9oOUdWNjVhTnpCU09qczhid01oUXN0V2hMNThLWXhWcHF6UnBBNDBrTE1FYk1sYXJWaSsvL05MT3pnNXJMY01HWW9VQTRPVXZ1M05wSVVKakJXWmo4eERFaHNwaG5FK0pyQ2VVc1lhd3JxMGhkdi9la3hjdDcrdEkrMHBaUW41Z2JHWjhyblRsMnVWUkhFZEsxeFRjKytqUjRhSDJWWU90RW16S0ZaR0ZUeit4NzVvMWd4dDcyMnB4bkxUdUo0dGgwdjFwOFowMjMrT1k3SHduQzJDU3FoUkJrczAzSHNra0JSR1FUZlpESWtLOUhyem1sczE1enlrWHlxNWtIL3Z5VTdYUUVMS1VGTXRhcy9jZkhmM1dvUkhnamdXc1I0cTArcjFYYnErSCtzKy85QUlLQVFBNk5odjYyKys4Yk9NLzNQZGtJVlFwbDZVNUxPdkxiMWczY04vRCs4dWhxVWNtak5YbDY1ZFB6cGYybkpwRTVzVEt0UGp1ampXRDk3NXdKTGFzSGx0dHlWaWJkWGw3V2xaRHJRekZ5ZFZwVUJJME9nTEdtTHZ1dXZQOEJqQnE3cmUrN3JwclZ3OFAxK3ZCa2hpUzdudHNLTmEySGx0ajlXQmJ5aGhEQktFaUMrekl4T0xJWFBHbUxjTkJIQ3R0RmVFM2RoL2VOTkRiMTVxSmxJNjBHWm10UHZUc3FaZGN0Y1ozbUNkWXhuVW55c0cvN2pyMjJtMnIrN0plWFdrQUVCd0J3WkROT2RManljNm83MTkwQ2t1ZCt3Yk9nTTQzTFFBSTRsaDN0WHF2dUhyOTNHUXg0OHFqcHlmdmYrSklKcHUyZ01yQVk2ZW56aFVEUnpnV3NCckc3V24rL3Rkc0g1K3YvdGtYWDlESUNaalJkakNmK1pVYkwvM013N3NPak0xNWptaHhXTmFCMjIvYTh0Z3pSNCtQekFXYVltMjZjcW5OeXdhKy90VCt5S0l5VkkraW16YXZuRm1zN2owN1k0SFZ0UVZBcmMxQVc0cXNxY2VKQTBqMkxkcm1aQklHUVRnME5IVEx6VGNsM0IzTnRhYUlXdXRVS25Ybm5YZFVxMVhHK05LY0hsbXd5ZkpGVGVWNjNKdHpVdzVMOWdrR3loQ3liK3c2ZXZISy91NldkS1NVc1hSbXZ2TGs4WkU3THQ1QXhpcERNZEVUKzhkSHBvdDNYTHZXS3BWMldOWjE5MDhXN2oxNCtsVmJWdVZkSG1nTm1PQm5yRUJDU3k1akRrT2JZQ2dKdm0rWFBKeHZDQy85NFp4VnF1RkxyeHp1VHpzTGMrVk0xdi9TQXk4V2E3R1FBb0JwQ3doTUlrYksxc0x3aXVIMjk5NjU3YWtqVTMvLzNTTWdKQUZZYlhyVC9qdGZzdlBiZTQ0OGN1U3M3N210bmhCRzMzSFRwcmxDNVh0UEgxZFdLRTFhNjlzdTJmVEM4ZEhqazRzV1VHbmRtZld1MnJqcW51Y1BhMkoxWlpMbzA1ZXNQKytWZ3pqV3BMUTF0cm42aDRBSU9PUFZhdlgyMjIvTDUvUEpGdnZ6WEJHSkVyeis5YitReTJZVG10Wm04eld4UWxacFc0c3RrUjFzU3lsdENDRFNwQW1QVHhmMm5abDgyU1hyNm5Gc3JHWEk3OTk3VWlDL1p0MktJSXhEWlVOTFgzN29TQzdqM3JSakdTcVZjWGpha2MrTnpqOTZjdnpsbTFaMHBKeElHVVJBZ2toclN6WWxlWHZHMFEwMjB5Wk95UUlSMnFTTW5td2xUekNzQkZxWmZFYSs4ZWJOVTJORkIzRjh0dmlOUnc2bVVyNHhoSVFKdUs4YXFheExiNzFxMVEwYkJ6NzU4TEZ2N3Bsd1hkY1NSSkh1eTdqdnZPV3lodytkdW5mZlNkOXpXend1akw1NngvS2U3cFl2ZkhOM3pXQVFtekNLZDY0WnlubmVOMTg0QWt4cVEvVW9mTm1sR3crUHpCd1ltU0hra1NZZ1VFb1B0YVU0Mm1xb1ltMVZncEJxRktJQkFZdzF2dWU5OFkydnZ4Q2IwbGl6emhpejFxNWJ0L2FHRzY4dmxjdU1pL01YellLeUZCa2JheW9IOFdCcnlwY3M0WWV2eFFhUmYvWDV3OHZiVzdZT2RRZXhOc1lHbXY3bHFYMDdWdzhOdEdValpjTFlsZ0w5K2ZzT2JGM1RlL0hhTGh0clgyTEtFZnVuQ2srZm5iNXB1TDgvNTJ0RERIR3hGa2JHT2doYmV0dm9BakpOQnNTUTJCSVR3UVh3QWlGWXNWSjd5KzFiaGxxeVUxT2x0cXo4MGdPN0p1YXFydXNBTUFOUWo0M2tjTVBhemwrNmN0VmNPZnJMZXc4Y21hNTVubU9CZ2poZTI1bjd0WnN1Kys3QmsxL2ZjMXk2VG92SEhhS0wxdmRjZWNuS1QzN2x1ZWx5VkZNbTFMbzNuN2xweTdyUFA3YW5IRmxMRU1ScVEzLzcrb0d1THp5NWw1aXN4d2xZeDNxQ0RiYjVwWG9jSi9zcEczNnJ1V3lWc1hLNWZNVVZPeSsrNktLbFZkY05IM0RoWk5JNzN2RjJoZ2hrbXl6TWphVit5bENrVFRYU0NIWjFkeTVXaWhCaVE2R0YyVnIwdFYxSFhyZHpzeWZRRWxuTGpzOFV2LzNpc1ZmdDJDZ1lhR3REYlVjWDZwKzcvOEQxMjFlc1c1NjNTbnVTcFJ4NVlxSHl4Sm1wenBSTFJKeXgyV3BRQ21JeXRMMnZvei9yaDdGaEFFdFZsQVJ5bkF5dkpTWlZjbGFxQkR2V2RiLzl0dTFuVHM2bkhUWmRxbnoydmoycGxLY3RLRXN0SHI5dXVQMFh0Zy9tVS9MdTU4N2U4K0tZSWlZWmk3VUpvK2ptMVlOdnVuTGIzYzhkdk8vZ0djZHpjNjZRUkJ0WHRMMzhsaTJmL2RhTEp5YktkVTFLV3dIMmRWZGY5T0QrRS90SDV4RFJXTU5Sdi9HYWJmYzhkM2k4VUk4TWhOb0NvVko2VlhkR29LMkdLbEtOdFpSTEtDMkxEVHYvSzI5LzIvY3Z1citBcm9aemJxMjk5cHFycjdyeWlsSzVoQXh0MHhWWUM3RzFrYktocGtJdEhHajEydEpPckl5MVZGVWFtWGo4Mk9oMG9meUduVnVDT0NJaVpQTEJJeU5uWnd1dnUyeWowY3BhaUMwZG5TaCsvc0dEZDF5K2FzTlEzc1JLY1BTbG1LbEZoMllLQ1Rxb3J2WHh1UUxqVEJLOFp0dEtzbHBaNGsyc2pEMFBtQ0VBRUl3VksyRnZtL2ZYdi82U3hiRnlxVkR2NzIvNXgzdDN6UlJDSVFVRHVHU3c5Y29WN1lCdzM2R3ByNzA0TVZ2VktjOEJoR29jdWN5KzliSk5sNjdzLytnanU1NGZtVTM3WG92THBUVWJsclcrN3JZdFgvajJpeStlbUkySXRMRkt4YSs1Zk5QWWZPa2J1NDR4Sm9pb0ZrYXZ1WHpUZkRtNGYvOXB4bVV0MXNaU2JHdytKWWZhVTR1MUtOUVVHUnNuQ1hCejlKb2pWaXJsN2RzdnV2MjJseERSaGR5dDdJZFh6THo3M2I5aHRMbUFSVDFKQ0NpeUZDcGJpVXdReHh2Nlc2dzFGa2hycUVhS2dIL3k4YjBiQnJvdkh4Nm9xOWlRUlNiLzVkbkRLVWUrN0tLMVNpdHJVVms0TUZyNHdzT0g3OWk1OHBMaGpqaFNDUmxSQTNjS1ZncngzT2hVWFp0UW1YVnQyYmZ2WE12SVZDT0ZrR3pId21TOU9XZE1HenRicUt3ZnpIN2l0MjZGaGRycDB6UExsN1UvZVdMcWl3OGRiTW1sakFWa2JMUllmL0Q0N0dNbjUrZXFLdVZLeVRGUXVoN0cyL282M25YZEpWVVYvNy92UFQ5YXJ1VjhtWE01YW5YSm1zNDMzTDdsYy9mdGUvTFFaRVNnakkxVmZPZTJ0ZmwwNWhPUDdDSGcybEl0VXBlczZMbDBlT2hqRCsweXdLdXhpVFFRb0xGbWZYOUxxRlFsTW9HaXlGalRSQ3cyTER4aUdFYnZmdGM3cFpUVzJCL0xIWjE0Z3VIaFZVOC85Y3lwMDZkOTMxOWFodDFjRTBtY29TWGJsZk8xaGZsS0pEaXpCSXhob016VVl1RXRWMSswNTl4RU9WU0lhQWdPalUzZnZuVzFLOWpSNlhtR25CQ25TOEhvZE9tT1MxY0tCc2ZHUzR6eEpkNWV3ZGhpcmU1eTNOcmZPVjhLVm5ma3RpL3ZLRWJSVEtsV2kzV29UQlNiVUJtbFZWZUw5OVpiTnYzUGwyMnZUMVpPblpsZnVhdzlkdm03L3ZhYkdqZ1RnakZoQ0N1eFFVUlhDb1lRYVJNcFBaQkx2Mnp6eW5XOTdkODVkUHFoRTJQU0VXbEhwQVJIbzE1NitjbzdybHJ6cVh2MzdUNDFiNUFSV2FQMWpSdVdYN3A2K1VlLysyd3BOQVNvU2JmN3ptKy85TXJQUExiMzhPU2lJbGFMRFFHRXNWN2U3aS92OEdmTFlTMnlkV1VpWlhWaWZDREJnck5LdGJwdDY5WS8vL01QSXVJUGJGZjZ3UVVPQ2JueDQwODg4ZEtYdmlLZmJ6RkwvRTNJR0lBckllUHdyTWZiTW00KzVUOTFjaTdRSkJBNVp6bVhheDI5Y3Z1YW5jT0RmL0tOeDVYbGlLQXRkYVNkZDk2dy9Za1RJOTg3TWlxRlZFUkcyOVlVdit2eVZWT0YrcmQyanlvTGpoVFdHQUlMeHBvNC90V2RteTdxNjV3cDFYSXBKOXZpemNYeHlmbnlkTGx1Q0ZxejN2ckJ6czFEWFNtQzB5ZW5xOFhhK3JXZHBzVjk5ei9jUDdaUTkzelhBa1BreUJnQWFFdXhNUnhoSUpmZU1kVGRsVTBkbWx4NFlYUmFBV1VjeCtXQTFtWWRmTXV0bTViMTVqL3hyYjJqQ3pYZ2pBRlpZNjVmUDNUejV0Vi85OEJ6RThXQU1RRm93S2cvZXZYMWg4Wm0vdVdwZzhqY1VtaTB0ZHFTdytqYWRaMlZJSnF2cW5Lb3FyR05GSkZkd2gwRDUzeCtZZUhMWC9yQ1hYZitpTFUrQ1gwOS92RG1ramUrOGMxZnYrZWJIZTF0alozV3lTVk5WaVc1UE92eDdweW5ERDU5Y3M2UkVnQWt4NnpEdEZIdnZPSGlyT2YrMWYzUFNlRllBa1cySStXODQ3cXR6NTJaZXVEd3FCUkNXOUxXTUtJYnQvYTNwdDN2N2hzZkwwU2U1QUNXakRGR0M3SnZ1M3pqOXY3dStWSmRHNXZMdUptMDQ3cVNjUVNnT0xLRlVsQ3RSKzM1OU5vMW5TY1dGOS8zMlVmbUt5cVRTV2tMeEhoU1JHSUllYzlaMXBwZDNaSDNwVGc1WHpnd3VWQ05kZHB6WElFY1NNZHFmWC9MbTIvZHVGQU9QLy9nb2JvaVlNZ0F0RlkzYkZoMjQ2WlYvL1RRcnRIRnV1UUNHTVJSOE51M1hVNElmMzNmczV5N3BWREhoZ2doaXRVVncrMXBCNmVLWVNVeTVVaEhjY0tYU09lWkVvdWw2NjY3OWx2Zi9GckNuZk1EeTBwK2hBQVNTc3RqeDQ5ZmZmVU5Vc2dFdE5KY0V3VlNzSlJrV1pkblBUYlFtajA3WHo4OFdmSmRoNGdjZ1duSm1OVy9jOXZsaTdYb254OTkwWEVjUzZDc2JmUGxPNjdkZG5ScTRlc3ZubUtjYXdKTEZNVnE0MEIreDZxdW81T2xGODdNYTJNbFE3QldHMlcxdm5YOTRCMmJWbVdFck5UaklEUktHV3NzNCtnSTFwcnorZ2Ziak0vdjJYWHNzdy9zdFl4N25xTXNNT1NlNCtSOXB6UGxkV1pTT2QrcGhPcjBRbW1rV0ltTVNVbnBDTVlRbEZJNWw5OTE2ZklkNjNvZWVuSDAwZjNqeVY1aWdXaU1ldWxGd3hjdjcvM0hoL2RNbGdJcEJHY1lSc0hicnRtMm9ydjF6NzcrUkV5OHBteW9MQ0RXbzNoZFQzWk5UM3A4c1ZZTmJUbFVkV1ViMlc4U3R5WFpiNzMyOEVNUGJOOSs4WS9jNGZBakJMQ2tCSC95SjMvMndRLytSWGQzdDlLcXNhMldnSEYwQmN0SWxuVjVMaVY2V3RPN3p4UW15NUV2QlNCNWduc2NYQWEvYzl2TzA3T0xuM242b08rNkZsQmJtNVg4TFZkc25LOEdkKzg2cGl4eXppMUFxSFRPRTVldTdPQU1ENHdVSm9zQncyU3l4QVpSMkpQeHJoanV1MmlvcHplWDhTVVhuQkZDUkhxbUZ1d2RtWDNpOE9qNFFqV2JTUUdpSnZDRVdOdVp6M29PWjd5dTlHd3RtcTNVcTdIbW5MbUNTNDRBcEpTV1NKZXQ2WHJKOW1YbGV2eTFwMDZOTHdhZUl3a3NXSktNM3JCelEzZEw1cDhmMmJzUUtFY0lqaGhFd1p1dTNMeHRxT2RQNzNtOEVsTm9iVDBtQUlpMDZVekx5NGJiWm9xMVV0MVVJbDJMVGRUWUxOYUkvWVVRc3pNejczelhyMy9vci8vZlQ3RkJZeW42Q2NQdzJtdHZQSG5xVERxZFRqZ1dFWUFCOHNRUU9Temo4cmFzektYY3A0N1AxeFE0bkFHZ0o4Qmw0RXY4N1ZzdlB6MVQrTnl6QnozSE5RU2FnSkY1MVVYRDdWbi83aGVPVFZjaXo1SEp2STNTcGovdnJlaE1sd04xZkxxc2pFV3lEQ2pXS29xVncxaHIybXZOdUo0UWtkWUwxV0NoR2lwdDA3N25TR0VKQ1JrQkU0dzVBbU5Mc1NGTkpKQkp4aVJuakpHMlZtbmpjdGk2ck8ybWJVT3VGQSs5T0xMM3pCeHd6aGt5eEVqcG5xejNscXMzbCtyUjU1NDZHRnZHT1dNSVVSVCswcFdiTDE3UjkzKys4ZmhDb0dQQ3VySkFvS3gxa2E1ZDExV1BvcmxLWEExTlJabFFrZEhXTnJORXhsZ1locDBkSFU4Ly9YaHJhMzZwM1BEdkVzQ1NFanoyMk9NdmZlbkxXL0w1NWdiWnhxcHNLZENUbUhWRXh1TWRPWmNoUG5WODNpSVhqQ0dBSzFFZ3BRVDd6WnN2blM1V1AvWFVBU1pFQXFLUFkzWDFxdDZkcS9vZU9UNzYzTWdjNTRJamtvVllXMFRxYlhFNVoxUEZ3Rkl5NWtRTWtzNkVOVWxjelVDd0J0RVhXYkRBR3JzbHNFRVV4MWppaFpFSUxWbWxEWUZ0VHp0Ymw3ZHRIKzUwQlgvKytNenpKMlpqUzY3Z0JFaEVwTldPbGIxM2JGdjEvT25KQnc2ZUZWeHlSRUpRS3Y3VjY3YXQ2bTc3aTN1ZktvVW1KZ3kxdFJZc2tOWHE2clZkZ3BucFVsd05UVFV5Z2JaS2s3MGd4ZUtjejgvTmZmbkxYM2paeSs3NkNadXNmcXdBbG1Ud1AvL243Ly9OaHovYTA5T3RsTDV3Z05LUkxDVloyaEVabDNXM3VtRU16NXhZNEZJd1JFUnlCWk5JRXVrM3JyL0VXdmo3eC9aRUZoaGpoaWlNMWZLMnpKMmJseS9XNCs4Y0hwbXR4YjRRRE1FUUtFTkNJQ013alkzWnRobEtOMlBoeHFnVk5CYVFJa01HalRIUXBGTFJ3TVlDWjlEaWl4VmRtVTJEclgzdDZYSTlmdkgwL09HeFFxU3Q2OGlFeEMzU3FqUHQzTGx0ZFc4Kzg0M2R4NDVORjMzWDVjQXNHQWJtM1RmdHlLWGNEOTMzVEZXVEpoYW9aUFlRdEZKWHJPbk1PamhaREtxUnFZWW0wRGJXbEt5NVRSNk9sRE16TTI5NjB4cys4ZkYvVGpaeExvRS9mM2lQR0ZFUzVQL29KYW9VUmVHTk45MTYrUERSWEM3WGpFcVRRWHR3SmZNa3l6b3k0N0tldkZlczZSZk9Ma29wa3dFd2x6T0hBVm45eHNzMjliZTIvT1BqZTZhcm9lYzRtbXlzTFFlNmRyaDNiVmZiN3JHNTNhT3prU0ZQQ29ZSkpuNXBrb0VhMDUxNHdTSnJ3S1R2MmpTMWlBbTNGQU5Yc0xRbjJ0Sk9kODdyYlV1M1p0eFkyM056NWFQanBlbGlpTWhjeVJIUkVNVktleHd2VzlsOXhmREF5Wm5GQnc2Y2pTd2tieUJTY1ZmR2UvZE5PK1lydFg5KzdFVURUQk9FcWdFWGlhTG84dFdkSFZrNXZsQ3ZoTG9hbVZCUmdyNWFxcUJ6em9KYXZhZTM1OGtuSHYwSnh1ZmZXT1RXVkFMTE9kdS8vOEQxTjl3aXBlU01XYnBnbVI1RFJ6QmZZa2FLak1mNzh0NThUZTA2VzVCQ0pGb3NPWE00eFhGODY0WVYxNjlkK2E5N2pqdy9NdTI3cmlVeUJ1cVI2c3Q1MTY3dXkzaHkxK2pja2FtU3N1UUt6cEx4MktRR3RIVE9CSTdBckNkYVV6TGp5OGJLUXlUT21PVE1rZHlYd3BHY0lVWGFsdXJ4VENtY0xBYUZtaktXSE02bDRFaGdMSVZHUzRhYisxcXZYdE1YeHVaN1IwYk96VmM4MTVFTUdVSVFSVHVXZGIvcHlxMVBuUmk1NThYalhNallZS1FiRXhaeEZGODYzTjZWY3lZV2E5WFFWaUlkS2h0cDB1YkM4UzhFZ0hLNS9KMzd2bm50dGRmOG0vczhmNUlKdXRBUWZlWXpuLzNWWC8yTnJxNXViWFNEYTZLNVN0VVJ6SmNzN2JLTXkvdGIvZmxLdlB0c2dRdVpoSytDb3lNeGpLTk4zZTIvZU9ubVExUHpYOTE3TkxMZ0NHa05oTm9ZcTlkMDVyWXY2K0xJRGs0dW5wZ3QxWlVSbkFuZUFHMDNKZEZnd1JZY0hjRTl5U1JueWRMeUJMbXR0QTIxRFdPVDdNTkdqcEp6eVJPT0YwcnF3MmxIck85dDJUN1VpWWpQbjVrK05MbUluUHRDY0lSWUs0bjIxUmV2Mjc2OC8wdlBIOXcxT3VNNWJxQ01Nc2w0S1dpbExoMXU3OG01WXd1MVNtU3FvV21jdnJYTkJmZEVCRktJeWFtcHYvanpELzdPNzd5M2FYeit3eHUxa3lkNjczdC81eU1mL1lmZTNoNmxWS04wa2V6WDRPaHc5QjJXY1VYR1piMTV0eExRYzZjWExIS0hzMlMzdENPWU1pcnI4TmR0MzlDUjhyKzg5K2pSbVVMS2NSQ1p0aEJxZzJSWHRHYzI5YmFuWFRGZXJKMmFyY3hVQTIwcDJWakpvQUVXZ09hd3EyME9paTFWMnhHUklUREdPRXRjQlZoRHlwQTJKQmgwWi8xMXZmbVZIYmxhSE84Ym16ODVXektBdmlNa01pSVR4dEg2cnJiWFg3YXhHRVQvOHV5QnhVQUo0VVRhR21zWmdqWkVWbCsrdXFNakxjY1g2NVhJVkNNZHhEYldwRXhqWWkxNU0xTEttWm5aMS8zQ2F6LzN1VTlwcllYZzhHL3RpdjkzTFhST2NLTFcycGU5N0pXUFBQcDRSMmRIckJSTEZzd0FNZ1RPUVhKTVNaWnhaZHBsUFMxZXBPaUZNNHQxVGE3a2xvZ2hhMGJpNnZKbFBUZXRXMzVpdHZEZFkrZUtRZVJJQndFdFVhZ01XZHVkOVZkMzVucGJVdHJTWktrK1Vhb3QxS0pBbWFUaXhCR1RnMDcrYjJtdW9WSDFKVWlHbHkwUkEvQUZiODk0ZzYzcGdYemFsWHk2WEQ4NlZaZ28xUUhRZDdsQVJtVERPRzVMT1hkdVhyMnhyK3VCd3ljZk96a21oQ1RpeWxvaWk0aXhNcDZBeTRZN1VoSW5DMEUxTXJYSUJOckVHcEt4Yzl0a1lKSkNGaFlMMjdadGVmQ0I3L2dwL3ljdlVmMCtBUUQ4R3l2Tmw5YnJ6Yy9QMzNMemJTZE9uVzVwYWRGYU04REVGalgxQUZLQ3B4MlJjckVyNXdyTzk1d3J6RlppejVXSkdlZUlrck5BeFZtWDM3Wis1ZHF1OXVkSEpwODhNMUdOdFNzY2hraVUyQXJqQ2RhVFMvWG5VKzFwVHpCZWozVXhpRXBCWEFsVlhlazRnWHRjUUhHYTdOYVZncVdreVBteUxlVzJwN3kwSjR5aGhWbzRXcWhNRk9wMWJhVGdibU5kQk1WYStZSmZzMnJnbXRWRFp4ZEszOXgvZkw0ZWVZNlRyQ2xNUGxrUXE4Nk1jK2x3dTlGcXVoVFZJNnJHT3RRMndTYlo4eWdxRUVMVXF0V096bzZISC9ydXNtWExmbUJwM285YzRmWURtVEQ5bThxU09JUFRwMDdmZlBOdGk0VkNPcFBSV2lmTGhWbXlhSXlqNU9oemxuRmx5c0cyak15bDNHT1RsWk16VlNsRUF2eEt0czhUUXFqVXl0Yk1UV3VXNTN4djk4alVyckhaY3F5bDRKSXpKRElFeWlUajdaaHpaWHZLYTAwNVdVZDZVZ2dHQ0dBSVRZTDJRR0NBZ2lFeVNJS295SmhxcEJacjhYdzFLTmJqMkZyT21TTTRiMVRvZEtSTWk4TzNEL1hzWE41WGo5VUR4ODRlbnl0NjBrRkFsY1N3Q01hU1VtYTRPN054SUZzTm92bXFxa1dtRnBsUWt6S04wMSthLzAzV1g3alN1Zi8rYjIyN2FOdS9jNW41VDJHQ2ZrQUdlL2Z1dmVPT2w0ZGg2S1ZTV2h0b3NBa0JBbkNCZ2pPZlk5cmhLWmZsZk5HWjllY3E4YjZSUWwyUjU0am1mRDRLeG1KanROSEQ3UzFYTHU5dlQzc241d3E3eHVZbXF6VUFkRGhQd3B3RW4ycVN3MFlTakRtY1NaYjhBRFpRVEVUYWtqS1VFSUFxbTVnZ0ZJd0p3UmhMdGp6YldGc0UyNVB4ZHd4MmIrN3JMSWJSRTZmR2pzNHNNQzRjTGt4ekR5Y0RESlYyT0Z5MHJMVXY3ODZXZ21KZzZwR3B4U1pJanQ2U3RlZnZQdU5jUmJHMTV1djNmT1c2YTYvNTl6amVueTRLK3BFTytabW5uMzM1SzE2dGpmRlR2dEo2eVNjekFNNGJDL2RTa3FkY25uSllWOVpqeVBhUGxjWVhBeW00WUpoWVBZYkFnTVhHR0d1WDVUTTdCcnNHODltRmVuUmtadUgwZkhreGpDeUI0RXd5eHRuNWlLaUI4S1ltOFVURGdEYWNRcFBqb1FFbjBOWXFZd0dvMVhPR08xbzM5YloxWlZLVHBkb0xvMU9uRjhySW1DZEVBenRDd0pJS3RqYjlyZDZXb1JhT05GdU9Ha1kvTnBFaGxlRER6Zy9iQWVjc2ltS3Q5SmUvL0lXWHZPU1duL2IwRzFGUTB3UDhkREo0NnFtblh2T2ExNGRSbEU2bHRkWkx4TWRKZnNBNXVnSjh3WDNKVTA2eXhjMmRLa2VIeGt1MXlMaENMSkZFSlh4U3l0allxTHpuck9uSXIrbHFiZlg5VWhDTkZzcWpwZXBjSmFncmJZaVNoSXNoTnVpL21tc1dFeGFTeENhWUpGNGd5d0JUVW5Ta3ZhSFczTXIybHJhMFZ3cWo0ek9MeDJZTEMvVklDdUZ5bHZDS0xQRmhoRXBuWEw1cE1OZVhkNHUxYUxHbTY3RU5ZaE1vRXh2UUpxRW5PYjloUkhBZUJBRVIzWDMzNTIrNzdkYWY0ZlF2REVQeHAvcTE1TVZlZU9HRlY3M3FkY1ZTcVNXYlZkcmcrZFlaY0VUT1VITDBCUHBTZUE1TE85aWVkVGtUcCtkcVoyYXJ5b0FqT0dzUUNUY3lPMHNVYVFORWJiNjdyRFUzbE05MHBIM0dvQmFweFNBcTFLTmlFRlZqRldqVEhId2d3c2FxSjhtNUwzamFrUzJlMCtaN2JXazM0N21JVUtpSG80WEttZm55ZkMyd0FLNFVncUdsaEE0R0dZQWxpSlJ4Qks3cVNnOTNwNjNWODVXNEdwbDZURUZzUXQyY09qcFBiQWhBSklTb1ZHdWU1MzdweTErNC9ycHJmN2JULzZsOXdBL0w0TkNodzY5OXpldlBuanZYM3Q2ZVRQbzFTelhBQUJrRHdkRk5DTFVsOXh6TWVidzE1UVlhVHMvV3hndDFiY2dSSW9rbkNZQVFFbm9wYlcxc3JDWHJjcGIzblk2MDM1SHlXMzAzSmFRVVRDUkpNSnlmKzI5UUxWaFMxZ2JhbElKd3JoN09WdXVGSUFxVkFVQkhjTUh3UEFVTUlnSllvbGhid1dCWmUycDFkOXFUdUZBTnk0RUpWYklzM2tZSnVtMHAyRytHdkZMSVFySFkyZG41bGEvY3ZXUEhKVCs1MnZQek4wRS80SlBIeDhmZjhQbzNQZnZjODEzZFhkcVloUHg0YVo4TFk0MU16ZVhNazl3VjRFblc0c3VzN3dUS2ppelVKd3Bob0l6Z3ZGSEdXK0wvYWRMY0paMi9wQnpMRVJ0K3VMRW5paVZubXRoNlpZd3lwTWtTSUVkTS9BY0R2Q0Jnd1FadnFMSGFXTTloZzYycEZSM3BsQU9sZWx3S2RLQnRHTnRRbVVoVGJCdmpkbzA4Q3h0a01seUl1ZG01clZ1MmZQR0xuMSs5ZXZobnZ2cy9YUjd3azJWUXE5WGUrYzUzZis3emQzZDJkaktHeHA0UGJaTWdIUmtJRGc1anJtQ3VZSjVrbm1BdFBzLzZNakl3WFk3SEYrdWx1allBZ2lYMFZVMk9LSVFtQlY3RFVpOXg3NXpuL21xdVcwL3MyQVU3Y3hxbHBJUnhpWUFhZUhlRUZsOE10YVg2OHI3RHFWU1BTNEVLTlVRNk9Yb2JKemFIbGtwK0NkVW5NY2FBWUc1MjdwV3Zldm5IUC9aUCtkYjhUeFZ4L21RTitLa0ZzTFFzZHlucCtNdS8vS3MvK1pNUFNpSFRtWlJXbXJEUmwydUFJTEd4a3RYaHpPWG9DdTRtQklrZXovb080NnhjMTFPbGFMNFNWVUtkVEFWejFpQk9PcitVOUlLcVNaUGRDNWZnby9SRGxwU2E0WkMxeEJoa1hOR1o5ZnJ5WGt0S1dHdktkVlVKZGFncDFqYlNKdFlVVzlJTm0zTkJKUkNCQ0lUZ1FUME02dlgvK2I5KzkzLy83ejlhdW56L25tenJQMW9MK3BHbmYrR0xOYmUxc0ljZWV1UTNmdVBkSStkR09qbzdyRFgyKzRpNEVCdGJvVUVnU282T1lLNWdEb2RHT2MrVHZzTUJzQkthaFZxOFdJbkxvUTVWOGlUSUVCaXlSZ0FFUzZralhnZ3phOVNJRW9xZUpMSms0QXFXOVdWN3h1bkl1bG1QTTZBZzFwVkFCN0dKRFVYYVJ0ckd4bW9MMm9CSjZoaExGaDhiOUlhTTg0WDVoZDZlbm85ODVFTjN2ZXpPNU5DYTRQNy9zQUIrWmgvd0k5M3kxTlQwLzNqdjczN2xxMS9QNW5LZTUycXR6MS9meHBoc280ektPVXFHRGtOSG9PUk1jT1p3OENUM1hlRTdYRENNRGRVaVV3MTFKZFMxS0trQmtMYk5DWUZtTU43a3UwT093QmhLem55SHB4eWU4MFRXbDJtSE9ZSVpzbUZzNnBFT2xZMjFWUWw4VTFOc1NWa3lTUnNuU2E4UUdtMElKQUFRWEVSeFhDb1c3N3p6cFgvN3QzODlORFQwSHpUNlA5SUhJUDVNSHZ6SHVRUUErTXhuUHZ1QkQvenAxUFIwZTF0YjhuVzR3RGczR2RtUU1lQ1lyRXBzK0V6SlVYQk12dUpKNWdybUNNWTVRd0FEYUMwa2RHSGFRako0Y3Q3SE1PUU1FK2JnaE5uTVdCdWZOK3VnRFJsamxTRmxyTEpXR2RMSjlJZTFaSnRMeUpzRXF3U1VJS2dXRnd0dGJhMS85RWZ2Ly9WZmY4Y1BtNTJmaHdCK2ZoclExRVJMUkl6eDBkSFI5Ny8vQTEvNTZ0ZUVFTmxzdHJranBEbDUwQ0FuVFdnU0d5VlZ6bEFnQ29hSkswN09sQ0Z3aGlMNUxtZUNJY2ZHV3VyRTl5WjA1STNCTVF2YVdHMXNNdUpwTFJnQ1k2MXBpTTFxQzlxU29VYm5zc2wvZHVFNFNHSnpXS1ZjamVMbzVTKzc2NE1mL0pQVnE0Y2JBeTAvdnJmMXN3dmdaMGpFZnJJSUFIRHBwdHgvLzNmLzlFLy96L012N001bTBxbDB5aVNWbEF0ZURodGJReFBvWTBLYmp4eUpJM0xHZU5OZUpkMzJaTzlUMDdNdnJieG9ac09OdUtYQjA2aWJzMDNXa3JGa0NLeUZwVW9HTlZjOElnRXRwVUtJbkxONkVKVEw1WXUyYnYzRFAzei95MTkrMTMvR3hiOVFBTW1vQnY3Y24zckpNeXVsUHZuSlQzLzRiejk2NnRTcFRDYnIrNzYxcGtGVTF6UjlTNUVtTmtPY3BLckRHREU0M3dOZ1NkYk1hS2tJY1o3Z3NUbU4zZ3hWbTdOOGhFMGkwd3Z0ekFWcGJjSkF4eGhqTEF5Q2NxV3lZc1dLZDczejE5L3hqcmY3dnYrZmRQSC9vMUhReitBVkNzWGlwei8xbVk5OS9KTW5UNTVLK1g0NmswN2FEUFI5STBqTkNnODF1Sk9iOERKczdOYkZDNExRQzk4MndRVUxXcHBUdWVmYnlmQ0QvM1hCNnlXSFc2L1ZhL1g2eXBVcmZ2bHRiM243ci94eWUwZjdmK3JGL3pua0FUK1ZLaXpOaEJTTHhidnYvdEtuUC9PNUEvc1BBa0kybTVWUzJtUXMvL3Vud2VEQ3pldm5GMGsyM3luU0QwYjh0UFJUZEFINzdJOGlZZ1lBd09USzYxaFZLaFVDMkxoeHc1dmYvS1kzdnZFTjdlMXRTVVRIT2Y4Wndzci9mL0FCUDFZTXhwZ2tnSXZqK0x2ZmZmQUxYN2o3c2NlZW1KOWZjRDB2bmZhRkVOU0liZWdIencwdUpGaStJQy83d2UvL2dISEJDOTFTOHZzSklGNHJFOVRyWVJpMnRyVmVjODNWYjNyVEw5NTIyNjJ1NnlhMy9nY1E1UC9KQXZoUjJORC9aREZZSVJwNmZlclVxVzkrODk1djMzZi8vbjM3eTZXeWtOTDNQY2R4a0xFR2FSSFJqMy92UDBaTVA2UkVTZnZZRXNWeEhOUURwVlZMTnJkNTg2YmI3N2p0NVMrL2ErM2FOVXZXOHIveTZDL1VnUC9TbDF3eVNrdjJGd0FPSFRyODZLT1BQZnJJWS92MjdaK2NtbzdpV0FqdXVxN3JPQ0xaUk5RMDQrZkxRRDlDTzVxTjhJU0YzRnB0VEt6aUtJeVUxdEtSdlQwOVc3ZHV1Zjc2NjI2ODhmck5temN0dGJ1VFlPRy8vaHdTRGFEL2hwZTlvTmR2TFMwcEJBQXNMQ3djT0hEd2hSZDI3OTI3NytUSmsxTlQwNVZLVlNtVkJDcWM4OGEvbG9vU0RhdFAxbHByckxIR21BYmxxWlFpazhuMDlQUU1ENis2NktKdGwxNTZ5Ylp0V3pzNk9pNE1FQzY4QlA4dEQ2VHpoZTcvdGtlRGdjQTJZc0dscjRkUk9EWTZkdnIwbVRPbno1NDlkMjVpWW1KbVpyWlFMSmJMNVNBSVZESUtEY1FZRTFMNnZwL0paUEw1bHM3T3pzR0IvbVhMbHExZVBUdzh2SEpvYU1qMy9lOFh1VzBNQ3VGLzU2ZE9IdjgvdG1wSWc4aWNXYzBBQUFBQVNVVk9SSzVDWUlJPSIpICFpbXBvcnRhbnQ7CiAgYmFja2dyb3VuZC1zaXplOiBjb3ZlciAhaW1wb3J0YW50OwogIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlciAhaW1wb3J0YW50OwogIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQgIWltcG9ydGFudDsKICBjb250ZW50OiB1cmwoImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBSUFBQUFDQUNBSUFBQUJNWFBhY0FBQnh3MGxFUVZSNDJ0WDlkNkNsWjFVdmpxLzFsTGZzZHZicC9VdzcwMnN5bVNTVDNrTVNFam9DZ2hSRlZFQ1VxOTRycUhoVjdsV3ZJb0tWWGlTQWxBQWhoSVQwbnN4TXB2ZDZlais3NzdjOFpmMytlUGMrTTFRRlVYL2Z6U1JNVHRubFdjL3FuL1ZaYUsxRkJBQ0VIL1dnSC9lTm4va0hmK1F2RTFsTEFNUTV2L0RyNVVwNVpucG1ZbUp5WW1wcWVucDZmbTYrV0N5Vks5V2dYbytpeUJocmlRQUFHUXJHWE0velU2bGNKdDJhejNkMGR2UjA5L1QzOS9iMTlmWDBkR2V6MlF1ZjFoZ0RnSXdoNHMvK252L2puenA1b0NXTC8rRm4rWm5QbllnQWdERzI5SW5HeHNlT0hUOXg5Tmp4TTJkT1QwL09GSXJGZWhnb2JTQTVhOERHbzNGbmNPbTVMQUJZc21TQmlBQVlvaERDVC9uNWZFdGZYKytxbFN2WHJsMnpidTNhd2NHQnBYTzMxZ0xBMHZQOXR6elFXdnRmLy9MV1dxTHo5NzFTcVJ3NmRIajNuajM3OWg4YUdSMHBsY3JHR01ZWTU0SXhob2hBQUlrRW1wSzdVR2NSb1BFdFJGajZGaUlnRWxscnJEYmFXaEtDNTNMWjVVTkRXN1pzM25ISkpaczNiMXpTREdNTUlwNi9CLy9sQWdENHIxS0M1TklsSHpVTXcxMjc5enorK0JONzkrMmZtcHlLb3BnSnpvVmd5TTVyUi9PRWwyNUo0M0NYL2c1QWlTMGdJS0NtUE03L2NsTTBpSWhrcmRiS1d1czRUbjl2NzdhTHQxMTM3ZFdYYk4vdWVkNlNSdjRYaStHL1RnT3N0Y2hZOGtxblRwLyszdmNlZXZ6eEo4K2VIWW1WY2h5SGNRN0prUk1sNTRxSWRNR0o0OUlkLzNHZkJCcDY4c09LUW8yL3MrU3ZpVENzTWJGU2ppTldyRmh4elZWWDNuTHpqY1BEdzBzSzhRUGU2UC9iR21DdFhicFd6eno3M0RmdStkWUxMN3hRTEplRmxJSUxXanFwQzA1NXlhcWNOL1kvL0M2Yjk3LzV3ODJ6VDFUZ1FpRTAvcnIwUFp0b0RESWtRR3UwMWpxWHkrN1lzZjNsTDd2enlpdXVTRjdyd3JmOS8xVUJKT3FWZko2SEgzbjBpMS8rMTcxN0QxaXRwZU13eGt6VEJ5WXZmOTdRSUNiL2lVdTJIS21wQkFTSWNENXNhTVFoaWZsSmpyaHg1SWs2TlVYUS9BczJYYlpGQUFLMFJJakFHUU9pTUk0Y0liZHMyZlFMcjMzTmpUZGV6eGo3THpCS2FLMXRmaDc4K1VZNDF0cEVrWjk2NnBuUGZ1N3plMTdjYXl5NXJvdldHaUprN01LN25Sd0hJREFBaGdpQWpFSHl4aEFUb3dHSXdKQVFHVFl0RVFFbDc5MUN3L0RiaGl6QVdpTEN4cmtURUlFRlNNSldvSWFzYU1sN0E2QzFnSXd4RnFrWUFiWnUyL3ptTi83aWRkZGRtMWlrUml6dy94VUJMQ252OGVNbi91bGpuM2ppaWFlME5hN2pXa3RFbGdFQXcvUGVsQkNUZzJhSUFJd3hob1FJREpFaGNBYU1JY1BrRDdEazlpT3hKUnZWVkFRQXRFUUVZSW1Jd0Zvd1pCdi9KckNFWklFSUxBRXQ1UjBBbUFpdktSVUxnSUNjc1VqSGlIajFsVmY4K2p2ZXZuNzl1djg4aTRTV1RLTG1QOStMWDYvWFAvSEpUMy94aS85YXFkVjgzN2VXTEJHL3dLd3NDWUFCTWdUR0VCbHdSTWFBSTNER09LSmd3QmtrNTg0WkNzWUVSOEdRTWRaSW81cWFZQW5JV21Pc3NkWVkwcGEwSlVQV0VyTVdOVmxEWkExb0FtUEpXQ0JMbHNBMnZIN0RPVmhyRzRFc0VTQWlZMkVZWmpMcFgzanRxOS8reTI5TnA5UEcySjlIK3ZhamZjRFBRUU9XN3Noenp6My9WMy85NFNOSGovbXBGQUJyWEN5QUpLNVp5cVFhTjVvaFp5QVlDb2FDbzBEa0REbVM1T0JKNmJsU09sSUt5Yml3d0pLN2JJaU1wV1llREFqSUVEa1NZOGlRT0FDQXNWcHBiWlJTVWF3aWJiUUJiVUVUYW11VnNjcGFZOUhheEZLUnBmTVJGQkVsYnNRU01jWUJvUjdVMXExZDh6OSsrejFYWG5IRmoxR0ZuejBsL3JrSklBbmRvamoreUVmLy9ndDNmOWxhY2h6SEdMMFUzU3g1ZW9iSVdYTHJJVGw2eVpuRG1XQWtHUGlTKzU3cmU1NXdYRTA4MUZTUGREMVdVV3lpV0dsanJDVnJHN1llQUd3aUFBQUVZQXdaWTRJektibnJDTjhSYVZkNGdna3dWc2RSRk5iQ09GUW1OcUF0S1V1eEptT3N0bVFKamFXR0l3RklYUFJTN3NjNWkrS1lNWHpENjE3N250OThsK3U2UDhjNDllZmdBNWJNem9tVEovLzRqLzlzejk2OW1YUTJlZHJtQlcxWUhjWUFFVGtDNThBWlNvNE9aNUtodzhoM2VDYmxlWDdLb3F6RlZBbFVPWWlDTU5iR0pLckRFQm13eE9wY1lIeVdMaUFRTlVJZFNtd0xrU0ZDWkpKeno1VzVsTk9TY3RJUzBhb2dxTmZxVWFCTWJFQVppbzFWeG1vQ1k4QW1Uc0xhNUVvbno0bGtDUm5qckZhdFhyUjF5Ly8rNHo5Y3MyYjF6MHNHLzlFd2RDbXovZlo5My9tekQvNUZwVkx4UE05b2c0aklrQzZJYzVLTHp4bHdEcEl6anpQSndSV1E5WjFNT29QQ0s0ZG1zUnFWYWtFY0t3TGdEQVZubkRNTzBIUU15Qmt5aGd5Qkx4VndHb2t2V0FJREpqSHh4cEt4WkFrdGdiR2tEUm15Q09oSWtVMDU3Umt2NTNMUVliVldxd1p4WkRDMkZCcXJ0TldHTERGcmJOTTlBQUV3SUVNQVFJS0xJS2puY3JuMy9mN3Yzdm5TTzViU2wvODJEVml5aG4vejRZOTg3T09mY2x5WE1kYlEzd3N1S1dlTUFYQU9nb1BEMGVGY012QUY1ck4rS3AwT0RKK3J4QXVWbW80MElBak9SRk0vSkVmSm1jTlFNdUJBREN3SFFpQ094QkVSSWJIRWxvZ0FMWUVCSUVBRHFKRlpRRzB4TnFRMEtXT1ZKV05KR1ZMYUFwRHJPRzI1ZEZmT2NVSFhhOVZTUFF3MHhKcGlZMk5qdFlaRWNza3pJOUJTL01xUUVWRVloVy8vbGJlKzk3ZmZjK0VoRU5IUElBeTAxc0Q1dS9SVEcvMGdDTjczQngrNDk5dmZ5V1Z6eHBna212ekJpOCtSTVpBY1BNNWNocTZFMW95WHllUXFtazh1Vmd1VnVnVndPTHFjY1lhU2t5ZTRKNWxFNEtRNVdVK3dkRXEyNURQNXRwWjhXMHN1bjBsbjBxN3ZTOGZoUWdDQU5UcU80NmdlMXFyVlNxbGFXQ2dWRmt2bFVyVmVqeU9ERnBrR0hsc0lqUTJWVVpxVUJXVkphY3NZdG1UOG5udzZLMjFRcXhTcllhQWhOamJTTmpaZ0RKaEd2TnBJSUpEQUFpRUE0N3hjTHQ5KzI2MS8vbi8rTEpYeS95UG1LQ2xILzlST09IbkpoY1hGMzN6UGU1OS9ZWGRMcmtWcGpVbGF4Qm9XTFFuZU9RZkIwZVhvQ3VaeXlxZWNYQzVYMFh4aW9WYXFCb2dnSlpjTUhRNitaTDVrRGxoT0ppV3d0UzA5ME4rMWJIaXdiMWx2YTN1cm0vSUFTTVVtQ3NLd0ZzWlJGTWRHYXdOQW5EUEhrWTRuUGQ5emZVKzZFaENpSUN6TUZ5Wkhwc2JPakUrTXpTMFdxNkVDelhoa1dSQ2JRTnZZa2pJUWEwT0FMV212dnkyVEZhWlNLWmZxS3RJUWFoTWFxdzBZQzlhU0lVb1NidHNNbHh3cGk2WFNwVHUyZitURGY5M1IwZkV6eXdCdHcyTDhGQUpJWG14eWN1clgzdm51bzBlUFp6SVpvMDBqeEc5YUhvYklHWEFHRGtkWGNvOWp4c1gyZkV2TTNKRzU2a0s1SmhHbDVKS2p5eURsY2wrZ3ROcGx0cTg3djM3VHluV2JWM2YzZFFIWndrSnBabng2Wm1KbWNiNVlMZGVDZXFTMTBjWWFTMHNGbitTOWM0YUNveFRjOTkxMEx0UFdtZS91Nys0ZTZNcDN0Q0RpN05UODhZT25qeHc4TXoxYkNnMkxrUVhLMXBRTkRSa0RTbHNOMEo1TkxldklPQlRPRjh2VnlFYUdRbVZpUThhQU50RE1zYW1SZ1Z0Z1F0WnFsVFhEcS83NUgvK3VmNkQvWjVQQmtnLzQ2VTUvZkh6aWJXOS94OGpJbUoveWpUS3NlZXNKRVJGNDRtODV1WUw1Z3JzYzJySmVPcHVmTEVYamMyVkwxcFZjTXZBRVpCemhDNUJXNXpQT2hnM0x0MSsyY1dCWlQxQUxSMDZObmo0K01qMHhYNjdVbGJZVzBUSkJ5QUFaRVJBa05ZYnpSVFpzWkFPQVFBd0l5REpyR0ZqSldUYnI5ZlozcjF3N3RHelZnSmYySmthbWR6OTMrTWpSYzRXcVVrd0VHbXF4aVRVcGdrZ1podGpYM3RMWDRnVDFjcUVTaEJwQ2JTSmxsVUZqeVJBMTRxTEVQMXVTa3RmcXRlVkR5ejd4OFg4Y0hCejRHV1R3MDJYQ2ljT1ptSno2NVYvKzFUUG5SdEtwbE5JV0d4VUNJQUJzWG53cDBCUE1FeXpqc003V2xxcDFUczhVd2lCMkpCZWN1Und5RGt0SkZGYjF0S1oyN3R5MC9mTE5Vb3BUUjg0YzNuOWlZbnl1RmlxRFBEbDBTMkFNS1cyVjBzb1lZMndTZXAwUFFKSXlXOFBpY1NtNWxGd0t6amt5QkU2V2pPR2tVNDdzSCtqWXNIVjQ5WWJsU3VrOXp4OSs5cG1qczhXYVptNWQyMnFrUTROYVU2aTE3em1yZWxwelhNMFhpdFdJQW1NRFpYV2lDa1NXQ0FHcFdWQmluSWRCTURnNDhKbFBmYXkvdi8rbnJWajhGQnFRUFBYQzR1SXZ2Zm1YVDV3Njdmc3BNaWFwMnJObUJaOHo1SXdjQWI0UXJzQzJ0TXpsV3NlSzBkaDhVU0J6SlpNTU1nN0xla0xhdUQzclhuUGxsc3V2MkJ3RThaNFhEaDA5ZkxwWURnMFRGcmttMU1hR2tRNGpaYXdSUW1UU2ZudGJ0cU85SmQrYXpiV2tVaW5mOTF3dU9RSWFZNk1vcnRXQ1VxbGFXQ3d0TEpRV0N0VktOVERhU0NGY1I3aU9rSndKSkxTR1daWExlaHMycnRoKzJZYVU3ei8zM0tHbm5qbzRXNG9VazVWSVYyTlNGaUpqcklYQjlwYkJWcWRjTGhScUt0UVFhQjFyTUFhU2xJMmFjWkVsa2tMVTZyWFZ3OE9mKzh3bjJ0dmJmeW9aL0hzelliSUVDRUVZdnUxdHY3cHI5NTVNTnFlMTVneWJWVXppbUpSb3dCUGdTKzRKNkd4SkN6ZDdmTEpZcXRZOVYwb092c0FXajN1TU1nS3Uycm54aGhzdUNlcjFKeC9mYyt6WVdGMVp5NFcyVEJzSUkxV1BZb2JRMFo1YnZiSjM5ZkJBZjE5bkpwTUN4b0l3cmxURGFyVmVDNElvaXJXeENDZ0VkMTBubmZJekdTK1g4Vk1wbDhoV3l2V3hpZG1USjhkUG5abWFXeWlqQmQ5M1BGZElqcHdSS3VVSjNMaCs2T3JydC91KysvRER1eDkvNWtoTlEwaThISmpBZ0xZVUs1MU4rV3Y3V2lDdXpCYnJnYWE2TXFHMjFxQ3hZSzJscGNZREVlZWlVcTFjc3YyaVQzL3lZNzd2RTBHeitmVHowSUNsWFBmZHYvbmI5Mzc3T3kzNVZxMVZ3K1kyQy9pQ0llUGdDdlFsU3duc2Jtc0p5VDAyTnFldGRhVndHS1JkYkhFNU4vSDZsZDJ2ZWVWMXVWem04VWQzN2R0M3NxYkpNS0VNeElwcVlXeXQ3ZXZPYjl1NFl2UDZaVzF0MlhJdE9EYytkK3Jjek5qay9FS2hHZ1N4MG9hTVRYencrVXdNRUJFWVEwZnlkTXJ0YU1zTjluZXNYTjZ6YktBem0zWVhGc3NIRDU5OThlQzVxZG1pNER6anU0NUF5WUZia3hLd2RjdkthNjdmWGk3WHZuclBreWZPeldybWxrSlRpWTB5RUdrakdGczMySjdHZUdheFZOTVFLQk1xYTB4U3VtaTRCQ0FpUzBMS1FxbDQ1KzB2K2VoSC9pWlJnaDlPQzM0NFYvaDNoYUZhYXlIRVgvNi9ELzNkMy8xamExdWJVb3B4QmdTSkFKSWFzaERnQy9RRVMwbm83V2liRC9EMDVEeGpLQVYzT2VROW1SSTJ4ZW5PbTdkZmUvWG1QWHRPUFBuNHZsS29ZaVpDVGJHeXRYb2tCYjlvdzlEVmw2N3Y2Y3BQekJUM0hqbDM1TlRFOUh3NVZwb3h6b1VRWENSMVVJQkdWVG1KelJ0dkhCdSswVnFyamRaYUdXTmRLWG82Y3h2WERseTBjWGxmVjM1eVp2SEo1NC90T3pLcXRjMmxQRWN5eVlIcE9PUHk2Ni9kZHRsbEc1NSs5dkM5RCt5dXhsQTFXQXAwWkNqVzFsZzczTmZlNGRQc1lxa1dVNkJNb0szV2FNZ2FTOWpvUmhNUkNDa1dGd3Z2ZXVldi9kN3Z2dmZmNlpBeHdYUDhCQUVrVC9TdGIzMzdQYi8xTzVsY3poaUxRS3pwdHBNQ2d4RGdDZlFFeTBqczZleVlLT2x6MHd1dUl3VEhsSUJXMzNGSXJlaHRlY3NiYm5ZRSsvbzlqNThkWHlESERUWEYybGJxc1JEc3FvdUhyN3QwTFNKNy9zQ1o1dytjbVo0dkE2RGpPRUxLeE0wWVMwcWJPRGJhV01IUmtTSUJTMXpRT0FiRVJqdXNrVmdpSUlEV09vb1ZnTzN2YnJsczIvRGxXMWVTdFk4K2UvVHBQYWVVTnJtVUt3VnpCS0NLaHdjN1h2WHlhNVMybjduN2UyZW1TekhLWWhBSEtra1g3RkIzNjBCT3pDOHVsS05FQnFBMG1VWXhsWko3WUFnRUY1Vnk4VzgvL05kMzNmWFNmNDhNL2cwTlNGVHA1TWxUcjNyTjY1UTIyQ2c3RWtNQVJBYkFPUk9jZkltZUVHa0h1dHZiUmd0cVlyYmdPbEp5U0V2TSs1S2I4T3J0cTkvMG1wdjI3anYyN1FlZXJ4dU1nY1VhYXFHeXhseTVkZVZ0MTJ3Sll2WEEwNGYySGgwTlkrMzZyaXNsSWxnTFNtdWxqYlhndWp5WDhkcHlmdHJqMWRCTXp0ZnJnZVo4cVhsNXZoMXNDYXdsZXg0WjBiZ3UycGd3akgxWGJOODRkT3VWNnoxSDNQZllnV2YzbjNXa3pIclNrVXdDK2N6ZWZ2UEZsMXkwK3U2dlBmSEVudE1rM01XNnFpcXJEVWJLOUhlMExHOXo1aFlYS3lIVnRBbVYxUnBOMHVCTExpc2hJaEJaeWZsWC92WHVOV3RXLzVzTytTYzU0YVFqR3NmeDY5L3dwdjJIRHZ1ZWIyMFM2Qk1nTWtUQlVBaHdPYVljbnBiUTA5RitiakdlbUN0NGpoU2NzZzV2OFlTdzhXdHZ1L1RtYXkvK3lqMlA3ajE0eGpwZVhka3d0cVZhc0xLLzdRMjNYSkpPK2Q5NSt0RHV3eU1FNlBtT1lBd1J0TEZhYWRmaFBlMlo1ZjM1d2U1c1B1Y3p4cVlMOVgwblpzOU9sc0xJTklyWUhEa2lhL1Fsa1FpU2JvdzJWaG5TMW1vTDFqWjZMSXdoRUlSaHhORHUyRFIwNTNXYjZrSDBydys4ZUhhOGtNOTREbWVlUkZEaEpSdVh2ZmFWMXo3eTFJR3YzYjliTWFjWTZISnN0Y1V3MW4wZExTdmFuTm5GeFVwRTlkaUVpclFCbmRRckFDd2hnR1dNQjBHd2NjUGFmLzNTRnh6SCtjbkFyNTlrZ2hJTit0TVAvdm5IUHZhSmZMNVZHNXNncEpLQ01PZE1jUFE0cFJ5UmRyQzdMVDlhMEJQekJVY0t5U0hyc0JhUGU2RGYvcm9iTjY0ZC9NUm43eHViTFZuaDFHTmJqN1F4NWhYWGJyNWk4OHFIWGpqKzBPNFRSSkQyWGM2UklXcXRHY0pBWjJiVDZxN2wvYTJNNGNSczVlUkVZV1M2T2xzTWE0RVNpR2xQZWdJRkdRbmE1U0E1VHhwbkNHUXNhRU1hbUVJZUE0KzBEWldKTkdocnJTVU5GZ2drWXdoWWowSkh3SzA3MTkyNmMvM3pCODU5L1pFRERDRHRTdGRod3FxQmp1emIzL3lTVTJkblB2SEZoME1TeFloS2tWWUdvbGozZDdZc2I1VXppNFVMWmJDVW95VUJxaENpVUNqOCtqdmUvdjczL2Q1UE5rUkxBc0FmYVh5ZWZ2cVpONzc1bDFPcGxEVVdrQUVRUy9xSWpBbU9ub0NVNUNrSGVqdGFKOHBtWkhyUmRhUmdOdVB5Vmxla3VmM050OTdlMVpiOXAwL2ZXd3hOVEN4VXRsU1AranV5YjcvenFpQ0tQbmYvQzdPRmFqYnRDNDVTTUNEckNiWjZXZHZGNi90eWFmZmNWSEhmaWRtVFk0WDVTaGdUQ3M1VGpzaDZVbG9scmNxbC9lNit6cjVsZzUxOWZmbTJkaStWWW94YnJZSnF0VGcvTnpjK05qVStNVCszVUkyTTRtNWdzUjZhU0Z0bFNZTWxJRWJvTUFZQXRTQVk2TXkrK1k1TFU1NzgyTmVmbnB5dnRtWTgzMkVPMmhaZnZPT1hYbElxMXoveW1lL1dEQytHcGh3WmJTR0k5WXJ1MXY0Y201NHZWbUtxeFNZMlNkRzdVYXBMR3Y2Y3NTQU1Qdi9aVDEyeDgzSmpEV2Y4cC9BQmlmRUp3dkFWcjNqTnFUUG5YTmRkaXA4WUFrZGduTGtDMHBLbkpIUzNab3V4UEQ0eDd3Z3VCZVFrYS9GNG1wdjMvc3FkMlpUNzhjL2VWemRZMVJBcEt0YnFPemNNdnY3R1N4N2JkK3FCNTQ5SlIzcVNTd0VjeWVXNGFiaHJ4NllCSW5qeDJOUys0ek9UaFVCWkJNWVNlK2R3RkVZSm8xWVBEKzI0WnVlR2k3WjE5M1ZLM3dQT0FCSUFCUzZoVzBESDFWSjU0dFNadzd0MkhkbTlmM2F4SEhPdnJxa1cyOGhZRFpZSTBJSW5PREpRU2tkUmRNY1Y2MjdidWU1TEQrMTk3dkJZV3pybENQUUZPR0RlOFV1M1dvSy8vc1I5VllXbDBKUmlxelJGc1Y0NzJObm02S25GU2szWnVyS1JCbU9zdVFDZmhJaHhGSzlZdWZ3YlgvOVgzL04rbkNINjBRSkl0T2IvL2ZYZmZQakRmOWZhMXFhMWh2UDFGaEtjQ3c0cGlTbkp1MXRjemRNSHo4MEp3UVRIak1SV1g2WlF2L2VYWDVwTHUvLzgyVzlISUNxUmpUUlZhOEhMcnRwNDFaYVZuL251QzZmR0YzSnBYM0R3SkRLeUsvcGFydG14MG5mRmMvdEhYencyVzZncEJUeTJGR3RyTFFuQmZJRVUxcGNOZE4vMmlsc3V1K295UDVPR0tBUVZHMnVJSUtrUlFlTVRFb0pGeGhqbjRMckE1ZHpFOUxNUFB2TGN3MDh0MXVLWU81WEkxR1BUbms5SkRwTnpOZDhWU2JtL1hBMDJMR3YvdFZmc2ZPN3c2RGNlUDV6eFhGZWc3ekJKNmpmZWZGdHM2RU1mdnpld1lqSFE1Y2dtOGMrbTVaM0NWR2RMVVMwMmdTS2xRVnRyenBlb1NBaXh1Rmg0NzIrLyszZmUrMXMvemhBdENRQi9NUEk1ZGVxdWw3MktDQWhZczZsckdVT09LQnZ4UG10THkydzJ2L2ZjbkRiV2tTd3RvZDEzcFkzZTlhWmJsdmQzZnZRVDk5UXRxMFlVS1lyaStLMHZ1V1NnSy8vMzMzaXFHdW1jNzdvQ1hRRTVUMXg5eWJKVlF4MTdqMHc4ZDJCaW9hcENnelZsUWszYUVoQTVncnVNcEZXM3YvU0dsNy9tOW96UG9WUTBSSlpMeGlWM1hYQWxjQVljZ1NFUWdDVlFsdUxZcWhpc1JyTE05U0NkSFRzNzhlMHZmRzMvM3NOS3BpcXhEWlM1YWt0ZjJtRVA3eG5uakFtQjFrSXRpbHRUem0rOTVzcngyY0pudnZPaTc3aFNZTnBsRHFuZmZNZGQ4NHVWdi92MC9TRTZDelZkMHhUSGxuRzJiWGw3clZKWXFOdDZyRU5GeXBDMkZ3TERHc0h4dCs3NXl1clZ3ejh5SXVJZitPTVA0QS9aSDBSODMvdi82UERoWTY3clVLUEVTUWpBa0hHT0RnTmZzcXlESGZuOGllbHFOWWdjeVQwT2JiNlVOdjdGbCsyOGFOUEtqM3o4bnBxQ2FnU1J0aXFPZisydUs5dHlxYisvNTNGTm1QV2N0SXNwQWNNRExTKy9lWk5nK0sySGo3eDRZclljUXlXeXhVRFZZcXNzQVpERE9ScVZsZnhkNzNucjdTKzlYcFlXVExsa0xUREdSTVpsUGc4cWhmRXpaMC9zUDNCODc0RlRCNDVNbkQ1Vm1wc0JFNlF6RHN2NHpJS05GSVVobEF2NWZIYjd0VmNnd3pPSGozTXVMTUd4MGNWTks5cHV1cmh2ZEtZVWhzWnp1Y05acE16VCs4OWN2V1haUmNOOXU0Nk9JVEpMaEJ3UEhqaDEyMDJYdE9kVEI0NmNkVnhIYVdNQUk2WHJtdnJhTWtvRnhxSWxheTNROTZFa2dURldyZFptWjJmdnZQT09IOWt5KzBGd2JxSXBUejMxekp0KzZhMWVLbTJOQm9RRWpNYVMxb2ZBbE1TMFpQM3RtZG1BblpwYzhCM0hFZERtY3cvTWpaY052K1VYYnZxYnYvdnE1R0k5MEJocGl1UG8xKzY4d3Zma1A5MzdsT2M0cnVRWmw3bmNYckpwNExKdEsvYnNIMzE2MzBneG9sSm95NkV1Qm9vQUJPTUU1SExHakc3THVuL3d2bDlidTdKUFRVMXo2UkJuUE9jVFJjL3ZPdkRFay90T0hqMjN1RkFNZzFnYlN3Q01vUkE4ay9FR0JycTNYTHorbXV0MkxGKzlIT3JLMUdJa0E4aFliKzhMVCsvK3pEL2NYVGRZc1ZDb1J0ZHY3YmxwKytCVCt5YVBuRjBVa3NXeGpaU05WUHdiZDExS0ZqNSszeTVYT2tLZ0oyeFh6dnVkMzN6MWwrNTU4bnZQSEF0QkxOUlVaREJVZWtWdmEzZUtwaFlxMWRqV2xORWF0YVVsUTJTdEZaelg2c0cvZk82VFYxOTE1UThiSXY2QkQzemcrNXZ5U0VTLyszdi9hM3hpVWdoeEh0Q0FqZWFpSjlBVnZDMHQwRWtmSFY5TS9FSE9ZVm1KcXdmeTczN2JIWi8vOGtNbnpzM0Z4SlRGTUlyZTlwSWRyZG5VUDkzN3BPODZhWWZuMHp6cnNsdXVXcnR4VGQ5M0h6MjgrOWgwT1liNXFsbXNxWVZhMUpkTERYZmxweW8xeVpnZzhoMzJ2Ly93MTlmMnRrVVRVMHhJWk1qYlVudGVQUGgvLytMVGQ5Lzl2V1BIeDh1QlVzaEpTSEJjZEZ4d0JLR294elExVmRpOSsrZ2ozM3R1OU56WThwVTkrZTUyVTFkZ2pGbFlIRnEzc24rb2Y4OXplNjBGTHVYUnNkTFVmUFd1cTFaMTVOenhxYktVREJFNVl5OGNIYjFpdzlDR29jNDlKOFk1NHhaWkdJWXpVM08vOVBxYmp4MC9WeXpWQ1RFMkZnQUwxYkNydGNWRkhXbGppWFFUSVhDaE4xWXFucGljZXRVclgvN0RyamdSQUY1dy9kbEREei95ZDMvL1Q5bE14cEJaK3BaQVpKdzVuSHpCTXk2MjVWdU9UMVhxc1hJRVN3bHM5VVhPZ2QvOTlidjI3ai8xeUZPSHJIQWlUZlV3ZlBVMVc5Y01kdi9ETjU1d3BaTjJlR3VHNTMxK3gwMmJPMW96MzNwZzM5bVphaUdrdWJLYXIwWEcybXVIKzdjUGRPNmRuQytGY1ZweUcwVy85NTQzWHJ4bUlKaWM1bEl5aml6TC8ra1RYL3ZyRDM5cFlxWWsvQlM2am1GQ0ExT0V5UjlOekNLemlNUzVjRnhsNk5DaDA0ODg5SHpLWXh1MkRrT2dnVUF0RmdkV0QzVjB0ejMzOUl0TVNDbkVmQ1UrY25ydTZtMER3LzNaa1ltQ0l6a2lNY2IybkJ5L2FmdnFybnhtLytrSndUampZbjZ1a0hMRmJiZnNlT2I1dzRaUVc2c3RLbTNxc1Izb3lPZ28waGFNdFlhU0tpbENFdUlUT1k1NzVzeVpMVnMyRDY5YW1TQk5mOEFIWEFnTGgvZTkvNDhteGllNGtCZUNaeGxEd2RIanpKUFFsVThWUWphMlVQS2tjQVMxK3NJaDlVdXZ1S0k5bi9uc2x4ODEzQW0wcVVmeDFadFczSExwaG4rODUxRkxrUEY1UGkxYVUrS2x0MngxcGZqMkEvdW1LdkZzV2MyVjFWdzE2czJsWHJGNXVLN05QUWZQTFFSeDFwVkJwZktxTzY5OTFhMDdnNUZ4TGlWeVpqMzd2ZzkrOGl2ZmZNckxaRUJJRGFpQjF3MkZoalFtSUMrdUNHdXhDUlVoNDhDWUpwS2VHeW56MkdNdkZndkZuVmR1Z3NpQ0piVllXckZocFRMbTRMN2ozSEVJSWRaMDVOVGN4ZXQ2TnExcUh4MWZGSUl6Qkd0aDM2bUpWMTZ6SlZiNnpOUThZMHg2enVsVEk1ZHNXOVhYMi9iaXdWTkNpTWhZQzFnTklzL3pXbE84SHNmR2dpWkwxQUNxTHVIc2xUSFRNOU92ZnRVcjhQdXJwT2MxSUpITU04ODg5K0dQL0YwcW5iWmttemhPNUlpY2dTdkFFOWlTRWw0cWUzU2lDQUF1eDV6TFVod3ZXdFB6bXBkZS9ySFBmYmRZVjRHeFNwdmxYUzIvY3RmVm43di95WVZLclNYbHRLWmxxODllY3ZObXlkZ0REeCtjcTVtcFFqeGJWdlBWOE5LaHJodldMbi9rOU1URHB5YUJjVTh3RzBWRHZlM3ZmK2RyYUdhZWtBR0IyK2IrNFY5OTdodmZlekhmM2haYklDWkNZRXp3NGU2MjZ6Y3N1L09TTlMrN2ZQMmRPemZjc0gxNDY5cStscGIwZkxrK1g2eEp4MFhHTGFIbmU3djJISnVZbXJuKyttMFVhQ0F3eGVybVN6WWRPemt5T2JWQVRHaEx5UEhVdVlVdGE3bzJyTzRjbXlnZ0F3Q3NSK2JNNU55YmJybnN6UGhzb1JvQUFqSis2dFRvYTE5K3hlalk3T3g4QlFBalF4YWdYSTk3MnJObzQxZzM4U3cyUVY5alVpcDFYZWZjdVpFZE95NVp2bXpvUWlYNFFRMzRzdy8rM3hNblRqcXUyMnp6UWRMamxSeDh5VklPNzh4bkpvcHF2bEx6SlBjbHRIb3k2OUI3ZnZuV0YzWWZmK0hBT2N1RnNTUVJmdXQxdHp4NzRQaStFNk50MlZRK0xWbzhkdVAxRzdPKys5MkhEczdWek1SQ09GTldwWHA4KzhibHc5MXRuOXQxN09SaU5lVktCQklJUWEzMjY3LzRrczM5bmZWaUZRaFNuZG5QM3ZQd3g3LzBTR3Q3bXlhMFhFU0FHM283M25qcHVsZHVYNzExZVhkSGF5NmRTZVZiVWlzSE83YnZHTDd4NXMyM1hiMGgzZFo2OHR4TXRSWTVycU9VU2FXOGZRZlBWR3VWYTYvZXBNcXhOU1FCaGxZdmYvekozWXBJR1NBQUtkalkrT0pGNjN1WDliV01UeXdDUTg3NFhMRksxdDUxelVVdkhEbGpMUkZncFJJZzJkdHV1dmpaNTQ4QnN0Z1liVEdJTldPOEsrY0djV3dzYW1zdEpiaHJwT2FJVkJpR1lSRGNlZWNkRjhLNUdnSklRdFRUWjg3ODJmLzVjK25JQ3dhc0dBZmdIQjBPdnVENXRPQk82dmhrUVRLV1ZQbGRVaSs5ZnRPcVpWMmYvOWZITFpmYWtncmlON3hrcCsrSWV4NSt2aldYeWZxaXhZWExMMXU5YktqN2V3L3VuNm5Fb3d2aGJDbXVSZW9YTDl1WWN0MS9mdnBBUlZsWE1rdkVFRXdjTCs5dGU4L3Jib29YaW9UTVR6a2o4N1AvNi8vZExWMGZ1TEJDR0dRM3IrNS8vY1hEcnVjOGVYYjJxeStlK2VxdVU5L1lkZktiejUrODkva1RUKzQ5VXkzWE4yOVp1Zk9sMTExNytmb3paNmJPak01NXJoTnI0L3ZlOHk4ZUgrcHQzYmgrWlZ5TjQxclEyOTh4VnlvZk9ISldlcTdTbGhCZHdTWW5GeS9kTnBSTHV6TXpSV0RvQ0hGcWZHYkR5djVWL1YxN2pwNWpuRWtweDBhbnI3cDhROHFUeDQ2UEErT3hJZ3RZRGVMdWZKYURqaFVaYXd3bEF5Q05HaTBSdWRJNU56cDIrMjIzdHJlM0xRV2ZqU2pJV21LTWZlSVRuM3JrMFNkU3FkVDVNQmFCSXdxT25tUytBNTB0bWZGaVZLZ0VqdUFwaVMwTzYydnpmL2tOTjkxejd6TVRjeFVOVE1WNjg2citPNi9kL3RsdlBNd1p6NlJrUHNVMnJ1dTkrSkoxajM5djM5aDhmYndRejVialNxaCthZWMyaSt4alQrMDN5RGxqWkMwQVNNYkNXdjNWdDF4MnhacWhVckVLWkRQdHFiLzUvSGYySEI1TFo5S0djdzM4OWpYOTF3LzNQbkYyOXJPN1R6MC9NajliRGtObHRNRlkyMUl0T2pOWmZHelhtZTg5ZlRUdHlNdXYyM3JidFJ2SFJtWVBISi93UFVjYnk3bllmL2pNemRkdFRndFBLMFZoYldDbzU3SG5EMGFHQ05BYUFNWWt3OFc1OHJWWERhc3dMcGNEQzhBUVQ0NU4zbm4xMXVuNTB2UkNSU0FpUUtWWXVmT09uWHYzbnF5RktyWldXNGlWQVM1N2NtNDlDbzBGYmEwbHZIQllrSE5lTEJYeitaWXJyN3hpS1NsamdFQUVuUE13REw5ei93Tys3eGxyejkvL1pPQ1dnZVNROVlRaU1WV29DY0VsZzR6a3pLcmJidGc2TjE4OGRIUVVoU0JqSllmWHZtVG5ZOC92SzFmcUdkL0pwL2hBZDJibk5WdjM3VG94T2xXY0xjZUZpcW9GMFMvdTNFS01mZnlKRjFFSVpLaXRqYlVGQW1PMDc4bkxOcStwbEtyR0dpbHdaSEx5d2FjUFpiSnB5M2hvMmJiZTFvdjcyNzU4WVBTcmg4YXJpdEtPOUp2d0IwUW1oRWludkZ3dVBUbFQrZjAvL3R3SGZ2OVRaUFdmL2Y0cnJyOThkYW11dUNNZHo1dWFyMzdxS3crN0dUUksxY3IxZ1h6bThvdldSa0dFaU5yYVNxakxrWmxlcUQzL3d0bXJybHpYMzVIT2VkeHpaYVVXUHZ6Y29WZmRlSWt2a1FFd3hnOGRHNTJhbkwzMXhzMW9WRnB5d1Vod05sT29LTXN6cmhDY0NZNE1rejVCQXVvaVk0enYrZCs1LzRFd0REam5pV2hZb3kwTThPeHp6NTg4ZWNyelBHaE9pRFp3VmcwRU9lVjhiN29jeFVwTGhwNUFqOE5BWitieTdhc2ZmSGlQWWR3YVVGRjAwMldiRWVHRkE4ZGJzbjdhNTYwcGZ2blZtMmNuRjQ0ZEcxc01iYUdxS3ZYb3BSZXRhODJrUC9YRUhpNDRBQmxqUEFITE90UGFXaFdyem55MnY3MmxWSzdGa1hKZC9zVGVrN09GT25la1JwNVBlZHY3V3I5MWJQTDVzVUxHY1RoaVV2cFBlbElXeUJJWlk1VTJRb2lXWE80TFgzM3lmLzdSdndEUUg3L3JKU3NHMm1LTGxtRXFtLzNXUS90T25CdnhKQ3FsZzNKdzdmWU5raVg0QnF1TkxkWlZ6ZURKTTNQVDA4V3JyOTZRODFqYVk3bTAvK0xSczhiU3JUczN4U3EyZ0FiRi9RL3V2bVRiaXNIdW5NdlI0MHd3akpXZUxvZlpsT2R5a0F3NVEzNStnQWNJeUhYZGs2ZE9QL2ZjQ3dCZ3JVa0UwSGpjZDkvOVNwc2xSQzBSWWFQYkRwSmpXbkppY3FaWUU0d0pobW5KbVZVM1hMVmhhbWJoMk9sSjVJS3M3Y2luYnJoaTY0TlA3aEtjK1I3UGVyaGgwMUN1dFdYdnMwZExFYzJWbzBJdDJERThlUEdxRlo5NGRKZEZKRUN5eGtYenJwZHU3R3YzbFRheDBsMnRhU2V1Qi9WQWFVT005aDRiUTg0dEV4cllzbnpxOEd4NXoxVEpkNlMyWkJ0aFJuTWNqeHF6TFVTWVlCbzYydkxmZVBEQTMzL3N3YmJCN3YveGk5Y2JBdUNTU3o1ZkN1OTlZcS9yazlhbVhLeXU2dXZzNzI1VmNVeEF5dGd3dHNXYXFobDQvb1ZUTFczcGpSc0cwaEpkaDBzcEhuNTIzN1dYYmU1dXl4cHRDTm1wc3pPVEV3czNYN09KRzVWeU9HZkFHVTRWYXhaRnl1V1NJMGRDQmd3dW1OcEUwRnJmZC84REY5Z1lJczU1dFZwOTZ1bG5mTit6eGl5VlJwZnNqMkNROWQxQ1hkZkRXSEowR0hnQ3VscjlIUmV2ZnV5cFE0UWNpRlFjM1h6VjlrS3BjblprTXBQMnM3N29hdlBYYjE5LzdNVlRDK1Zvb2FyS2RkV1R5Nzc4aW0xZmZHcDNOVktNSVlKRm8zLzdsZHZteXVGengrWXluaE9wdUN1Zk1XRVExVU9yZEJEcmtlbUM5RndMVERJMlUxTzdweXVPa0xiWmYyeFdvcHVkNFVZNXVuSG5ZbTN5TGRsUGZtUFh3UmRPWDNmWm1zczNEbFVDWTRGNUtlL3hQYWRMS21JQTlWcmRBN3Q2cUR1TVltMXRQdTNtVTI0dFZJVzZXaWpITCs0K3RlMlMxVDJ0ZnNaajZaUXpNakU3TmJkd3c4N05zWXFBZ0pBOStmU1JTeTVhMWRPVzhqaEpUcHl6ZWhndjFGVEdjeVZua2lGRHVtRG9GcXd4dnVjOS9mUXp0VnFOYzA1RUxMRS9lL2JzSFJrZGN4M25nbGxPQUFUR1NEQndCVHFPTTFNS0VvbDVFdEdvUzdldGpDSjE3TVE0ZDZTMXRxczFjK25GRzU1NVlhL25PV2xmNUZ6Y3VIMXR2UnFjT3pGZURHMjVic0hRRzI2OC9La2pwdytQVFF2QkJLS04xVHRmdHJrYXhwLzg3aEVwQlFFUnNJenZxa2hIWWFUanVGcXZGV3NSbHpJeGhZdEJVcU9qNytzZU5lWTFFbE5MQUJiSVFqSVRDWUFNdzVnKzhmWG5nT2lPUzFaYXNoYUY2N2tqVStYVHMwVkhjaDJwdUZ3WjdtK3oxbHBMa3JOYnQ2NEJvbkpkVnpTZFBqMVRyWVlYN1ZpYmsrZzczSFdkSjNjZHZHampxcTYyTkZuRGhYUHMxRlJRank3YnZncU44aVV5SklZd1d3cWtsQjVIeVpFellIamVEMXNpeDNGR1JrWjM3OTdUS0R3bjV2N3hKNTlVU2lYMnAxbkJTS2EzaUhQMEhSNXFWcXlGa2pQQk1DVlpTcktkTzlhOHVPOVVySWtCa2xKWGJOOVlycFRISnFheWFTL3I4OTdlL01EdzBJazlKd3AxWGFpcFdoRGR2SDJEa1BMZUZ3NDZqb3NBS281LzhkYjEzVzI1ZjdyM2tPOUphNjB4UklCQ2lEaldVYUNpTUFxalVCbEN4Z0haMGtBd0FqQWd6cEkvd0ZneTZvU01BVU5pU2VUZGxKQTI1SG5PVXdkR0RoMDhlOW1LenY2MmRHaUlTeGtvYy9qMHVIQklSYXBXcmcyMDV5Um5rckd4aGJMcnlNdFdENVdEcUZ6WGdZS0RMNTRhV2ozUTM1dFB1K2o3Y21KcWRxRlF1bnJISmhXSGlCaHAycjNuNUdYYlY2Y2M1Z2dVbkRoanhYb1Vha2k3WEREa1MzMktwUklwWWh6cng1OTRNdmtLU3hUaCtlZGZrTkloMi9EYVFFbnhtVGdEd1NEbHlvVmFIR3ZER0RvQ0JkbVZnMjN0clpuOUI4NEs2U0JRMW5jdTJiN2h4WDJIQkJlK3l6TU9ydG0ydHJ4UW5oeWRLMFcyRnVpZVhPcjZTN2Q4NWZIZE9objUwZnJLVFQwM1h6YjhEOS9ZeTVKaGVac1V2REdLbEltTkNsVlVqZEZZUndwcVFuNjB0UXloTWN2SDBlSGdjSElGT0J4azAra3hocnd4dUVITk1Xc3MxS0w3bnozZW1VNXZIT3hReGlEbnhQaXhzOU9XbEluam9CYTJwZjFNeWpQR0dxS3ZQMzk0eDVybDNSbS9IcWhLWktjbkNndnpwZlVYRDJkYzlGMHVoZGh6NE5qMmJXdnphWmVzRlZMdU8zU3VKZXV2R09yZ0Zoek9PRU90elVJMTlsMHBPUXBNWXFIejhhaTE0TGp5K1JkMkpWZzNob2pqNHhPblRwMzJYTWRZb2liYUxNRzZDZ1NQb3lOa29Sb3lCSTdrU1FaV1g3UnAyY1Rrd3V4Q2hVdHVkTHgrN1RJcDJka3pvK21VbTNHeHV6UFh0YngvNU5DWmNtUXFnWTRqZGZQbDI0Nk5UaDArTys1SXdjQzJaZmhiWHJiOXl3OGNXQ3lGbktNeG9HMlN1TUJDcWFxMWlXTlZEeUlCME5yaVcwc0U1RExXNmtsdGlUTndPWG9jZmNGOHdYM09VZ0o5amg1SGw0SERLTGwzREpyNmJJRXo5c0tKcVVvUXJldHJSMlFFeUxnWW5TNUdjV1MwRG9MWUZ6TGpPN0hXanVDblp1WlBUQzdjc20yRGlsVzFybXVLVGg0ODI3TzhyNmV6SmUxZzJuZEhSeWFSc2MzclZob2RjUzdtRjJzVEUzTTd0aTdqMW5pY0oxNm9VSXU1a0k1QXdSaGpnSTE0RklqUVd1TTR6c21UcDhmSEp4Q1JBY0NCZ3djTGl3VXB4UVdBTTBBQWpzU1JlWklwaTlVZ0Zvd0pCSmRCMnVVYjEvUWZQSHd1NmRNemF5NithUDNaczZNcTByNHIwaElIMTYwSWE5SE0yRXcxb2lEUWc1MnRhMVlPZmV1SlBWeEtCTElxZnQzdFd5Zm5Lay90SFhWZGFZd0ZvaGFYRzZzNTQrTnp4VENzYTZYQ1dGTnNWL1MyS2sxQW9JM1oxSmxaMTVFR010Wm9BZUF5bGhJc0kzbEtDRi93eERCNmdqa2NHdGFwT2YzcmNqNHhYNTFhclBXM1pnVm4xZ0pqZktGY0QxUnNESVZSak5xNGtpdHR0Q0ZIT2cvdFB6NDgyTHVzczdVV3FGcE1zNU1MdFVxd2NzUHlqRVRmNFZxYlU2ZkdMdHE2VHBCRklBTjQ0UERJaGpYOU9aODdERGdqeHJBU1JNcUFMN2xneUFId2dtWTlBQWtoQ29YaXdVT0hHbUhvdnYwSGpMRjBRZnlBQkF4SklFcEUzNUhsVUFkS013VEJrUUVOZE9kYnN1a1RwNmE0Rk5ibzlueDJjTEQzMVBFem51djREc3ZuL082Vnk2YVBuYTNVVlMwMEtvNnZ2bVR6OGJIWmthbDV6amxaczI1NSs0NnR5Nzd5d0Q0dWhTVlFXbDh5MkhiMTZ0NTZGTHVDamN3VUN2V1FBYWc0THM1WHQ2N29Ja3RJRUNrTEFEY3NiMy9sK3I0cmwzV3VhRSsxZXN4bjVJSEpDbXAxV2RaaEtZa3B3WHpCUEFZQ2dTTWxNdUFNcTVHZVdheG5KWmVJeGhJaUMwSWRLMlcxamlOdGxPWU10Q1ZqQVJtT0w1U1BqczlldVdtMTBhb2FtVnBvSms2TzlRNFB0YmI0dnNNOTF6MTU4a3gvWDFkWGU0dTFpZ3QrNnN4TUxwMGU3RzNsWkIyR0FqRld1aHdvWDNLTzFKanV0NGxoYnhnaVk4MysvUWNhQWpoNjVDZ1huQzVJZ0JNdm5KU2dIU0ZLOVJpSUVNSGxESXhadDZxM1hLNHZMbFlsNTZUMWloVURSc2R6cy9PZUwzMkhkUTUwQ1VmT25KMnNLUWdpM1pITHJCNWUvdGdMQjVCeHhraVNmc1ZMdHUwOU1qNDZWUUxHakxFRCtjeHQyOWJ1SFpsMXBCQ0NMOWFpMHd2bFZNclJXazlQRmRaMzVycnlydEtXTWJadnNsaU8xTmFlbHBlczZYNzFwc0hYN3hoKy9WVnJiN3QwMWNabCtYWVBPbHpvU01tY3k5S0NwUVQzT0FpV2ZIZ0N4TWpRWExHS3hqUTRuUkF0b1RGa1ltTmlZNVN4emNGSVpRZzVmL3pBeVZWRC9kMHQ2U2hTZFEzVEk5UGNjM3NHdTFJT2VyNVluQy9FY1R3OFBFQmFjODRYQ3JYRlFuWHRxaDYweHVGSjJFbUZ1aEpDU0o1QW1LbFpjMGpjQUhFdWpodzlCZ0NzVnErZlBUdmlPSTQ5VDVGRW1JeWFJRWtHZ0t3YXFtU3FYWEtVYU5lczdENDdPcU9NNFF5UjdPclZRek5UMDFwcjErRnBCN3BXTGFzc2xFcWxhcUJCeDJyam11VUxsZnJKa1VrdU9SaTlkbVhuOEtyZWg1ODhKbDJIQ0t4UnI3dnFvak56cGJIRlNrb0toaUNFZVBia3VKLzFyRFdsY29EVjZKYnR5NnBoSkJpVVF2M05JNU9QbloyYnFVZXVKM3BiVWl0YU10dDYybDUyNmZwZnZQT3lpemIwZGJqVW5SRjVqeWZqWmg1bmtqVTY5cFpzcVJaR1Vid1Vaek9PQUJBcnJlSllLYVdVYWNLY2dYTitlbkp1dmhwc1c3TmNSVkdvYmFWY0w4OFd1bGNPcEIzMEpEZEdUMDlQcjE2OW5CRnhoc3JZMDJkbjFxem9rWXdreDZTZlV3MlVCVndDN2lYalE0M1l3QnBIeXJObno5VnFOVFkyTmo0N055ZWtiTkM2RUNXRDV3eUlBVHFDS3d2MVNETkVEaWdRTXA3VDE5MTZkblFXT1NPd0tjOFpHT2dlRzUwUW5EdVNaVE5lUzEvZjRzaDBFSnRRR1ltd1lmM3dpNGRPaExIbURMblYxMSs3K2ZUWS9QUmNtVE91bGQ0MDJMV2lwKzNoQXlkeXZnZEVuRUV1N2U0Zm1aa0pvcXp2TUliam80VTd0aTNyYVhWRFpSekJ5c3JjZTJUOEh4NC84dW1uajMvbjBNaXh4Ukw1VHRyejg1YmZjZlZGZDk1MWFVK1dkNlZGaTh0VGd2a1NIWjRRckFBQ1JGRmNyc2ZhV2dTd0JKNG5HV0lVeFdSdHBGUWxWTmlrdWxHV2xMVjdqcC9iTUx6Y1pWekZObzd0L05oMHZyY25sM0ZkaVZMeThiSEp2djZ1Yk1vRklzYjV1ZEdaN3M2V1RFb3lKSTZBREd1eFVwb2N6amllejFXV3hqcWtsTE56ODZOajQremN1WFBWV3UzQ0psbVRTSytCUUFtVWpZMWhERGtISk9wb1RidWVuSjR0Q2luSTJvNjJuSi95NTJibUhWZjZBbHM2MnJqcmxXYm1Zc3QxYkR0YVczS3QrWU5IejNBaGdHeG5XMnI5eHFIZHUwOHdJUUNKZzNucFpadWZQWDUyc1JaS2dWSWdBMGdKVHBZZTJIZXlyVDN0dW1nUmVDMTYyMDFySXhVbjFDWlN5THJHUTVQRmUzZWYvWWQ3OS96bGw1OTQ4TWdacHpldnk4SHE5cTY3WG5WdGQ1WjFwbm5XNVo1QVI2QmtnRUFjZ0lobXkzVmxDQmthUTIyNXRFQ0lvNGd6Q09LNFVvOFk1eFlvSVZoaGdoMDhOWnJKWnZvNzhqbzJzV1dscVhudU9pMGRMWjVBeDVIemMvTys1N1IzdElBeGpoRFRNd1VwZVdkYmhnRnhCa0NrbEFtMWRUaGppSXdSWWxLeW9zVENNTTVxdGRxNWN5UHM5Sm16U2ltNGdCUXZVUlNHd0JoSndRSmxyQ1dHSUJraTJiNnVuSXJqUXFuR09TTnJ1bm82dElycjFacm5Tb2REdHFkVGgxRzlWSTRNa0RiTGwvVVhLcldwdVFVaEJSbTFidDJBQm5QbTlEUVh3aGk5cHI5anFMZnptY05uSEVjUWtjdHdUVmVMSjFsYnh0OTNidWJvUXFtM08rK2w1TXhjOWFvVlhhKzhZdmxDcGM1NVF2TUFCams1anVaeW9oQjgvdHU3UC9CMzM1cnpwT0M4eDh2Y2VNZk9kZy9hVXRJWDNCUG9jSVpvT1FPSk1GNm9hVXNNd0ZqYjI1bEZBOXBhSVhDeEZ0VENHQkZTcnVqS085WVNBWnRaTEMxVTY4c0dlNnpTaXJCV3FzWkJtTy9yZGpnNGt0ZHI5VGlLZTNvN3lCckdXYkVTUkVIVTM5M0NMRW1HQ0dDSWdzaHd3VmdEdDlxQTBDZDJCZ0cwMG1mUG5tT2pJNlBmeDdjQWdFQ01KUUJRWUl6VlkwM04zZ0JZMjkyWnE1VHJZYWc0NDJCdGQzZDd0VlRXV2tuSlBZZGx1anJDd21JVUttTUF5UTR0SHhpWm1Bc2l4VGxLTU9zM0RZNmVtNm5WWXdDMFdsK3haZDNVWW5teFhKR2NXNjFYdEtkdjNqd29rSHpKTzNLcGh3K2ZxeExsTXA2WGNxY215Mi9Zc2V6R1RkMkZXcGlrdkpvd05GVFJ0a2JJL05UNFRPV1AvKytYVHdTaFFMdHFhUG0yeTlibHVNNTUway9jQUtBbkdCQ01sbXFBUUFER21sVjlyU1l5Qk9CNWNxSlFEcFhXeHZhMitUdlhkU21sQ0NCUytzejQ3TEtCWG9HZ3RBMURWVnNzNWJxN1hBZWw0RnFaVXJIVTI5dUZaQmxqa2RLbGNyMnZLNDlrRXlvU0FLZ3J3eGxMZ01QbnVhR29RY2lDUUNPam8yeHlhZ3FiYkk4WHlvQWpjQVJFRENPRFJBakFFWUdvb3kyelVLZzJtTDRRT3RyejVVSUpBYVZnbmlmOTFueDlmakhXMWhqckNOSFczam8rUG8zSUFDaVRrb1BMZTArZG1MQ0FRSlIyNUtiVkt3NmRHZVdDTXdRa3MzTnQvM1NweWdCU0RzLzdrak80Zjk5SmNFUnJTNHB6WEp5cnZldUdkYS9hTVZnUG8waGJ4cGdGTk1RaXcwcVJpYmlvRy96ckQzMnRsTXNKcGJkZHVxbW5LNXVUNkhMbWNPUUlPVmZVbFJvcjFDVkRZNjBVdUxxdnRWWUp1Y09jbEhONnBtaUlBSkFqck83THBRUWpzcGJ3ek1Sc1czdWI1d2l0clRKVVh5ejVyYTIrSjZWQXhyQlVLSFowNUFVSEFMS1dGaFlybmEwNUJwUjBiSUFvVW9ZQmNyeHdDTFZSWlNBRVpHeGlZb0l0ekM5d3h1akNBTFRaaXVFSUFLaTBib0s4Z0ROb3pmaUxoUW9CWXdTTzRMbGN0bFFzSStPU2c1dHlwSmNLQ21WdFVHbWJTZm1PNjAxTnozSE9rVXhiV3phVnkweU5MeUJqUnV1K2p0WnNTK2JNK0pRakJRUFQyNXBhUGRoNWJId3U2OHVVWko1azdXa1hrWjQ4ZXFZVUJPbVU2enF5c0ZCL3piYkIzNzU1ZFgrTFU0K1ZzVUFJRmtBVFZwU051VmdvQkYvNjZoTk9tOSthenEzWnVzWUQ3VW51Y0FaQUhXbDNzUnJPMVVLQkxJcDFUMXRxV1h1MlhBbzl6MFZIbnBwZVREaEtaeFlxcmJsTVY5NVh5bkRPNStZTHduV3phWStNMVJhRFlrWDZhUy9sY3dhQzgwcXhrc21ra2pJaUFDNFdhL21jTHhseWJLUytzVGFVTUsxQmd1L0U1T0pqc3dvMFB6ZlBTcVVTdXhDclJZUkV5ZHcxUXdRQ1pXd2lRUVlrT2FaVGJya2NOQXA3VXZxdVc2M1dPR2Vjb2V0N3lFUlVxV21MWkd3bTYxdWtZckVDaklFMVBUMXR4a0NwVU9WTUdHMEcrN3Jxc1NvVUs1d3hxODNtRlgxY09xVnlQZVVJVjJMRzVXbFBkTFdrT0dNSHowNEVTdnVlNjd0T29SUXR6L20vY3NYZzdldmJzdzRxYlFuQUFockNtcktZOHA1NjRzRHArWnBNWlFaWERXVjhuaEpjTWtTZ0ZsZU1GR3JLQW1NWUJOR1c0YTQwc25vWVpkSmVJVlJqYzJVcEpTTFZBb1dNOTNWa2pMV0NzMUtwcWl6bFd6SmtyUUZVdFJDNDQ2ZFRFb0V4ckZXcW51dDRyZ05Fd0xCU3FhZDlSMHFHUUFpRURKU3haSUd6OCtXNEM0NFpHR1BGVXBsVnE3V0VLSFdKNGJUaHB3RVEwUkpvUTloTXBxVVFqaFRWZW9TSVJPUTZVZ29lQlNIbnlKQWN6d09pT0l3TUFaSE41ZEpoSE5mckFUSUcxblIwdDlicmNSQkV5SkNNNmUxclh5aVhJcTA1WTJUTjJwWDlpN1dJSXpnQ1BZRnBWK1I4bWZINFFFZjIrcDJiKzN0YjA3bTBrWkk3VWxzS1E3T3kxYjk1dUhVdzUrakdtQlpvQ3hGQnRSWWZPRElHUHV2b2FHMXR6em9NT0tMTEVSQk9MOVlGWTBSZ2pMNTY4MkIxb1k2TXQrVFRoOGJuaXZXWWNjWVlHbTFyb2VydnlBbXd5REFNNHpCV0xaazBHRXVFY1JnRE1UZmxjVWFjOHlpTUpPT3VLNUdJSVZacmtTT0ZJMFNEMUFoUUowUnRnS3dKT3J6QXpCQWlWbXRWRVlRaE1tWi9lSHdTZ0NGWW9vUTdKNmtQU2NFRVowR29rQ0VSU1NrUUtJNFZTd2hwWEplME5wRXlSRVFtbGZiREtJcVZSaVlZUUs0MVY2K0cxaGdRd0JtMWRiUXNsRXJHRWdKSWpyMDk3U2RPalRtU1N3NnU0TDdEYzc2YmRtRHoyb0dWd3dQbkpoZi81dk9Qbkp3dXVaN2IxNUlheW5zY0lJak55cndiR3p0YjA4QVFpSlFsbDdGeko4ZEFYSmx1eWVWYXMzeXN6Qm1tSEQ1WGkrYXFvV1FzanRXeW50d2xLenRuanMzN0tkZnhuZWVPalRFdWlGQXlSZ2hoYkR0YU14eUlJU2lqNjFHVXp2aU15QkxZV0pIVnd2YzRJOFl4VmhxdDlSd0hxQTZJVWF3NVkxSXlhQnFaaEYwOGlXaVNXY3J2MHdERUtJeUUxcnJwaEJOdW5HVDhsNUl5OW9YcHNiV0VnRWhNS1owd213ckJ3VnFqRFRMR2dKZ1FWaHR0dENFQ0M2NGpWYVMwdGNBSUVmeE1Lb3FpNW5RL1Q2Zjl5YW1GcFBycU82S2xMVk91MTZWZ25ERXBtT2NJWDJKWFcyWm8xWkRYa3ZyMEp4NThaTzg1UDV1Skt1YjRkTTJUYkhWbnBqdmpWRUtkbFZqa29Dd3hCQXRBaUtWU0ZaZ3JmZWE0a2lNaGdtQnNxaEpaUzB4Z3ZSNjk5YzdOR1NaSEl0M1duajIzV0RwNGJzYnpYQURpQ01CUVdXakpwVGtRSWhodG8xaDdLWjh6SkNKanREVmFTTWtRT1dOR0s3QkdDRTVFREpsU0dvRVlaOUFzS1pPbFpubVprTTczeFpvOWR6VGFNR3RNZ3hzYkVKcDhkZDhucTZaaFNpQ25SS0FNQVNFUklBTzAxbGpUSkN4bllJMjFOdW5YSWtOalROTzRFWmRDYVdPSmdJZ3hFSzZNbEVxU0UwOEtKK1dGV2pWWTVEaHpCSE01WmpKZXFyUE5lTzY1OGRsY05zVUVGNXlsWEFISURrMVhqODNXSWtPUnRoNXZCaG1VOUZBWlNBQkhOSWZJSVRLMkdobk9NSTUxZTk1OXhiV2I1bWRyMG5meWVmLytQU2Nxc1dhY0pZd1hraUZ5VEtkZDNyQWFwSTJWamtpQWN0WWFzaFpZQTZ4UDFoSlp6aG9qMDhiWUpIOXFzRWhnb3lzSERhckM1SURwUXVaeGF3MjdNUHRxVnRDWCtPQ3BLYTBsVWphVHdBOHNKZjhRR2R0b2lTZVdHR3lDVHFCRTluU2gxRzJUNzRXUzZnQUNMUFhWazBKcmdzTm8xSjBrNXd5MVFON1Z0bkhMYWhWRmlVOHlCQmJBRld5dUZoY2lyWW1TSGlVQ2NBWWNxS085QlZLZU5uRWNoQllaV2FoR1JsdVNuSlhLdFZmY3VLSExsZVZxMU5hZW5hMUhENzk0S3VXNWxoclZBc25CY2FWd1pYTUd2VkZHYU5SeWtzRmthbERMSmZ5d0RlUFJIQSt6RFZBSllaUE40L3dJN2ZmM1VodTNsakVHUzNNRkY2UmtEWm9vYW82Zk4rRFQxaHJMR1RPMndVNEwxaUtnTVdRTjZGZ3QvYllsVUxFU2pHRXpCMWVSa2x3a0ttYXNpWVBRa1JJSUdiSW8xbUVZZWE1N25udVlBQm5HdFdxOVdnYkhmK09iYnNsbmZXclVNaHM0RkNJb2hUb3lWaEVoRWtOSWNTYklMRi9kRDhLcEZTdmx4YklsMUlZcWdVR0FNTmI5M2VtMzNISHg1TWdzZDBSWFg4YzNuajllck1WYzhLUUR5d0Vrb3A5S0VUWUcwUm1TNndoalRPUGtHRU1HUmhsS0ZoVXdob1JKRkdESk1vYldVdEpZVFNBYURkSmxRbXBjU3JndzNMZGtPV2ZNZFJ5VGZHSnJrK0dZSlU3YVpnc3owVFpMUU1xUU1WWUlicXdsZ0ZocDBzQVowOFpvU3lxS0FBaVpTTzVJVUEra1lJd2pFRmlMdFZMTjh4d2l0TVlxWTh2bFdrczJuYkFRMXlKVm1DdmtNMm1sRFZscnJOV1dZa05ock9mUGpObEtiZVdhcm11dTNSelVROVprekUzVU9MWVVhcklBRE5CbDVEUHFhczlzdTNnbFZLdno0N1BGWWpVeXRoTHAwRmpCZWFWY2ZjK2JyOHNpcjFURGpvNzA2ZG5GN3p4ek5Kdk54TW5ab09VTUpZZVdmQzZNREZKQ29jdGQxNG5Ec0lGUkV3SVJkQlFxUzlvUVl4d0J0ZFlFYUlpazRFYlpXSmxrVUNxaHN1QUpueTk5WDVabEcvZ1pFRnl3ZENadGJITk1qSllvNUluQUptQk5EdGljZjRWWTJ6aFN2aWVOdFVRWVJNcG9MYmhReG1wTGNUMUNJQlFjaUl5RlNxWHVTZUU2a2dnTTRlSjgwZmNkaHN3YU1nYm1ad3VkclhtR29JeUpEWTJkbSs3TXBtTnRsQ0Z0YktSMEVLclFzSmx6RTdXcGFWS3diZE1xTWdhYjBKOGtqaU1BYlFrSUpGTE9FNlpXdS83V3kvcjZlNmhjUHJYL2NLVnVhNUdacjhXTThYSzVkdDNPVmErOGRzUEV5R3dxNDdXMFpmN2hxMC9VSW1NUU85T3BGVzFaTWpacE5iZTJ0cFNLTlFCRUlsZktsT2ZVcXJVRTU4K0ZST1J4UFRRV3JMRlNjR3ROR0NrRU1NWjZycU9ValpWdTBJZ244UStRVFhBYXRHU0ltOFVHYS8yVXo3S1pqTFVKWlhKaXQ1SWZ3b1FmbFFFd0JxYkp5UnhwWGE5SE9kOHpob2dnRE9NNGpqelBUVEwxb0I2UTBkS1JDZFNpV0twSjZhUlNYZ0pqbXBsYzhCemhlbzR4QmhpYkdKOXR6YVFkeDFIYUlPZEhUNDZuT0FManlwRFNGTWFtRnFwcXFCWUwxYWhTaFNEbURYcmJwYXllR05sa05OMUJ5UHRDMUlQTlc1YTk0bFZYUWFVK1BUbDdiTytKcXVHTHRiZ1VhcU5OUHVmK3lYdnVLbzdORzJzR2hqcnYzM1h5OFJmUHBESityR243VUdkS01zNkFJNlU5cHlXZm5wMWU0SXlEcGJUditwNWJLVmN0SUJJNWpndGtvbHBnTEdoalhFOHFyWU13SWtScmJjWjN3MUJGc1RFQUNWSXZvWFpNZ0Q4TnByUHpOR3Rvak1sbU1xeXRyYzFxazFDQllWTzdLV0VJdGdSQWtpTVFXVXVHUUdsYnFBVDViQ3BSMmlCU2xXb3RrL2FVTnJHbWFqWFFVZVNsZlFRTGlLVktIWlZxYThrWWF5emc1TlFDR3AxdlRSdGptT0NqRTdQUzZ0WmNKbGFHTVg1MFpEYXNCdTNaVkJTYlNKa2cxcFZRelMxV3RadE9TUStMaFhNak04MkdOU0VSRW5FQVgyQlc4alJhVXk1ZnZIM1Y3LzNCV3pOYUs5SlBmZnV4K2JJdUJtcXNGQkd5U3FYNkI3OTExMkRHTHl4VU96dHpjL1h3Yjcvd3FKLzJ0YUcwSTFaMHRkVmluWElFczdhem84WDE1UGo0RE9NQ2pHbk41eHpCeStVNkFUQ3lNdTJUaXV2VnVyYWdqVTJuVXZWNldJc1VBUnByVzdOK3BSYkcydGdrR2lHUUhCR2c2U1BPaHpPSlpkZkd0TFcxcys3dXJtWWtlZ0YrQ0lnYXhHRGtTcDU4enhneUJIT0wxYlpzS3FHSGo0MWRMRld6NlpReEZDcFRxMGRSdFpMT3BSR0lNU3pYdzJxMTF0dlpwclV4QlBPRlduR2hORGpVWmJSQjVCTUxwZm5aaFpYOUhWRWNhMkx6MWZENDZOeXFudlpxRkFlR2FwR3VCbXErSEt4YnM1SXBXMXlzUFBqWVhzZDFyYldKYXZ1UytSd2dERENxTGU5ci9mWGZlUGtmL3NFYk94Z1ozMy8wMnc4Zk96eFMxVGhSaXFxS0NvdVZYM3psNWErNWZ1UFk2UWsvNjdmM3RuL3dFOStkTGRZZDExR1dWblMycEZOdUpRaFNEa2RqbGkzcnFWWHJzN05GWkl5czZlM3JVR0ZRcnRZUUdVUHlXakp4clJiV1E2M0JHcHZQWlFyRlNoUnJDMENXV3JQcHVVSkZtUWFGQ2hBNWdnR1FzUTJzZzIwMnhhQnhucWFucDRzTkRQUTNkYVRKR2tFTkppNXR5WkwxSkV0a3A0a0kyTlI4cVNYbFNjNk5zUVpnWnJIWWtrNWJnRWpaV2hpWDVncnBmRll3UklSNnJLZG01Z2U2Mnl4WlMxQUwxZW5UazJ0Vzl3TmFTMUJWZXMrUnM1dVc5U1cyRHBsNDRmUkVXZ3BrckI2YnVxSzVVbjNuam8yZERncEdILzNpazZkR0Y3Z1UxaEpuNUhDTWE3VVdCMjYvYWVzSDN2LzZqL3pWcjc3dVZWZjVES29tL3U1WDd0dno5SkZDektaSzRYUmRWNnZCeFp2N1AvRHVPNlpQampLR0s0WjdQM1h2cnU4OWV6eVh6eGhDWSt5bGF3WVhnN3JTMnVGTUFtM2F2UExNeWJGYUVET0daTzJ5b1o2RitmbEtQVW9ZWmROdExmWEZoWG9ZeDhZUVFHdExkbWErb0kyMWxoakR0bXhxYXFGTUFNcmFoTk1zT1RwRGxBVHZUUzRKSUVwd3NYWndjSUN0WExFQ0daNWZSZEV3OTJBQXJMWEdXTjlKYUdGQkd3dUFrd3RWMzNWU3ZxT3RCY0NKMlVMYWN6bm5VYXlEeU14UHphZGFzbzduTUFZVzhNU1o4WUhPMXBUcktHTU5zZ01IUi9wNzI3SVpWMXZOdUhqcTBPbk90TmViejJodEFIR3FIRDUzYXRKWWlMUmVLTmNIZXRzMzlIZEp4L24wdmM5OTd1dFBwN05wWXl3eVFMSTJERjU3Mi9hUGZlaFgvL1I5YjdqbHBvdnphUm1XaXNlT25mbmFKKy9aOWR6eDZRRG5xMnEwSEJkclVXdUwrM2YvOXkxVUxBYjFjR0NvL2FsRDV6NzB5UWRiV3JMR0lpRjBaTnp0YS91UGpreTVVZ0JRTHVPdFhydDg3NTdqbGdrQVRIbk9zdjZPa1ROanNTR0c0SGd5M1pwYm5KeXB4VGFPcmVBOG04NU16aFFJbU5iR2QwVTI1WS9QRkFtWk5nbU5OZmlTSzJPMGFicXZKaWdDd1RLeURISGxpaFZzNWNvVnJ1dGFZL0g3aUNLQUNBeEJyRTNLRVp3aEVSaEx5SENtV0xYV2R1YlRTaHRBTnIxUVJHSXRhVCtNVktScGRucEJjTXEwcGdVUWNqd3hPdVVKUHRqWkdpc05uQjg1TlJIVmc5V3JlbU9sQUhCa3JuaGtkT2E2TGNOQkhBR0FzbkJ5dmx3TzRqQzIydHB0Zzkwc0NwNCtNZlZYLy9LWW0vWmpRMGtLQ2pyKzMrKys4d08vOCtxVlEyMVVMazBmUDdmcnlSZS84Uy9mL3Ribjd6OXhkbkUyaFBscU5GSUs1K3ZhcVBoREgzekxpclpVWWI3YzFadWZyZ2UvL2FkZkJNNkpNY2FaaXVMYmRxeXhaTTVNTGJpT3NIRzhkdDBna2oxOCtJeHdwTkY2b0tlakxlT2ZQRE5HVEFoRzJaYU1kT1RNNUd5b2JSVHJUTnBueUNabkZ3QjVyRTE3UzVvaEc1OHJFVEp0d1ZyZ0NDbkprdVRmRU5sR2tZR1dzbWpIZFZldVhNR1dMMStlYjgwcnJSR0FYY0J6WUt5MUJMRW1UekJITUd1dHRxQUpTclZ3b1ZRYjdNeEhTZ1BnWXJWZUxGWDYydk5ockNKRjh3dWxhckhjMFozbm9CbUR1Vkp0Y25yK29yV0RaS3dodGxDSm45dDlZc2VXWlZvYklnTEd2L3Zpc1EyRFBWMjVkS1NVTVlZc2hvWXFvVXI3ZnQ1UGg5cDg4cHRQSzBEaXpCQXh4RGlNZi85dHQ3N2loczFtWWY3VWdkTmZ1dnZCTDN6NjN2dnZmZWJBc2VtSkdrMVcxV0kxbXEzR3MxVmRYQ3krNzdkZmRlUE9kWFBucG5MNURNdjQ3L3JBM2RNTE5lRTZCcEF4MXBQMVgzM05sa2QySDIwVWk0MisvcHF0ZTNjZm1TdlVHT2RXNnkzcmxoY1dDdFB6SlNhNFJOdlcxeGxXYXdzemk1R2lLTmJkSFcybFNtMjJXQUZrU3V2Qjd0WlN0VDVmcVp0a1J3Ulp3WmtqV2F5cHdmQm56K2RoaUtpMGJtMXBXYkZpT2V2cTZod2FHSWlpS0dFR3cyYTRhZ2lNb1ZoWkRwUnlSREw1cDR3TnRUMDVOcitzcXpXcExZU3hPVFV4UGRUZGJxME5sQzNYMWZqSVRFOWZoeFRvTUZRRUx4dzV2WFhGUU5hWFdoTXg4YjJuVG5Ubi9jR2VsbVJnNlBoMFlmZUowUnZXTHkvWFEwMFVHeHNyR3lockxJQXhpelUxUGxjVndqRUdoUkRGY3UzbVM0ZGZjLzNtV3JIeTRPUDdQL3JQOXoyLzkrem9mRGhabzZtcW5xM0dwVkF0MXZWVVRTOFVLcSs4ODlKZmUvTjFsWFBqWHRwdjZXLzcvYis4WjlmK2tWeExXbHR5cGRCaCtMYmJMNjNVZ3ozSHh4elhNVm9QOXJldlh0bjE0RU43UURyVzJwUWpMMTYzL01EQkU2RUJ5Y0Z6V05kUTc4ekllS2tTeGpFWWF3ZTZPczZNVFllUlNSTDc0ZDcyMHhQejlkZ3FROGFRdGVRN1hIS010ZFdXekJMREhUU21Mc0lvNmh2bzcrcnFZb2k0WWVQNktJcWJOUXRxbWlDeTFpcHJMZG1jSnhMSEhodHJrUjBhbWVsdXlhWmNHUnREZ0VkSEp0dGJzaW5YQ1NKZFYremtxZkZNeG05dHpUcG9IY0gzblo0a2F6Y3U2NDJWSXVCbnA4dlA3enQzKzFWcnRkS0lpQ2p1MlhYVTViQ3FNMStMakNIU2hveWhoVXBZck5TbDBaMzVWRGxRQUZDdWhiM3Q2WGU4Wkp1cVZaN2FjL3JqWDN0dVBxSzVpS2FxOFZ3MVdnaFVPVlNWMEV4VlZha1NyaDN1L3ZQMy80S2VtUU5yYzBNZC8vaTVSLy8xV3krMHRiWEVCcmdRcFBUVzVWMHZ2WGJUNSs1N21uT0JRQ2FLNzdwNTIvNzlKNDZkbWVGYzZGaHZYTm5ma3ZaZlBIS2FjZTRLYkduTlpmT3AwWk1qZFFWaHJGMHBPOXRhanB3ZUpXREtHRmZ5Z2M2MncyZW5pVERXQ1Q4WDVYeEJaSlVsUTVUVWVoQUFFNUpCaERpTzE2OWZtNVR4NFpMdDJ4dDEwQ1VhUmdCclFSTVpBNUhXTGI1RUlDS0lOUkhocWNrRk1yYS9QUmZGR2hrL083TllEOVJBVjFzUXhVRnN4eVlMaFlYaWlsVzlBc21WckJCRVR4ODZmZTNtMVVoV2FRdGNmTzNSWTh1N1d6WXM3NGhqVFFpRlFIMTcveW5KbUxWZ0xTaGpDWENxV0Rzd09tOEMvWmJydDZ3ZHpHdXRWbmFtLy9pWHJoL3F5QjQ5TS8zUkx6OVJONndVbXNXNktvZTZISnB5b011Qm1hN0VvU2FHOUpkLzhBdDVYOFMxS051WGYrVHhBMy94MFcrMXRPYVVCY2E1dzVpTDlnL2Vlc3MzSHQ1OVlteVJTMkdVV1QzVWNkR0d3YnUvL2l3d1NZVE0ycHN1MjdML3lNbnBZbFZJNWpJYVdObFhMWmJHeDJaRFJmVW83dTFzalNOOVptSU9HQXRqM2QrZWR6ay9PallMeU9QbWlGMXJTbXFqbGJIR0xvM3dRSE54RFZwakx0cTJyUUZOdlBqaWl6TFpqRFlHbXozN0pDWTFGclNsTURKWmozdUNHeUpOb0FnV2E5SFpxY1ZOZzExS2FTS3NodnJ3MmZHMVEvMUsyekRTbGJvNmRPamM4dVU5NmJUakNYU2xmUFRBeVphMHUyR3dPNGlWQlpoYURPNTkvTmpMcjExSDFpVHI5YzRWZ3FPekpjWlFNb1lJa1RIRTREdEhSczR0MWxlM1pQL1BhNi84MEZ1dS8vQmJyOXZlMnpJeFYvMnJyenczV1lycW1rcUJyb1M2RXBoS29PcXhMZ1lxdGxndTEzNzVEZGZzdkdKOU9GLzIyeklUMDRYLzhVZWY1OUl4aU1TWUwwVWNCSC93eHVzTGk2VXZQUENpY0YwZ0lxM2Y5dW9ySG5yNjhQR1JSUzZFVm5yZHN0NFZQYTNmZTNZL2N1a0pUSGxpYUdYZnlVT25TeFVWUkZacHMzN0Z3SW1SeVZJOUlzQklxVTNMZXM3TkZtZExkVU9nTFZnaWgyUFdGNkV5Q2RQdVVpa2hLVWtZWTFLcDFQYUxMMm9JWVBYcVZhdFdyUXpDZ0RndVZZc3NnQ0V5MWtaYUM2UjhTaHBMbGlCVVZoTjc0ZFQ0bXY1T1YvSllHMEsrNjhSSVp5N2Jta21Gb1Fwak9IeDhVaXUxY21VUEIvSWtuNjNVSDkxMzRyYnQ2eEZJRytKUzN2dmN1VktwZHVQMndWbzlab3doNDhoNGJLekxXZDUxZ3RnZzhMbGEvSkhIRGo1OGRLSldqdnN6bVRBdzM5bHo1bjk4L01IOTV4WVk1NVZRMVdKZGkwMU42Y0RZUUZOb0lJamlvZjc4ZTk1Nmd5M1h1Q1BCRi8vclQ3ODRQVmQxUE5jQ3VsTFU2L1YzM25IcHVzR3VQL3Y4OTFDNmhxQmFEVysvYWswdTdYeittN3VFNHhJZ1dQUEthN2Mvcy8vWXVibVNkSVNMdEd4bEw0QTVmT2hzVFdFUTZaYU0zOWZSdXV2b0dVS3VyWFU0MjdDczY3a2pJOXF5UUpPeFlJeHRTVWxYWUJqYnhoaWhiV3hzQWdDT0dJWGg4dVhMMXExZkN3Qk1heTJFdk95eUhVRTlaTUJvcVc5cHlWalFSTXFBTnJvejZ3RlpKSWlOSmNERG8zT2M4Vlc5N1VHc0NkbklmSGx5ZG5ITGl2NGdqdXVSbVM5SGUvYWQzclJ4MEhPWUo1am5PQS9zTytFS3ZIcnRVQkJyWlcxazZSKy92WC9ic3JiaDNtd1FHNGFOek5zVnJEUGpBMEJzaURNK1dRci80WWtqZjN6Zm52ZDk3ZW5mKy9Lekgvem1pNmZuYWx5S1FGRnNJRElVR1lvdHhBWkNSY2l3WGc5Lzg4M1h0SFNtVlRXUTdkbC8rZUlURHo1K3FLVTFxeXdKenVyMTRHM1hiYjF4ODhvLy9PUjNhd29KV0JpcGxYMjVYN2gxNjRjKzgyZ3BJRUFlUmZIVm0xYjF0R2EvOGVTTDNIRlRrcVZjdm1IcnlvUDdUODhzMXV1UkRXTzFjWG5mMU56aTZhbEZaQ0tJMU1xZU5zOXg5NTZlSkdSSmdtYUpPakt1VWlyV1ZsbWJGT1BPTjNvWjF1dkI1WmRkNnJxZU1hWkJISEhqRGRlenBKZGo0YndiSUZDV2xJRmFyRnZUd3VGTVc1dXNaMW1zaDN2UFRGNjZla2daYlN4b2k0OGRQTDFob0RmdE9wSFNnYWJkQjhlc05odlc5bkl5YVVjR3luejE2ZjEzWEx5MkxlM0d4bHFFOFVMNHBTZFB2ZnFLVmEwcEdSdHJMUmx0VzMyM0src25MNlNONVFpQzg1bHllSHltUEZtc3UxSkt6bU50ZGJJcHpJQXhwRFZwWXdsc1BZaTJydTE5N1czYjQrbWk0REIxYnVwRC8veWRiRXZHSWxyRUlJemVkdFdHcTlZT3ZPOXpEMHlXUWtTaGpQRWsvZDZicnJyNy9yMjdqczh5SWNoU215OWZmK09PZjMzMHVmbGE1RG5NWjNiTm1qNGgySjQ5SitzS29saDdrbTljMXZmWTN1T2hCbTBwMXVxS0Rjc09uNXVhS1FmS2tqSmtpQ1NEam93TUloTWJTbnhBTXcxdVZwdUJicnp4K3NhSVV1S0hyN3p5aW9IK3ZpUVlYVnBHWkJyc202WVdhY21nUGUwb1l3eGhvQzB4L3RpUk0wTWQrYTZXZEtnMUlUczhQanRmcWwrMGFpQlFxaGFaK1VyMDJMUEh0MjlabHMwSVgyTFc4L2FlbXpsd2J1SzFsNjBQdzBoYkVrSzhPRko4OXRqMFRadDZZMldNSmM2Z0wrZDNwajNKbURGa0V3WlFZeGxEaDNPZWlKOGE2bXlNMVdRMWtRRktFQVZCRUwzbEZaZTRVbFlYYTF6UzMvN3p2Wk56WmVrNmdZR1U1TysrYmx0dlMrYjlYM3Awb2hRUjQ4cGFvOVgvZXNQT1hVY252dkRRVWVFNkFLaFYvS1liZHh3Ym1Yamt3R25mOTNNT3k2WGw5b3RYUGZYa3dkbGlHTVkyaktOdHd3UGxlclR2ekNSd0ZtcmRuazJ0N3U5OGFQOHBRbFpYUmhOb1k5b3lqaU93R21uVjJKSFZ1TTFBZ0loUkhQWDBkRjkxMVZWSmM1d2hvakUybjg5ZmZjM1YxV3FWTlZGMGliQzBoZGphV0VNWXE5NFdENG1JS0RKV1d6dzlVem96UFgvMXV1VkJGQnNDYmZGN2UwOXNYVDZZZHAxWTJjRGc3cU9UTS9QbEt5OVpDVmFuWE80NHp0M1BIc3E0OHZwMVE5VWdOaFlabHc4ZG1YMzA4TFREbVRZMkpYaGZOcFZ4WkxQbmxmeVByTFhHa2pYVTNDRFdjRkVFU0kyb0RzUElyRm5lZnVmVjYwc1RpMmxQSER4dzVrdmYzcFhOcFFOTmF6cGFmbW5IdXNseTdjTVA3UzByc01naWJiU0szdmY2UzR2VitHKy85aUozSEFCUWticDEyK3BsM1cwZi8rNnpLSnkwd3h5MGwrOFlMcFpxeis4OVc5Y1VLdTA3NHBKMUs3KzMrMWlneVZxb2g5R1Y2NWFOekJTT2pzOGJ3TWhRc3RXaEw1OEtZeFZwcXpScEE0MGtMTUViTWxhclZpKy8vTkxPemc1ckxjTUdZb1VBNE9VdnUzTnBJVUpqQldaajh4REVoc3BobkUrSnJDZVVzWWF3cnEwaGR2L2VreGN0Nyt0SSswcFpRbjVnYkdaOHJuVGwydVZSSEVkSzF4VGMrK2pSNGFIMlZZT3RFbXpLRlpHRlR6K3g3NW8xZ3h0NzIycHhuTFR1SjR0aDB2MXA4WjAyMytPWTdId25DMkNTcWhSQmtzMDNIc2trQlJHUVRmWkRJa0s5SHJ6bWxzMTV6eWtYeXE1a0gvdnlVN1hRRUxLVUZNdGFzL2NmSGYzV29SSGdqZ1dzUjRxMCtyMVhicStIK3MrLzlBSUtBUUE2Tmh2NjIrKzhiT00vM1Bka0lWUXBsNlU1TE92TGIxZzNjTi9EKzh1aHFVY21qTlhsNjVkUHpwZjJuSnBFNXNUS3RQanVqaldEOTc1d0pMYXNIbHR0eVZpYmRYbDdXbFpEclF6RnlkVnBVQkkwT2dMR21MdnV1dlA4QmpCcTdyZSs3cnByVnc4UDErdkJraGlTN250c0tOYTJIbHRqOVdCYnloaERCS0VpQyt6SXhPTElYUEdtTGNOQkhDdHRGZUUzZGgvZU5ORGIxNXFKbEk2MEdabXRQdlRzcVpkY3RjWjNtQ2RZeG5VbnlzRy83anIyMm0ycis3SmVYV2tBRUJ3QndaRE5PZExqeWM2bzcxOTBDa3VkK3diT2dNNDNMUUFJNGxoM3RYcXZ1SHI5M0dReDQ4cWpweWZ2ZitKSUpwdTJnTXJBWTZlbnpoVURSemdXc0JyRzdXbisvdGRzSDUrdi90a1hYOURJQ1pqUmRqQ2YrWlViTC8zTXc3c09qTTE1am1oeFdOYUIyMi9hOHRnelI0K1B6QVdhWW0yNmNxbk55d2ErL3RUK3lLSXlWSStpbXphdm5GbXM3ajA3WTRIVnRRVkFyYzFBVzRxc3FjZUpBMGoyTGRybVpCSUdRVGcwTkhUTHpUY2wzQjNOdGFhSVd1dFVLblhublhkVXExWEcrTktjSGxtd3lmSkZUZVY2M0p0elV3NUw5Z2tHeWhDeWIrdzZldkhLL3U2V2RLU1VzWFJtdnZMazhaRTdMdDVBeGlwRE1kRVQrOGRIcG90M1hMdldLcFYyV05aMTkwOFc3ajE0K2xWYlZ1VmRIbWdObU9CbnJFQkNTeTVqRGtPYllDZ0p2bStYUEp4dkNDLzk0WnhWcXVGTHJ4enVUenNMYytWTTF2L1NBeThXYTdHUUFvQnBDd2hNSWtiSzFzTHdpdUgyOTk2NTdha2pVMy8vM1NNZ0pBRlliWHJUL2p0ZnN2UGJlNDQ4Y3VTczc3bXRuaEJHMzNIVHBybEM1WHRQSDFkV0tFMWE2OXN1MmZUQzhkSGprNHNXVUduZG1mV3UycmpxbnVjUGEySjFaWkxvMDVlc1ArK1ZnempXcExRMXRybjZoNEFJT09QVmF2WDIyMi9MNS9QSkZ2dnpYQkdKRXJ6KzliK1F5MllUbXRabTh6V3hRbFpwVzRzdGtSMXNTeWx0Q0NEU3BBbVBUeGYyblpsODJTWHI2bkZzckdYSTc5OTdVaUMvWnQyS0lJeERaVU5MWDM3b1NDN2ozclJqR1NxVmNYamFrYytOemo5NmN2emxtMVowcEp4SUdVUkFna2hyU3pZbGVYdkcwUTAyMHlaT3lRSVIycVNNbm13bFR6Q3NCRnFaZkVhKzhlYk5VMk5GQjNGOHR2aU5SdzZtVXI0eGhJUUp1SzhhcWF4TGI3MXExUTBiQno3NThMRnY3cGx3WGRjU1JKSHV5N2p2dk9XeWh3K2R1bmZmU2Q5eld6d3VqTDU2eC9LZTdwWXZmSE4zeldBUW16Q0tkNjRaeW5uZU4xODRBa3hxUS9Vb2ZObWxHdytQekJ3WW1TSGtrU1lnVUVvUHRhVTQybXFvWW0xVmdwQnFGS0lCQVl3MXZ1ZTk4WTJ2dnhDYjBsaXp6aGl6MXE1YnQvYUdHNjh2bGN1TWkvTVh6WUt5RkJrYmF5b0g4V0JyeXBjczRZZXZ4UWFSZi9YNXc4dmJXN1lPZFFleE5zWUdtdjdscVgwN1Z3OE50R1VqWmNMWWxnTDkrZnNPYkYzVGUvSGFMaHRyWDJMS0VmdW5DaytmbmI1cHVMOC81MnREREhHeEZrYkdPZ2hiZXR2b0FqSk5Cc1NRMkJJVHdRWHdBaUZZc1ZKN3krMWJobHF5VTFPbHRxejgwZ083SnVhcXJ1c0FNQU5RajQza2NNUGF6bCs2Y3RWY09mckxldzhjbWE1NW5tT0JnamhlMjVuN3Rac3UrKzdCazEvZmMxeTZUb3ZISGFLTDF2ZGNlY25LVDM3bHVlbHlWRk1tMUxvM243bHB5N3JQUDdhbkhGbExFTVJxUTMvNytvR3VMenk1bDVpc3h3bFl4M3FDRGJiNXBYb2NKL3NwRzM2cnVXeVZzWEs1Zk1VVk95Kys2S0tsVmRjTkgzRGhaTkk3M3ZGMmhnaGtteXpNamFWK3lsQ2tUVFhTQ0haMWR5NVdpaEJpUTZHRjJWcjB0VjFIWHJkenN5ZlFFbG5ManM4VXYvM2lzVmZ0MkNnWWFHdERiVWNYNnArNy84RDEyMWVzVzU2M1NudVNwUng1WXFIeXhKbXB6cFJMUkp5eDJXcFFDbUl5dEwydm96L3JoN0ZoQUV0VmxBUnluQXl2SlNaVmNsYXFCRHZXZGIvOXR1MW5UczZuSFRaZHFuejJ2ajJwbEtjdEtFc3RIcjl1dVAwWHRnL21VL0x1NTg3ZTgrS1lJaVlaaTdVSm8ram0xWU52dW5MYjNjOGR2Ty9nR2NkemM2NlFSQnRYdEwzOGxpMmYvZGFMSnliS2RVMUtXd0gyZFZkZjlPRCtFL3RINXhEUldNTlJ2L0dhYmZjOGQzaThVSThNaE5vQ29WSjZWWGRHb0syR0tsS050WlJMS0MyTERUdi9LMjkvMi9jdnVyK0Fyb1p6YnEyOTlwcXJyN3J5aWxLNWhBeHQweFZZQzdHMWtiS2hwa0l0SEdqMTJ0Sk9ySXkxVkZVYW1YajgyT2gwb2Z5R25WdUNPQ0lpWlBMQkl5Tm5ad3V2dTJ5ajBjcGFpQzBkblNoKy9zR0RkMXkrYXNOUTNzUktjUFNsbUtsRmgyWUtDVHFvcnZYeHVRTGpUQks4WnR0S3NscFo0azJzakQwUG1DRUFFSXdWSzJGdm0vZlh2LzZTeGJGeXFWRHY3Mi81eDN0M3pSUkNJUVVEdUdTdzljb1Y3WUJ3MzZHcHI3MDRNVnZWS2M4QmhHb2N1Y3krOWJKTmw2N3MvK2dqdTU0Zm1VMzdYb3ZMcFRVYmxyVys3cll0WC9qMml5K2VtSTJJdExGS3hhKzVmTlBZZk9rYnU0NHhKb2lvRmthdnVYelRmRG00Zi85cHhtVXQxc1pTYkd3K0pZZmFVNHUxS05RVUdSc25DWEJ6OUpvalZpcmw3ZHN2dXYyMmx4RFJoZHl0N0lkWHpMejczYjlodExtQVJUMUpDQ2l5RkNwYmlVd1F4eHY2VzZ3MUZraHJxRWFLZ0gveThiMGJCcm92SHg2b3E5aVFSU2IvNWRuREtVZSs3S0sxU2l0clVWazRNRnI0d3NPSDc5aTU4cExoampoU0NSbFJBM2NLVmdyeDNPaFVYWnRRbVhWdDJiZnZYTXZJVkNPRmtHekh3bVM5T1dkTUd6dGJxS3dmekg3aXQyNkZoZHJwMHpQTGw3VS9lV0xxaXc4ZGJNbWxqQVZrYkxSWWYvRDQ3R01uNStlcUt1Vkt5VEZRdWg3RzIvbzYzblhkSlZVVi83L3ZQVDlhcnVWOG1YTTVhblhKbXM0MzNMN2xjL2Z0ZS9MUVpFU2dqSTFWZk9lMnRmbDA1aE9QN0NIZzJsSXRVcGVzNkxsMGVPaGpEKzB5d0t1eGlUUVFvTEZtZlg5THFGUWxNb0dpeUZqVFJDdzJMRHhpR0VidmZ0YzdwWlRXMkIvTEhaMTRndUhoVlU4LzljeXAwNmQ5MzE5YWh0MWNFMG1jb1NYYmxmTzFoZmxLSkRpekJJeGhvTXpVWXVFdFYxKzA1OXhFT1ZTSWFBZ09qVTNmdm5XMUs5alI2WG1HbkJDblM4SG9kT21PUzFjS0JzZkdTNHp4SmQ1ZXdkaGlyZTV5M05yZk9WOEtWbmZrdGkvdktFYlJUS2xXaTNXb1RCU2JVQm1sVlZlTDk5WmJOdjNQbDIydlQxWk9uWmxmdWF3OWR2bTcvdmFiR2pnVGdqRmhDQ3V4UVVSWENvWVFhUk1wUFpCTHYyenp5blc5N2Q4NWRQcWhFMlBTRVdsSHBBUkhvMTU2K2NvN3JscnpxWHYzN1Q0MWI1QVJXYVAxalJ1V1g3cDYrVWUvKzJ3cE5BU29TYmY3em0rLzlNclBQTGIzOE9TaUlsYUxEUUdFc1Y3ZTdpL3Y4R2ZMWVMyeWRXVWlaWFZpZkNEQmdyTkt0YnB0NjlZLy8vTVBJdUlQYkZmNndRVU9DYm54NDA4ODhkS1h2aUtmYnpGTC9FM0lHSUFySWVQd3JNZmJNbTQrNVQ5MWNpN1FKQkE1WnptWGF4MjljdnVhbmNPRGYvS054NVhsaUtBdGRhU2RkOTZ3L1lrVEk5ODdNaXFGVkVSRzI5WVV2K3Z5VlZPRityZDJqeW9MamhUV0dBSUx4cG80L3RXZG15N3E2NXdwMVhJcEo5dml6Y1h4eWZueWRMbHVDRnF6M3ZyQnpzMURYU21DMHllbnE4WGErcldkcHNWOTl6L2NQN1pROTN6WEFrUGt5QmdBYUV1eE1SeGhJSmZlTWRUZGxVMGRtbHg0WVhSYUFXVWN4K1dBMW1ZZGZNdXRtNWIxNWoveHJiMmpDelhnakFGWlk2NWZQM1R6NXRWLzk4QnpFOFdBTVFGb3dLZy9ldlgxaDhabS91V3BnOGpjVW1pMHRkcVN3K2phZFoyVklKcXZxbktvcXJHTkZKRmR3aDBENTN4K1llSExYL3JDWFhmK2lMVStDWDA5L3ZEbWtqZSs4YzFmditlYkhlMXRqWjNXeVNWTlZpVzVQT3Z4N3B5bkRENTljczZSRWdBa3g2ekR0Rkh2dk9IaXJPZisxZjNQU2VGWUFrVzJJK1c4NDdxdHo1MlpldUR3cUJSQ1c5TFdNS0lidC9hM3B0M3Y3aHNmTDBTZTVBQ1dqREZHQzdKdnUzemo5djd1K1ZKZEc1dkx1Sm0wNDdxU2NRU2dPTEtGVWxDdFIrMzU5Tm8xblNjV0Y5LzMyVWZtS3lxVFNXa0x4SGhTUkdJSWVjOVoxcHBkM1pIM3BUZzVYemd3dVZDTmRkcHpYSUVjU01kcWZYL0xtMi9kdUZBT1AvL2dvYm9pWU1nQXRGWTNiRmgyNDZaVi8vVFFydEhGdXVRQ0dNUlI4TnUzWFU0SWYzM2ZzNXk3cFZESGhnZ2hpdFVWdysxcEI2ZUtZU1V5NVVoSGNjS1hTT2VaRW91bDY2Njc5bHZmL0ZyQ25mTUR5MHAraEFBU1NzdGp4NDlmZmZVTlVzZ0V0TkpjRXdWU3NKUmtXWmRuUFRiUW1qMDdYejg4V2ZKZGg0Z2NnV25KbU5XL2M5dmxpN1hvbng5OTBYRWNTNkNzYmZQbE82N2RkblJxNGVzdm5tS2Nhd0pMRk1WcTQwQit4NnF1bzVPbEY4N01hMk1sUTdCV0cyVzF2blg5NEIyYlZtV0VyTlRqSURSS0dXc3M0K2dJMXByeitnZmJqTS92MlhYc3N3L3N0WXg3bnFNc01PU2U0K1I5cHpQbGRXWlNPZCtwaE9yMFFtbWtXSW1NU1VucENNWVFsRkk1bDk5MTZmSWQ2M29lZW5IMDBmM2p5VjVpZ1dpTWV1bEZ3eGN2Ny8zSGgvZE1sZ0lwQkdjWVJzSGJydG0yb3J2MXo3NytSRXk4cG15b0xDRFdvM2hkVDNaTlQzcDhzVllOYlRsVWRXVWIyVzhTdHlYWmI3MzI4RU1QYk45KzhZL2M0ZkFqQkxDa0JIL3lKMy8yd1EvK1JYZDN0OUtxc2EyV2dIRjBCY3RJbG5WNUxpVjZXdE83enhRbXk1RXZCU0I1Z25zY1hBYS9jOXZPMDdPTG4zbjZvTys2RmxCYm01WDhMVmRzbks4R2QrODZwaXh5emkxQXFIVE9FNWV1N09BTUQ0d1VKb3NCdzJTeXhBWlIySlB4cmhqdXUyaW9wemVYOFNVWG5CRkNSSHFtRnV3ZG1YM2k4T2o0UWpXYlNRR2lKdkNFV051Wnozb09aN3l1OUd3dG1xM1VxN0htbkxtQ1M0NEFwSlNXU0pldDZYcko5bVhsZXZ5MXAwNk5Md2FlSXdrc1dKS00zckJ6UTNkTDVwOGYyYnNRS0VjSWpoaEV3WnV1M0x4dHFPZFA3M204RWxOb2JUMG1BSWkwNlV6THk0YmJab3ExVXQxVUlsMkxUZFRZTE5hSS9ZVVFzek16NzN6WHIzL29yLy9mVDdGQll5bjZDY1B3Mm10dlBIbnFURHFkVGpnV0VZQUI4c1FRT1N6ajhyYXN6S1hjcDQ3UDF4UTRuQUdnSjhCbDRFdjg3VnN2UHoxVCtOeXpCejNITlFTYWdKRjUxVVhEN1ZuLzdoZU9UVmNpejVISnZJM1Nwai92cmVoTWx3TjFmTHFzakVXeURDaldLb3FWdzFocjJtdk51SjRRa2RZTDFXQ2hHaXB0MDc3blNHRUpDUmtCRTR3NUFtTkxzU0ZOSkpCSnhpUm5qSkcyVm1uamN0aTZyTzJtYlVPdUZBKzlPTEwzekJ4d3poa3l4RWpwbnF6M2xxczNsK3JSNTU0NkdGdkdPV01JVVJUKzBwV2JMMTdSOTMrKzhmaENvR1BDdXJKQW9LeDFrYTVkMTFXUG9ybEtYQTFOUlpsUWtkSFdOck5FeGxnWWhwMGRIVTgvL1hocmEzNnAzUER2RXNDU0VqejIyT012ZmVuTFcvTDU1Z2JaeHFwc0tkQ1RtSFZFeHVNZE9aY2hQblY4M2lJWGpDR0FLMUVncFFUN3pac3ZuUzVXUC9YVUFTWkVBcUtQWTNYMXF0NmRxL29lT1Q3NjNNZ2M1NElqa29WWVcwVHFiWEU1WjFQRndGSXk1a1FNa3M2RU5VbGN6VUN3QnRFWFdiREFHcnNsc0VFVXgxamloWkVJTFZtbERZRnRUenRibDdkdEgrNTBCWC8rK016ekoyWmpTNjdnQkVoRXBOV09sYjEzYkZ2MS9PbkpCdzZlRlZ4eVJFSlFLdjdWNjdhdDZtNzdpM3VmS29VbUpneTF0Ullza05YcTZyVmRncG5wVWx3TlRUVXlnYlpLazcwZ3hlS2N6OC9OZmZuTFgzalp5Kzc2Q1p1c2Zxd0FsbVR3UC8vbjcvL05oei9hMDlPdGxMNXdnTktSTENWWjJoRVpsM1czdW1FTXo1eFk0Rkl3UkVSeUJaTklFdWszcnIvRVd2ajd4L1pFRmhoamhpaU0xZksyekoyYmx5L1c0KzhjSHBtdHhiNFFETUVRS0VOQ0lDTXdqWTNadGhsS04yUGh4cWdWTkJhUUlrTUdqVEhRcEZMUndNWUNaOURpaXhWZG1VMkRyWDN0NlhJOWZ2SDAvT0d4UXFTdDY4aUV4QzNTcWpQdDNMbHRkVzgrODQzZHg0NU5GMzNYNWNBc0dBYm0zVGZ0eUtYY0Q5MzNURldUSmhhb1pQWVF0RkpYck9uTU9qaFpES3FScVlZbTBEYldsS3k1VFI2T2xETXpNMjk2MHhzKzhmRi9Ualp4TG9FL2YzaVBHRkVTNVAvb0phb1VSZUdOTjkxNitQRFJYQzdYakVxVFFYdHdKZk1reXpveTQ3S2V2RmVzNlJmT0xrb3Brd0V3bHpPSEFWbjl4c3MyOWJlMi9PUGplNmFyb2VjNG1teXNMUWU2ZHJoM2JWZmI3ckc1M2FPemtTRlBDb1lKSm41cGtvRWEwNTE0d1NKcndLVHYyalMxaUFtM0ZBTlhzTFFuMnRKT2Q4N3JiVXUzWnR4WTIzTno1YVBqcGVsaWlNaGN5UkhSRU1WS2V4d3ZXOWw5eGZEQXlabkZCdzZjalN3a2J5QlNjVmZHZS9kTk8rWXJ0WDkrN0VVRFRCT0VxZ0VYaWFMbzh0V2RIVms1dmxDdmhMb2FtVkJSZ3I1YXFxQnp6b0phdmFlMzU4a25IdjBKeHVmZldPVFdWQUxMT2R1Ly84RDFOOXdpcGVTTVdicGdtUjVEUnpCZllrYUtqTWY3OHQ1OFRlMDZXNUJDSkZvc09YTTR4WEY4NjRZVjE2OWQrYTk3amp3L011MjdyaVV5QnVxUjZzdDUxNjd1eTNoeTEramNrYW1Tc3VRS3pwTHgyS1FHdEhUT0JJN0FyQ2RhVXpMank4YktReVRPbU9UTWtkeVh3cEdjSVVYYWx1cnhUQ21jTEFhRm1qS1dITTZsNEVoZ0xJVkdTNGFiKzFxdlh0TVh4dVo3UjBiT3pWYzgxNUVNR1VJUVJUdVdkYi9weXExUG5SaTU1OFhqWE1qWVlLUWJFeFp4RkY4NjNONlZjeVlXYTlYUVZpSWRLaHRwMHViQzhTOEVnSEs1L0ozN3ZubnR0ZGY4bS9zOGY1SUp1dEFRZmVZem4vM1ZYLzJOcnE1dWJYU0RhNks1U3RVUnpKY3M3YktNeS90Yi9mbEt2UHRzZ1F1WmhLK0NveU14aktOTjNlMi9lT25tUTFQelg5MTdOTExnQ0drTmhOb1lxOWQwNXJZdjYrTElEazR1bnBndDFaVVJuQW5lQUcwM0pkRmd3UlljSGNFOXlTUm55ZEx5QkxtdHRBMjFEV09UN01OR2pwSnp5Uk9PRjBycXcybEhyTzl0MlQ3VWlZalBuNWsrTkxtSW5QdENjSVJZSzRuMjFSZXYyNzY4LzB2UEg5dzFPdU01YnFDTU1zbDRLV2lsTGgxdTc4bTVZd3UxU21TcW9XbWN2clhOQmZkRUJGS0l5YW1wdi9qekQvN083N3kzYVh6K3d4dTFreWQ2NzN0LzV5TWYvWWZlM2g2bFZLTjBrZXpYNE9odzlCMldjVVhHWmIxNXR4TFFjNmNYTEhLSHMyUzN0Q09ZTWlycjhOZHQzOUNSOHIrODkralJtVUxLY1JDWnRoQnFnMlJYdEdjMjliYW5YVEZlckoyYXJjeFVBMjBwMlZqSm9BRVdnT2F3cTIwT2lpMVYyeEdSSVRER09FdGNCVmhEeXBBMkpCaDBaLzExdmZtVkhibGFITzhibXo4NVd6S0F2aU1rTWlJVHh0SDZycmJYWDdheEdFVC84dXlCeFVBSjRVVGFHbXNaZ2paRVZsKyt1cU1qTGNjWDY1WElWQ01keERiV3BFeGpZaTE1TTFMS21abloxLzNDYXovM3VVOXByWVhnOEcvdGl2OTNMWFJPY0tMVzJwZTk3SldQUFBwNFIyZEhyQlJMRnN3QU1nVE9RWEpNU1paeFpkcGxQUzFlcE9pRk00dDFUYTdrbG9naGEwYmk2dkpsUFRldFczNWl0dkRkWStlS1FlUklCd0V0VWFnTVdkdWQ5VmQzNW5wYlV0clNaS2srVWFvdDFLSkFtYVRpeEJHVGcwNytiMm11b1ZIMUpVaUdseTBSQS9BRmI4OTRnNjNwZ1h6YWxYeTZYRDg2VlpnbzFRSFFkN2xBUm1URE9HNUxPWGR1WHIyeHIrdUJ3eWNmT3prbWhDVGl5bG9paTRpeE1wNkF5NFk3VWhJbkMwRTFNclhJQk5yRUdwS3hjOXRrWUpKQ0ZoWUwyN1p0ZWZDQjcvZ3AveWN2VWYwK0FRRDhHeXZObDlicnpjL1AzM0x6YlNkT25XNXBhZEZhTThERUZqWDFBRktDcHgyUmNyRXI1d3JPOTV3cnpGWml6NVdKR2VlSWtyTkF4Vm1YMzdaKzVkcXU5dWRISnA4OE0xR050U3NjaGtpVTJBcmpDZGFUUy9YblUrMXBUekJlajNVeGlFcEJYQWxWWGVrNGdYdGNRSEdhN05hVmdxV2t5UG15TGVXMnA3eTBKNHloaFZvNFdxaE1GT3AxYmFUZ2JtTmRCTVZhK1lKZnMycmdtdFZEWnhkSzM5eC9mTDRlZVk2VHJDbE1QbGtRcTg2TWMrbHd1OUZxdWhUVkk2ckdPdFEyd1NiWjh5Z3FFRUxVcXRXT3pvNkhIL3J1c21YTGZtQnAzbzljNGZZRG1URDltOHFTT0lQVHAwN2ZmUE50aTRWQ09wUFJXaWZMaFZteWFJeWo1T2h6bG5GbHlzRzJqTXlsM0dPVGxaTXpWU2xFQXZ4S3RzOFRRcWpVeXRiTVRXdVc1M3h2OThqVXJySFpjcXlsNEpJekpESUV5aVRqN1poelpYdkthMDA1V1VkNlVnZ0dDR0FJVFlMMlFHQ0FnaUV5U0lLb3lKaHFwQlpyOFh3MUtOYmoyRnJPbVNNNGIxVG9kS1JNaThPM0QvWHNYTjVYajlVRHg4NGVueXQ2MGtGQWxjU3dDTWFTVW1hNE83TnhJRnNOb3ZtcXFrV21GcGxRa3pLTjAxK2EvMDNXWDdqU3VmLytiMjI3YU51L2M1bjVUMkdDZmtBR2UvZnV2ZU9PbDRkaDZLVlNXaHRvc0FrQkFuQ0Jnak9mWTlyaEtaZmxmTkdaOWVjcThiNlJRbDJSNTRqbWZENEt4bUpqdE5IRDdTMVhMdTl2VDNzbjV3cTd4dVltcXpVQWREaFB3cHdFbjJxU3cwWVNqRG1jU1piOEFEWlFURVRha2pLVUVJQXFtNWdnRkl3SndSaEx0anpiV0ZzRTI1UHhkd3gyYis3ckxJYlJFNmZHanM0c01DNGNMa3h6RHljRERKVjJPRnkwckxVdjc4NldnbUpnNnBHcHhTWklqdDZTdGVmdlB1TmNSYkcxNXV2M2ZPVzZhNi81OXpqZW55NEsrcEVPK1ptbm4zMzVLMTZ0amZGVHZ0SjZ5U2N6QU00YkMvZFNrcWRjbm5KWVY5Wmp5UGFQbGNZWEF5bTRZSmhZUFliQWdNWEdHR3VYNVRNN0Jyc0c4OW1GZW5Sa1p1SDBmSGt4akN5QjRFd3l4dG41aUtpQjhLWW04VVREZ0RhY1FwUGpvUUVuME5ZcVl3R28xWE9HTzFvMzliWjFaVktUcGRvTG8xT25GOHJJbUNkRUF6dEN3SklLdGpiOXJkNldvUmFPTkZ1T0drWS9OcEVobGVERHpnL2JBZWNzaW1LdDlKZS8vSVdYdk9TV24vYjBHMUZRMHdQOGRESjQ2cW1uWHZPYTE0ZFJsRTZsdGRaTHhNZEpmc0E1dWdKOHdYM0pVMDZ5eGMyZEtrZUh4a3UxeUxoQ0xKRkVKWHhTeXRqWXFMem5yT25JcitscWJmWDlVaENORnNxanBlcGNKYWdyYllpU2hJc2hOdWkvbW1zV0V4YVN4Q2FZSkY0Z3l3QlRVblNrdmFIVzNNcjJscmEwVndxajR6T0x4MllMQy9WSUN1RnlsdkNLTFBGaGhFcG5YTDVwTU5lWGQ0dTFhTEdtNjdFTlloTW9FeHZRSnFFbk9iOWhSSEFlQkFFUjNYMzM1Mis3N2RhZjRmUXZERVB4cC9xMTVNVmVlT0dGVjczcWRjVlNxU1diVmRyZytkWVpjRVRPVUhMMEJQcFNlQTVMTzlpZWRUa1RwK2RxWjJhcnlvQWpPR3NRQ1RjeU8wc1VhUU5FYmI2N3JEVTNsTTkwcEgzR29CYXB4U0FxMUtOaUVGVmpGV2pUSEh3Z3dzYXFKOG01TDNqYWtTMmUwK1o3YldrMzQ3bUlVS2lIbzRYS21mbnlmQzJ3QUs0VWdxR2xoQTRHR1lBbGlKUnhCSzdxU2c5M3A2M1Y4NVc0R3BsNlRFRnNRdDJjT2pwUGJBaEFKSVNvVkd1ZTUzN3B5MSs0L3JwcmY3YlQvNmw5d0EvTDROQ2h3Njk5emV2UG5qdlgzdDZlVFBvMVN6WEFBQmtEd2RGTkNMVWw5eHpNZWJ3MTVRWWFUcy9XeGd0MWJjZ1JJb2tuQ1lBUUVub3BiVzFzckNYcmNwYjNuWTYwMzVIeVczMDNKYVFVVENSSk1KeWYrMjlRTFZoUzFnYmFsSUp3cmg3T1Z1dUZJQXFWQVVCSGNNSHdQQVVNSWdKWW9saGJ3V0JaZTJwMWQ5cVR1RkFOeTRFSlZiSXMza1lKdW0wcDJHK0d2RkxJUXJIWTJkbjVsYS9jdldQSEpUKzUydlB6TjBFLzRKUEh4OGZmOFBvM1BmdmM4MTNkWGRxWWhQeDRhWjhMWTQxTXplWE1rOXdWNEVuVzRzdXM3d1RLaml6VUp3cGhvSXpndkZIR1crTC9hZExjSloyL3BCekxFUnQrdUxFbmlpVm5tdGg2Wll3eXBNa1NJRWRNL0FjRHZDQmd3UVp2cUxIYVdNOWhnNjJwRlIzcGxBT2xlbHdLZEtCdEdOdFFtVWhUYkJ2amRvMDhDeHRrTWx5SXVkbTVyVnUyZlBHTG4xKzlldmhudnZzL1hSN3drMlZRcTlYZStjNTNmKzd6ZDNkMmRqS0d4cDRQYlpNZ0hSa0lEZzVqcm1DdVlKNWtubUF0UHMvNk1qSXdYWTdIRit1bHVqWUFnaVgwVlUyT0tJUW1CVjdEVWk5eDc1em4vbXF1VzAvczJBVTdjeHFscElSeGlZQWFlSGVFRmw4TXRhWDY4cjdEcVZTUFM0RUtOVVE2T1hvYkp6YUhsa3ArQ2RVbk1jYUFZRzUyN3BXdmV2bkhQL1pQK2RiOFR4VngvbVFOK0trRnNMUXNkeW5wK011Ly9Lcy8rWk1QU2lIVG1aUldtckRSbDJ1QUlMR3hrdFhoek9Yb0N1NG1CSWtlei9vTzQ2eGMxMU9sYUw0U1ZVS2RUQVZ6MWlCT09yK1U5SUtxU1pQZEM1ZmdvL1JEbHBTYTRaQzF4QmhrWE5HWjlmcnlYa3RLV0d2S2RWVUpkYWdwMWpiU0p0WVVXOUlObTNOQkpSQ0JDSVRnUVQwTTZ2WC8rYjkrOTMvLzd6OWF1bnovbm16clAxb0wrcEduZitHTE5iZTFzSWNlZXVRM2Z1UGRJK2RHT2pvN3JEWDIrNGk0RUJ0Ym9VRWdTbzZPWUs1Z0RvZEdPYytUdnNNQnNCS2FoVnE4V0luTG9RNVY4aVRJRUJpeVJnQUVTNmtqWGdnemE5U0lFb3FlSkxKazRBcVc5V1Y3eHVuSXVsbVBNNkFnMXBWQUI3R0pEVVhhUnRyR3htb0wyb0JKNmhoTEZoOGI5SWFNODRYNWhkNmVubzk4NUVOM3Zlek81TkNhNFA3L3NBQitaaC93STkzeTFOVDAvM2p2NzM3bHExL1A1bktlNTJxdHoxL2Z4cGhzbzR6S09VcUdEa05Ib09STWNPWnc4Q1QzWGVFN1hEQ01EZFVpVXcxMUpkUzFLS2tCa0xiTkNZRm1NTjdrdTBPT3dCaEt6bnlIcHh5ZTgwVFdsMm1IT1lJWnNtRnM2cEVPbFkyMVZRbDhVMU5zU1ZreVNSc25TYThRR20wSUpBQVFYRVJ4WENvVzc3enpwWC83dDM4OU5EVDBIelQ2UDlJSElQNU1IdnpIdVFRQStNeG5QdnVCRC96cDFQUjBlMXRiOG5XNHdEZzNHZG1RTWVDWXJFcHMrRXpKVVhCTXZ1Sko1Z3JtQ01ZNVF3QURhQzBrZEdIYVFqSjRjdDdITU9RTUUrYmdoTm5NV0J1Zk4rdWdEUmxqbFNGbHJMSldHZExKOUllMVpKdEx5SnNFcXdTVUlLZ1dGd3R0YmExLzlFZnYvL1ZmZjhjUG01MmZod0IrZmhyUTFFUkxSSXp4MGRIUjk3Ly9BMS81NnRlRUVObHN0cmtqcERsNTBDQW5UV2dTR3lWVnpsQWdDb2FKSzA3T2xDRndoaUw1TG1lQ0ljZkdXdXJFOXlaMDVJM0JNUXZhV0cxc011SnBMUmdDWTYxcGlNMXFDOXFTb1VibnNzbC9kdUU0U0dKeldLVmNqZUxvNVMrNzY0TWYvSlBWcTRjYkF5MC92cmYxc3d2Z1owakVmcklJQUhEcHB0eC8vM2YvOUUvL3ovTXY3TTVtMHFsMHlpU1ZsQXRlRGh0YlF4UG9ZMEtianh5SkkzTEdlTk5lSmQzMlpPOVQwN012cmJ4b1pzT051S1hCMDZpYnMwM1drckZrQ0t5RnBVb0dOVmM4SWdFdHBVS0luTE42RUpUTDVZdTJidjNEUDN6L3kxOSsxMy9HeGI5UUFNbW9CdjdjbjNySk15dWxQdm5KVDMvNGJ6OTY2dFNwVENicis3NjFwa0ZVMXpSOVM1RW1Oa09jcEtyREdERTQzd05nU2RiTWFLa0ljWjdnc1RtTjNneFZtN044aEUwaTB3dnR6QVZwYmNKQXh4aGpMQXlDY3FXeVlzV0tkNzN6MTkveGpyZjd2ditmZFBIL28xSFF6K0FWQ3NYaXB6LzFtWTk5L0pNblQ1NUsrWDQ2azA3YURQUjlJMGpOQ2c4MXVKT2I4REpzN05iRkM0TFFDOTgyd1FVTFdwcFR1ZWZieWZDRC8zWEI2eVdIVzYvVmEvWDZ5cFVyZnZsdGIzbjdyL3h5ZTBmN2YrckYvem5rQVQrVktpek5oQlNMeGJ2di90S25QL081QS9zUEFrSTJtNVZTMm1Rcy8vdW53ZURDemV2bkYwazIzeW5TRDBiOHRQUlRkQUg3N0k4aVlnWUF3T1RLNjFoVktoVUMyTGh4dzV2Zi9LWTN2dkVON2UxdFNVVEhPZjhad3NyL2YvQUJQMVlNeHBna2dJdmorTHZmZmZBTFg3ajdzY2VlbUo5ZmNEMHZuZmFGRU5TSWJlZ0h6dzB1SkZpK0lDLzd3ZS8vZ0hIQkM5MVM4dnNKSUY0ckU5VHJZUmkydHJWZWM4M1ZiM3JUTDk1MjI2MnU2eWEzL2djUTVQL0pBdmhSMk5EL1pERllJUnA2ZmVyVXFXOSs4OTV2MzNmLy9uMzd5Nld5a05MM1BjZHhrTEVHYVJIUmozL3ZQMFpNUDZSRVNmdllFc1Z4SE5RRHBWVkxOcmQ1ODZiYjc3anQ1UysvYSszYU5Vdlc4ci95NkMvVWdQL1NsMXd5U2t2MkZ3QU9IVHI4NktPUFBmcklZL3YyN1orY21vN2lXQWp1dXE3ck9DTFpSTlEwNCtmTFFEOUNPNXFOOElTRjNGcHRUS3ppS0l5VTF0S1J2VDA5VzdkdXVmNzY2MjY4OGZyTm16Y3R0YnVUWU9HLy9od1NEYUQvaHBlOW9OZHZMUzBwQkFBc0xDd2NPSER3aFJkMjc5Mjc3K1RKazFOVDA1VktWU21WQkNxYzg4YS9sb29TRGF0UDFscHJyTEhHbUFibHFaUWlrOG4wOVBRTUQ2KzY2S0p0bDE1NnliWnRXenM2T2k0TUVDNjhCUDh0RDZUemhlNy90a2VEZ2NBMllzR2xyNGRST0RZNmR2cjBtVE9uejU0OWQyNWlZbUptWnJaUUxKYkw1U0FJVkRJS0RjUVlFMUw2dnAvSlpQTDVsczdPenNHQi9tWExscTFlUFR3OHZISm9hTWozL2U4WHVXME1DdUYvNTZkT0h2OC90bXBJZzhpY1djMEFBQUFBU1VWT1JLNUNZSUk9IikgIWltcG9ydGFudDsKfQoudmZyYy1hdmF0YXIgaW1nIHsKICBvcGFjaXR5OiAwICFpbXBvcnRhbnQ7CiAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50Owp9'
          }, isEnglishPage ? {
            title: 'Tinnitus Assistant',
            description: 'Questions about Dustin’s story, approach, and sources',
            header: { title: 'Tinnitus Assistant' },
            banner: {
              title: 'Tinnitus Assistant',
              description: 'Questions about Dustin’s story, approach, and sources'
            },
            inputPlaceholder: 'What would you like to know about tinnitus, Dustin’s story, or his approach?'
          } : isFrenchPage ? {
            title: 'Assistant sur les acouphènes',
            description: 'Questions sur l’histoire de Dustin, sa démarche et ses sources',
            header: { title: 'Assistant sur les acouphènes' },
            banner: {
              title: 'Assistant sur les acouphènes',
              description: 'Questions sur l’histoire de Dustin, sa démarche et ses sources'
            },
            launcher: {
              label: 'Assistant sur les acouphènes',
              title: 'Assistant sur les acouphènes'
            },
            inputPlaceholder: 'Que souhaitez-vous savoir sur les acouphènes, l’histoire de Dustin ou sa démarche ?',
            aiDisclaimer: {
              text: 'Les réponses de l’IA peuvent contenir des erreurs.',
              hide: false
            }
          } : isDutchPage ? {
            title: 'Tinnitusassistent',
            description: 'Vragen over Dustins verhaal, aanpak en bronnen',
            header: { title: 'Tinnitusassistent' },
            banner: {
              title: 'Tinnitusassistent',
              description: 'Vragen over Dustins verhaal, aanpak en bronnen'
            },
            launcher: {
              label: 'Tinnitusassistent',
              title: 'Tinnitusassistent'
            },
            inputPlaceholder: 'Wat wil je weten over tinnitus, Dustins verhaal of zijn aanpak?'
          } : isRussianPage ? {
            title: 'Ассистент по тиннитусу',
            description: 'Вопросы о личной истории Дастина, о его подходе и об источниках',
            header: { title: 'Ассистент по тиннитусу' },
            banner: {
              title: 'Ассистент по тиннитусу',
              description: 'Вопросы о личной истории Дастина, о его подходе и об источниках'
            },
            launcher: {
              label: 'Ассистент по тиннитусу',
              title: 'Открыть чат'
            },
            inputPlaceholder: 'Что ты хочешь узнать о тиннитусе, истории Дастина или его подходе?',
            aiDisclaimer: {
              text: 'Ответы ИИ могут содержать ошибки.',
              hide: false
            }
          } : isJapanesePage ? {
            title: '耳鳴りアシスタント',
            description: 'ダスティンの体験、アプローチ、出典についての質問',
            header: { title: '耳鳴りアシスタント' },
            banner: {
              title: '耳鳴りアシスタント',
              description: 'ダスティンの体験、アプローチ、出典についての質問'
            },
            launcher: {
              label: '耳鳴りアシスタント',
              title: 'チャットを開く'
            },
            inputPlaceholder: '耳鳴りやダスティンの体験、アプローチについて、何を知りたいですか？',
            aiDisclaimer: {
              text: japaneseAiDisclaimer,
              hide: false
            }
          } : isKoreanPage ? {
            title: '이명 도우미',
            description: 'Dustin의 이야기와 해결 접근법, 출처에 관한 질문',
            header: { title: '이명 도우미' },
            banner: {
              title: '이명 도우미',
              description: 'Dustin의 이야기와 해결 접근법, 출처에 관한 질문'
            },
            launcher: {
              label: '이명 도우미',
              title: '채팅 열기'
            },
            inputPlaceholder: '이명이나 Dustin의 이야기, 해결 접근법에 관해 무엇이 궁금하신가요?',
            aiDisclaimer: {
              text: koreanAiDisclaimer,
              hide: false
            }
          } : isCzechPage ? {
            title: 'Asistent pro tinnitus',
            description: 'Otázky k Dustinovu příběhu, přístupu a zdrojům',
            header: { title: 'Asistent pro tinnitus' },
            banner: {
              title: 'Asistent pro tinnitus',
              description: 'Otázky k Dustinovu příběhu, přístupu a zdrojům'
            },
            launcher: {
              label: 'Asistent pro tinnitus',
              title: 'Otevřít chat'
            },
            inputPlaceholder: 'Co chceš vědět o tinnitu, Dustinově příběhu nebo jeho přístupu?',
            responseLoader: {
              type: 'spinner-with-text',
              text: 'Jen se na to podívám…'
            },
            aiDisclaimer: {
              text: czechAiDisclaimer,
              hide: false
            }
          } : {})
        });

        function setAttributeIfChanged(element, name, value) {
          if (element && element.getAttribute(name) !== value) {
            element.setAttribute(name, value);
          }
        }

        function replaceKnownElementText(shadowRoot, selector, replacements) {
          var elements = shadowRoot.querySelectorAll(selector);
          for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            if (element.children.length) continue;
            var value = (element.textContent || '').trim();
            if (value && Object.prototype.hasOwnProperty.call(replacements, value) &&
                element.textContent !== replacements[value]) {
              element.textContent = replacements[value];
            }
          }
        }

        function setFrenchHeaderControlLabel(button) {
          if (!button) return;
          var currentLabel = [
            button.getAttribute('title') || '',
            button.getAttribute('aria-label') || '',
            (button.textContent || '').trim()
          ].join(' ');
          var path = button.querySelector('path');
          var pathData = path ? (path.getAttribute('d') || '') : '';
          var label = '';

          if (/restart conversation|start new chat|redémarrer la conversation/i.test(currentLabel) ||
              pathData.indexOf('M5.75 5C5.75 4.58579') === 0) {
            label = 'Redémarrer la conversation';
          } else if (/hide messages|close chat|masquer les messages/i.test(currentLabel) ||
                     pathData.indexOf('M17.7478 7.31915') === 0) {
            label = 'Masquer les messages';
          }

          if (label) {
            setAttributeIfChanged(button, 'title', label);
            setAttributeIfChanged(button, 'aria-label', label);
          }
        }

        function localizeFrenchInterface(shadowRoot) {
          var title = 'Assistant sur les acouphènes';
          var description = 'Questions sur l’histoire de Dustin, sa démarche et ses sources';
          var placeholder = 'Que souhaitez-vous savoir sur les acouphènes, l’histoire de Dustin ou sa démarche ?';
          var textReplacements = {
            'Tinnitus-Assistent': title,
            'Fragen zu Dustins Geschichte, Ansatz & Quellen': description,
            'Start new chat': 'Nouvelle conversation',
            'Restart conversation': 'Redémarrer la conversation',
            'Cancel': 'Annuler',
            'Drop files to upload': 'Déposez les fichiers à importer',
            'Privacy notice': 'Avis de confidentialité',
            'Before we can proceed with your conversation, we kindly ask you to review and accept our privacy policy, outlining how we handle and protect your personal information throughout our services.': 'Avant de poursuivre la conversation, veuillez consulter et accepter notre politique de confidentialité. Elle explique comment vos informations personnelles sont traitées et protégées lorsque vous utilisez ce service.',
            'Submit': 'Accepter et continuer',
            'Privacy policy': 'Politique de confidentialité',
            'Hide messages': 'Masquer les messages',
            'Open chat': 'Ouvrir le chat',
            'open chat': 'Ouvrir le chat'
          };
          replaceKnownElementText(shadowRoot,
            '.vfrc-launcher__label, .vfrc-header--title, .vfrc-assistant-info--title, ' +
            '.vfrc-assistant-info--description, .vfrc-footer__start-button button, ' +
            '.vfrc-prompt button, .vfrc-more-menu .vfrc-button--label, ' +
            '.vfrc-file-drop-overlay *, .vfrc-privacy__title, .vfrc-privacy__description, ' +
            '.vfrc-privacy__primary-button, .vfrc-privacy__secondary-button-label',
            textReplacements);

          var launcher = shadowRoot.querySelector('.vfrc-launcher');
          if (launcher) {
            setAttributeIfChanged(launcher, 'title', 'Ouvrir le chat');
            setAttributeIfChanged(launcher, 'aria-label', 'Ouvrir le chat');
            var launcherLabel = launcher.querySelector('.vfrc-launcher__label');
            if (launcherLabel && launcherLabel.textContent !== title) launcherLabel.textContent = title;
          }

          var headerButtons = shadowRoot.querySelectorAll('.vfrc-header--button');
          for (var i = 0; i < headerButtons.length; i++) {
            setFrenchHeaderControlLabel(headerButtons[i]);
          }

          var input = shadowRoot.querySelector('.vfrc-chat-input');
          setAttributeIfChanged(input, 'placeholder', placeholder);

          var sendButton = shadowRoot.querySelector('.vfrc-chat-input__send');
          setAttributeIfChanged(sendButton, 'title', 'Envoyer');
          setAttributeIfChanged(sendButton, 'aria-label', 'Envoyer');

          var scrollIcon = shadowRoot.querySelector('[title="scroll"], [title="Faire défiler vers le bas"]');
          if (scrollIcon) {
            setAttributeIfChanged(scrollIcon, 'title', 'Faire défiler vers le bas');
            setAttributeIfChanged(scrollIcon.closest('button'), 'aria-label', 'Faire défiler vers le bas');
          }

          var privacyPrimary = shadowRoot.querySelector('.vfrc-privacy__primary-button');
          var privacySecondary = shadowRoot.querySelector('.vfrc-privacy__secondary-button');
          setAttributeIfChanged(privacyPrimary, 'aria-label', 'Accepter et continuer');
          setAttributeIfChanged(privacySecondary, 'aria-label', 'Politique de confidentialité');

          var proactiveClose = shadowRoot.querySelector('.vfrc-proactive__close-button');
          setAttributeIfChanged(proactiveClose, 'title', 'Fermer');
          setAttributeIfChanged(proactiveClose, 'aria-label', 'Fermer');

          return Boolean(launcher);
        }

        function observeFrenchInterface(shadowRoot) {
          var localized = localizeFrenchInterface(shadowRoot);
          if (!shadowRoot.__tinnitusFrenchUiObserver) {
            var scheduled = false;
            var observer = new MutationObserver(function() {
              if (scheduled) return;
              scheduled = true;
              window.requestAnimationFrame(function() {
                scheduled = false;
                localizeFrenchInterface(shadowRoot);
              });
            });
            observer.observe(shadowRoot, {
              childList: true,
              subtree: true,
              characterData: true,
              attributes: true,
              attributeFilter: ['title', 'aria-label', 'placeholder']
            });
            shadowRoot.__tinnitusFrenchUiObserver = observer;
          }
          return localized;
        }

        function localizeLauncher(shadowRoot) {
          if (isFrenchPage) return observeFrenchInterface(shadowRoot);
          var localizedLabel = isEnglishPage
            ? 'Tinnitus Assistant'
            : isDutchPage
              ? 'Tinnitusassistent'
              : isRussianPage
                ? 'Ассистент по тиннитусу'
                : isJapanesePage
                  ? '耳鳴りアシスタント'
                  : isKoreanPage
                    ? '이명 도우미'
                    : isCzechPage
                      ? 'Asistent pro tinnitus'
                      : '';
          if (!localizedLabel) return true;
          var launcher = shadowRoot.querySelector('.vfrc-launcher');
          if (!launcher) return false;
          var currentLauncherTitle = launcher.getAttribute('title') || '';
          var launcherActionLabel = (isCzechPage || isJapanesePage || isKoreanPage)
            ? (
                currentLauncherTitle === 'Close chat agent' ||
                currentLauncherTitle === 'Close chat' ||
                currentLauncherTitle === 'Zavřít chat' ||
                currentLauncherTitle === 'チャットを閉じる' ||
                currentLauncherTitle === '채팅 닫기'
                  ? (isJapanesePage ? 'チャットを閉じる' : isKoreanPage ? '채팅 닫기' : 'Zavřít chat')
                  : (isJapanesePage ? 'チャットを開く' : isKoreanPage ? '채팅 열기' : 'Otevřít chat')
              )
            : localizedLabel;
          if (launcher.getAttribute('title') !== launcherActionLabel) {
            launcher.setAttribute('title', launcherActionLabel);
          }
          if (launcher.getAttribute('aria-label') !== launcherActionLabel) {
            launcher.setAttribute('aria-label', launcherActionLabel);
          }
          var launcherLabel = launcher.querySelector('.vfrc-launcher__label');
          if (launcherLabel && launcherLabel.textContent !== localizedLabel) {
            launcherLabel.textContent = localizedLabel;
          }
          return true;
        }

        function localizeDutchWidget(shadowRoot) {
          if (!isDutchPage) return true;

          var textMap = {
            'Start new chat': 'Nieuw gesprek starten',
            'Cancel': 'Annuleren',
            'Restart conversation': 'Gesprek opnieuw starten',
            'Drop files to upload': 'Sleep bestanden hierheen om ze te uploaden',
            'open chat': 'Chat openen',
            'send': 'Versturen',
            'Send': 'Versturen',
            'scroll': 'Scrollen',
            'Hide messages': 'Berichten verbergen',
            'system agent avatar': 'Avatar van de assistent',
            'Privacy notice': 'Privacy-informatie',
            'Before we can proceed with your conversation, we kindly ask you to review and accept our privacy policy, outlining how we handle and protect your personal information throughout our services.': 'Voordat we verdergaan met je gesprek, vragen we je onze privacyverklaring te lezen en te accepteren. Daarin staat hoe we je persoonsgegevens binnen onze diensten verwerken en beschermen.',
            'Submit': 'Accepteren',
            'Privacy policy': 'Privacyverklaring',
            'Powered by Voiceflow': 'Mogelijk gemaakt door Voiceflow'
          };

          shadowRoot.querySelectorAll('*').forEach(function(element) {
            if (element.children.length > 0) return;
            var sourceText = element.textContent.trim();
            if (Object.prototype.hasOwnProperty.call(textMap, sourceText)) {
              element.textContent = textMap[sourceText];
            }
          });

          var textarea = shadowRoot.querySelector('textarea');
          if (textarea && textarea.getAttribute('placeholder') !== 'Wat wil je weten over tinnitus, Dustins verhaal of zijn aanpak?') {
            textarea.setAttribute('placeholder', 'Wat wil je weten over tinnitus, Dustins verhaal of zijn aanpak?');
          }

          shadowRoot.querySelectorAll('[aria-label], [title], [label]').forEach(function(element) {
            ['aria-label', 'title', 'label'].forEach(function(attribute) {
              var sourceText = element.getAttribute(attribute);
              if (sourceText && Object.prototype.hasOwnProperty.call(textMap, sourceText)) {
                element.setAttribute(attribute, textMap[sourceText]);
              }
            });
          });

          return localizeLauncher(shadowRoot);
        }

        function localizeRussianWidget(shadowRoot) {
          if (!isRussianPage) return true;

          var textMap = {
            'Start new chat': 'Новый чат',
            'Restart conversation': 'Начать разговор заново',
            'Cancel': 'Отмена',
            'Drop files to upload': 'Перетащи файлы сюда для загрузки',
            'Privacy notice': 'Уведомление о конфиденциальности',
            'Before we can proceed with your conversation, we kindly ask you to review and accept our privacy policy, outlining how we handle and protect your personal information throughout our services.': 'Прежде чем продолжить разговор, пожалуйста, ознакомься с нашей политикой конфиденциальности и прими её. В ней описано, как мы обрабатываем и защищаем твою личную информацию при использовании наших сервисов.',
            'Submit': 'Принять и продолжить',
            'Privacy policy': 'Политика конфиденциальности',
            'Hide messages': 'Скрыть сообщения',
            'Open chat': 'Открыть чат',
            'open chat': 'Открыть чат',
            'Send': 'Отправить',
            'send': 'Отправить',
            'Scroll down': 'Прокрутить вниз',
            'scroll': 'Прокрутить вниз',
            'system agent avatar': 'Аватар ассистента',
            'Powered by Voiceflow': 'Работает на Voiceflow'
          };

          shadowRoot.querySelectorAll('*').forEach(function(element) {
            if (element.children.length > 0) return;
            var sourceText = element.textContent.trim();
            if (Object.prototype.hasOwnProperty.call(textMap, sourceText)) {
              element.textContent = textMap[sourceText];
            }
          });

          var textarea = shadowRoot.querySelector('textarea');
          if (textarea && textarea.getAttribute('placeholder') !== 'Что ты хочешь узнать о тиннитусе, истории Дастина или его подходе?') {
            textarea.setAttribute('placeholder', 'Что ты хочешь узнать о тиннитусе, истории Дастина или его подходе?');
          }

          shadowRoot.querySelectorAll('[aria-label], [title], [label]').forEach(function(element) {
            ['aria-label', 'title', 'label'].forEach(function(attribute) {
              var sourceText = element.getAttribute(attribute);
              if (sourceText && Object.prototype.hasOwnProperty.call(textMap, sourceText)) {
                element.setAttribute(attribute, textMap[sourceText]);
              }
            });
          });

          var launcher = shadowRoot.querySelector('.vfrc-launcher');
          if (launcher) {
            launcher.setAttribute('title', 'Открыть чат');
            launcher.setAttribute('aria-label', 'Открыть чат');
            var launcherLabel = launcher.querySelector('.vfrc-launcher__label');
            if (launcherLabel && launcherLabel.textContent !== 'Ассистент по тиннитусу') {
              launcherLabel.textContent = 'Ассистент по тиннитусу';
            }
          }

          return Boolean(launcher);
        }

        function setCzechHeaderControlLabel(button) {
          if (!button) return;
          var currentLabel = [
            button.getAttribute('title') || '',
            button.getAttribute('aria-label') || '',
            (button.textContent || '').trim()
          ].join(' ');
          var path = button.querySelector('path');
          var pathData = path ? (path.getAttribute('d') || '') : '';
          var label = '';

          if (/restart conversation|restart chat|start new chat|začít chat znovu|začít konverzaci znovu/i.test(currentLabel) ||
              pathData.indexOf('M5.75 5C5.75 4.58579') === 0) {
            label = 'Začít chat znovu';
          } else if (/hide messages|close chat agent|close chat|zavřít chat|skrýt zprávy/i.test(currentLabel) ||
                     pathData.indexOf('M17.7478 7.31915') === 0) {
            label = 'Zavřít chat';
          }

          if (label) {
            setAttributeIfChanged(button, 'title', label);
            setAttributeIfChanged(button, 'aria-label', label);
          }
        }

        function localizeCzechWidget(shadowRoot) {
          if (!isCzechPage) return true;

          var textMap = {
            'Tinnitus-Assistent': 'Asistent pro tinnitus',
            'Fragen zu Dustins Geschichte, Ansatz & Quellen': 'Otázky k Dustinovu příběhu, přístupu a zdrojům',
            'Start new chat': 'Nový chat',
            'Cancel': 'Zrušit',
            'Restart conversation': 'Začít konverzaci znovu',
            'Restart chat': 'Začít chat znovu',
            'Drop files to upload': 'Přetáhni sem soubory k nahrání',
            'open chat': 'Otevřít chat',
            'Open chat': 'Otevřít chat',
            'Open chat agent': 'Otevřít chat',
            'Close chat agent': 'Zavřít chat',
            'Close chat': 'Zavřít chat',
            'Chat has ended': 'Konverzace skončila',
            'send': 'Odeslat',
            'Send': 'Odeslat',
            'Sent': 'Odesláno',
            'scroll': 'Posunout dolů',
            'Scroll down': 'Posunout dolů',
            'Hide messages': 'Skrýt zprávy',
            'system agent avatar': 'Avatar asistenta',
            'See more': 'Zobrazit více',
            'See less': 'Zobrazit méně',
            'Download': 'Stáhnout',
            'Image viewer': 'Prohlížeč obrázků',
            'Previous image': 'Předchozí obrázek',
            'Next image': 'Následující obrázek',
            'Scrollable table': 'Tabulka s možností posouvání',
            'Privacy notice': 'Upozornění k ochraně osobních údajů',
            'Before we can proceed with your conversation, we kindly ask you to review and accept our privacy policy, outlining how we handle and protect your personal information throughout our services.': 'Než budeme pokračovat v konverzaci, přečti si prosím naše zásady ochrany osobních údajů a přijmi je. Popisují, jak v rámci našich služeb nakládáme s tvými osobními údaji a jak je chráníme.',
            'Submit': 'Přijmout',
            'Privacy policy': 'Zásady ochrany osobních údajů',
            'Powered by Voiceflow': 'Vytvořeno pomocí Voiceflow',
            'AI responses may contain mistakes.': czechAiDisclaimer,
            'Close': 'Zavřít'
          };

          shadowRoot.querySelectorAll('*').forEach(function(element) {
            if (element.children.length > 0) return;
            var sourceText = element.textContent.trim();
            if (Object.prototype.hasOwnProperty.call(textMap, sourceText)) {
              element.textContent = textMap[sourceText];
            }
          });

          var textarea = shadowRoot.querySelector('textarea');
          var placeholder = 'Co chceš vědět o tinnitu, Dustinově příběhu nebo jeho přístupu?';
          if (textarea && textarea.getAttribute('placeholder') !== placeholder) {
            textarea.setAttribute('placeholder', placeholder);
          }

          shadowRoot.querySelectorAll('[aria-label], [title], [label], [alt]').forEach(function(element) {
            ['aria-label', 'title', 'label', 'alt'].forEach(function(attribute) {
              var sourceText = element.getAttribute(attribute);
              if (sourceText && Object.prototype.hasOwnProperty.call(textMap, sourceText)) {
                element.setAttribute(attribute, textMap[sourceText]);
              }
            });
          });

          var headerButtons = shadowRoot.querySelectorAll('.vfrc-header--button');
          for (var i = 0; i < headerButtons.length; i++) {
            setCzechHeaderControlLabel(headerButtons[i]);
          }

          var sendButton = shadowRoot.querySelector('.vfrc-chat-input__send');
          setAttributeIfChanged(sendButton, 'title', 'Odeslat');
          setAttributeIfChanged(sendButton, 'aria-label', 'Odeslat');

          var scrollIcon = shadowRoot.querySelector('[title="scroll"], [title="Scroll down"], [title="Posunout dolů"]');
          if (scrollIcon) {
            setAttributeIfChanged(scrollIcon, 'title', 'Posunout dolů');
            setAttributeIfChanged(scrollIcon.closest('button'), 'aria-label', 'Posunout dolů');
          }

          var proactiveClose = shadowRoot.querySelector('.vfrc-proactive__close-button');
          setAttributeIfChanged(proactiveClose, 'title', 'Skrýt zprávy');
          setAttributeIfChanged(proactiveClose, 'aria-label', 'Skrýt zprávy');

          return localizeLauncher(shadowRoot);
        }

        function localizeCzechPortal() {
          if (!isCzechPage) return false;
          var dialogs = document.querySelectorAll(
            '[role="dialog"][aria-label="Image viewer"], ' +
            '[role="dialog"][aria-label="Prohlížeč obrázků"]'
          );
          if (!dialogs.length) return false;

          var portalMap = {
            'Image viewer': 'Prohlížeč obrázků',
            'Download': 'Stáhnout',
            'Close': 'Zavřít',
            'Previous image': 'Předchozí obrázek',
            'Next image': 'Následující obrázek'
          };

          dialogs.forEach(function(dialog) {
            setAttributeIfChanged(dialog, 'aria-label', 'Prohlížeč obrázků');
            dialog.querySelectorAll('*').forEach(function(element) {
              if (element.children.length > 0) return;
              var sourceText = (element.textContent || '').trim();
              if (Object.prototype.hasOwnProperty.call(portalMap, sourceText)) {
                element.textContent = portalMap[sourceText];
              }
            });
            dialog.querySelectorAll('[aria-label], [title], [alt]').forEach(function(element) {
              ['aria-label', 'title', 'alt'].forEach(function(attribute) {
                var sourceText = element.getAttribute(attribute);
                if (sourceText && Object.prototype.hasOwnProperty.call(portalMap, sourceText)) {
                  setAttributeIfChanged(element, attribute, portalMap[sourceText]);
                }
              });
            });
          });
          return true;
        }

        function setJapaneseHeaderControlLabel(button) {
          if (!button) return;
          var currentLabel = [
            button.getAttribute('title') || '',
            button.getAttribute('aria-label') || '',
            (button.textContent || '').trim()
          ].join(' ');
          var path = button.querySelector('path');
          var pathData = path ? (path.getAttribute('d') || '') : '';
          var label = '';

          if (/restart conversation|restart chat|start new chat|会話を最初からやり直す|新しいチャット/i.test(currentLabel) ||
              pathData.indexOf('M5.75 5C5.75 4.58579') === 0) {
            label = '会話を最初からやり直す';
          } else if (/hide messages|close chat agent|close chat|メッセージを閉じる|チャットを閉じる/i.test(currentLabel) ||
                     pathData.indexOf('M17.7478 7.31915') === 0) {
            label = 'チャットを閉じる';
          }

          if (label) {
            setAttributeIfChanged(button, 'title', label);
            setAttributeIfChanged(button, 'aria-label', label);
          }
        }

        function localizeJapaneseWidget(shadowRoot) {
          if (!isJapanesePage) return true;

          var textMap = {
            'Tinnitus-Assistent': '耳鳴りアシスタント',
            'Fragen zu Dustins Geschichte, Ansatz & Quellen': 'ダスティンの体験、アプローチ、出典についての質問',
            'Start new chat': '新しいチャット',
            'Cancel': 'キャンセル',
            'Restart conversation': '会話を最初からやり直す',
            'Restart chat': '会話を最初からやり直す',
            'Drop files to upload': 'ファイルをここにドロップしてアップロード',
            'open chat': 'チャットを開く',
            'Open chat': 'チャットを開く',
            'Open chat agent': 'チャットを開く',
            'Close chat agent': 'チャットを閉じる',
            'Close chat': 'チャットを閉じる',
            'Chat has ended': 'チャットは終了しました',
            'send': '送信',
            'Send': '送信',
            'Sent': '送信済み',
            'scroll': '下へスクロール',
            'Scroll down': '下へスクロール',
            'Hide messages': 'メッセージを閉じる',
            'system agent avatar': 'アシスタントのアバター',
            'See more': 'もっと見る',
            'See less': '折りたたむ',
            'Download': 'ダウンロード',
            'Image viewer': '画像ビューア',
            'Previous image': '前の画像',
            'Next image': '次の画像',
            'Scrollable table': 'スクロール可能な表',
            'Privacy notice': 'プライバシーに関するお知らせ',
            'Before we can proceed with your conversation, we kindly ask you to review and accept our privacy policy, outlining how we handle and protect your personal information throughout our services.': '会話を続ける前に、当サービスで個人情報をどのように取り扱い、保護するかを記載したプライバシーポリシーをご確認のうえ、同意してください。',
            'Submit': '同意する',
            'Privacy policy': 'プライバシーポリシー',
            'Powered by Voiceflow': 'Voiceflowを使用',
            'AI responses may contain mistakes.': japaneseAiDisclaimer,
            'Close': '閉じる'
          };

          shadowRoot.querySelectorAll('*').forEach(function(element) {
            if (element.children.length > 0) return;
            var sourceText = element.textContent.trim();
            if (Object.prototype.hasOwnProperty.call(textMap, sourceText)) {
              element.textContent = textMap[sourceText];
            }
          });

          var textarea = shadowRoot.querySelector('textarea');
          var placeholder = '耳鳴りやダスティンの体験、アプローチについて、何を知りたいですか？';
          if (textarea && textarea.getAttribute('placeholder') !== placeholder) {
            textarea.setAttribute('placeholder', placeholder);
          }

          shadowRoot.querySelectorAll('[aria-label], [title], [label], [alt]').forEach(function(element) {
            ['aria-label', 'title', 'label', 'alt'].forEach(function(attribute) {
              var sourceText = element.getAttribute(attribute);
              if (sourceText && Object.prototype.hasOwnProperty.call(textMap, sourceText)) {
                element.setAttribute(attribute, textMap[sourceText]);
              }
            });
          });

          var headerButtons = shadowRoot.querySelectorAll('.vfrc-header--button');
          for (var i = 0; i < headerButtons.length; i++) {
            setJapaneseHeaderControlLabel(headerButtons[i]);
          }

          var sendButton = shadowRoot.querySelector('.vfrc-chat-input__send');
          setAttributeIfChanged(sendButton, 'title', '送信');
          setAttributeIfChanged(sendButton, 'aria-label', '送信');

          var scrollIcon = shadowRoot.querySelector('[title="scroll"], [title="Scroll down"], [title="下へスクロール"]');
          if (scrollIcon) {
            setAttributeIfChanged(scrollIcon, 'title', '下へスクロール');
            setAttributeIfChanged(scrollIcon.closest('button'), 'aria-label', '下へスクロール');
          }

          var proactiveClose = shadowRoot.querySelector('.vfrc-proactive__close-button');
          setAttributeIfChanged(proactiveClose, 'title', 'メッセージを閉じる');
          setAttributeIfChanged(proactiveClose, 'aria-label', 'メッセージを閉じる');

          return localizeLauncher(shadowRoot);
        }

        function localizeJapanesePortal() {
          if (!isJapanesePage) return false;
          var dialogs = document.querySelectorAll(
            '[role="dialog"][aria-label="Image viewer"], ' +
            '[role="dialog"][aria-label="画像ビューア"]'
          );
          if (!dialogs.length) return false;

          var portalMap = {
            'Image viewer': '画像ビューア',
            'Download': 'ダウンロード',
            'Close': '閉じる',
            'Previous image': '前の画像',
            'Next image': '次の画像'
          };

          dialogs.forEach(function(dialog) {
            setAttributeIfChanged(dialog, 'aria-label', '画像ビューア');
            dialog.querySelectorAll('*').forEach(function(element) {
              if (element.children.length > 0) return;
              var sourceText = (element.textContent || '').trim();
              if (Object.prototype.hasOwnProperty.call(portalMap, sourceText)) {
                element.textContent = portalMap[sourceText];
              }
            });
            dialog.querySelectorAll('[aria-label], [title], [alt]').forEach(function(element) {
              ['aria-label', 'title', 'alt'].forEach(function(attribute) {
                var sourceText = element.getAttribute(attribute);
                if (sourceText && Object.prototype.hasOwnProperty.call(portalMap, sourceText)) {
                  setAttributeIfChanged(element, attribute, portalMap[sourceText]);
                }
              });
            });
          });
          return true;
        }

        function setKoreanHeaderControlLabel(button) {
          if (!button) return;
          var currentLabel = [
            button.getAttribute('title') || '',
            button.getAttribute('aria-label') || '',
            (button.textContent || '').trim()
          ].join(' ');
          var path = button.querySelector('path');
          var pathData = path ? (path.getAttribute('d') || '') : '';
          var label = '';

          if (/restart conversation|restart chat|start new chat|대화 다시 시작|새 채팅 시작/i.test(currentLabel) ||
              pathData.indexOf('M5.75 5C5.75 4.58579') === 0) {
            label = '대화 다시 시작';
          } else if (/hide messages|close chat agent|close chat|메시지 숨기기|채팅 닫기/i.test(currentLabel) ||
                     pathData.indexOf('M17.7478 7.31915') === 0) {
            label = '채팅 닫기';
          }

          if (label) {
            setAttributeIfChanged(button, 'title', label);
            setAttributeIfChanged(button, 'aria-label', label);
          }
        }

        function localizeKoreanWidget(shadowRoot) {
          if (!isKoreanPage) return true;

          var textMap = {
            'Tinnitus-Assistent': '이명 도우미',
            'Fragen zu Dustins Geschichte, Ansatz & Quellen': 'Dustin의 이야기와 해결 접근법, 출처에 관한 질문',
            'Start new chat': '새 채팅 시작',
            'Cancel': '취소',
            'Restart conversation': '대화 다시 시작',
            'Restart chat': '대화 다시 시작',
            'Drop files to upload': '업로드할 파일을 여기에 놓으세요',
            'open chat': '채팅 열기',
            'Open chat': '채팅 열기',
            'Open chat agent': '채팅 열기',
            'Close chat agent': '채팅 닫기',
            'Close chat': '채팅 닫기',
            'Chat has ended': '채팅이 종료되었습니다',
            'send': '보내기',
            'Send': '보내기',
            'Sent': '전송됨',
            'scroll': '아래로 스크롤',
            'Scroll down': '아래로 스크롤',
            'Hide messages': '메시지 숨기기',
            'system agent avatar': '이명 도우미 아바타',
            'See more': '더 보기',
            'See less': '접기',
            'Download': '다운로드',
            'Image viewer': '이미지 뷰어',
            'Previous image': '이전 이미지',
            'Next image': '다음 이미지',
            'Scrollable table': '스크롤 가능한 표',
            'Privacy notice': '개인정보 보호 안내',
            'Before we can proceed with your conversation, we kindly ask you to review and accept our privacy policy, outlining how we handle and protect your personal information throughout our services.': '대화를 계속하기 전에 개인정보 처리방침을 검토하고 동의해 주세요. 이 방침에는 서비스 전반에서 개인정보를 어떻게 처리하고 보호하는지 설명되어 있습니다.',
            'Submit': '동의하고 계속하기',
            'Privacy policy': '개인정보 처리방침',
            'Powered by Voiceflow': 'Voiceflow 제공',
            'AI responses may contain mistakes.': koreanAiDisclaimer,
            'Close': '닫기'
          };

          shadowRoot.querySelectorAll('*').forEach(function(element) {
            if (element.children.length > 0) return;
            var sourceText = element.textContent.trim();
            if (Object.prototype.hasOwnProperty.call(textMap, sourceText)) {
              element.textContent = textMap[sourceText];
            }
          });

          var textarea = shadowRoot.querySelector('textarea');
          var placeholder = '이명이나 Dustin의 이야기, 해결 접근법에 관해 무엇이 궁금하신가요?';
          if (textarea && textarea.getAttribute('placeholder') !== placeholder) {
            textarea.setAttribute('placeholder', placeholder);
          }

          shadowRoot.querySelectorAll('[aria-label], [title], [label], [alt]').forEach(function(element) {
            ['aria-label', 'title', 'label', 'alt'].forEach(function(attribute) {
              var sourceText = element.getAttribute(attribute);
              if (sourceText && Object.prototype.hasOwnProperty.call(textMap, sourceText)) {
                element.setAttribute(attribute, textMap[sourceText]);
              }
            });
          });

          var headerButtons = shadowRoot.querySelectorAll('.vfrc-header--button');
          for (var i = 0; i < headerButtons.length; i++) {
            setKoreanHeaderControlLabel(headerButtons[i]);
          }

          var sendButton = shadowRoot.querySelector('.vfrc-chat-input__send');
          setAttributeIfChanged(sendButton, 'title', '보내기');
          setAttributeIfChanged(sendButton, 'aria-label', '보내기');

          var scrollIcon = shadowRoot.querySelector('[title="scroll"], [title="Scroll down"], [title="아래로 스크롤"]');
          if (scrollIcon) {
            setAttributeIfChanged(scrollIcon, 'title', '아래로 스크롤');
            setAttributeIfChanged(scrollIcon.closest('button'), 'aria-label', '아래로 스크롤');
          }

          var proactiveClose = shadowRoot.querySelector('.vfrc-proactive__close-button');
          setAttributeIfChanged(proactiveClose, 'title', '메시지 숨기기');
          setAttributeIfChanged(proactiveClose, 'aria-label', '메시지 숨기기');

          return localizeLauncher(shadowRoot);
        }

        function localizeKoreanPortal() {
          if (!isKoreanPage) return false;
          var dialogs = document.querySelectorAll(
            '[role="dialog"][aria-label="Image viewer"], ' +
            '[role="dialog"][aria-label="이미지 뷰어"]'
          );
          if (!dialogs.length) return false;

          var portalMap = {
            'Image viewer': '이미지 뷰어',
            'Download': '다운로드',
            'Close': '닫기',
            'Previous image': '이전 이미지',
            'Next image': '다음 이미지'
          };

          dialogs.forEach(function(dialog) {
            setAttributeIfChanged(dialog, 'aria-label', '이미지 뷰어');
            dialog.querySelectorAll('*').forEach(function(element) {
              if (element.children.length > 0) return;
              var sourceText = (element.textContent || '').trim();
              if (Object.prototype.hasOwnProperty.call(portalMap, sourceText)) {
                element.textContent = portalMap[sourceText];
              }
            });
            dialog.querySelectorAll('[aria-label], [title], [alt]').forEach(function(element) {
              ['aria-label', 'title', 'alt'].forEach(function(attribute) {
                var sourceText = element.getAttribute(attribute);
                if (sourceText && Object.prototype.hasOwnProperty.call(portalMap, sourceText)) {
                  setAttributeIfChanged(element, attribute, portalMap[sourceText]);
                }
              });
            });
          });
          return true;
        }

        var dutchObserver = null;
        var russianObserver = null;
        var czechObserver = null;
        var czechPortalObserver = null;
        var japaneseObserver = null;
        var japanesePortalObserver = null;
        var koreanObserver = null;
        var koreanPortalObserver = null;

        // Listen for shadow host creation to inject styles
        var shadowInterval = setInterval(function() {
          var shadowHost = document.getElementById('voiceflow-chat');
          if (shadowHost && shadowHost.shadowRoot) {
            injectShadowStyles();
            if (isFrenchPage) {
              localizeLauncher(shadowHost.shadowRoot);
              clearInterval(shadowInterval);
            } else if (isDutchPage) {
              localizeDutchWidget(shadowHost.shadowRoot);
              if (!dutchObserver) {
                dutchObserver = new MutationObserver(function() {
                  localizeDutchWidget(shadowHost.shadowRoot);
                });
                dutchObserver.observe(shadowHost.shadowRoot, {
                  childList: true,
                  subtree: true,
                  characterData: true,
                  attributes: true,
                  attributeFilter: ['aria-label', 'title', 'label', 'placeholder']
                });
              }
              clearInterval(shadowInterval);
            } else if (isRussianPage) {
              localizeRussianWidget(shadowHost.shadowRoot);
              if (!russianObserver) {
                russianObserver = new MutationObserver(function() {
                  localizeRussianWidget(shadowHost.shadowRoot);
                });
                russianObserver.observe(shadowHost.shadowRoot, {
                  childList: true,
                  subtree: true,
                  characterData: true,
                  attributes: true,
                  attributeFilter: ['aria-label', 'title', 'label', 'placeholder']
                });
              }
              clearInterval(shadowInterval);
            } else if (isCzechPage) {
              localizeCzechWidget(shadowHost.shadowRoot);
              localizeCzechPortal();
              if (!czechObserver) {
                czechObserver = new MutationObserver(function() {
                  localizeCzechWidget(shadowHost.shadowRoot);
                });
                czechObserver.observe(shadowHost.shadowRoot, {
                  childList: true,
                  subtree: true,
                  characterData: true,
                  attributes: true,
                  attributeFilter: ['aria-label', 'title', 'label', 'placeholder', 'alt']
                });
              }
              if (!czechPortalObserver) {
                czechPortalObserver = new MutationObserver(function() {
                  localizeCzechPortal();
                });
                czechPortalObserver.observe(document.body, {
                  childList: true,
                  subtree: true,
                  attributes: true,
                  attributeFilter: ['aria-label', 'title', 'alt']
                });
              }
              clearInterval(shadowInterval);
            } else if (isJapanesePage) {
              localizeJapaneseWidget(shadowHost.shadowRoot);
              localizeJapanesePortal();
              if (!japaneseObserver) {
                japaneseObserver = new MutationObserver(function() {
                  localizeJapaneseWidget(shadowHost.shadowRoot);
                });
                japaneseObserver.observe(shadowHost.shadowRoot, {
                  childList: true,
                  subtree: true,
                  characterData: true,
                  attributes: true,
                  attributeFilter: ['aria-label', 'title', 'label', 'placeholder', 'alt']
                });
              }
              if (!japanesePortalObserver) {
                japanesePortalObserver = new MutationObserver(function() {
                  localizeJapanesePortal();
                });
                japanesePortalObserver.observe(document.body, {
                  childList: true,
                  subtree: true,
                  attributes: true,
                  attributeFilter: ['aria-label', 'title', 'alt']
                });
              }
              clearInterval(shadowInterval);
            } else if (isKoreanPage) {
              localizeKoreanWidget(shadowHost.shadowRoot);
              localizeKoreanPortal();
              if (!koreanObserver) {
                koreanObserver = new MutationObserver(function() {
                  localizeKoreanWidget(shadowHost.shadowRoot);
                });
                koreanObserver.observe(shadowHost.shadowRoot, {
                  childList: true,
                  subtree: true,
                  characterData: true,
                  attributes: true,
                  attributeFilter: ['aria-label', 'title', 'label', 'placeholder', 'alt']
                });
              }
              if (!koreanPortalObserver) {
                koreanPortalObserver = new MutationObserver(function() {
                  localizeKoreanPortal();
                });
                koreanPortalObserver.observe(document.body, {
                  childList: true,
                  subtree: true,
                  attributes: true,
                  attributeFilter: ['aria-label', 'title', 'alt']
                });
              }
              clearInterval(shadowInterval);
            } else if (localizeLauncher(shadowHost.shadowRoot)) {
              clearInterval(shadowInterval);
            }
          }
        }, 50);
        setTimeout(function() { if (shadowInterval) clearInterval(shadowInterval); }, 8000);

        // Show the proactive speech bubble only after Voiceflow is ready.
        Promise.resolve(voiceflowReady).then(function() {
          setTimeout(function(){
            if(window.voiceflow && window.voiceflow.chat && typeof window.voiceflow.chat.proactive === 'object'){
              var pageLang = document.documentElement.lang.toLowerCase();
              var messageText = pageLang.indexOf('en') === 0
                ? "Tinnitus is not a life sentence. Do you have questions about my way out of tinnitus hell or the nutrient protocol?"
                : pageLang.indexOf('nl') === 0
                  ? "Tinnitus hoeft niet je lot te zijn. Heb je vragen over mijn weg uit de tinnitushel of over mijn voedingsstoffenprotocol?"
                : pageLang.indexOf('fr') === 0
                  ? "Les acouphènes ne sont pas une condamnation. Vous avez des questions sur la façon dont je suis sorti de l’enfer des acouphènes ou sur le protocole nutritionnel ?"
                : pageLang.indexOf('tr') === 0
                  ? "Tinnitus ömür boyu sürecek bir kader değildir. Tinnitus cehenneminden nasıl çıktığım ya da besin öğeleri protokolü hakkında soruların mı var?"
                  : pageLang.indexOf('pl') === 0
                    ? "Szumy uszne nie są wyrokiem. Masz pytania o moją drogę wyjścia z piekła szumów usznych albo o protokół oparty na składnikach odżywczych?"
                    : pageLang.indexOf('ru') === 0
                      ? "Тиннитус — не приговор. У тебя есть вопросы о моём пути из ада тиннитуса или о протоколе приёма нутриентов?"
                      : pageLang.indexOf('cs') === 0
                        ? "Tinnitus není nezvratný osud. Máš otázky k mé cestě z tinnitusového pekla nebo k protokolu založenému na živinách?"
                        : pageLang.indexOf('ja') === 0
                          ? "耳鳴りは、変えられない運命ではありません。私が耳鳴りの地獄から抜け出した道のりや、栄養素プロトコルについて質問はありますか？"
                          : pageLang.indexOf('ko') === 0
                            ? "이명은 정해진 운명이 아닙니다. 제가 이명 지옥에서 빠져나온 과정이나 영양소 프로토콜에 관해 궁금한 점이 있나요?"
                            : "Tinnitus ist kein Urteil. Hast du Fragen zu meinem Weg aus der Tinnitus-Hölle oder zum Nährstoff-Protokoll?";
              window.voiceflow.chat.proactive.push({
                type: 'text',
                payload: {
                  message: messageText
                }
              });

              // Hide the proactive bubble automatically after 8.25 seconds (2.25s fade-in + 6s stay)
              setTimeout(function() {
                if (window.voiceflow && window.voiceflow.chat && typeof window.voiceflow.chat.proactive === 'object') {
                  window.voiceflow.chat.proactive.clear();
                }
              }, 8250);
            }
          }, 350);
        });
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
          paragraphs[i].textContent.indexOf('lying awake at night') !== -1 ||
          paragraphs[i].textContent.indexOf('reste éveillé la nuit') !== -1 ||
          paragraphs[i].textContent.indexOf('’s nachts wakker te liggen') !== -1 ||
          paragraphs[i].textContent.indexOf('Geceleri uyanık yatıp') !== -1 ||
          paragraphs[i].textContent.indexOf('leżeć nocą, nie mogąc zasnąć') !== -1 ||
          paragraphs[i].textContent.indexOf('лежать без сна по ночам') !== -1 ||
          paragraphs[i].textContent.indexOf('ležet v noci vzhůru') !== -1 ||
          paragraphs[i].textContent.indexOf('夜、眠れずに横たわり') !== -1 ||
          paragraphs[i].textContent.indexOf('밤에 깨어 누운 채') !== -1) {
        return paragraphs[i];
      }
    }
    // Fallback to "Warum diese Seite existiert" heading
    var headings = document.querySelectorAll('h2');
    for (var i = 0; i < headings.length; i++) {
      if (headings[i].textContent.indexOf('Warum diese Seite existiert') !== -1 ||
          headings[i].textContent.indexOf('Why this site exists') !== -1 ||
          headings[i].textContent.indexOf('Pourquoi cette page existe') !== -1 ||
          headings[i].textContent.indexOf('Waarom deze pagina bestaat') !== -1 ||
          headings[i].textContent.indexOf('Bu site neden var') !== -1 ||
          headings[i].textContent.indexOf('Dlaczego ta strona istnieje') !== -1 ||
          headings[i].textContent.indexOf('Почему существует этот сайт') !== -1 ||
          headings[i].textContent.indexOf('Proč tento web existuje') !== -1 ||
          headings[i].textContent.indexOf('このサイトを作った理由') !== -1 ||
          headings[i].textContent.indexOf('이 사이트가 존재하는 이유') !== -1) {
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
  var homepagePaths = {
    '/': true,
    '/index.html': true,
    '/en': true,
    '/en/': true,
    '/en/index.html': true,
    '/it': true,
    '/it/': true,
    '/it/index.html': true,
    '/fr': true,
    '/fr/': true,
    '/fr/index.html': true,
    '/nl': true,
    '/nl/': true,
    '/nl/index.html': true,
    '/es': true,
    '/es/': true,
    '/es/index.html': true,
    '/tr': true,
    '/tr/': true,
    '/tr/index.html': true,
    '/pl': true,
    '/pl/': true,
    '/pl/index.html': true,
    '/ru': true,
    '/ru/': true,
    '/ru/index.html': true,
    '/cs': true,
    '/cs/': true,
    '/cs/index.html': true,
    '/ja': true,
    '/ja/': true,
    '/ja/index.html': true,
    '/ko': true,
    '/ko/': true,
    '/ko/index.html': true
  };
  var isHomepage = Boolean(homepagePaths[pathname]);

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
