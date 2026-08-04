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

const carousel = document.querySelector('.sample-carousel');

if (carousel) {
  const scrollSamples = (direction) => {
    carousel.scrollBy({ left: carousel.clientWidth * direction, behavior: 'smooth' });
  };

  document.querySelector('.carousel-prev').addEventListener('click', () => scrollSamples(-1));
  document.querySelector('.carousel-next').addEventListener('click', () => scrollSamples(1));

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
