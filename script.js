// Mobile Navigation Menu Toggle
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

// Modal Handlers
function openModal() {
  const modal = document.getElementById('quoteModal');
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function closeModal() {
  const modal = document.getElementById('quoteModal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

// Handle Form Submission Redirect to WhatsApp
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quoteForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const category = document.getElementById('modalCategory').value;
      const org = document.getElementById('modalOrg').value;
      const phone = document.getElementById('modalPhone').value;
      const details = document.getElementById('modalDetails').value;

      const text = `*New Quotation Request*\n*Category:* ${category}\n*Organization:* ${org}\n*Phone:* ${phone}\n*Details:* ${details}`;
      const encodedText = encodeURIComponent(text);
      
      window.open(`https://wa.me/9779841914333?text=${encodedText}`, '_blank');
      closeModal();
    });
  }

  // Independent Card Accordion Logic
  const cards = document.querySelectorAll('.category-card');

  cards.forEach(card => {
    const btn = card.querySelector('.toggle-card-btn');
    const bar = card.querySelector('.toggle-card-bar');
    const content = card.querySelector('.card-details-content');
    const icon = card.querySelector('.toggle-card-btn i');

    const toggleAccordion = (e) => {
      e.stopPropagation();
      const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

      // Close all other cards first
      cards.forEach(c => {
        const cContent = c.querySelector('.card-details-content');
        const cIcon = c.querySelector('.toggle-card-btn i');
        if (cContent) cContent.style.maxHeight = '0px';
        if (cIcon) cIcon.classList.remove('rotate-180');
        c.classList.remove('border-emerald-600', 'ring-1', 'ring-emerald-600');
      });

      // Expand current clicked card if it wasn't open
      if (!isOpen) {
        content.style.maxHeight = content.scrollHeight + 'px';
        if (icon) icon.classList.add('rotate-180');
        card.classList.add('border-emerald-600', 'ring-1', 'ring-emerald-600');
      }
    };

    if (btn) btn.addEventListener('click', toggleAccordion);
    if (bar) bar.addEventListener('click', toggleAccordion);
  });
});
