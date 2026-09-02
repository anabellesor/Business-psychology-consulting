const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-nav');

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  navigation.classList.toggle('open', !open);
});

navigation.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
});

const contactForm = document.querySelector('#contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = document.querySelector('#formStatus');
    const submitButton = form.querySelector('button[type="submit"]');

    if (!form.checkValidity()) {
      form.reportValidity();
      status.textContent = 'Please complete all required fields.';
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
    status.textContent = '';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) throw new Error('Submission failed');

      status.textContent = "Thank you for contacting us. Your message has been sent!";
      form.reset();
    } catch (error) {
      status.textContent = 'Sorry, your message could not be sent. Please email contact@businesspsychologyconsulting.com directly.';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Send';
    }
  });
}

document.querySelectorAll('.sample-carousel-wrap').forEach((wrap) => {
  const carousel = wrap.querySelector('.sample-carousel');
  const previousButton = wrap.querySelector('.carousel-prev');
  const nextButton = wrap.querySelector('.carousel-next');

  if (!carousel || !previousButton || !nextButton) return;

  const scrollSamples = (direction) => {
    const firstSlide = carousel.firstElementChild;
    const gap = Number.parseFloat(getComputedStyle(carousel).gap) || 0;
    const distance = (firstSlide?.getBoundingClientRect().width || carousel.clientWidth) + gap;
    carousel.scrollBy({ left: distance * direction, behavior: 'smooth' });
  };

  previousButton.addEventListener('click', () => scrollSamples(-1));
  nextButton.addEventListener('click', () => scrollSamples(1));
});

const marketingCarousel = document.querySelector('.marketing-samples .sample-carousel');
const lightbox = document.querySelector('.sample-lightbox');

if (marketingCarousel && lightbox) {
  const lightboxImage = lightbox.querySelector('img');
  const lightboxVideo = lightbox.querySelector('video');

  const stopVideo = () => {
    lightboxVideo.pause();
    lightboxVideo.removeAttribute('src');
    lightboxVideo.load();
  };

  marketingCarousel.querySelectorAll('.sample-slide').forEach((slide) => {
    slide.addEventListener('click', () => {
      const image = slide.querySelector('img');
      const videoSource = slide.dataset.videoSrc;

      if (videoSource) {
        lightboxImage.hidden = true;
        lightboxVideo.hidden = false;
        lightboxVideo.src = videoSource;
      } else {
        stopVideo();
        lightboxVideo.hidden = true;
        lightboxImage.hidden = false;
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
      }

      lightbox.showModal();
      if (videoSource) lightboxVideo.play().catch(() => {});
    });
  });

  const closeLightbox = () => {
    stopVideo();
    lightbox.close();
  };

  lightbox.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  const immediateFadeItems = document.querySelectorAll(
    '.site-header .brand, .site-header nav a, .hero .portrait, .hero-copy > *'
  );
  const immediateSlideItems = document.querySelectorAll('.team-profile');
  const observedFadeItems = document.querySelectorAll('.site-footer > *');
  const observedSlideItems = document.querySelectorAll(
    '.wix-mission > *, .wix-research-intro > *, .wix-research-grid article > *, .wix-research-button, .research-page-hero h1, .about-hero > *'
  );

  immediateFadeItems.forEach((item) => item.classList.add('wix-motion-fade'));
  immediateSlideItems.forEach((item) => item.classList.add('wix-motion-slide'));
  observedFadeItems.forEach((item) => item.classList.add('wix-motion-fade'));
  observedSlideItems.forEach((item) => item.classList.add('wix-motion-slide'));
  document.documentElement.classList.add('wix-page-motion-ready');

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      immediateFadeItems.forEach((item) => item.classList.add('is-visible'));
      immediateSlideItems.forEach((item) => item.classList.add('is-visible'));
    });
  });

  const revealImmediately = (items) => {
    items.forEach((item) => item.classList.add('is-visible'));
  };

  if ('IntersectionObserver' in window) {
    const motionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    observedFadeItems.forEach((item) => motionObserver.observe(item));
    observedSlideItems.forEach((item) => motionObserver.observe(item));
  } else {
    revealImmediately(observedFadeItems);
    revealImmediately(observedSlideItems);
  }
}



const recommendationCarousel = document.querySelector('.recommendation-carousel');

if (recommendationCarousel) {
  const scrollRecommendations = (direction) => {
    const card = recommendationCarousel.querySelector('.recommendation-preview');
    const gap = Number.parseFloat(getComputedStyle(recommendationCarousel).gap) || 0;
    const distance = (card?.getBoundingClientRect().width || recommendationCarousel.clientWidth) + gap;

    recommendationCarousel.scrollBy({
      left: distance * direction,
      behavior: 'smooth'
    });
  };

  document.querySelector('.recommendation-prev')?.addEventListener('click', () => scrollRecommendations(-1));
  document.querySelector('.recommendation-next')?.addEventListener('click', () => scrollRecommendations(1));
}

const positionHeroGrowthLine = () => {
  const svg = document.querySelector('.hero-growth-line');
  const headline = document.querySelector('.hero-copy h1');
  const supportingCopy = document.querySelector('.hero-copy > p');

  if (!svg || !headline || !supportingCopy) return;

  const svgRect = svg.getBoundingClientRect();
  const headlineRect = headline.getBoundingClientRect();
  const copyRect = supportingCopy.getBoundingClientRect();
  if (!svgRect.width || !svgRect.height) return;

  const scaleX = 1280 / svgRect.width;
  const scaleY = 600 / svgRect.height;
  const toX = (value) => (value - svgRect.left) * scaleX;
  const toY = (value) => (value - svgRect.top) * scaleY;
  const left = toX(headlineRect.left);
  const right = toX(headlineRect.right);
  const width = right - left;
  const openTop = toY(headlineRect.bottom) + 12 * scaleY;
  const openBottom = toY(copyRect.top) - 12 * scaleY;
  const gap = Math.max(18, openBottom - openTop);
  const peakOne = openTop + gap * .72;
  const peakTwo = openTop + gap * .45;
  const peakThree = openTop + gap * .18;
  const valley = openBottom - 2;

  const points = [
    [-30, 545],
    [Math.max(70, left - 230), 510],
    [Math.max(120, left - 135), 530],
    [left - 38, peakOne],
    [left + width * .12, valley],
    [left + width * .34, peakOne],
    [left + width * .49, valley],
    [left + width * .68, peakTwo],
    [left + width * .80, valley],
    [right - 28, peakThree],
    [right + 32, valley],
    [right + 86, Math.max(78, openTop - 105)],
    [right + 155, Math.max(110, openTop - 55)],
    [1280, 55]
  ];

  const pathData = points.map(([x, y], index) => `${index ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  svg.querySelectorAll('.hero-growth-line-base,.hero-growth-line-draw,.hero-growth-line-sweep').forEach((path) => {
    path.setAttribute('d', pathData);
  });

  const markerPoints = [points[3], points[5], points[7], points[9], points[11]];
  svg.querySelectorAll('.hero-growth-points circle').forEach((circle, index) => {
    const point = markerPoints[index];
    if (!point) return;
    circle.setAttribute('cx', point[0].toFixed(1));
    circle.setAttribute('cy', point[1].toFixed(1));
  });

  svg.style.visibility = 'visible';
};

let heroLineResizeFrame;
const queueHeroLinePosition = () => {
  cancelAnimationFrame(heroLineResizeFrame);
  heroLineResizeFrame = requestAnimationFrame(positionHeroGrowthLine);
};

positionHeroGrowthLine();
document.fonts?.ready.then(positionHeroGrowthLine);
window.addEventListener('resize', queueHeroLinePosition, { passive: true });
