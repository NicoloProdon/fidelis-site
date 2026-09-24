const logoWrapper       = document.getElementById('logoWrapper');
const modalOverlay      = document.getElementById('modalOverlay');
const phaseImage        = document.getElementById('phaseImage');
const phaseVideo        = document.getElementById('phaseVideo');
const phaseTrophy       = document.getElementById('phaseTrophy');
const mainVideo         = document.getElementById('mainVideo');
const tauntBubble       = document.getElementById('tauntBubble');
const floatingTaunt     = document.getElementById('floatingTaunt');
const trophyClose       = document.getElementById('trophyClose');
const confettiContainer = document.getElementById('confettiContainer');

const imageTaunts = [
  "Ma chi te l'ha detto che eravate forti?!",
  "Serie D e orgogliosi!",
  "Il logo è bello almeno...",
  "Eccellenza, arriviamo!",
  "Tranquilli, è solo una fase...",
];

const videoTaunts = [
  { text: "CLAMOROSO!",                      x: '8%',  y: '12%' },
  { text: "NON CI CREDO!",                   x: '55%', y: '18%' },
  { text: "SERIE D ERA TROPPO ALTA PER NOI", x: '10%', y: '60%' },
  { text: "ECCELLENZA ASPETTACI!!!",          x: '40%', y: '72%' },
  { text: "CHE SQUADRA FENOMENALE",           x: '15%', y: '35%' },
  { text: "LEGGENDARI (IN NEGATIVO)",         x: '45%', y: '42%' },
  { text: "IL PRESIDENTE OGNI ANNO: CI SALVIAMO",  x: '5%',  y: '80%' },
  { text: "TECNICO CERCASI URGENTEMENTE",     x: '50%', y: '28%' },
  { text: "CHI HA PAGATO I GIOCATORI?",       x: '12%', y: '50%' },
  { text: "RETROCESSI CON STILE",             x: '38%', y: '60%' },
  { text: "STORIA DEL CALCIO ITALIANO",       x: '20%', y: '22%' },
  { text: "BRAVI! CONTINUATE COSI'",          x: '52%', y: '78%' },
];

let tauntIndex     = 0;
let tauntTimer     = null;
let videoTauntTimer = null;
let videoMode      = false;

// ---- OPEN MODAL ----
logoWrapper.addEventListener('click', () => {
  modalOverlay.classList.add('active');
  startPhaseImage();
});

function startPhaseImage() {
  videoMode = false;
  phaseImage.classList.remove('hidden');
  phaseVideo.classList.add('hidden');
  phaseTrophy.classList.add('hidden');
  modalOverlay.classList.remove('video-mode');

  tauntIndex = 0;
  showNextTaunt();
  setTimeout(transitionToVideo, 3500);
}

function showNextTaunt() {
  tauntBubble.textContent = imageTaunts[tauntIndex % imageTaunts.length];
  tauntBubble.classList.add('show');
  tauntIndex++;
  tauntTimer = setTimeout(() => {
    tauntBubble.classList.remove('show');
    setTimeout(showNextTaunt, 400);
  }, 1100);
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
    modalOverlay.classList.add('video-mode');
    videoMode = true;

    mainVideo.currentTime = 0;
    mainVideo.play().catch(() => {});

    scheduleVideoTaunt(0);
  }, 400);
}

function scheduleVideoTaunt(index) {
  if (index >= videoTaunts.length) return;
  const delay = 2000 + index * 10000;
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
  void floatingTaunt.offsetWidth;
  floatingTaunt.classList.add('show');
  setTimeout(() => floatingTaunt.classList.remove('show'), 9000);
}

// ---- FINE VIDEO → TROFEO ----
mainVideo.addEventListener('ended', transitionToTrophy);

function transitionToTrophy() {
  clearTimeout(videoTauntTimer);
  videoMode = false;
  floatingTaunt.classList.remove('show');

  phaseVideo.classList.add('phase-fadeout');
  modalOverlay.classList.remove('video-mode');

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
  for (let i = 0; i < 140; i++) {
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

// ---- CLICK OVERLAY ----
modalOverlay.addEventListener('click', (e) => {
  if (e.target !== modalOverlay) return;
  if (videoMode) {
    // click sullo sfondo durante il video → vai al trofeo
    mainVideo.pause();
    transitionToTrophy();
  } else if (!phaseTrophy.classList.contains('hidden')) {
    closeModal();
  }
});

// ---- CHIUDI (solo dalla schermata trofeo) ----
trophyClose.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (videoMode) {
      mainVideo.pause();
      transitionToTrophy();
    } else {
      closeModal();
    }
  }
});

function closeModal() {
  mainVideo.pause();
  mainVideo.currentTime = 0;
  clearTimeout(tauntTimer);
  clearTimeout(videoTauntTimer);
  videoMode = false;
  tauntBubble.classList.remove('show');
  floatingTaunt.classList.remove('show');
  confettiContainer.innerHTML = '';
  modalOverlay.classList.remove('active', 'video-mode');
  phaseImage.classList.remove('hidden', 'phase-fadeout');
  phaseVideo.classList.add('hidden');
  phaseTrophy.classList.add('hidden');
}