// ==============================
// Interactive + Visual Behavior
// - Scroll reveal (adds .in-view)
// - Parallax movement for shapes
// - Auto-highlight nav link
// - Tilt hover effect for hobby cards
// - Flip/swap interaction for hobby images
// ==============================

document.addEventListener('DOMContentLoaded', () => {
  // ——— Scroll reveal ———
  const sections = document.querySelectorAll('main section');
  const opts = { root: null, threshold: 0.16 };
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('in-view');
      else e.target.classList.remove('in-view');
    });
  }, opts);
  sections.forEach(s => io.observe(s));

  // ——— Parallax movement ———
  const shapes = document.querySelectorAll('.section-shape');
  window.addEventListener('mousemove', (ev) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const mx = (ev.clientX - cx) / cx;
    const my = (ev.clientY - cy) / cy;
    shapes.forEach((sh, i) => {
      const depth = 8 + i * 4;
      sh.style.transform = `translate3d(${mx * depth}px, ${my * depth}px, 0)`;
    });
  }, { passive: true });

  // ——— Highlight nav link ———
  const navLinks = document.querySelectorAll('nav a[href^="#"], nav a[href$=".html"]');
  function setActiveNav() {
    let current = window.scrollY + window.innerHeight * 0.25;
    let activeId = '';
    sections.forEach(s => {
      const top = s.offsetTop;
      if (top <= current) activeId = s.id || activeId;
    });
    navLinks.forEach(a => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        if (href === `#${activeId}`) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
      }
    });
  }
  setActiveNav();
  window.addEventListener('scroll', setActiveNav, { passive: true });

  // ——— Tilt hover effect for hobby cards ———
  const cards = document.querySelectorAll('.hobby-item');
  cards.forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (y - 0.5) * 6;
      const ry = (x - 0.5) * -8;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
    });
    card.addEventListener('pointerleave', () => card.style.transform = '');
  });

  // ——— Smooth reveal nav links on load ———
  navLinks.forEach((a, i) => {
    a.style.opacity = 0;
    a.style.transform = 'translateY(6px)';
    setTimeout(() => {
      a.style.transition = 'opacity 420ms var(--ease-1), transform 420ms var(--ease-1)';
      a.style.opacity = 1;
      a.style.transform = 'translateY(0)';
    }, 120 * i);
  });

  // ——— Flip/swap logic for hobby images ———
  const flipInners = document.querySelectorAll('.flip-inner');
  flipInners.forEach(inner => {
    // Add label overlay
    const label = document.createElement('div');
    label.className = 'flip-label';
    label.innerHTML = 'Tap to flip ↻';
    inner.appendChild(label);

    inner.addEventListener('click', () => inner.classList.toggle('flipped'));
    inner.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        inner.classList.toggle('flipped');
      }
    });
  });

  // fallback single swap version
  const singleImgs = document.querySelectorAll('.single-swap .single');
  singleImgs.forEach(img => {
    const label = document.createElement('div');
    label.className = 'flip-label';
    label.innerHTML = 'Tap to flip ↻';
    img.parentElement.appendChild(label);

    const swap = () => {
      const alt = img.getAttribute('data-alt');
      if (!alt) return;
      img.style.opacity = '0.03';
      img.style.transform = 'scale(0.97)';
      setTimeout(() => {
        const cur = img.src;
        img.src = alt;
        img.setAttribute('data-alt', cur);
        img.style.opacity = '1';
        img.style.transform = 'scale(1)';
      }, 250);
    };

    img.addEventListener('click', swap);
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        swap();
      }
    });
  });
});
