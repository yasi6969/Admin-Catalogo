document.addEventListener('DOMContentLoaded', () => {
  const welcomeModal = document.getElementById('welcome-modal');
  const closeModalBtn = document.getElementById('close-welcome-modal');
  const neverShowBtn = document.getElementById('never-show-modal');


  if (!localStorage.getItem('hide-welcome-modal')) {
    welcomeModal.style.display = 'flex';
  }


  closeModalBtn.addEventListener('click', () => {
    welcomeModal.style.display = 'none';
  });


  neverShowBtn.addEventListener('click', () => {
    localStorage.setItem('hide-welcome-modal', 'true');
    welcomeModal.style.display = 'none';
  });


  document.addEventListener('click', (event) => {
    const modalContent = document.querySelector('.modal-content');
  
    if (event.target === welcomeModal && !modalContent.contains(event.target)) {
      welcomeModal.style.display = 'none';
    }
  });
});
