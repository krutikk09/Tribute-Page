/* ============================================================
   KING KOHLI — Virat Kohli Tribute Page
   Complete Vanilla JavaScript  •  Production-Ready
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ----------------------------------------------------------
     UTILITIES
  ---------------------------------------------------------- */

  /** Linear interpolation */
  const lerp = (start, end, factor) => start + (end - start) * factor;

  /** Debounce helper */
  const debounce = (fn, ms = 100) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  };

  /** Throttle via rAF */
  const rafThrottle = (fn) => {
    let ticking = false;
    return (...args) => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          fn(...args);
          ticking = false;
        });
      }
    };
  };

  /** Format number with commas */
  const formatNumber = (n) => {
    const str = String(n);
    if (str.includes('.')) {
      const [intPart, dec] = str.split('.');
      return Number(intPart).toLocaleString('en-IN') + '.' + dec;
    }
    return Number(n).toLocaleString('en-IN');
  };

  /** Check mobile breakpoint */
  const isMobile = () => window.innerWidth < 768;

  /* ----------------------------------------------------------
     1. LOADING SCREEN
  ---------------------------------------------------------- */
  const loadingScreen  = document.getElementById('loading-screen');
  const loaderPct      = document.querySelector('.loader-percentage');
  const loaderBarFill  = document.querySelector('.loader-bar-fill');

  const runLoadingScreen = () => {
    if (!loadingScreen) { triggerHeroAnimations(); return; }

    document.body.style.overflow = 'hidden';

    const duration  = 3000;           // 3 seconds
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const pct      = Math.round(progress * 100);

      if (loaderPct)     loaderPct.textContent   = `${pct}%`;
      if (loaderBarFill) loaderBarFill.style.width = `${pct}%`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        // Finished — hide loading screen
        setTimeout(() => {
          loadingScreen.classList.add('hidden');
          document.body.style.overflow = '';
          triggerHeroAnimations();
        }, 400);
      }
    };

    requestAnimationFrame(tick);
  };

  /* ----------------------------------------------------------
     2. CUSTOM CURSOR
  ---------------------------------------------------------- */
  const cursor         = document.querySelector('.custom-cursor');
  const cursorFollower = document.querySelector('.cursor-follower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  const hoverTargets = 'a, button, .gallery-item, .record-card, .trophy-card, .admire-card, .stat-card, .innings-card, .fact-card';

  const initCursor = () => {
    if (!cursor || !cursorFollower) return;

    if (isMobile()) {
      cursor.style.display = 'none';
      cursorFollower.style.display = 'none';
      return;
    }

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top  = `${mouseY}px`;
    }, { passive: true });

    // Follower lerp loop
    const animateFollower = () => {
      followerX = lerp(followerX, mouseX, 0.15);
      followerY = lerp(followerY, mouseY, 0.15);
      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top  = `${followerY}px`;
      requestAnimationFrame(animateFollower);
    };
    requestAnimationFrame(animateFollower);

    // Hover state
    document.querySelectorAll(hoverTargets).forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
        cursorFollower.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
        cursorFollower.classList.remove('cursor-hover');
      });
    });
  };

  // Re-evaluate on resize
  window.addEventListener('resize', debounce(() => {
    if (!cursor || !cursorFollower) return;
    if (isMobile()) {
      cursor.style.display = 'none';
      cursorFollower.style.display = 'none';
    } else {
      cursor.style.display = '';
      cursorFollower.style.display = '';
    }
  }, 250));

  /* ----------------------------------------------------------
     3. SCROLL PROGRESS BAR
  ---------------------------------------------------------- */
  const scrollProgress = document.getElementById('scroll-progress');

  const updateScrollProgress = () => {
    if (!scrollProgress) return;
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPct    = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = `${scrollPct}%`;
  };

  /* ----------------------------------------------------------
     4. NAVBAR
  ---------------------------------------------------------- */
  const navbar   = document.getElementById('navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');

  const handleNavbarScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  const initNavbar = () => {
    // Mobile toggle
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
      });
    }

    // Nav link clicks
    document.querySelectorAll('.nav-links a').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
        // Close mobile nav
        if (navLinks) navLinks.classList.remove('active');
        if (navToggle) navToggle.classList.remove('active');
      });
    });
  };

  /* ----------------------------------------------------------
     15. 3D TILT EFFECT FOR CARDS
  ---------------------------------------------------------- */
  const initTiltEffect = () => {
    const tiltElements = document.querySelectorAll('.tilt-card');
    if (!tiltElements.length || isMobile()) return;

    tiltElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      });
    });
  };

  /* ----------------------------------------------------------
     16. NAVBAR ACTIVE STATE (on scroll)
  ---------------------------------------------------------- */
  const updateNavActiveState = () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 200;

    sections.forEach((section) => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-links a').forEach((a) => {
          a.classList.remove('active');
          if (a.getAttribute('href') === `#${id}`) {
            a.classList.add('active');
          }
        });
      }
    });
  };

  /* ----------------------------------------------------------
     5a. HERO — PARTICLE SYSTEM
  ---------------------------------------------------------- */
  const particleCanvas = document.getElementById('particles-canvas');

  const initParticles = () => {
    if (!particleCanvas) return;
    const ctx = particleCanvas.getContext('2d');
    let width  = particleCanvas.width  = particleCanvas.parentElement.offsetWidth;
    let height = particleCanvas.height = particleCanvas.parentElement.offsetHeight;

    const COLORS = [
      'rgba(255, 215, 0, 0.6)',   // gold
      'rgba(255, 193, 37, 0.5)',  // dark gold
      'rgba(30, 144, 255, 0.5)',  // dodger blue
      'rgba(0, 100, 200, 0.4)',   // blue
      'rgba(255, 255, 255, 0.3)', // white
    ];

    const PARTICLE_COUNT = isMobile() ? 35 : 80;
    const CONNECTION_DIST = 120;
    let particles = [];

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x      = Math.random() * width;
        this.y      = Math.random() * height;
        this.vx     = (Math.random() - 0.5) * 0.8;
        this.vy     = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2.5 + 0.8;
        this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width)  this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    };

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const opacity = 1 - dist / CONNECTION_DIST;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 215, 0, ${opacity * 0.25})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => { p.update(); p.draw(); });
      drawConnections();
      requestAnimationFrame(animate);
    };

    createParticles();
    animate();

    window.addEventListener('resize', debounce(() => {
      width  = particleCanvas.width  = particleCanvas.parentElement.offsetWidth;
      height = particleCanvas.height = particleCanvas.parentElement.offsetHeight;
      createParticles();
    }, 200));
  };

  /* ----------------------------------------------------------
     5b. HERO — ANIMATED COUNTERS (generic reusable)
  ---------------------------------------------------------- */
  const animateCounter = (el, target, duration = 2000) => {
    const start = performance.now();

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(eased * target);
      el.textContent = formatNumber(current);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  /* Counter with decimal support (e.g. 3.2) */
  const animateCounterDecimal = (el, target, duration = 2000) => {
    const start = performance.now();
    const decimals = (String(target).split('.')[1] || '').length;

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = (eased * target).toFixed(decimals);
      el.textContent = formatNumber(current);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  /* ----------------------------------------------------------
     5c. HERO — STAT COUNTERS (trigger once in view)
  ---------------------------------------------------------- */
  const heroStatsAnimated = new Set();

  const initHeroCounters = () => {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !heroStatsAnimated.has('hero')) {
          heroStatsAnimated.add('hero');
          document.querySelectorAll('.hero-stats .stat-number').forEach((el) => {
            const raw = el.getAttribute('data-target');
            const target = parseFloat(raw);
            if (!isNaN(target)) {
              if (raw.includes('.')) {
                animateCounterDecimal(el, target, 2200);
              } else {
                animateCounter(el, target, 2200);
              }
            }
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(heroSection);
  };

  /* ----------------------------------------------------------
     5d. HERO — TEXT ANIMATION
  ---------------------------------------------------------- */
  const triggerHeroAnimations = () => {
    // Title — letter-by-letter
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      const spans = heroTitle.querySelectorAll('span');
      spans.forEach((span, i) => {
        setTimeout(() => {
          span.style.opacity    = '1';
          span.style.transform  = 'translateY(0)';
          span.style.filter     = 'blur(0)';
        }, 100 + i * 60);
      });
    }

    // Subtitle — typing effect (Section 15)
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
      const fullText = heroSubtitle.getAttribute('data-text') || heroSubtitle.textContent;
      heroSubtitle.textContent = '';
      heroSubtitle.style.opacity = '1';
      heroSubtitle.style.visibility = 'visible';

      let charIdx = 0;
      const typingCursor = document.createElement('span');
      typingCursor.className = 'typing-cursor';
      typingCursor.textContent = '|';
      heroSubtitle.appendChild(typingCursor);

      const titleDelay = heroTitle
        ? heroTitle.querySelectorAll('span').length * 60 + 400
        : 400;

      setTimeout(() => {
        const typeInterval = setInterval(() => {
          if (charIdx < fullText.length) {
            heroSubtitle.insertBefore(
              document.createTextNode(fullText.charAt(charIdx)),
              typingCursor
            );
            charIdx++;
          } else {
            clearInterval(typeInterval);
            // Blink cursor then remove
            setTimeout(() => {
              typingCursor.classList.add('blink');
            }, 200);
          }
        }, 80);
      }, titleDelay);
    }

    // Quote
    const heroQuote = document.querySelector('.hero-quote');
    if (heroQuote) {
      setTimeout(() => {
        heroQuote.style.opacity   = '1';
        heroQuote.style.transform = 'translateY(0)';
      }, 2200);
    }

    // Buttons
    const heroButtons = document.querySelector('.hero-buttons');
    if (heroButtons) {
      setTimeout(() => {
        heroButtons.style.opacity   = '1';
        heroButtons.style.transform = 'translateY(0)';
      }, 2600);
    }
  };

  /* ----------------------------------------------------------
     6. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  ---------------------------------------------------------- */
  const initScrollReveals = () => {
    const revealClasses = [
      '.reveal', '.reveal-left', '.reveal-right',
      '.timeline-card', '.stat-card', '.record-card',
      '.trophy-card', '.admire-card', '.gallery-item',
      '.innings-card', '.impact-card', '.social-card', '.fact-card',
    ];

    const selector = revealClasses.join(', ');
    const elements = document.querySelectorAll(selector);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-delay') || 0;
          setTimeout(() => {
            entry.target.classList.add('active');
          }, Number(delay));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    elements.forEach((el) => observer.observe(el));
  };

  /* ----------------------------------------------------------
     7. ANIMATED COUNTERS — Stats Dashboard & Social
  ---------------------------------------------------------- */
  const dashboardAnimated = new Set();

  const initDashboardCounters = () => {
    // Stat card numbers
    const statSection = document.querySelector('.stats-dashboard') ||
                        document.getElementById('stats');
    if (statSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !dashboardAnimated.has('stats')) {
            dashboardAnimated.add('stats');

            document.querySelectorAll('.stat-card-number').forEach((el) => {
              const raw = el.getAttribute('data-target');
              const target = parseFloat(raw);
              if (!isNaN(target)) {
                if (raw.includes('.')) {
                  animateCounterDecimal(el, target, 2000);
                } else {
                  animateCounter(el, target, 2000);
                }
              }
            });

            // Animate bar fills
            document.querySelectorAll('.stat-card-bar-fill').forEach((bar) => {
              const w = bar.getAttribute('data-width') || '0%';
              setTimeout(() => { bar.style.width = w; }, 300);
            });

            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      observer.observe(statSection);
    }

    // Social numbers
    const socialSection = document.querySelector('.social-section') ||
                          document.getElementById('social');
    if (socialSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !dashboardAnimated.has('social')) {
            dashboardAnimated.add('social');

            document.querySelectorAll('.social-number').forEach((el) => {
              const raw = el.getAttribute('data-target');
              const target = parseFloat(raw);
              if (!isNaN(target)) {
                if (raw.includes('.')) {
                  animateCounterDecimal(el, target, 2000);
                } else {
                  animateCounter(el, target, 2000);
                }
              }
            });

            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      observer.observe(socialSection);
    }
  };

  /* ----------------------------------------------------------
     8. TIMELINE ANIMATIONS
  ---------------------------------------------------------- */
  const initTimeline = () => {
    const timelineCards = document.querySelectorAll('.timeline-card');
    if (!timelineCards.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Pulse dot
          const dot = entry.target.querySelector('.timeline-dot');
          if (dot) dot.classList.add('pulse');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    timelineCards.forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.15}s`;
      observer.observe(card);
    });
  };

  /* ----------------------------------------------------------
     9a. GALLERY — FILTER
  ---------------------------------------------------------- */
  const initGalleryFilter = () => {
    const filterBtns   = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (!filterBtns.length || !galleryItems.length) return;

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Active state
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-category') || btn.getAttribute('data-filter') || 'all';

        galleryItems.forEach((item) => {
          const itemCat = item.getAttribute('data-category') || '';
          if (category === 'all' || itemCat === category) {
            item.style.opacity   = '0';
            item.style.transform = 'scale(0.8)';
            item.style.display   = '';
            // Force reflow
            void item.offsetHeight;
            setTimeout(() => {
              item.style.opacity   = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity   = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 400);
          }
        });
      });
    });
  };

  /* ----------------------------------------------------------
     9b. GALLERY — LIGHTBOX
  ---------------------------------------------------------- */
  const initLightbox = () => {
    const lightbox      = document.querySelector('.lightbox');
    const lightboxImg   = document.querySelector('.lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryItems  = document.querySelectorAll('.gallery-item');
    if (!lightbox || !lightboxImg) return;

    const openLightbox = (src) => {
      lightboxImg.src = src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => { lightboxImg.src = ''; }, 300);
    };

    galleryItems.forEach((item) => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) openLightbox(img.src);
      });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  };

  /* ----------------------------------------------------------
     10. QUOTES CAROUSEL
  ---------------------------------------------------------- */
  const initQuotesCarousel = () => {
    const slides = document.querySelectorAll('.quote-slide');
    const dots   = document.querySelectorAll('.quote-dot');
    if (!slides.length) return;

    let current  = 0;
    let interval = null;
    let paused   = false;

    const showSlide = (idx) => {
      slides.forEach((s, i) => {
        s.classList.toggle('active', i === idx);
        s.style.opacity = i === idx ? '1' : '0';
        s.style.position = i === idx ? 'relative' : 'absolute';
      });
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      current = idx;
    };

    const nextSlide = () => {
      if (paused) return;
      showSlide((current + 1) % slides.length);
    };

    const startAuto = () => {
      clearInterval(interval);
      interval = setInterval(nextSlide, 5000);
    };

    // Dot clicks
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        showSlide(i);
        startAuto();
      });
    });

    // Pause on hover
    const carousel = document.querySelector('.quotes-carousel') ||
                     document.querySelector('.quotes-section');
    if (carousel) {
      carousel.addEventListener('mouseenter', () => { paused = true; });
      carousel.addEventListener('mouseleave', () => { paused = false; });
    }

    showSlide(0);
    startAuto();
  };

  /* ----------------------------------------------------------
     11. FUN FACTS FLIP (touch support)
  ---------------------------------------------------------- */
  const initFactCards = () => {
    const factInners = document.querySelectorAll('.fact-card-inner');
    if (!factInners.length) return;

    factInners.forEach((card) => {
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
      });
      card.addEventListener('touchstart', (e) => {
        // Prevent double-fire on devices that also fire click
        e.preventDefault();
        card.classList.toggle('flipped');
      }, { passive: false });
    });
  };

  /* ----------------------------------------------------------
     12. PARALLAX EFFECT
  ---------------------------------------------------------- */
  const hero          = document.getElementById('hero');
  const parallaxQuote = document.getElementById('parallax-quote');

  const updateParallax = () => {
    const scrollY = window.scrollY;
    if (hero) {
      hero.style.backgroundPositionY = `${scrollY * 0.35}px`;
    }
    if (parallaxQuote) {
      parallaxQuote.style.backgroundPositionY = `${scrollY * 0.25}px`;
    }
  };

  /* ----------------------------------------------------------
     13. BACK TO TOP
  ---------------------------------------------------------- */
  const backToTop = document.getElementById('back-to-top');

  const handleBackToTop = () => {
    if (!backToTop) return;
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  };

  const initBackToTop = () => {
    if (!backToTop) return;
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  /* ----------------------------------------------------------
     14. SMOOTH SECTION TRANSITIONS (stagger grid children)
  ---------------------------------------------------------- */
  const initStaggeredDelays = () => {
    const gridContainers = [
      '.admire-cards',
      '.records-grid',
      '.trophies-grid',
      '.stats-grid',
      '.innings-grid',
      '.impact-grid',
      '.social-grid',
      '.facts-grid',
      '.gallery-grid',
    ];

    gridContainers.forEach((selector) => {
      const container = document.querySelector(selector);
      if (!container) return;
      Array.from(container.children).forEach((child, i) => {
        child.style.transitionDelay = `${i * 0.1}s`;
      });
    });
  };

  /* ----------------------------------------------------------
     COMBINED SCROLL HANDLER (debounced / rAF-throttled)
  ---------------------------------------------------------- */
  const onScroll = rafThrottle(() => {
    updateScrollProgress();
    handleNavbarScroll();
    updateNavActiveState();
    handleBackToTop();
    updateParallax();
  });

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ----------------------------------------------------------
     17. PAGE LOAD SEQUENCE — Orchestrate everything
  ---------------------------------------------------------- */

  // Immediate setup (before loading completes)
  initCursor();
  initNavbar();
  initParticles();
  initBackToTop();
  initStaggeredDelays();

  // Start loading animation → triggers hero on complete
  runLoadingScreen();

  // Setup observers & listeners (independent of load screen)
  initHeroCounters();
  initScrollReveals();
  initDashboardCounters();
  initTimeline();
  initGalleryFilter();
  initLightbox();
  initQuotesCarousel();
  initFactCards();
  initTiltEffect();

  // Initial scroll state in case page loads mid-scroll
  updateScrollProgress();
  handleNavbarScroll();
  handleBackToTop();
  updateNavActiveState();
});
