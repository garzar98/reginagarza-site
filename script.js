const header = document.getElementById('site-header');
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.getElementById('nav-links');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 45);
}
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton.addEventListener('click', () => {
  const opened = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(opened));
  menuButton.setAttribute('aria-label', opened ? 'Close navigation' : 'Open navigation');
  header.classList.toggle('scrolled', opened || window.scrollY > 45);
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    updateHeader();
  });
});

const revealItems = document.querySelectorAll('.reveal');
if (reducedMotion.matches || !('IntersectionObserver' in window)) {
  revealItems.forEach(el => el.classList.add('visible'));
} else {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px 30px 0px' });
  revealItems.forEach(el => observer.observe(el));
}

// Move background images more slowly than their containing sections.
const layers = [...document.querySelectorAll('.parallax-layer')];
let pending = false;
function animateParallax() {
  pending = false;
  if (reducedMotion.matches) return;
  const viewportHeight = window.innerHeight;
  for (const layer of layers) {
    const section = layer.parentElement;
    const box = section.getBoundingClientRect();
    if (box.bottom < 0 || box.top > viewportHeight) continue;
    const offset = (viewportHeight / 2 - (box.top + box.height / 2)) * 0.12;
    layer.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
  }
}
function requestParallax() {
  if (!pending) { pending = true; requestAnimationFrame(animateParallax); }
}
window.addEventListener('scroll', requestParallax, { passive: true });
window.addEventListener('resize', requestParallax);
requestParallax();

// Keep copyright year current.
document.getElementById('year').textContent = String(new Date().getFullYear());
