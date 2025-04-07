document.addEventListener('DOMContentLoaded', () => {
  const welcomeModal = document.getElementById('welcome-modal');
  const closeModalBtn = document.getElementById('close-welcome-modal');
  const neverShowBtn = document.getElementById('never-show-modal');

  // Verificar si el modal debe mostrarse
  if (!localStorage.getItem('hide-welcome-modal')) {
    welcomeModal.style.display = 'flex';
  }

  // Botón de cerrar
  closeModalBtn.addEventListener('click', () => {
    welcomeModal.style.display = 'none';
  });

  // Botón de nunca mostrar
  neverShowBtn.addEventListener('click', () => {
    localStorage.setItem('hide-welcome-modal', 'true');
    welcomeModal.style.display = 'none';
  });

  // Cerrar al hacer clic fuera del modal
  document.addEventListener('click', (event) => {
    const modalContent = document.querySelector('.modal-content');
  
    if (event.target === welcomeModal && !modalContent.contains(event.target)) {
      welcomeModal.style.display = 'none';
    }
  });
});
