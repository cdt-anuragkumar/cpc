// ============ ENHANCED GALLERY SYSTEM ============
// Handles: grid view, filtering, lightbox, stats, admin sync

const GALLERY_CATEGORIES = {
    events: { label: 'Events', icon: 'fa-calendar-alt', iconClass: 'events', color: '#E94560' },
    awards: { label: 'Awards', icon: 'fa-trophy', iconClass: 'awards', color: '#fda085' },
    classes: { label: 'Classes', icon: 'fa-chalkboard-teacher', iconClass: 'classes', color: '#66a6ff' },
    sports: { label: 'Sports', icon: 'fa-futbol', iconClass: 'sports', color: '#38f9d7' }
};

// Default gallery items
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
    let allFlatItems = [];
    let activeIndex = 0;

    const lightbox = document.getElementById('lightbox');
    const lbImg = lightbox?.querySelector('.lightbox-content img');
    const lbCaption = lightbox?.querySelector('.lightbox-caption');
    const lbCounter = lightbox?.querySelector('.lightbox-counter');
    const lbClose = lightbox?.querySelector('.lightbox-close');
    const lbPrev = lightbox?.querySelector('.lightbox-prev');
    const lbNext = lightbox?.querySelector('.lightbox-next');

    // ---- Stats Bar ----
    function renderStatsBar(items) {
        var bar = document.getElementById('galleryStatsBar');
        if (!bar) return;
        var total = items.length;
        var catCounts = {};
        items.forEach(function(item) {
            var cat = item.category || 'other';
            catCounts[cat] = (catCounts[cat] || 0) + 1;
        });
        var html = '<div class="gal-stat-chip" style="animation-delay:0s"><i class="fas fa-images"></i> Total: <span class="gal-stat-num">' + total + '</span></div>';
        var delay = 0.08;
        Object.keys(GALLERY_CATEGORIES).forEach(function(cat) {
            if (catCounts[cat]) {
                var catInfo = GALLERY_CATEGORIES[cat];
                html += '<div class="gal-stat-chip" style="animation-delay:' + delay + 's"><i class="fas ' + catInfo.icon + '"></i> ' + catInfo.label + ': <span class="gal-stat-num">' + catCounts[cat] + '</span></div>';
                delay += 0.08;
            }
        });
        bar.innerHTML = html;
    }

    // ---- Build Gallery Card HTML ----
    function buildCard(item, idx) {
        var cat = GALLERY_CATEGORIES[item.category] || { label: item.category, icon: 'fa-image' };
        var delay = (idx || 0) * 0.06;
        return '<figure class="gallery-item" data-category="' + item.category + '" data-id="' + item.id + '" style="animation-delay:' + delay + 's">' +
            '<div class="gallery-image">' +
                '<img src="' + item.image + '" alt="' + escapeAttr(item.title) + '" loading="lazy">' +
                '<span class="gallery-category-badge">' + cat.label + '</span>' +
                '<div class="gallery-overlay"><div class="view-icon"><i class="fas fa-expand"></i></div></div>' +
            '</div>' +
            '<figcaption class="gallery-info">' +
                '<h3>' + escapeHtmlGallery(item.title) + '</h3>' +
                '<p>' + escapeHtmlGallery(item.description || '') + '</p>' +
            '</figcaption>' +
        '</figure>';
    }

    function escapeHtmlGallery(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function escapeAttr(str) {
        return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    // ---- Render Grid View ----
    function renderGridView(items) {
        var grid = document.getElementById('galleryGrid');
        if (!grid) return;
        grid.innerHTML = items.map(function(item, i) { return buildCard(item, i); }).join('');
    }

    // ---- Main render ----
    function renderGallery() {
        var items = getGalleryItems();
        var filtered = currentFilter === 'all' ? items : items.filter(function(i) { return i.category === currentFilter; });

        var gridView = document.getElementById('galleryGridView');
        var emptyState = document.getElementById('galleryEmpty');

        renderStatsBar(items);

        if (filtered.length === 0) {
            if (gridView) gridView.style.display = 'none';
            if (emptyState) emptyState.style.display = '';
            return;
        }
        if (emptyState) emptyState.style.display = 'none';

        renderGridView(filtered);
        if (gridView) gridView.style.display = '';

        attachCardListeners();
        observeCards();
    }

    // ---- Card click handlers ----
    function attachCardListeners() {
        var allCards = document.querySelectorAll('.gallery-item');
        allFlatItems = Array.from(allCards);
        allCards.forEach(function(card) {
            card.addEventListener('click', function() {
                allFlatItems = Array.from(document.querySelectorAll('.gallery-item'));
                activeIndex = allFlatItems.indexOf(card);
                var img = card.querySelector('img');
                var title = card.querySelector('.gallery-info h3')?.innerText || '';
                openLightbox(img.src, title);
            });
        });
    }

    // ---- Intersection Observer for reveal animations ----
    function observeCards() {
        if (!('IntersectionObserver' in window)) return;
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('gal-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

        document.querySelectorAll('.gallery-item, .gallery-event-section').forEach(function(el) {
            observer.observe(el);
        });
    }

    // ---- Lightbox ----
    function openLightbox(src, caption) {
        if (!lightbox) return;
        lbImg.src = src;
        lbImg.alt = caption;
        if (lbCaption) lbCaption.textContent = caption;
        if (lbCounter) lbCounter.textContent = (activeIndex + 1) + ' / ' + allFlatItems.length;
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
        var target = allFlatItems[activeIndex];
        var img = target.querySelector('img');
        var caption = target.querySelector('.gallery-info h3')?.innerText || '';
        openLightbox(img.src, caption);
    }

    // Lightbox touch swipe
    var lbTouchStartX = 0;
    if (lightbox) {
        lightbox.addEventListener('touchstart', function(e) {
            lbTouchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        lightbox.addEventListener('touchend', function(e) {
            var diff = e.changedTouches[0].screenX - lbTouchStartX;
            if (Math.abs(diff) > 50) {
                navigate(diff > 0 ? -1 : 1);
            }
        });
    }

    lbClose?.addEventListener('click', closeLightbox);
    lbPrev?.addEventListener('click', function(e) { e.stopPropagation(); navigate(-1); });
    lbNext?.addEventListener('click', function(e) { e.stopPropagation(); navigate(1); });
    lightbox?.addEventListener('click', function(e) {
        if (e.target.classList.contains('lightbox-backdrop')) closeLightbox();
    });
    document.addEventListener('keydown', function(e) {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
    });

    // ---- Filter buttons with transition ----
    var filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;

            var gridView = document.getElementById('galleryGridView');
            if (gridView) {
                gridView.style.opacity = '0';
                gridView.style.transform = 'translateY(10px)';
                gridView.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            }
            setTimeout(function() {
                renderGallery();
                if (gridView) {
                    gridView.style.opacity = '';
                    gridView.style.transform = '';
                }
            }, 200);
        });
    });

    // ---- Listen for admin gallery changes ----
    window.addEventListener('storage', function(e) {
        if (e.key === 'admin_gallery') renderGallery();
    });

    // Expose for admin to call after changes
    window.refreshPublicGallery = renderGallery;

    // Initial render
    renderGallery();
});
