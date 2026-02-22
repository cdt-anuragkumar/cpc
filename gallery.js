// ============ ENHANCED GALLERY SYSTEM ============
// Handles: carousel view, grid view, filtering, lightbox, admin sync

const GALLERY_CATEGORIES = {
    events: { label: 'Events', icon: 'fa-calendar-alt', iconClass: 'events' },
    awards: { label: 'Awards', icon: 'fa-trophy', iconClass: 'awards' },
    classes: { label: 'Classes', icon: 'fa-chalkboard-teacher', iconClass: 'classes' },
    sports: { label: 'Sports', icon: 'fa-futbol', iconClass: 'sports' }
};

// Default gallery items (used when no admin data exists)
const DEFAULT_GALLERY = [
    { id: 1, title: 'Annual Function 2025', description: 'Celebrate achievements and performances from our students.', category: 'events', image: 'cpcimg.png' },
    { id: 2, title: 'Student Awards', description: 'Recognition of outstanding performers and achievers.', category: 'awards', image: 'cpcimg.png' },
    { id: 3, title: 'Science Lab Activities', description: 'Hands-on experiments and practical sessions.', category: 'classes', image: 'cpcimg.png' },
    { id: 4, title: 'Study Sessions', description: 'Interactive classroom learning and doubt-clearing sessions.', category: 'classes', image: 'cpcimg.png' },
    { id: 5, title: 'Sports Events', description: 'Inter-school competitions and sports day highlights.', category: 'sports', image: 'cpcimg.png' },
    { id: 6, title: 'Graduation Ceremony', description: 'Celebrating the success and future of our graduating students.', category: 'events', image: 'cpcimg.png' },
    { id: 7, title: 'Cultural Fest', description: 'Students showcasing cultural talents and performances.', category: 'events', image: 'cpcimg.png' },
    { id: 8, title: 'Top Achievers', description: 'Honouring students who excelled in academics and competitions.', category: 'awards', image: 'cpcimg.png' }
];

function getGalleryItems() {
    try {
        const admin = JSON.parse(localStorage.getItem('admin_gallery'));
        if (admin && admin.length > 0) return admin;
    } catch(e) {}
    return DEFAULT_GALLERY;
}

document.addEventListener('DOMContentLoaded', function () {
    let currentFilter = 'all';
    let currentView = 'carousel';
    let allFlatItems = [];
    let activeIndex = 0;

    const lightbox = document.getElementById('lightbox');
    const lbImg = lightbox?.querySelector('.lightbox-content img');
    const lbCaption = lightbox?.querySelector('.lightbox-caption');
    const lbCounter = lightbox?.querySelector('.lightbox-counter');
    const lbClose = lightbox?.querySelector('.lightbox-close');
    const lbPrev = lightbox?.querySelector('.lightbox-prev');
    const lbNext = lightbox?.querySelector('.lightbox-next');

    // ---- Build Gallery Card HTML ----
    function buildCard(item) {
        const cat = GALLERY_CATEGORIES[item.category] || { label: item.category, icon: 'fa-image' };
        return `
        <figure class="gallery-item" data-category="${item.category}" data-id="${item.id}">
            <div class="gallery-image">
                <img src="${item.image}" alt="${escapeAttr(item.title)}" loading="lazy">
                <span class="gallery-category-badge">${cat.label}</span>
                <div class="gallery-overlay"><div class="view-icon"><i class="fas fa-expand"></i></div></div>
            </div>
            <figcaption class="gallery-info">
                <h3>${escapeHtmlGallery(item.title)}</h3>
                <p>${escapeHtmlGallery(item.description || '')}</p>
            </figcaption>
        </figure>`;
    }

    function escapeHtmlGallery(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function escapeAttr(str) {
        return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    // ---- Render Carousel View (event-wise) ----
    function renderCarouselView(items) {
        const container = document.getElementById('galleryCarouselView');
        if (!container) return;

        // Group by category
        const groups = {};
        items.forEach(item => {
            const cat = item.category || 'other';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(item);
        });

        let html = '';
        const catOrder = ['events', 'awards', 'classes', 'sports'];
        const orderedKeys = catOrder.filter(k => groups[k]);
        // Add any remaining categories
        Object.keys(groups).forEach(k => { if (!orderedKeys.includes(k)) orderedKeys.push(k); });

        orderedKeys.forEach(cat => {
            const catInfo = GALLERY_CATEGORIES[cat] || { label: cat, icon: 'fa-image', iconClass: 'events' };
            const catItems = groups[cat];
            html += `
            <div class="gallery-event-section" data-event-cat="${cat}">
                <div class="gallery-event-header">
                    <div class="gallery-event-title">
                        <span class="event-icon ${catInfo.iconClass}"><i class="fas ${catInfo.icon}"></i></span>
                        ${catInfo.label}
                    </div>
                    <span class="gallery-event-count">${catItems.length} photo${catItems.length > 1 ? 's' : ''}</span>
                </div>
                <div class="carousel-wrapper">
                    <button class="carousel-nav prev" onclick="scrollCarousel(this, -1)"><i class="fas fa-chevron-left"></i></button>
                    <div class="carousel-track">
                        ${catItems.map(item => buildCard(item)).join('')}
                    </div>
                    <button class="carousel-nav next" onclick="scrollCarousel(this, 1)"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>`;
        });

        container.innerHTML = html;
    }

    // ---- Render Grid View ----
    function renderGridView(items) {
        const grid = document.getElementById('galleryGrid');
        if (!grid) return;
        grid.innerHTML = items.map(item => buildCard(item)).join('');
    }

    // ---- Main render ----
    function renderGallery() {
        const items = getGalleryItems();
        const filtered = currentFilter === 'all' ? items : items.filter(i => i.category === currentFilter);

        const carouselView = document.getElementById('galleryCarouselView');
        const gridView = document.getElementById('galleryGridView');
        const emptyState = document.getElementById('galleryEmpty');

        if (filtered.length === 0) {
            if (carouselView) carouselView.style.display = 'none';
            if (gridView) gridView.style.display = 'none';
            if (emptyState) emptyState.style.display = '';
            return;
        }
        if (emptyState) emptyState.style.display = 'none';

        if (currentView === 'carousel') {
            renderCarouselView(filtered);
            if (carouselView) carouselView.style.display = '';
            if (gridView) gridView.style.display = 'none';
        } else {
            renderGridView(filtered);
            if (carouselView) carouselView.style.display = 'none';
            if (gridView) gridView.style.display = '';
        }

        attachCardListeners();
    }

    // ---- Card click handlers ----
    function attachCardListeners() {
        const allCards = document.querySelectorAll('.gallery-item');
        allFlatItems = Array.from(allCards);
        allCards.forEach(card => {
            card.addEventListener('click', function() {
                allFlatItems = Array.from(document.querySelectorAll('.gallery-item'));
                activeIndex = allFlatItems.indexOf(card);
                const img = card.querySelector('img');
                const title = card.querySelector('.gallery-info h3')?.innerText || '';
                openLightbox(img.src, title);
            });
        });
    }

    // ---- Lightbox ----
    function openLightbox(src, caption) {
        if (!lightbox) return;
        lbImg.src = src;
        lbImg.alt = caption;
        if (lbCaption) lbCaption.textContent = caption;
        if (lbCounter) lbCounter.textContent = `${activeIndex + 1} / ${allFlatItems.length}`;
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function navigate(dir) {
        if (!allFlatItems.length) return;
        activeIndex = (activeIndex + dir + allFlatItems.length) % allFlatItems.length;
        const target = allFlatItems[activeIndex];
        const img = target.querySelector('img');
        const caption = target.querySelector('.gallery-info h3')?.innerText || '';
        openLightbox(img.src, caption);
    }

    lbClose?.addEventListener('click', closeLightbox);
    lbPrev?.addEventListener('click', (e) => { e.stopPropagation(); navigate(-1); });
    lbNext?.addEventListener('click', (e) => { e.stopPropagation(); navigate(1); });
    lightbox?.addEventListener('click', (e) => {
        if (e.target.classList.contains('lightbox-backdrop')) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
    });

    // ---- Filter buttons ----
    const filters = document.querySelectorAll('.filter-btn');
    filters.forEach(btn => btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderGallery();
    }));

    // ---- View toggle ----
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => btn.addEventListener('click', () => {
        viewBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentView = btn.dataset.view;
        renderGallery();
    }));

    // ---- Carousel scroll function ----
    window.scrollCarousel = function(btnEl, direction) {
        const wrapper = btnEl.closest('.carousel-wrapper');
        const track = wrapper.querySelector('.carousel-track');
        const scrollAmount = 260;
        track.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    };

    // ---- Listen for admin gallery changes ----
    window.addEventListener('storage', function(e) {
        if (e.key === 'admin_gallery') renderGallery();
    });

    // Expose for admin to call after changes
    window.refreshPublicGallery = renderGallery;

    // Initial render
    renderGallery();
});
