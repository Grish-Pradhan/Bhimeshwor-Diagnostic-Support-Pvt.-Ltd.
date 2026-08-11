// Ensure the script runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    
    // --- SEARCH AND FILTER LOGIC ---
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    const noResults = document.getElementById('noResults');

    let currentCategory = 'all';
    let searchQuery = '';

    // 1. Pre-cache card data to avoid DOM lookups on every keystroke
    const cachedCards = Array.from(productCards).map(card => {
        const category = (card.dataset.category || '').toLowerCase().trim();
        const dataName = card.dataset.name || '';
        const titleText = card.querySelector('h3')?.textContent || '';
        const descText = card.querySelector('p')?.textContent || '';

        return {
            element: card,
            category: category,
            // Combine name keywords, category, title, and description into a single searchable string
            searchContent: `${dataName} ${category} ${titleText} ${descText}`.toLowerCase()
        };
    });

    // 2. Debounce Utility: Prevents lag during rapid typing
    function debounce(func, delay = 150) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // 3. Fast Filtering Function
    function filterProducts() {
        // Tokenize query to support multi-word searching (e.g., "lab centrifuge")
        const terms = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
        let visibleCount = 0;

        cachedCards.forEach(card => {
            const matchesCategory = currentCategory === 'all' || card.category === currentCategory;
            // Matches if ALL search terms exist in the cached card text
            const matchesSearch = terms.every(term => card.searchContent.includes(term));

            const isVisible = matchesCategory && matchesSearch;

            // Toggle Tailwind's 'hidden' class for clean layout handling
            card.element.classList.toggle('hidden', !isVisible);

            if (isVisible) visibleCount++;
        });

        // Toggle empty state indicator
        if (noResults) {
            noResults.classList.toggle('hidden', visibleCount > 0);
        }
    }

    // Expose filter function globally so resetFilters can trigger it
    window.performFilter = filterProducts;

    // Attach debounced search listener
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            searchQuery = e.target.value;
            filterProducts();
        }, 150));
    }

    // Attach category filter button listeners
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Reset styling for all buttons
                filterBtns.forEach(b => {
                    b.classList.remove('bg-[#0f291e]', 'text-white', 'active');
                    b.classList.add('text-slate-600', 'hover:bg-white', 'hover:text-slate-900');
                });
                
                // Use currentTarget to avoid target errors if clicking internal icons/spans
                const targetBtn = e.currentTarget;
                targetBtn.classList.add('bg-[#0f291e]', 'text-white', 'active');
                targetBtn.classList.remove('text-slate-600', 'hover:bg-white', 'hover:text-slate-900');

                // Apply the filter
                currentCategory = targetBtn.dataset.category || 'all';
                filterProducts();
            });
        });
    }

    // Close detail modal when clicking the backdrop
    const detailModal = document.getElementById('detailModal');
    if (detailModal) {
        detailModal.addEventListener('click', (e) => {
            if (e.target === detailModal) closeDetailModal();
        });
    }

    // Close open modals on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeDetailModal();
            closeModal();
        }
    });

    // Handle form submission via WhatsApp
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const product = document.getElementById('modalCategory')?.value || '';
            const message = encodeURIComponent(`Hello, I am interested in ordering: ${product}. Could you please provide pricing details?`);
            window.open(`https://wa.me/9779841914333?text=${message}`, '_blank');
            closeModal();
        });
    }
});

// --- GLOBAL FUNCTIONS & CATALOG DATA ---

const CATALOG_DATA = {
    lab: {
        title: 'Lab Equipment',
        icon: 'fa-flask',
        color: 'brand-green',
        items: [
            { name: 'Digital Centrifuges', image: 'images/Digital%20Centrifuges.webp', desc: 'Bench-top and refrigerated centrifuges for serum, plasma, and sample separation with adjustable RPM control.' },
            { name: 'Binocular Microscopes', image: 'images/binocular-microscope.webp', desc: 'High-resolution optical microscopes for routine histopathology, hematology, and parasitology examination.' },
            { name: 'CO2 & Bacteriological Incubators', image: 'images/co2-laboratory-incubators.webp', desc: 'Precision temperature-controlled incubators for culture growth and microbiological testing.' },
            { name: 'Water Bath Units', image: 'images/Water%20Bath%20Units.webp', desc: 'Digital water baths with uniform heat distribution for reagent warming and coagulation testing.' },
            { name: 'Autoclaves & Sterilizers', image: 'images/Autoclaves%20%26%20Sterilizers.webp', desc: 'Steam sterilization units for lab glassware, instruments, and biomedical waste decontamination.' },
            { name: 'Hematology Analyzers', image: 'images/Hematology%20Analyzers.webp', desc: 'Automated 3-part/5-part differential analyzers for fast, accurate complete blood count reporting.' }
        ]
    },
    reagents: {
        title: 'Kits & Reagents',
        icon: 'fa-vial',
        color: 'brand-teal',
        items: [
            { name: 'Dengue NS1/IgG/IgM Kits', image: 'images/DengueKits.webp', desc: 'Rapid immunochromatographic cassette kits for early and accurate dengue detection.' },
            { name: 'Typhoid (Widal) Test Kits', image: 'images/Typhoid%20(Widal)%20Test%20Kits.webp', desc: 'Slide agglutination reagents for qualitative and semi-quantitative typhoid screening.' },
            { name: 'HBsAg Rapid Test Kits', image: 'images/HBsAg%20Rapid%20Test%20Kits.webp', desc: 'One-step cassette tests for Hepatitis B surface antigen screening in serum or plasma.' },
            { name: 'HIV Rapid Test Kits', image: 'images/HIV%20Rapid%20Test%20Kits.webp', desc: 'WHO-listed rapid diagnostic kits for HIV-1/2 antibody screening at point of care.' },
            { name: 'Biochemistry Reagents', image: 'images/Biochemistry%20Reagents.webp', desc: 'Liquid stable reagents compatible with major semi-auto and fully-automated analyzers.' },
            { name: 'Malaria & Pregnancy RDTs', image: 'images/Malaria%20%26%20Pregnancy%20RDTs.webp', desc: 'Fast, reliable rapid diagnostic strips and cassettes for field and lab use.' }
        ]
    },
    surgical: {
        title: 'Surgical Goods',
        icon: 'fa-kit-medical',
        color: 'brand-dark',
        items: [
            { name: 'OT Instrument Sets', image: 'images/OT%20Instrument%20Sets.webp', desc: 'Complete stainless steel operation theatre sets for general and minor surgical procedures.' },
            { name: 'Forceps & Clamp Sets', image: 'images/Forceps%20%26%20Clamp%20Sets.webp', desc: 'Artery forceps, tissue forceps, and clamps in various sizes and jaw configurations.' },
            { name: 'Scalpels & Blades', image: 'images/Scalpels%20%26%20Blades.webp', desc: 'Disposable and reusable scalpel handles with sterile surgical blades of assorted sizes.' },
            { name: 'Sterile Sutures', image: 'images/Sterile%20Sutures.webp', desc: 'Absorbable and non-absorbable sutures in a range of gauges for wound closure.' },
            { name: 'Surgical Gloves & Gowns', image: 'images/Surgical%20Gloves%20%26%20Gowns.webp', desc: 'Sterile latex and nitrile gloves, disposable gowns, and drapes for OT hygiene.' },
            { name: 'Gauze, Dressings & Bandages', image: 'images/Gauze,%20Dressings%20%26%20Bandages.webp', desc: 'Absorbent cotton gauze, crepe bandages, and wound dressing consumables.' }
        ]
    },
    imaging: {
        title: 'ICU & Imaging',
        icon: 'fa-x-ray',
        color: 'brand-accent',
        items: [
            { name: 'Digital X-Ray Machines', image: 'images/Digital%20X-Ray%20Machines.webp', desc: 'Fixed and portable digital radiography systems delivering high-clarity diagnostic images.' },
            { name: 'Mobile C-Arm Units', image: 'images/Mobile%20C-Arm%20Units.webp', desc: 'Compact fluoroscopy C-arms for real-time intra-operative imaging support.' },
            { name: 'ICU Ventilators', image: 'images/ICU%20Ventilators.webp', desc: 'Invasive and non-invasive ventilators with adjustable modes for critical care support.' },
            { name: 'Patient Monitors', image: 'images/Patient%20Monitors.webp', desc: 'Multi-parameter monitors tracking ECG, SpO2, NIBP, and respiration in real time.' },
            { name: 'Radiograph Plates & Films', image: 'images/Radiograph%20Plates%20%26%20Films.webp', desc: 'CR/DR imaging plates and X-ray films compatible with major imaging systems.' },
            { name: 'Oxygen Concentrators', image: 'images/Oxygen%20Concentrators.webp', desc: 'High-flow medical-grade oxygen concentrators for ward and home care use.' }
        ]
    }
};

// Open category detail modal
function openDetailModal(categoryKey) {
    const data = CATALOG_DATA[categoryKey];
    const modal = document.getElementById('detailModal');
    if (!data || !modal) return;

    document.getElementById('detailModalTitle').textContent = data.title;
    document.getElementById('detailModalIcon').innerHTML = `<i class="fa-solid ${data.icon}"></i>`;

    const grid = document.getElementById('detailItemsGrid');
    if (grid) {
        grid.innerHTML = data.items.map(item => `
            <div class="detail-item-card flex gap-4 p-4 rounded-xl border border-slate-200 hover:border-${data.color} hover:shadow-sm transition-all bg-white cursor-pointer">
                <div class="detail-item-image w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" loading="lazy">
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="font-bold text-sm text-slate-900 mb-1">${item.name}</h4>
                    <p class="text-xs text-slate-600 leading-relaxed mb-2">${item.desc}</p>
                    <button onclick="closeDetailModal(); openModal('${item.name.replace(/'/g, "\\'")}')" class="text-[11px] font-bold text-brand-teal hover:text-brand-dark transition-colors inline-flex items-center gap-1">
                        Request Quote <i class="fa-solid fa-arrow-right text-[9px]"></i>
                    </button>
                </div>
            </div>
        `).join('');

    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeDetailModal() {
    const modal = document.getElementById('detailModal');
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = '';

    document.querySelectorAll('.product-card').forEach(card => {
        card.classList.remove('is-expanded');
    });
}

// Reset Filters Function
function resetFilters() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach((btn, index) => {
        if (index === 0 || btn.dataset.category === 'all') {
            btn.classList.add('bg-[#0f291e]', 'text-white', 'active');
            btn.classList.remove('text-slate-600', 'hover:bg-white', 'hover:text-slate-900');
        } else {
            btn.classList.remove('bg-[#0f291e]', 'text-white', 'active');
            btn.classList.add('text-slate-600', 'hover:bg-white', 'hover:text-slate-900');
        }
    });

    if (typeof window.performFilter === 'function') {
        window.performFilter();
    }
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
