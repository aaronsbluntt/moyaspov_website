/**
 * MOYA'S POV — Main Application & Interactive CMS Controller
 * Controla:
 * 1. Transición estética de Minimalista (Inicio) → Moderna no invasiva (Scroll)
 * 2. Escenario animado de fotografías seleccionadas detrás del quote de Robert Frank
 * 3. Portafolio filtrable + Lightbox de pantalla completa
 * 4. Selección de paquetes + Formulario de reserva conectado a WhatsApp / almacenamiento local
 * 5. Panel de Administración en vivo (CMS Local) para editar fotos y textos a antojo
 */

(function () {
  'use strict';

  const BOOKINGS_STORAGE_KEY = 'moyaspov_bookings_v1';

  let siteData = window.MoyaCMS.getSiteData();
  let heroSlideIndex = 0;
  let heroIntervalId = null;
  let activePortfolioCategory = 'Todo';
  let filteredPortfolioItems = [];
  let currentLightboxIndex = 0;

  /* ========================================================================
     INICIALIZACIÓN PRINCIPAL
     ======================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    renderAll();
    initScrollExperience();
    initNavigation();
    initLightboxEvents();
    initBookingForm();
    initAdminPanel();

    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });

  /**
   * Renderiza todas las secciones a partir de `siteData`
   */
  function renderAll() {
    renderBrandAndHeader();
    renderHeroSection();
    renderAboutSection();
    renderPortfolioSection();
    renderPackagesSection();
    renderBookingSection();
  }

  /* ========================================================================
     1. RENDERIZADO DE MARCA Y HEADER
     ======================================================================== */
  function renderBrandAndHeader() {
    const { brand } = siteData;
    setText('headerBrandName', brand.name);
    setText('footerBrandName', brand.name);
    setText('footerTagline', brand.tagline);
    setText('contactInstagram', brand.instagram);
    setText('contactEmail', brand.email);
  }

  /* ========================================================================
     2. HERO MINIMALISTA + FOTOS ANIMADAS PASANDO DETRÁS DEL QUOTE
     ======================================================================== */
  function renderHeroSection() {
    const { hero, theme } = siteData;

    setText('heroEyebrow', hero.eyebrow);
    setText('heroQuoteText', `“${hero.quote.replace(/^[“"]|[”"]$/g, '')}”`);
    setText('heroQuoteAuthor', hero.quoteAuthor);
    setText('heroSubtitle', hero.subtitle);

    const stage = document.getElementById('heroBackdropStage');
    if (stage) {
      stage.setAttribute('data-anim-mode', theme.heroAnimationStyle || 'cinematic-drift');
    }

    const photos = Array.isArray(hero.backgroundPhotos) && hero.backgroundPhotos.length > 0
      ? hero.backgroundPhotos
      : window.MoyaCMS.DEFAULT_SITE_DATA.hero.backgroundPhotos;

    // A) Capa Crossfade de Fondo
    const crossfadeContainer = document.getElementById('heroBgCrossfade');
    if (crossfadeContainer) {
      crossfadeContainer.innerHTML = photos
        .map((photo, idx) => `
          <div
            class="hero-bg-slide ${idx === 0 ? 'active' : ''}"
            data-slide-idx="${idx}"
            style="background-image: url('${escapeAttr(photo.url)}')"
          ></div>
        `)
        .join('');
    }

    // B) Capa Cinta Editorial Flotante (Drifting Gallery)
    // Duplicamos las fotos para que el loop infinito sea perfectamente continuo
    const trackPrimary = document.getElementById('driftingTrackPrimary');
    const trackSecondary = document.getElementById('driftingTrackSecondary');

    if (trackPrimary && trackSecondary) {
      const doubledPrimary = [...photos, ...photos, ...photos];
      const reversedPhotos = [...photos].reverse();
      const doubledSecondary = [...reversedPhotos, ...reversedPhotos, ...reversedPhotos];

      trackPrimary.innerHTML = doubledPrimary
        .map(p => `
          <div class="drifting-card">
            <img src="${escapeAttr(p.url)}" alt="${escapeAttr(p.title)}" loading="eager" />
          </div>
        `)
        .join('');

      trackSecondary.innerHTML = doubledSecondary
        .map(p => `
          <div class="drifting-card">
            <img src="${escapeAttr(p.url)}" alt="${escapeAttr(p.title)}" loading="lazy" />
          </div>
        `)
        .join('');
    }

    // C) Indicadores inferiores numerados
    const indicatorsContainer = document.getElementById('heroPhotoIndicators');
    if (indicatorsContainer) {
      indicatorsContainer.innerHTML = photos
        .map((photo, idx) => {
          const num = String(idx + 1).padStart(2, '0');
          return `
            <button
              type="button"
              class="hero-indicator-btn ${idx === 0 ? 'active' : ''}"
              data-hero-idx="${idx}"
              aria-label="Ver fotografía seleccionada ${num}: ${escapeAttr(photo.title)}"
            >
              <span>${num}</span>
              <span class="ind-bar"></span>
            </button>
          `;
        })
        .join('');

      indicatorsContainer.querySelectorAll('.hero-indicator-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const targetIdx = parseInt(btn.getAttribute('data-hero-idx'), 10);
          setActiveHeroSlide(targetIdx);
          restartHeroTimer();
        });
      });
    }

    heroSlideIndex = 0;
    updateHeroMeta(photos[0]);
    restartHeroTimer();
  }

  function setActiveHeroSlide(index) {
    const photos = siteData.hero.backgroundPhotos || [];
    if (!photos.length) return;

    heroSlideIndex = (index + photos.length) % photos.length;

    const slides = document.querySelectorAll('.hero-bg-slide');
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === heroSlideIndex);
    });

    const indicators = document.querySelectorAll('.hero-indicator-btn');
    indicators.forEach((ind, idx) => {
      ind.classList.toggle('active', idx === heroSlideIndex);
    });

    updateHeroMeta(photos[heroSlideIndex]);
  }

  function updateHeroMeta(photo) {
    if (!photo) return;
    setText('heroCurrentPhotoTitle', photo.title || 'Selección Moya');
    setText('heroCurrentPhotoExif', photo.meta || photo.category || 'RAW');
  }

  function restartHeroTimer() {
    if (heroIntervalId) clearInterval(heroIntervalId);
    heroIntervalId = setInterval(() => {
      setActiveHeroSlide(heroSlideIndex + 1);
    }, 4800);
  }

  /* ========================================================================
     3. SECCIÓN SOBRE MÍ
     ======================================================================== */
  function renderAboutSection() {
    const { about } = siteData;

    setText('aboutEyebrow', about.eyebrow);
    setText('aboutTitle', about.title);
    setText('aboutLead', about.lead);
    setText('aboutParagraph1', about.paragraph1);
    setText('aboutParagraph2', about.paragraph2);
    setText('aboutPortraitCaption', about.portraitCaption);

    const portraitImg = document.getElementById('aboutPortraitImg');
    if (portraitImg) {
      portraitImg.src = about.portraitUrl;
    }

    const statsRow = document.getElementById('aboutStatsRow');
    if (statsRow && Array.isArray(about.stats)) {
      statsRow.innerHTML = about.stats
        .map(s => `
          <div class="stat-card">
            <span class="stat-value">${escapeHtml(s.value)}</span>
            <span class="stat-label">${escapeHtml(s.label)}</span>
          </div>
        `)
        .join('');
    }

    const pillarsContainer = document.getElementById('aboutPillars');
    if (pillarsContainer && Array.isArray(about.pillars)) {
      pillarsContainer.innerHTML = about.pillars
        .map(p => `
          <div class="pillar-card">
            <h3 class="pillar-title">${escapeHtml(p.title)}</h3>
            <p class="pillar-desc">${escapeHtml(p.description)}</p>
          </div>
        `)
        .join('');
    }
  }

  /* ========================================================================
     4. SECCIÓN PORTAFOLIO & FILTROS
     ======================================================================== */
  function renderPortfolioSection() {
    const { portfolio } = siteData;

    setText('portfolioEyebrow', portfolio.eyebrow);
    setText('portfolioTitle', portfolio.title);
    setText('portfolioSubtitle', portfolio.subtitle);

    // Filtros
    const filtersContainer = document.getElementById('portfolioFilters');
    if (filtersContainer) {
      const categories = portfolio.categories || ['Todo', 'Retrato', 'Editorial', 'Parejas', 'Urbano'];
      filtersContainer.innerHTML = categories
        .map(cat => `
          <button
            type="button"
            class="filter-btn ${cat === activePortfolioCategory ? 'active' : ''}"
            data-filter-cat="${escapeAttr(cat)}"
          >
            ${escapeHtml(cat)}
          </button>
        `)
        .join('');

      filtersContainer.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          activePortfolioCategory = btn.getAttribute('data-filter-cat');
          renderPortfolioSection();
        });
      });
    }

    // Items filtrados
    const allItems = portfolio.items || [];
    filteredPortfolioItems = activePortfolioCategory === 'Todo'
      ? allItems
      : allItems.filter(item => item.category.toLowerCase() === activePortfolioCategory.toLowerCase());

    const grid = document.getElementById('portfolioGrid');
    if (grid) {
      grid.innerHTML = filteredPortfolioItems
        .map((item, idx) => {
          const sizeClass = item.size === 'tall' ? 'size-tall' : item.size === 'wide' ? 'size-wide' : '';
          return `
            <article
              class="portfolio-item ${sizeClass}"
              tabindex="0"
              role="button"
              aria-label="Ver fotografía ${escapeAttr(item.title)}"
              data-lightbox-index="${idx}"
            >
              <img src="${escapeAttr(item.url)}" alt="${escapeAttr(item.title)}" loading="lazy" />
              <div class="portfolio-overlay">
                <span class="portfolio-cat-tag">${escapeHtml(item.category)}</span>
                <h3 class="portfolio-item-title">${escapeHtml(item.title)}</h3>
                <span class="portfolio-item-meta">${escapeHtml(item.meta || item.year || '')}</span>
              </div>
            </article>
          `;
        })
        .join('');

      grid.querySelectorAll('.portfolio-item').forEach(card => {
        card.addEventListener('click', () => {
          const idx = parseInt(card.getAttribute('data-lightbox-index'), 10);
          openLightbox(idx);
        });
        card.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const idx = parseInt(card.getAttribute('data-lightbox-index'), 10);
            openLightbox(idx);
          }
        });
      });
    }
  }

  /* ========================================================================
     5. SECCIÓN PAQUETES
     ======================================================================== */
  function renderPackagesSection() {
    const { packages } = siteData;

    setText('packagesEyebrow', packages.eyebrow);
    setText('packagesTitle', packages.title);
    setText('packagesSubtitle', packages.subtitle);
    setText('packagesNote', packages.note);

    const grid = document.getElementById('packagesGrid');
    if (grid && Array.isArray(packages.items)) {
      grid.innerHTML = packages.items
        .map(pkg => `
          <article class="package-card ${pkg.featured ? 'featured' : ''}">
            <div>
              <span class="package-badge">${escapeHtml(pkg.badge)}</span>
              <h3 class="package-name">${escapeHtml(pkg.name)}</h3>
              <p class="package-desc">${escapeHtml(pkg.description)}</p>

              <div class="package-price-box">
                <span class="package-price">${escapeHtml(pkg.price)}</span>
                <span class="package-duration">/ ${escapeHtml(pkg.duration)}</span>
              </div>

              <ul class="package-features">
                ${(pkg.features || [])
                  .map(f => `
                    <li>
                      <span class="check-icon" aria-hidden="true">✓</span>
                      <span>${escapeHtml(f)}</span>
                    </li>
                  `)
                  .join('')}
              </ul>
            </div>

            <button
              type="button"
              class="btn-package-select"
              data-select-package="${escapeAttr(pkg.name)} (${escapeAttr(pkg.price)})"
            >
              Elegir ${escapeHtml(pkg.name)}
            </button>
          </article>
        `)
        .join('');
    }

    // Conectar botones de elegir paquete con la sección Reserva tu sesión
    document.querySelectorAll('[data-select-package]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const pkgName = btn.getAttribute('data-select-package');
        const selectEl = document.getElementById('sessionPackage');
        if (selectEl) {
          // Buscar opción coincidente o agregarla
          let matched = false;
          for (const opt of selectEl.options) {
            if (opt.value.includes(pkgName) || pkgName.includes(opt.value)) {
              selectEl.value = opt.value;
              matched = true;
              break;
            }
          }
          if (!matched) {
            selectEl.value = selectEl.options[selectEl.options.length - 1]?.value || '';
          }
        }
        const reservarSection = document.getElementById('reservar');
        if (reservarSection) {
          reservarSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /* ========================================================================
     6. SECCIÓN RESERVA TU SESIÓN
     ======================================================================== */
  function renderBookingSection() {
    const { booking, packages } = siteData;

    setText('bookingEyebrow', booking.eyebrow);
    setText('bookingTitle', booking.title);
    setText('bookingSubtitle', booking.subtitle);

    const selectEl = document.getElementById('sessionPackage');
    if (selectEl && Array.isArray(packages.items)) {
      const optionsHtml = packages.items
        .map(pkg => {
          const label = `${pkg.name} — ${pkg.price} (${pkg.duration})`;
          return `<option value="${escapeAttr(pkg.name)} (${escapeAttr(pkg.price)})">${escapeHtml(label)}</option>`;
        })
        .join('');

      selectEl.innerHTML = `
        ${optionsHtml}
        <option value="Sesión Personalizada / A medida">Sesión Personalizada / Producción a medida</option>
      `;
    }
  }

  /* ========================================================================
     7. EXPERIENCIA DE SCROLL (MINIMALISTA → MODERNA) & NAVEGACIÓN ACTIVA
     ======================================================================== */
  function initScrollExperience() {
    const progressBar = document.getElementById('scrollProgressBar');
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.main-nav .nav-link');

    function handleScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? Math.min(100, (scrollY / docHeight) * 100) : 0;

      if (progressBar) {
        progressBar.style.width = `${scrollPercent}%`;
      }

      // Cambiar entre estado "minimal" (al entrar) y "modern" (al hacer scroll)
      if (scrollY > 65) {
        document.body.setAttribute('data-scroll-state', 'modern');
      } else {
        document.body.setAttribute('data-scroll-state', 'minimal');
      }

      // Actualizar link activo del Header según la sección en pantalla
      let currentSectionId = 'inicio';
      sections.forEach(sec => {
        const top = sec.offsetTop - 180;
        if (scrollY >= top) {
          currentSectionId = sec.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        const target = link.getAttribute('data-section');
        link.classList.toggle('active', target === currentSectionId);
      });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // IntersectionObserver para animaciones suaves al hacer scroll
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      revealElements.forEach(el => observer.observe(el));
    } else {
      revealElements.forEach(el => el.classList.add('is-visible'));
    }
  }

  function initNavigation() {
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const mobileDrawer = document.getElementById('mobileNavDrawer');

    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = mobileDrawer.classList.toggle('open');
        mobileToggle.setAttribute('aria-expanded', String(isOpen));
      });

      mobileDrawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileDrawer.classList.remove('open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  /* ========================================================================
     8. VISOR LIGHTBOX DE PANTALLA COMPLETA
     ======================================================================== */
  function openLightbox(index) {
    if (!filteredPortfolioItems.length) return;
    currentLightboxIndex = (index + filteredPortfolioItems.length) % filteredPortfolioItems.length;

    const item = filteredPortfolioItems[currentLightboxIndex];
    const modal = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImg');

    if (!modal || !img || !item) return;

    img.src = item.url;
    img.alt = item.title;
    setText('lightboxCat', item.category);
    setText('lightboxTitle', item.title);
    setText('lightboxMeta', item.meta || item.year || '');

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    if (modal) {
      modal.hidden = true;
      document.body.style.overflow = '';
    }
  }

  function initLightboxEvents() {
    document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox);
    document.getElementById('lightboxBackdrop')?.addEventListener('click', closeLightbox);

    document.getElementById('lightboxPrev')?.addEventListener('click', () => {
      openLightbox(currentLightboxIndex - 1);
    });
    document.getElementById('lightboxNext')?.addEventListener('click', () => {
      openLightbox(currentLightboxIndex + 1);
    });

    document.getElementById('lightboxBookBtn')?.addEventListener('click', () => {
      const item = filteredPortfolioItems[currentLightboxIndex];
      closeLightbox();
      const notesEl = document.getElementById('sessionNotes');
      if (notesEl && item) {
        notesEl.value = `Me encanta la estética de la foto "${item.title}" (${item.category}). Me gustaría una sesión con esa vibra.`;
      }
    });

    document.addEventListener('keydown', e => {
      const modal = document.getElementById('lightboxModal');
      if (!modal || modal.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') openLightbox(currentLightboxIndex - 1);
      if (e.key === 'ArrowRight') openLightbox(currentLightboxIndex + 1);
    });
  }

  /* ========================================================================
     9. FORMULARIO DE RESERVA DE SESIÓN
     ======================================================================== */
  function initBookingForm() {
    const form = document.getElementById('bookingForm');
    const successBox = document.getElementById('bookingSuccessMsg');
    const closeSuccessBtn = document.getElementById('closeSuccessBtn');

    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();

      const clientName = document.getElementById('clientName')?.value.trim();
      const clientContact = document.getElementById('clientContact')?.value.trim();
      const sessionPackage = document.getElementById('sessionPackage')?.value;
      const sessionDate = document.getElementById('sessionDate')?.value || 'Por definir';
      const sessionLocation = form.querySelector('input[name="sessionLocation"]:checked')?.value || 'Por definir';
      const sessionNotes = document.getElementById('sessionNotes')?.value.trim() || 'Sin notas adicionales';

      if (!clientName || !clientContact) {
        showToast('Por favor completa tu nombre y medio de contacto.');
        return;
      }

      const newBooking = {
        id: 'res-' + Date.now(),
        createdAt: new Date().toLocaleString('es-ES'),
        clientName,
        clientContact,
        sessionPackage,
        sessionDate,
        sessionLocation,
        sessionNotes
      };

      // Guardar reserva localmente para verla en el Panel de Admin
      saveBookingRecord(newBooking);

      // Preparar enlace directo de WhatsApp
      const cleanPhone = (siteData.brand.whatsapp || '').replace(/[^0-9]/g, '');
      const waMessage =
        `¡Hola Moya! Quiero reservar una sesión fotográfica.%0A%0A` +
        `• *Nombre:* ${encodeURIComponent(clientName)}%0A` +
        `• *Contacto:* ${encodeURIComponent(clientContact)}%0A` +
        `• *Paquete:* ${encodeURIComponent(sessionPackage)}%0A` +
        `• *Fecha tentativa:* ${encodeURIComponent(sessionDate)}%0A` +
        `• *Atmósfera:* ${encodeURIComponent(sessionLocation)}%0A` +
        `• *Idea:* ${encodeURIComponent(sessionNotes)}`;

      const waLink = document.getElementById('whatsappDirectLink');
      if (waLink) {
        waLink.href = `https://wa.me/${cleanPhone}?text=${waMessage}`;
      }

      setText(
        'bookingSuccessText',
        `¡Gracias, ${clientName}! Tu solicitud para "${sessionPackage}" quedó registrada. Puedes enviarla directo por WhatsApp para atención inmediata.`
      );

      if (successBox) {
        successBox.hidden = false;
      }

      form.reset();
      showToast('Solicitud de sesión preparada con éxito');
    });

    closeSuccessBtn?.addEventListener('click', () => {
      if (successBox) successBox.hidden = true;
    });
  }

  function getSavedBookings() {
    try {
      return JSON.parse(localStorage.getItem(BOOKINGS_STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  function saveBookingRecord(record) {
    const list = getSavedBookings();
    list.unshift(record);
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(list));
  }

  /* ========================================================================
     10. PANEL DE ADMINISTRACIÓN INTERACTIVO (CMS LOCAL)
     ======================================================================== */
  function initAdminPanel() {
    const drawer = document.getElementById('adminDrawer');
    const openBtn = document.getElementById('openAdminBtn');
    const closeBtn = document.getElementById('closeAdminBtn');
    const backdrop = document.getElementById('adminBackdrop');

    function openAdmin() {
      populateAdminFields();
      if (drawer) {
        drawer.hidden = false;
        document.body.style.overflow = 'hidden';
      }
    }

    function closeAdmin() {
      if (drawer) {
        drawer.hidden = true;
        document.body.style.overflow = '';
      }
    }

    openBtn?.addEventListener('click', openAdmin);
    closeBtn?.addEventListener('click', closeAdmin);
    backdrop?.addEventListener('click', closeAdmin);

    // Atajo de teclado Shift + A (cuando no se está escribiendo en un input)
    document.addEventListener('keydown', e => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        if (drawer?.hidden) openAdmin();
        else closeAdmin();
      }
    });

    // Cambio de pestañas en el Admin
    document.querySelectorAll('.admin-tab').forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        const targetId = tabBtn.getAttribute('data-admin-tab');
        document.querySelectorAll('.admin-tab').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
        tabBtn.classList.add('active');
        document.getElementById(targetId)?.classList.add('active');
      });
    });

    // Subida de archivos locales convirtiendo a DataURL
    setupFileInputToUrl('newHeroPhotoFile', 'newHeroPhotoUrl');
    setupFileInputToUrl('newPortFile', 'newPortUrl');
    setupFileInputToUrl('adminAboutPortraitFile', 'adminAboutPortraitUrl');

    // Botón: Agregar foto al Hero
    document.getElementById('addHeroPhotoBtn')?.addEventListener('click', () => {
      const title = document.getElementById('newHeroPhotoTitle')?.value.trim() || 'Selección Moya';
      const meta = document.getElementById('newHeroPhotoMeta')?.value.trim() || '50mm · f/1.4';
      const url = document.getElementById('newHeroPhotoUrl')?.value.trim();

      if (!url) {
        showToast('Ingresa una URL de foto o sube una imagen desde tu equipo');
        return;
      }

      siteData.hero.backgroundPhotos.push({
        id: 'hero-' + Date.now(),
        title,
        category: 'Selección',
        meta,
        url
      });

      document.getElementById('newHeroPhotoTitle').value = '';
      document.getElementById('newHeroPhotoMeta').value = '';
      document.getElementById('newHeroPhotoUrl').value = '';

      window.MoyaCMS.saveSiteData(siteData);
      renderHeroSection();
      renderAdminHeroPhotoList();
      showToast('Fotografía agregada al inicio animado');
    });

    // Botón: Agregar foto al Portafolio
    document.getElementById('addPortfolioPhotoBtn')?.addEventListener('click', () => {
      const title = document.getElementById('newPortTitle')?.value.trim() || 'Sin título';
      const category = document.getElementById('newPortCategory')?.value || 'Retrato';
      const meta = document.getElementById('newPortMeta')?.value.trim() || '35mm · f/1.8';
      const size = document.getElementById('newPortSize')?.value || 'normal';
      const url = document.getElementById('newPortUrl')?.value.trim();

      if (!url) {
        showToast('Ingresa una URL o sube una foto desde tu equipo');
        return;
      }

      siteData.portfolio.items.unshift({
        id: 'port-' + Date.now(),
        title,
        category,
        year: String(new Date().getFullYear()),
        meta,
        size,
        url
      });

      document.getElementById('newPortTitle').value = '';
      document.getElementById('newPortMeta').value = '';
      document.getElementById('newPortUrl').value = '';

      window.MoyaCMS.saveSiteData(siteData);
      renderPortfolioSection();
      renderAdminPortfolioList();
      showToast('Fotografía publicada en el portafolio');
    });

    // Botón: Guardar cambios generales
    document.getElementById('saveCmsBtn')?.addEventListener('click', () => {
      collectAdminFieldsIntoState();
      window.MoyaCMS.saveSiteData(siteData);
      renderAll();
      showToast('¡Cambios guardados y aplicados en la página!');
    });

    // Botón: Restaurar original
    document.getElementById('resetCmsBtn')?.addEventListener('click', () => {
      if (confirm('¿Deseas restaurar las fotografías y textos originales de demostración?')) {
        siteData = window.MoyaCMS.resetSiteData();
        populateAdminFields();
        renderAll();
        showToast('Configuración original restaurada');
      }
    });

    // Botón: Exportar JSON
    document.getElementById('exportCmsBtn')?.addEventListener('click', () => {
      collectAdminFieldsIntoState();
      const blob = new Blob([JSON.stringify(siteData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'moyaspov-config.json';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Archivo JSON de configuración descargado');
    });
  }

  function setupFileInputToUrl(fileInputId, targetUrlInputId) {
    const fileInput = document.getElementById(fileInputId);
    const urlInput = document.getElementById(targetUrlInputId);
    if (!fileInput || !urlInput) return;

    fileInput.addEventListener('change', () => {
      const file = fileInput.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = e => {
        urlInput.value = e.target?.result || '';
        showToast(`Imagen "${file.name}" lista para aplicar`);
      };
      reader.readAsDataURL(file);
    });
  }

  function populateAdminFields() {
    // Hero
    setVal('adminHeroQuote', siteData.hero.quote);
    setVal('adminHeroAuthor', siteData.hero.quoteAuthor);
    setVal('adminHeroSubtitle', siteData.hero.subtitle);
    setVal('adminHeroAnimStyle', siteData.theme.heroAnimationStyle || 'cinematic-drift');

    // Sobre mí
    setVal('adminAboutTitle', siteData.about.title);
    setVal('adminAboutLead', siteData.about.lead);
    setVal('adminAboutP1', siteData.about.paragraph1);
    setVal('adminAboutP2', siteData.about.paragraph2);
    setVal('adminAboutPortraitUrl', siteData.about.portraitUrl);

    // Contacto
    setVal('adminBrandIg', siteData.brand.instagram);
    setVal('adminBrandWa', siteData.brand.whatsapp);
    setVal('adminBrandEmail', siteData.brand.email);

    renderAdminHeroPhotoList();
    renderAdminPortfolioList();
    renderAdminPackagesEditor();
    renderAdminBookingsList();
  }

  function renderAdminHeroPhotoList() {
    const container = document.getElementById('adminHeroPhotoList');
    if (!container) return;

    const photos = siteData.hero.backgroundPhotos || [];
    container.innerHTML = photos
      .map((p, idx) => `
        <div class="admin-photo-row">
          <img src="${escapeAttr(p.url)}" alt="${escapeAttr(p.title)}" />
          <div class="admin-photo-info">
            <strong>${escapeHtml(p.title)}</strong>
            <span>${escapeHtml(p.meta || '')}</span>
          </div>
          <button type="button" class="btn-delete-item" data-del-hero="${idx}">Eliminar</button>
        </div>
      `)
      .join('');

    container.querySelectorAll('[data-del-hero]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (siteData.hero.backgroundPhotos.length <= 1) {
          showToast('Debe haber al menos 1 fotografía en el inicio');
          return;
        }
        const idx = parseInt(btn.getAttribute('data-del-hero'), 10);
        siteData.hero.backgroundPhotos.splice(idx, 1);
        window.MoyaCMS.saveSiteData(siteData);
        renderHeroSection();
        renderAdminHeroPhotoList();
        showToast('Fotografía retirada del inicio');
      });
    });
  }

  function renderAdminPortfolioList() {
    const container = document.getElementById('adminPortfolioList');
    const countEl = document.getElementById('adminPortCount');
    if (!container) return;

    const items = siteData.portfolio.items || [];
    if (countEl) countEl.textContent = String(items.length);

    container.innerHTML = items
      .map((item, idx) => `
        <div class="admin-photo-row">
          <img src="${escapeAttr(item.url)}" alt="${escapeAttr(item.title)}" />
          <div class="admin-photo-info">
            <strong>${escapeHtml(item.title)}</strong>
            <span>${escapeHtml(item.category)} · ${escapeHtml(item.meta || '')}</span>
          </div>
          <button type="button" class="btn-delete-item" data-del-port="${idx}">Eliminar</button>
        </div>
      `)
      .join('');

    container.querySelectorAll('[data-del-port]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-del-port'), 10);
        siteData.portfolio.items.splice(idx, 1);
        window.MoyaCMS.saveSiteData(siteData);
        renderPortfolioSection();
        renderAdminPortfolioList();
        showToast('Fotografía eliminada del portafolio');
      });
    });
  }

  function renderAdminPackagesEditor() {
    const container = document.getElementById('adminPackagesEditor');
    if (!container) return;

    const pkgs = siteData.packages.items || [];
    container.innerHTML = pkgs
      .map((pkg, idx) => `
        <div class="admin-pkg-editor-card" data-pkg-idx="${idx}">
          <div class="admin-field-row">
            <div class="admin-field">
              <label>Nombre del paquete</label>
              <input type="text" class="pkg-edit-name" value="${escapeAttr(pkg.name)}" />
            </div>
            <div class="admin-field">
              <label>Precio</label>
              <input type="text" class="pkg-edit-price" value="${escapeAttr(pkg.price)}" />
            </div>
          </div>
          <div class="admin-field-row">
            <div class="admin-field">
              <label>Duración</label>
              <input type="text" class="pkg-edit-duration" value="${escapeAttr(pkg.duration)}" />
            </div>
            <div class="admin-field">
              <label>Etiqueta superior</label>
              <input type="text" class="pkg-edit-badge" value="${escapeAttr(pkg.badge)}" />
            </div>
          </div>
          <div class="admin-field">
            <label>Descripción corta</label>
            <input type="text" class="pkg-edit-desc" value="${escapeAttr(pkg.description)}" />
          </div>
          <div class="admin-field">
            <label>Incluye (1 beneficio por línea)</label>
            <textarea class="pkg-edit-features" rows="4">${escapeHtml((pkg.features || []).join('\n'))}</textarea>
          </div>
        </div>
      `)
      .join('');
  }

  function renderAdminBookingsList() {
    const container = document.getElementById('adminBookingsList');
    if (!container) return;

    const list = getSavedBookings();
    if (!list.length) {
      container.innerHTML = `<p class="admin-help">Aún no hay solicitudes registradas desde este navegador.</p>`;
      return;
    }

    container.innerHTML = list
      .map(b => `
        <div class="admin-pkg-editor-card">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong>${escapeHtml(b.clientName)}</strong>
            <span style="font-size:0.74rem;color:var(--accent);">${escapeHtml(b.createdAt)}</span>
          </div>
          <span style="font-size:0.82rem;color:var(--text-secondary);">Contacto: ${escapeHtml(b.clientContact)}</span>
          <span style="font-size:0.82rem;color:#fff;">Paquete: ${escapeHtml(b.sessionPackage)}</span>
          <span style="font-size:0.78rem;color:var(--text-muted);">Fecha: ${escapeHtml(b.sessionDate)} · ${escapeHtml(b.sessionLocation)}</span>
          <p style="font-size:0.8rem;color:var(--text-secondary);margin-top:4px;">“${escapeHtml(b.sessionNotes)}”</p>
        </div>
      `)
      .join('');
  }

  function collectAdminFieldsIntoState() {
    siteData.hero.quote = getVal('adminHeroQuote') || siteData.hero.quote;
    siteData.hero.quoteAuthor = getVal('adminHeroAuthor') || siteData.hero.quoteAuthor;
    siteData.hero.subtitle = getVal('adminHeroSubtitle') || siteData.hero.subtitle;
    siteData.theme.heroAnimationStyle = getVal('adminHeroAnimStyle') || 'cinematic-drift';

    siteData.about.title = getVal('adminAboutTitle') || siteData.about.title;
    siteData.about.lead = getVal('adminAboutLead') || siteData.about.lead;
    siteData.about.paragraph1 = getVal('adminAboutP1') || siteData.about.paragraph1;
    siteData.about.paragraph2 = getVal('adminAboutP2') || siteData.about.paragraph2;
    siteData.about.portraitUrl = getVal('adminAboutPortraitUrl') || siteData.about.portraitUrl;

    siteData.brand.instagram = getVal('adminBrandIg') || siteData.brand.instagram;
    siteData.brand.whatsapp = getVal('adminBrandWa') || siteData.brand.whatsapp;
    siteData.brand.email = getVal('adminBrandEmail') || siteData.brand.email;

    // Paquetes
    const pkgCards = document.querySelectorAll('.admin-pkg-editor-card[data-pkg-idx]');
    pkgCards.forEach(card => {
      const idx = parseInt(card.getAttribute('data-pkg-idx'), 10);
      const target = siteData.packages.items[idx];
      if (!target) return;

      target.name = card.querySelector('.pkg-edit-name')?.value.trim() || target.name;
      target.price = card.querySelector('.pkg-edit-price')?.value.trim() || target.price;
      target.duration = card.querySelector('.pkg-edit-duration')?.value.trim() || target.duration;
      target.badge = card.querySelector('.pkg-edit-badge')?.value.trim() || target.badge;
      target.description = card.querySelector('.pkg-edit-desc')?.value.trim() || target.description;

      const rawFeatures = card.querySelector('.pkg-edit-features')?.value || '';
      target.features = rawFeatures
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean);
    });
  }

  /* ========================================================================
     UTILIDADES DOM & SEGURIDAD
     ======================================================================== */
  function setText(id, text) {
    const el = document.getElementById(id);
    if (el && text !== undefined && text !== null) {
      el.textContent = text;
    }
  }

  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el && val !== undefined && val !== null) {
      el.value = val;
    }
  }

  function getVal(id) {
    return document.getElementById(id)?.value.trim() || '';
  }

  function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const msgEl = document.getElementById('toastMessage');
    if (!toast || !msgEl) return;

    msgEl.textContent = message;
    toast.hidden = false;

    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      toast.hidden = true;
    }, 3400);
  }

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function escapeAttr(str) {
    return escapeHtml(str);
  }
})();

