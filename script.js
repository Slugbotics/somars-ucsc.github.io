// Konami Code easter egg
const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      konamiIndex = 0;
      showSecret();
    }
  } else {
    konamiIndex = 0;
  }
});

function showSecret() {
  const overlay = document.createElement('div');
  overlay.className = 'secret-overlay';
  overlay.innerHTML = `
    <div class="secret-box">
      <p class="secret-eyebrow">Classified Intel</p>
      <h2 class="secret-title">Gene is the best. Andrew is a bum.</h2>
      <button class="secret-close" onclick="this.closest('.secret-overlay').remove()">Acknowledged</button>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('secret-visible'));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

// Close nav when a link is clicked (mobile)
if (navLinks) {
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}