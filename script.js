// Ensure the script runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    
    // --- SEARCH AND FILTER LOGIC ---
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    const noResults = document.getElementById('noResults');
    let currentCategory = 'all';

    function filterProducts() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        let visibleCount = 0;

        productCards.forEach(card => {
            const category = card.dataset.category;
            const nameKeywords = card.dataset.name ? card.dataset.name.toLowerCase() : '';
            
            const matchesCategory = currentCategory === 'all' || category === currentCategory;
            const matchesSearch = nameKeywords.includes(searchTerm);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Toggle the empty state message if no products match
        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    // Attach event listeners if the elements exist on the page
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }

    if (filterBtns) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Reset styling for all buttons
                filterBtns.forEach(b => {
                    b.classList.remove('bg-[#0f291e]', 'text-white');
                    b.classList.add('text-slate-600', 'hover:bg-white', 'hover:text-slate-900');
                });
                
                // Apply active styling to the clicked button
                e.target.classList.add('bg-[#0f291e]', 'text-white');
                e.target.classList.remove('text-slate-600', 'hover:bg-white', 'hover:text-slate-900');

                // Apply the filter
                currentCategory = e.target.dataset.category;
                filterProducts();
            });
        });
    }

    // Handle form submission via WhatsApp
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const product = document.getElementById('modalCategory').value;
            const message = encodeURIComponent(`Hello, I am interested in ordering: ${product}. Could you please provide pricing details?`);
            window.open(`https://wa.me/9779841914333?text=${message}`, '_blank');
            closeModal();
        });
    }
});

// --- SOURCE CODE PROTECTION (CTRL + U / CTRL + S INTERCEPTION) ---
document.addEventListener('keydown', function (e) {
    // Check for Ctrl + U (View Source) or Ctrl + S (Save Page)
    if (e.ctrlKey && (e.key.toLowerCase() === 'u' || e.key.toLowerCase() === 's')) {
        e.preventDefault(); // Stop the default browser action
        
        // Custom message to copy to the user's clipboard
        const customMessage = "Source code protected. Copyright © Bhimeshwori Diagnostic Support Pvt. Ltd. All rights reserved. Please give credit to the real owner.";
        
        navigator.clipboard.writeText(customMessage).then(() => {
            alert("Source code access is restricted. A copyright notice has been copied to your clipboard.");
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }
});

// --- GLOBAL FUNCTIONS ---

// Reset Filters Function
function resetFilters() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    const allBtn = document.querySelector('[data-category="all"]');
    if (allBtn) allBtn.click();
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.toggle('hidden');
}

// Modal Toggle Functions
function openModal(productName) {
    const modalCategory = document.getElementById('modalCategory');
    const quoteModal = document.getElementById('quoteModal');
    
    if (modalCategory) modalCategory.value = productName;
    if (quoteModal) quoteModal.classList.remove('hidden');
}

function closeModal() {
    const quoteModal = document.getElementById('quoteModal');
    if (quoteModal) quoteModal.classList.add('hidden');
}
