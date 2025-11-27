// about.js
document.addEventListener('DOMContentLoaded', function () {
    const showMoreButtons = document.querySelectorAll('.show-more-btn');
  
    showMoreButtons.forEach(button => {
      button.addEventListener('click', function () {
        const experienceFull = this.previousElementSibling; 
        experienceFull.classList.toggle('hidden');
        if (experienceFull.classList.contains('hidden')) {
          this.textContent = 'Show More';
        } else {
          this.textContent = 'Show Less';
        }
      });
    });
  });
  