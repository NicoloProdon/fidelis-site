const logoWrapper  = document.getElementById('logoWrapper');
const modalOverlay = document.getElementById('modalOverlay');
const phaseImage   = document.getElementById('phaseImage');
const phaseVideo   = document.getElementById('phaseVideo');
const phaseTrophy  = document.getElementById('phaseTrophy');
const mainVideo    = document.getElementById('mainVideo');
const tauntBubble  = document.getElementById('tauntBubble');
const floatingTaunt = document.getElementById('floatingTaunt');
const trophyClose  = document.getElementById('trophyClose');
const confettiContainer = document.getElementById('confettiContainer');

const imageTaunts = [
  "Ma chi te l'ha detto che eravate forti?!",
  "Serie D e orgogliosi!",
  "Il logo è bello almeno...",
  "Eccellenza, arriviamo!",
];

const videoTaunts = [
  { text: "CLAMOROSO!", x: '10%', y: '15%' },
  { text: "NON CI CREDO!", x: '55%', y: '20%' },
  { text: "SERIE D ERA TROPPO ALTA", x: '15%', y: '65%' },
  { text: "ECCELLENZA ASPETTACI", x: '45%', y: '70%' },
  { text: "CHE SQUADRA FENOMENALE", x: '20%', y: '40%' },
  { text: "LEGGENDARI", x: '50%', y: '45%' },
];

let tauntIndex = 0;
let tauntTimer = null;
let videoTauntTimer = null;

// ---- OPEN MODAL ----
logoWrapper.addEventListener('click', () => {
  modalOverlay.classList.add('active');
  startPhaseImage();
});

function startPhaseImage() {
  phaseImage.classList.remove('hidden');
  phaseVideo.classList.add('hidden');
  phaseTrophy.classList.add('hidden');

  tauntIndex = 0;
  showNextTaunt();

  // Dopo 3.5 secondi passa al video
  setTimeout(transitionToVideo, 3500);
}

function showNextTaunt() {
  tauntBubble.textContent = imageTaunts[tauntIndex % imageTaunts.length];
  tauntBubble.classList.add('show');
  tauntIndex++;
  tauntTimer = setTimeout(() => {
    tauntBubble.classList.remove('show');
    setTimeout(showNextTaunt, 400);
  }, 800);
}

// ---- TRANSIZIONE AL VIDEO ----
function transitionToVideo() {
  clearTimeout(tauntTimer);
  tauntBubble.classList.remove('show');

  phaseImage.classList.add('phase-fadeout');

  setTimeout(() => {
    phaseImage.classList.add('hidden');
    phaseImage.classList.remove('phase-fadeout');
    phaseVideo.classList.remove('hidden');

    mainVideo.currentTime = 0;
    mainVideo.play().catch(() => {});

    scheduleVideoTaunt(0);
  }, 400);
}

function scheduleVideoTaunt(index) {
  if (index >= videoTaunts.length) return;
  const delay = 3000 + index * 8000;
  videoTauntTimer = setTimeout(() => {
    showVideoTaunt(videoTaunts[index]);
    scheduleVideoTaunt(index + 1);
  }, delay);
}

function showVideoTaunt(taunt) {
  floatingTaunt.textContent = taunt.text;
  floatingTaunt.style.left = taunt.x;
  floatingTaunt.style.top  = taunt.y;
  floatingTaunt.classList.remove('show');
  void floatingTaunt.offsetWidth; // force reflow
  floatingTaunt.classList.add('show');
  setTimeout(() => floatingTaunt.classList.remove('show'), 3000);
}

// ---- FINE VIDEO → TROFEO ----
mainVideo.addEventListener('ended', transitionToTrophy);

function transitionToTrophy() {
  clearTimeout(videoTauntTimer);
  phaseVideo.classList.add('phase-fadeout');

  setTimeout(() => {
    phaseVideo.classList.add('hidden');
    phaseVideo.classList.remove('phase-fadeout');
    phaseTrophy.classList.remove('hidden');
    spawnConfetti();
  }, 400);
}

// ---- CONFETTI ----
function spawnConfetti() {
  confettiContainer.innerHTML = '';
  const colors = ['#f0c040', '#4682dc', '#ff4444', '#ffffff', '#44cc88', '#ff88cc'];
  for (let i = 0; i < 120; i++) {
    const el = document.createElement('div');
    el.className = 'confetto';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.width  = (6 + Math.random() * 10) + 'px';
    el.style.height = (6 + Math.random() * 10) + 'px';
    const dur = 2.5 + Math.random() * 3;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay = (Math.random() * 1.5) + 's';
    confettiContainer.appendChild(el);
  }
}

// ---- CHIUDI ----
trophyClose.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

function closeModal() {
  mainVideo.pause();
  mainVideo.currentTime = 0;
  clearTimeout(tauntTimer);
  clearTimeout(videoTauntTimer);
  tauntBubble.classList.remove('show');
  confettiContainer.innerHTML = '';
  modalOverlay.classList.remove('active');
  phaseImage.classList.remove('hidden', 'phase-fadeout');
  phaseVideo.classList.add('hidden');
  phaseTrophy.classList.add('hidden');
}
