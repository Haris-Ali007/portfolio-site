/**
 * Portfolio — Syed Muhammad Haris Ali
 * Vanilla JS: Particles, Typing Effect, Scroll Reveal, Nav
 */

(function () {
  'use strict';

  /* ----------------------------------------------------------------
     1. PARTICLE CANVAS
  ---------------------------------------------------------------- */
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');

  let particles = [];
  let animationId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.8 + 0.4;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.speedY = (Math.random() - 0.5) * 0.35;
      this.opacity = Math.random() * 0.5 + 0.1;
      // Accent colours: violet or cyan
      this.color = Math.random() > 0.5 ? '139, 92, 246' : '34, 211, 238';
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    const maxDist = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.18;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    animationId = requestAnimationFrame(animateParticles);
  }

  function startParticles() {
    resizeCanvas();
    initParticles();
    animateParticles();
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });

  startParticles();

  /* ----------------------------------------------------------------
     2. TYPING EFFECT
  ---------------------------------------------------------------- */
  const phrases = [
    'ML pipelines.',
    'intelligent APIs.',
    'computer vision.',
    'generative AI apps.',
    'scalable backends.',
  ];

  const typedEl = document.getElementById('typed-text');
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingTimer;

  function typeEffect() {
    const current = phrases[phraseIdx];

    if (isDeleting) {
      charIdx--;
    } else {
      charIdx++;
    }

    typedEl.textContent = current.substring(0, charIdx);

    let delay = isDeleting ? 55 : 90;

    if (!isDeleting && charIdx === current.length) {
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 300;
    }

    typingTimer = setTimeout(typeEffect, delay);
  }

  typeEffect();

  /* ----------------------------------------------------------------
     3. NAVBAR — scroll state + active link
  ---------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Scrolled class
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ----------------------------------------------------------------
     4. SMOOTH SCROLL for nav links
  ---------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // close mobile menu if open
        closeMobileMenu();
      }
    });
  });

  /* ----------------------------------------------------------------
     5. HAMBURGER / MOBILE MENU
  ---------------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // Close on mobile link click
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ----------------------------------------------------------------
     6. SCROLL REVEAL — IntersectionObserver
  ---------------------------------------------------------------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  /* ----------------------------------------------------------------
     7. STAGGER CHILDREN inside revealed parents
  ---------------------------------------------------------------- */
  document.querySelectorAll('.skills-grid, .projects-grid, .posts-grid, .about-stats, .timeline').forEach(container => {
    const children = container.querySelectorAll('.reveal');
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.1}s`;
    });
  });

})();