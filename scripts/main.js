const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DEFAULT_EMAIL = 'bringoxin@gmail.com';
const EASING_CSS = 'cubic-bezier(0.16, 1, 0.3, 1)';
const TOAST_DURATION_MS = 2600;

/**
 * Load Anime.js v4 dynamically with graceful fallback when unavailable.
 * @returns {Promise<{ animate: Function, stagger: Function, easeOutExpo: Function } | null>}
 */
async function loadMotionEngine() {
  try {
    const anime = await import('./vendor/anime.esm.js');
    if (anime && typeof anime.animate === 'function') {
      const easeOutExpo =
        typeof anime.cubicBezier === 'function'
          ? anime.cubicBezier(0.16, 1, 0.3, 1)
          : anime.eases?.outExpo ?? 'outExpo';
      const staggerFn =
        typeof anime.stagger === 'function'
          ? anime.stagger
          : (step) => (_target, index = 0) => index * step;

      return {
        animate: anime.animate,
        stagger: staggerFn,
        easeOutExpo,
      };
    }
  } catch {
    // Fall back to Web Animations API if Anime.js bundle cannot be loaded.
  }
  return null;
}

/**
 * Clear inline transform/opacity styles once an animation completes.
 * @param {HTMLElement[]} elements
 */
function finalizeRevealedElements(elements) {
  elements.forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = '';
  });
}

/**
 * Animate elements with Anime.js v4, falling back to WAAPI or instant reveal.
 * @param {HTMLElement[]} elements
 * @param {{
 *   motion: Awaited<ReturnType<typeof loadMotionEngine>>,
 *   animeParams: Record<string, unknown>,
 *   waapiKeyframes: (el: HTMLElement, index: number) => Keyframe[],
 *   duration: number,
 *   delay?: number,
 *   staggerMs?: number,
 * }} config
 */
function animateElements(elements, config) {
  if (!elements.length) return;
  const { motion, animeParams, waapiKeyframes, duration, delay = 0, staggerMs = 0 } = config;

  if (motion) {
    try {
      motion.animate(elements, {
        ...animeParams,
        duration,
        delay: staggerMs > 0 ? motion.stagger(staggerMs) : delay,
        ease: motion.easeOutExpo,
        onComplete: () => finalizeRevealedElements(elements),
      });
      return;
    } catch {
      // Fall back to WAAPI if Anime.js throws at runtime.
    }
  }

  elements.forEach((el, index) => {
    const itemDelay = staggerMs > 0 ? index * staggerMs : delay;
    if (typeof el.animate === 'function') {
      try {
        const anim = el.animate(waapiKeyframes(el, index), {
          duration,
          delay: itemDelay,
          easing: EASING_CSS,
          fill: 'both',
        });
        anim.onfinish = () => finalizeRevealedElements([el]);
        return;
      } catch {
        // Snap visible if WAAPI throws.
      }
    }
    finalizeRevealedElements([el]);
  });
}

/**
 * Hero entrance animation (Figma 2835:328).
 * @param {Promise<Awaited<ReturnType<typeof loadMotionEngine>>>} motionPromise
 * @param {boolean} prefersReducedMotion
 */
function initHeroAnimation(motionPromise, prefersReducedMotion) {
  if (prefersReducedMotion) return;

  const specs = [
    {
      el: document.querySelector('[data-hero-portrait]'),
      initialTransform: 'scale(0.95)',
      animeProps: { scale: [0.95, 1], opacity: [0, 1] },
      waapiFrom: { opacity: 0, transform: 'scale(0.95)' },
    },
    {
      el: document.querySelector('[data-hero-heading]'),
      initialTransform: 'translateY(40px)',
      animeProps: { translateY: [40, 0], opacity: [0, 1] },
      waapiFrom: { opacity: 0, transform: 'translateY(40px)' },
    },
    {
      el: document.querySelector('[data-hero-copy]'),
      initialTransform: 'translateY(60px)',
      animeProps: { translateY: [60, 0], opacity: [0, 1] },
      waapiFrom: { opacity: 0, transform: 'translateY(60px)' },
    },
  ].filter((spec) => spec.el instanceof HTMLElement);

  if (!specs.length) return;

  // Apply initial state synchronously so hero elements never flash before async engine loads.
  specs.forEach(({ el, initialTransform }) => {
    el.style.opacity = '0';
    el.style.transform = initialTransform;
  });

  motionPromise.then((resolvedMotion) => {
    specs.forEach(({ el, animeProps, waapiFrom }) => {
      animateElements([el], {
        motion: resolvedMotion,
        animeParams: animeProps,
        waapiKeyframes: () => [waapiFrom, { opacity: 1, transform: 'none' }],
        duration: 800,
        delay: 100,
      });
    });
  });
}

/**
 * Scroll-triggered staggered reveals for [data-reveal-group] / [data-reveal-item].
 * @param {Promise<Awaited<ReturnType<typeof loadMotionEngine>>>} motionPromise
 * @param {boolean} prefersReducedMotion
 */
function initScrollReveals(motionPromise, prefersReducedMotion) {
  const groups = Array.from(document.querySelectorAll('[data-reveal-group]'));
  if (!groups.length || prefersReducedMotion) return;

  const unrevealed = new Set(groups);

  groups.forEach((group) => {
    const items = group.querySelectorAll('[data-reveal-item]');
    items.forEach((item) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(32px)';
    });
  });

  const revealGroup = (group, observer) => {
    if (!unrevealed.has(group)) return;
    unrevealed.delete(group);
    observer?.unobserve(group);

    const items = Array.from(group.querySelectorAll('[data-reveal-item]'));
    if (!items.length) return;

    motionPromise.then((motion) => {
      animateElements(items, {
        motion,
        animeParams: {
          translateY: [32, 0],
          opacity: [0, 1],
        },
        waapiKeyframes: () => [
          { opacity: 0, transform: 'translateY(32px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        duration: 650,
        staggerMs: 80,
      });
    });
  };

  if (!('IntersectionObserver' in window)) {
    groups.forEach((group) => revealGroup(group, null));
    return;
  }

  const isInOrAboveViewport = (el) => {
    const rect = el.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    return rect.top < viewportHeight * 0.92;
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight) {
          revealGroup(entry.target, observer);
        }
      });
      if (!unrevealed.size) {
        observer.disconnect();
      }
    },
    { threshold: 0.15 }
  );

  // Immediately reveal groups already visible within or scrolled past the viewport.
  groups.forEach((group) => {
    if (isInOrAboveViewport(group)) {
      revealGroup(group, observer);
    } else {
      observer.observe(group);
    }
  });

  // Fallback for tall groups on short mobile viewports where 15% ratio may lag.
  if (unrevealed.size) {
    const onScrollCheck = () => {
      Array.from(unrevealed).forEach((group) => {
        if (isInOrAboveViewport(group)) {
          revealGroup(group, observer);
        }
      });
      if (!unrevealed.size) {
        window.removeEventListener('scroll', onScrollCheck);
      }
    };
    window.addEventListener('scroll', onScrollCheck, { passive: true });
  }
}

/**
 * Scroll smoothly to a target element or page top while respecting reduced motion.
 * @param {string} hash
 * @param {boolean} prefersReducedMotion
 */
function scrollToHash(hash, prefersReducedMotion) {
  const behavior = prefersReducedMotion ? 'auto' : 'smooth';
  const id = hash.startsWith('#') ? hash.slice(1) : hash;

  if (!id || id === 'top') {
    const topEl = id ? document.getElementById(id) : null;
    if (!topEl || topEl.getBoundingClientRect().top + window.scrollY < 160) {
      window.scrollTo({ top: 0, behavior });
      return true;
    }
    topEl.scrollIntoView({ behavior, block: 'start' });
    return true;
  }

  const target = document.getElementById(id);
  if (!target) return false;
  target.scrollIntoView({ behavior, block: 'start' });
  return true;
}

/**
 * Navigation drawer toggle + smooth anchor scrolling (including [data-back-to-top]).
 * @param {boolean} prefersReducedMotion
 */
function initNavigation(prefersReducedMotion) {
  const toggle = document.querySelector('[data-nav-toggle]');
  const drawer = document.querySelector('[data-nav-drawer]');

  const closeDrawer = (restoreFocus = false) => {
    if (!toggle || !drawer) return;
    drawer.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    if (restoreFocus) {
      toggle.focus();
    }
  };

  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      const nextOpen = !drawer.classList.contains('open');
      drawer.classList.toggle('open', nextOpen);
      toggle.setAttribute('aria-expanded', String(nextOpen));
    });

    drawer.addEventListener('click', (event) => {
      if (event.target instanceof Element && event.target.closest('a')) {
        closeDrawer(false);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && drawer.classList.contains('open')) {
        const activeInNav =
          document.activeElement instanceof Node &&
          (drawer.contains(document.activeElement) || toggle.contains(document.activeElement));
        closeDrawer(activeInNav);
      }
    });

    document.addEventListener('click', (event) => {
      if (!drawer.classList.contains('open')) return;
      if (!(event.target instanceof Node)) return;
      const nav = toggle.closest('.site-nav');
      if (nav && !nav.contains(event.target)) {
        closeDrawer(false);
      }
    });
  }

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const anchor = event.target.closest('a[href^="#"], [data-back-to-top]');
    if (!anchor) return;
    if (anchor.getAttribute('aria-disabled') === 'true') return;

    const href = anchor.getAttribute('href') || '#top';
    if (!href.startsWith('#')) return;

    const didScroll = scrollToHash(href, prefersReducedMotion);
    if (didScroll) {
      event.preventDefault();
      closeDrawer(false);
    }
  });
}

/**
 * Case study chapter buttons and scroll-spy active highlighting.
 * @param {boolean} prefersReducedMotion
 */
function initChapterNavigation(prefersReducedMotion) {
  const buttons = Array.from(document.querySelectorAll('[data-chapter-btn]'));
  if (!buttons.length) return;

  const sections = buttons
    .map((btn) => {
      const id = btn.dataset.chapterBtn;
      const section = id ? document.getElementById(id) : null;
      return section ? { btn, id, section } : null;
    })
    .filter(Boolean);

  if (!sections.length) return;

  const setActiveButton = (activeId) => {
    buttons.forEach((btn) => {
      const isActive = btn.dataset.chapterBtn === activeId;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  };

  if (!buttons.some((btn) => btn.classList.contains('is-active'))) {
    setActiveButton(sections[0].id);
  }

  let lockSpyUntil = 0;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.chapterBtn;
      if (!targetId) return;
      const targetEl = document.getElementById(targetId);
      setActiveButton(targetId);
      lockSpyUntil = Date.now() + 700;
      if (targetEl) {
        targetEl.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      }
    });
  });

  if ('IntersectionObserver' in window) {
    const visibleIds = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleIds.add(entry.target.id);
          } else {
            visibleIds.delete(entry.target.id);
          }
        });

        if (Date.now() < lockSpyUntil || !visibleIds.size) return;
        const firstVisible = sections.find(({ id }) => visibleIds.has(id));
        if (firstVisible) {
          setActiveButton(firstVisible.id);
        }
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0, 0.25],
      }
    );

    sections.forEach(({ section }) => observer.observe(section));
  }
}

/**
 * Copy text to clipboard with textarea fallback.
 * @param {string} text
 * @returns {Promise<boolean>}
 */
async function copyToClipboard(text) {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall back to execCommand below.
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, text.length);

  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch {
    copied = false;
  } finally {
    textarea.remove();
  }
  return copied;
}

/**
 * Copy email buttons and toast notification.
 */
function initCopyEmail() {
  const buttons = document.querySelectorAll('[data-copy-email]');
  const toast = document.querySelector('[data-toast]');
  if (!buttons.length) return;

  let hideTimer = null;

  const showToast = (message) => {
    if (!toast) return;
    if (hideTimer) {
      clearTimeout(hideTimer);
    }
    toast.textContent = message;
    toast.hidden = false;
    toast.classList.add('is-visible');

    hideTimer = window.setTimeout(() => {
      toast.classList.remove('is-visible');
      toast.hidden = true;
      hideTimer = null;
    }, TOAST_DURATION_MS);
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const email = (btn.dataset.copyEmail || DEFAULT_EMAIL).trim() || DEFAULT_EMAIL;
      await copyToClipboard(email);
      showToast(`Copied ${email} to clipboard`);
    });
  });
}

/**
 * Contact form validation and confirmation view with pre-filled mailto link.
 */
function initContactForm() {
  const forms = document.querySelectorAll('[data-contact-form]');
  if (!forms.length) return;

  forms.forEach((form) => {
    const nameInput = form.querySelector('[name="name"]');
    const emailInput = form.querySelector('[name="email"]');
    const messageInput = form.querySelector('[name="message"]');
    if (!nameInput || !emailInput || !messageInput) return;

    let confirmation =
      form.parentElement?.querySelector('[data-form-confirmation]') ||
      document.querySelector('[data-form-confirmation]');

    const getErrorSlot = (input, key) => {
      const explicit = form.querySelector(`[data-error="${key}"]`);
      if (explicit) return explicit;

      const wrapper = input.closest('.form-group, .contact-card__row, .form-field') || input.parentElement;
      let existing = wrapper?.querySelector('.form-error');
      if (!existing && wrapper) {
        existing = document.createElement('p');
        existing.className = 'form-error';
        existing.setAttribute('aria-live', 'polite');
        wrapper.appendChild(existing);
      }
      return existing || null;
    };

    const setFieldError = (input, key, message) => {
      const slot = getErrorSlot(input, key);
      if (message) {
        input.setAttribute('aria-invalid', 'true');
        input.classList.add('is-invalid');
        if (slot) slot.textContent = message;
      } else {
        input.removeAttribute('aria-invalid');
        input.classList.remove('is-invalid');
        if (slot) slot.textContent = '';
      }
    };

    const validators = {
      name: () => (nameInput.value.trim().length > 0 ? '' : 'Please enter your name.'),
      email: () =>
        EMAIL_REGEX.test(emailInput.value.trim()) ? '' : 'Please enter a valid email address.',
      message: () =>
        messageInput.value.trim().length >= 10
          ? ''
          : 'Please enter a message of at least 10 characters.',
    };

    const inputsByKey = {
      name: nameInput,
      email: emailInput,
      message: messageInput,
    };

    Object.entries(inputsByKey).forEach(([key, input]) => {
      input.addEventListener('input', () => {
        if (input.getAttribute('aria-invalid') === 'true') {
          setFieldError(input, key, validators[key]());
        }
      });
    });

    const renderConfirmation = (name, email, message) => {
      const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      const mailtoHref = `mailto:${DEFAULT_EMAIL}?subject=${subject}&body=${body}`;

      if (!confirmation) {
        confirmation = document.createElement('div');
        confirmation.className = 'contact-card form-confirmation';
        confirmation.setAttribute('data-form-confirmation', '');
        form.insertAdjacentElement('afterend', confirmation);
      }

      const existingLink = confirmation.querySelector('[data-mailto-link], a[href^="mailto:"]');
      const existingReset = confirmation.querySelector('[data-form-reset], button');

      if (existingLink && existingReset) {
        existingLink.setAttribute('href', mailtoHref);
        const summary = confirmation.querySelector('[data-confirmation-summary]');
        if (summary) {
          summary.textContent = `Thanks, ${name}. Your draft is ready to open in your email client.`;
        }
      } else {
        confirmation.replaceChildren();

        const heading = document.createElement('h3');
        heading.textContent = 'Message ready to send';

        const copy = document.createElement('p');
        copy.textContent = `Thanks, ${name}. Open your email client below with your details pre-filled for ${DEFAULT_EMAIL}.`;

        const actions = document.createElement('div');
        actions.className = 'form-confirmation__actions';

        const mailtoLink = document.createElement('a');
        mailtoLink.className = 'btn-primary';
        mailtoLink.href = mailtoHref;
        mailtoLink.setAttribute('data-mailto-link', '');
        mailtoLink.textContent = 'Open Email Draft ↗';

        const resetBtn = document.createElement('button');
        resetBtn.type = 'button';
        resetBtn.className = 'btn-secondary';
        resetBtn.setAttribute('data-form-reset', '');
        resetBtn.textContent = 'Send Another Message';

        actions.append(mailtoLink, resetBtn);
        confirmation.append(heading, copy, actions);
      }

      const isNestedInForm = form.contains(confirmation);
      const toggleFormFields = (hidden) => {
        if (isNestedInForm) {
          Array.from(form.children).forEach((child) => {
            if (child !== confirmation) {
              child.hidden = hidden;
            }
          });
        } else {
          form.hidden = hidden;
        }
      };

      const resetBtn = confirmation.querySelector('[data-form-reset], button');
      if (resetBtn && !resetBtn.dataset.boundReset) {
        resetBtn.dataset.boundReset = 'true';
        resetBtn.addEventListener('click', () => {
          form.reset();
          Object.entries(inputsByKey).forEach(([key, input]) => setFieldError(input, key, ''));
          confirmation.hidden = true;
          toggleFormFields(false);
          nameInput.focus();
        });
      }

      toggleFormFields(true);
      confirmation.hidden = false;
    };

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      let firstInvalid = null;
      Object.entries(inputsByKey).forEach(([key, input]) => {
        const error = validators[key]();
        setFieldError(input, key, error);
        if (error && !firstInvalid) {
          firstInvalid = input;
        }
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      renderConfirmation(
        nameInput.value.trim(),
        emailInput.value.trim(),
        messageInput.value.trim()
      );
    });
  });
}

function init() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motionPromise = prefersReducedMotion ? Promise.resolve(null) : loadMotionEngine();

  initHeroAnimation(motionPromise, prefersReducedMotion);
  initScrollReveals(motionPromise, prefersReducedMotion);
  initNavigation(prefersReducedMotion);
  initChapterNavigation(prefersReducedMotion);
  initCopyEmail();
  initContactForm();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
