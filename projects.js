document.addEventListener('DOMContentLoaded', function () {
  const projectBoxes = document.querySelectorAll('.project-box');
  const modal = document.getElementById('projectModal');
  const modalContent = document.getElementById('modalContent');
  const closeModal = document.getElementById('closeModal');

  projectBoxes.forEach(box => {
    box.addEventListener('click', function () {
      const details = this.querySelector('.project-details');
      if (details) {
        modalContent.innerHTML = details.innerHTML;
        modal.classList.add('active');
      }
    });
  });

  closeModal.addEventListener('click', function () {
    modal.classList.remove('active');
  });
});