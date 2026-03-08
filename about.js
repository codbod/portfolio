// about.js — Smooth expand/collapse for experience items
document.addEventListener('DOMContentLoaded', function () {
  var showMoreButtons = document.querySelectorAll('.show-more-btn');

  showMoreButtons.forEach(function (button) {
    var experienceFull = button.previousElementSibling;

    // Set initial collapsed state with max-height: 0
    if (experienceFull && experienceFull.classList.contains('hidden')) {
      experienceFull.style.maxHeight = '0px';
    }

    button.addEventListener('click', function () {
      var content = this.previousElementSibling;
      if (!content) return;

      if (content.classList.contains('hidden')) {
        // ── Expanding ──
        // Measure the full content height
        content.classList.remove('hidden');
        content.style.maxHeight = '0px';

        // Force reflow so the browser registers the starting state
        content.offsetHeight;

        // Animate to the actual scroll height
        content.style.maxHeight = content.scrollHeight + 'px';
        this.textContent = 'Show Less';

        // After transition ends, remove max-height cap so content can resize naturally
        var onExpanded = function () {
          content.style.maxHeight = 'none';
          content.removeEventListener('transitionend', onExpanded);
        };
        content.addEventListener('transitionend', onExpanded);

      } else {
        // ── Collapsing ──
        // Set max-height to current height first (from 'none' to a real value)
        content.style.maxHeight = content.scrollHeight + 'px';

        // Force reflow
        content.offsetHeight;

        // Animate to 0
        content.classList.add('hidden');
        content.style.maxHeight = '0px';
        this.textContent = 'Show More';
      }
    });
  });
});