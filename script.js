// =============================================
// IMRAN MAQSOOD PORTFOLIO — SCRIPT.JS
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ============ PARTICLE CANVAS ============
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.4 + 0.05;
      this.color = Math.random() > 0.7 ? '#00ffe7' : '#0077ff';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // Create particles
  for (let i = 0; i < 120; i++) particles.push(new Particle());

  // Draw connecting lines
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 255, 231, ${0.08 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();


  // ============ NAVBAR SCROLL ============
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    // Back to top
    document.getElementById('backTop').classList.toggle('visible', window.scrollY > 400);
  });


  // ============ HAMBURGER MENU ============
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
  });

  window.closeMobile = () => {
    mobileMenu.classList.remove('active');
  };


  // ============ TYPEWRITER ============
  const phrases = [
    'Ethical Hacker',
    'Penetration Tester',
    'Network Security Expert',
    'Full Stack Developer',
    'VAPT Specialist',
    'Web Designer',
    'Bug Bounty Hunter'
  ];
  const typeEl = document.getElementById('typewriter');
  let phraseIndex = 0, charIndex = 0, isDeleting = false;

  function typeWrite() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
      typeEl.textContent = current.substring(0, charIndex--);
    } else {
      typeEl.textContent = current.substring(0, charIndex++);
    }

    let delay = isDeleting ? 60 : 100;
    if (!isDeleting && charIndex > current.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex < 0) {
      isDeleting = false;
      charIndex = 0;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }
    setTimeout(typeWrite, delay);
  }
  typeWrite();


  // ============ COUNTER ANIMATION ============
  function animateCounters() {
    document.querySelectorAll('.stat-num').forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      let current = 0;
      const increment = target / 60;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current);
        }
      }, 30);
    });
  }

  // Trigger counter once hero is in view
  const heroObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { animateCounters(); heroObs.unobserve(entry.target); }
    });
  }, { threshold: 0.3 });
  const heroSection = document.getElementById('home');
  if (heroSection) heroObs.observe(heroSection);


  // ============ SCROLL REVEAL — SERVICE CARDS ============
  const serviceCards = document.querySelectorAll('.service-card');
  const cardObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.getAttribute('data-delay')) || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        cardObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  serviceCards.forEach(card => cardObs.observe(card));


  // ============ SKILL BARS ANIMATION ============
  const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.bar-fill').forEach(bar => {
          const width = bar.getAttribute('data-width');
          setTimeout(() => { bar.style.width = width + '%'; }, 300);
        });
        skillObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) skillObs.observe(skillsSection);


  // ============ TESTIMONIAL SLIDER ============
  const track = document.getElementById('testimonialTrack');
  const cards = track ? track.querySelectorAll('.testimonial-card') : [];
  const dotsContainer = document.getElementById('sliderDots');
  let currentSlide = 0;
  let cardsVisible = getCardsVisible();
  let totalSlides = Math.ceil(cards.length / cardsVisible);
  let autoSlideTimer;

  function getCardsVisible() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 1;
    return 3;
  }

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const d = document.createElement('div');
      d.className = 'dot-item' + (i === currentSlide ? ' active' : '');
      d.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(d);
    }
  }

  function goToSlide(index) {
    currentSlide = index;
    if (!track) return;
    const cardWidth = cards[0].offsetWidth + 24; // gap
    track.style.transform = `translateX(-${currentSlide * cardsVisible * cardWidth}px)`;
    document.querySelectorAll('.dot-item').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    goToSlide(currentSlide);
  }
  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(currentSlide);
  }

  function startAutoSlide() {
    autoSlideTimer = setInterval(nextSlide, 4000);
  }
  function stopAutoSlide() { clearInterval(autoSlideTimer); }

  document.getElementById('nextBtn')?.addEventListener('click', () => { nextSlide(); stopAutoSlide(); startAutoSlide(); });
  document.getElementById('prevBtn')?.addEventListener('click', () => { prevSlide(); stopAutoSlide(); startAutoSlide(); });

  window.addEventListener('resize', () => {
    cardsVisible = getCardsVisible();
    totalSlides = Math.ceil(cards.length / cardsVisible);
    currentSlide = 0;
    goToSlide(0);
    buildDots();
  });

  buildDots();
  startAutoSlide();


  // ============ CONTACT FORM ============
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Sending...';
      btn.style.opacity = '0.7';
      setTimeout(() => {
        btn.textContent = 'Message Sent ✓';
        btn.style.background = '#00ffe7';
        document.getElementById('formSuccess').classList.add('show');
        form.reset();
        setTimeout(() => {
          btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
          btn.style.opacity = '1';
          btn.style.background = '';
        }, 4000);
      }, 1500);
    });
  }


  // ============ BACK TO TOP ============
  document.getElementById('backTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ============ SMOOTH ACTIVE NAV LINKS ============
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const navObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'var(--accent)';
          }
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => navObs.observe(s));


  // ============ GLITCH EFFECT ON HOVER ============
  const glitchEl = document.querySelector('.glitch');
  if (glitchEl) {
    setInterval(() => {
      glitchEl.style.textShadow = `${Math.random() * 6 - 3}px 0 rgba(0,255,231,0.5)`;
      setTimeout(() => { glitchEl.style.textShadow = ''; }, 100);
    }, 3000);
  }

});
