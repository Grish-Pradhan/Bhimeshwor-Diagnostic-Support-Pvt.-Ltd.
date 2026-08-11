document.addEventListener('DOMContentLoaded', () => {
  // Select all category card elements
  const cards = document.querySelectorAll('.category-card');

  cards.forEach((card) => {
    // Interactive trigger elements (Banner & Sub-bar)
    const banner = card.querySelector('.card-banner');
    const subBar = card.querySelector('.card-sub-bar');
    const toggleBtn = card.querySelector('.expand-toggle-btn');
    const labelText = card.querySelector('.label-text');

    // Function to handle card expansion logic
    const handleToggle = (event) => {
      // Stop event from triggering parent handlers repeatedly
      event.stopPropagation();

      const isCurrentlyExpanded = card.classList.contains('expanded');

      // OPTION A: Close all other open cards first (Accordion behavior)
      cards.forEach((otherCard) => {
        if (otherCard !== card) {
          otherCard.classList.remove('expanded');
          const otherLabel = otherCard.querySelector('.label-text');
          if (otherLabel) otherLabel.textContent = 'Expand Details';
        }
      });

      // Toggle current card
      if (isCurrentlyExpanded) {
        card.classList.remove('expanded');
        if (labelText) labelText.textContent = 'Expand Details';
      } else {
        card.classList.add('expanded');
        if (labelText) labelText.textContent = 'Hide Details';
      }
    };

    // Attach click listeners to banner and sub-bar
    if (banner) banner.addEventListener('click', handleToggle);
    if (subBar) subBar.addEventListener('click', handleToggle);
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevents double toggling when inside banner
        handleToggle(e);
      });
    }
  });
});
