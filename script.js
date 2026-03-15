/* =============================================
   RITAM PAL PORTFOLIO — MAIN SCRIPT
   ============================================= */

/* =====================
   PARTICLE BACKGROUND
   ===================== */
(function () {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: null, y: null };
  const COUNT = 80;
  const MAX_DIST = 130;
  const CYAN = '0, 245, 255';
  const PINK = '255, 45, 120';

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.45;
    this.vy = (Math.random() - 0.5) * 0.45;
    this.radius = Math.random() * 1.8 + 0.4;
    this.color = Math.random() > 0.6 ? PINK : CYAN;
    this.alpha = Math.random() * 0.5 + 0.2;
  }
  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };
  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
    ctx.fill();
  };

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${CYAN}, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
      // Mouse connections
      if (mouse.x !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          const alpha = (1 - dist / 160) * 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${PINK}, ${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }
  animate();
})();


/* =====================
   CUSTOM CURSOR
   ===================== */
(function () {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();
})();


/* =====================
   NAVBAR SCROLL
   ===================== */
(function () {
  const nav = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
    });
  });
})();


/* =====================
   TYPEWRITER EFFECT
   ===================== */
(function () {
  const el = document.getElementById('typewriter');
  const phrases = [
    'Full-Stack Developer',
    'Real-Time Systems Builder',
    'Security Enthusiast',
    'Software Engineering Student',
  ];
  let pi = 0, ci = 0, deleting = false;

  function type() {
    const current = phrases[pi];
    el.textContent = deleting ? current.substring(0, ci--) : current.substring(0, ci++);

    let delay = deleting ? 50 : 85;
    if (!deleting && ci > current.length) { delay = 1600; deleting = true; }
    if (deleting && ci < 0) {
      deleting = false;
      pi = (pi + 1) % phrases.length;
      delay = 400;
      ci = 0;
    }
    setTimeout(type, delay);
  }
  type();
})();


/* =====================
   REVEAL ON SCROLL
   ===================== */
(function () {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Trigger skill bar fill
        entry.target.querySelectorAll('.bar-fill').forEach(bar => {
          bar.style.width = bar.style.getPropertyValue('--pct') || '0%';
        });
        // Trigger score bar fill
        entry.target.querySelectorAll('.score-fill').forEach(bar => {
          bar.style.width = getComputedStyle(bar).getPropertyValue('--w') || '0%';
        });
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(r => observer.observe(r));

  // Standalone bar triggers (outside reveal classes)
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.style.getPropertyValue('--pct') ||
          getComputedStyle(e.target).getPropertyValue('--w') || '0%';
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.bar-fill, .score-fill').forEach(b => barObserver.observe(b));
})();


/* =====================
   STAT COUNTER
   ===================== */
(function () {
  const counters = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.getAttribute('data-count'));
      const isFloat = target % 1 !== 0;
      const duration = 1800;
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const val = eased * target;
        el.textContent = isFloat ? val.toFixed(2) : Math.floor(val);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = isFloat ? target.toFixed(2) : target;
      }
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();


/* =====================
   3D CARD TILT EFFECT
   ===================== */
(function () {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(12px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
    });
  });
})();


/* =====================
   ACTIVE NAV LINK
   ===================== */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const offset = section.offsetTop - 120;
      if (window.scrollY >= offset) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === '#' + current) {
        link.style.color = 'var(--cyan)';
      }
    });
  });
})();


/* =====================
   GLITCH RANDOM FLICKER
   ===================== */
(function () {
  const glitch = document.querySelector('.glitch');
  if (!glitch) return;
  setInterval(() => {
    glitch.style.textShadow = `
      ${(Math.random() * 6 - 3)}px 0 0 rgba(0,245,255,0.7),
      ${(Math.random() * -6 + 3)}px 0 0 rgba(255,45,120,0.7)
    `;
    setTimeout(() => {
      glitch.style.textShadow = '0 0 40px rgba(0,245,255,0.3)';
    }, 80);
  }, 3500 + Math.random() * 2000);
})();


/* =====================
   SMOOTH ANCHOR SCROLL
   ===================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
});


/* =====================
   PAGE LOAD — STAGGER HERO
   ===================== */
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  // Trigger any visible bars on first load
  document.querySelectorAll('.bar-fill, .score-fill').forEach(b => {
    if (b.closest('.visible') || !b.closest('.reveal')) {
      b.style.width = b.style.getPropertyValue('--pct') ||
        getComputedStyle(b).getPropertyValue('--w') || '0%';
    }
  });
});
