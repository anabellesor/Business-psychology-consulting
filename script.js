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

document.querySelector('#contactForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.querySelector('#formStatus');

  if (!form.checkValidity()) {
    form.reportValidity();
    status.textContent = 'Please complete all required fields.';
    return;
  }

  status.textContent = "Thank you for contacting us. We'll get back to you soon!";
  form.reset();
});

const carousel = document.querySelector('.sample-carousel');

if (carousel) {
  const scrollSamples = (direction) => {
    carousel.scrollBy({ left: carousel.clientWidth * direction, behavior: 'smooth' });
  };

  const previousControl = document.querySelector('.carousel-prev');
  const nextControl = document.querySelector('.carousel-next');

  const updateCarouselControls = () => {
    previousControl.hidden = carousel.scrollLeft < 5;
    nextControl.hidden = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 5;
  };

  previousControl.addEventListener('click', () => scrollSamples(-1));
  nextControl.addEventListener('click', () => scrollSamples(1));
  carousel.addEventListener('scroll', updateCarouselControls, { passive: true });
  updateCarouselControls();

  const lightbox = document.querySelector('.sample-lightbox');
  const lightboxImage = lightbox.querySelector('img');
  const lightboxVideo = lightbox.querySelector('video');

  const stopVideo = () => {
    lightboxVideo.pause();
    lightboxVideo.removeAttribute('src');
    lightboxVideo.load();
  };

  document.querySelectorAll('.sample-slide').forEach((slide) => {
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

  document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
}
