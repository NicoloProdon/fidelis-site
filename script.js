const logoWrapper = document.getElementById('logoWrapper');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');

logoWrapper.addEventListener('click', () => {
  modalOverlay.classList.add('active');
});

modalClose.addEventListener('click', () => {
  modalOverlay.classList.remove('active');
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove('active');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    modalOverlay.classList.remove('active');
  }
});