// Dark Mode Toggle Function
function toggleDarkMode() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    
    // Toggle dark mode class
    body.classList.toggle('dark-mode');
    
    // Save preference to localStorage
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    // Update button icon
    if (isDarkMode) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggle.title = 'Toggle Light Mode';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.title = 'Toggle Dark Mode';
    }
}

// Load dark mode preference on page load
function loadDarkModePreference() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    
    if (isDarkMode) {
        body.classList.add('dark-mode');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            themeToggle.title = 'Toggle Light Mode';
        }
    }
}

// Mobile card click - makes entire card clickable on mobile only
function mobileCardClick(card) {
    if (window.innerWidth <= 768) {
        const btn = card.querySelector('.btn-action');
        if (btn) btn.click();
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const menuBtn = document.getElementById('menuBtn');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    menuBtn.classList.toggle('active');
}



// Menu Management
let hiddenMenus = JSON.parse(localStorage.getItem('hiddenMenus')) || [];

function toggleSubmenu(submenuName) {
    const submenu = document.getElementById(submenuName + '-submenu');
    const navItem = document.querySelector(`[onclick="toggleSubmenu('${submenuName}')"]`);
    
    if (submenu) {
        document.querySelectorAll('.submenu').forEach(menu => {
            if (menu !== submenu) {
                menu.classList.remove('active');
                const item = menu.previousElementSibling;
                if (item) item.classList.remove('active');
            }
        });
        
        submenu.classList.toggle('active');
        if (navItem) navItem.classList.toggle('active');
    }
}

function closeSubmenu(submenuName) {
    const submenu = document.getElementById(submenuName + '-submenu');
    const navItem = document.querySelector(`[onclick="toggleSubmenu('${submenuName}')"]`);
    
    if (submenu) {
        submenu.classList.remove('active');
        if (navItem) navItem.classList.remove('active');
    }
}

function hideMenuItem(menuName) {
    const wrapper = document.getElementById(menuName + '-wrapper');
    
    if (wrapper) {
        wrapper.classList.add('hidden');
        
        if (!hiddenMenus.includes(menuName)) {
            hiddenMenus.push(menuName);
        }
        
        localStorage.setItem('hiddenMenus', JSON.stringify(hiddenMenus));
        updateHiddenMenuNotice();
        
        // Show confirmation toast
        showToast(`${menuName.charAt(0).toUpperCase() + menuName.slice(1)} menu hidden. Click "Restore All" to show.`);
    }
}

function restoreMenuItem(menuName) {
    const wrapper = document.getElementById(menuName + '-wrapper');
    
    if (wrapper) {
        wrapper.classList.remove('hidden');
        hiddenMenus = hiddenMenus.filter(item => item !== menuName);
        localStorage.setItem('hiddenMenus', JSON.stringify(hiddenMenus));
        updateHiddenMenuNotice();
        showToast(`${menuName.charAt(0).toUpperCase() + menuName.slice(1)} menu restored!`);
    }
}

function restoreAllMenus() {
    const allWrappers = document.querySelectorAll('.nav-item-wrapper');
    allWrappers.forEach(wrapper => {
        wrapper.classList.remove('hidden');
    });
    
    hiddenMenus = [];
    localStorage.setItem('hiddenMenus', JSON.stringify(hiddenMenus));
    updateHiddenMenuNotice();
    showToast('All menus restored!');
}

function updateHiddenMenuNotice() {
    const notice = document.getElementById('hidden-menu-notice');
    const countSpan = document.getElementById('hidden-count');
    
    if (hiddenMenus.length > 0) {
        countSpan.textContent = hiddenMenus.length;
        notice.style.display = 'block';
        notice.innerHTML = `
            <p>
                📌 Hidden menus: <span id="hidden-count">${hiddenMenus.length}</span> | 
                <button onclick="restoreAllMenus();" style="padding: 5px 10px; background: var(--primary); color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    ↻ Restore All
                </button>
            </p>
        `;
    } else {
        notice.style.display = 'none';
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--primary) 0%, #424242 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        max-width: 300px;
        word-wrap: break-word;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Initialize hidden menus on page load
function initializeHiddenMenus() {
    hiddenMenus = JSON.parse(localStorage.getItem('hiddenMenus')) || [];
    
    hiddenMenus.forEach(menuName => {
        const wrapper = document.getElementById(menuName + '-wrapper');
        if (wrapper) {
            wrapper.classList.add('hidden');
        }
    });
    
    updateHiddenMenuNotice();
}

// Add to DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    initializeHiddenMenus();
    loadDarkModePreference(); // Load dark mode preference
    seedDefaultHeadlines(); // Seed default headlines if none exist
    applyStoredHeadlines(); // Apply admin-saved headlines
    applySiteConfig(); // Apply saved site configuration
    seedDefaultTeachers(); // Seed default teachers if none exist
    seedDefaultToppers(); // Seed default toppers if none exist
    renderTeacherSubjectButtons(); // Dynamic subject buttons
});

// Apply persisted headlines on page load
function applyStoredHeadlines() {
    try {
        const list = JSON.parse(localStorage.getItem('admin_headlines') || '[]').filter(h => h.active);
        if (list.length === 0) return;
        const container = document.querySelector('.headlines-content');
        if (!container) return;
        container.innerHTML = list.map(h => `
            <div class="headline-item">
                <div class="hl-item-icon">${h.icon || '📢'}</div>
                <div class="hl-item-body">
                    <h3>${escapeHtml(h.title)}</h3>
                    <p>${escapeHtml(h.description || '')}</p>
                </div>
            </div>
        `).join('');
        initHeadlinesTicker();
    } catch(e) {}
}

// Headlines auto-scroll ticker
var _hlTickerInterval = null;
var _hlTickerPaused = false;

function initHeadlinesTicker() {
    if (_hlTickerInterval) clearInterval(_hlTickerInterval);
    const wrap = document.querySelector('.headlines-ticker-wrap');
    if (!wrap) return;
    const content = wrap.querySelector('.headlines-content');
    if (!content) return;

    // Reset scroll
    wrap.scrollTop = 0;

    // Pause on hover
    wrap.addEventListener('mouseenter', function() { _hlTickerPaused = true; });
    wrap.addEventListener('mouseleave', function() { _hlTickerPaused = false; });

    // Pause on click/touch
    wrap.addEventListener('click', function() {
        _hlTickerPaused = !_hlTickerPaused;
        wrap.classList.toggle('hl-ticker-paused', _hlTickerPaused);
    });
    wrap.addEventListener('touchstart', function() { _hlTickerPaused = true; }, { passive: true });
    wrap.addEventListener('touchend', function() {
        setTimeout(function() { _hlTickerPaused = false; }, 3000);
    }, { passive: true });

    // Auto-scroll
    _hlTickerInterval = setInterval(function() {
        if (_hlTickerPaused) return;
        const maxScroll = wrap.scrollHeight - wrap.clientHeight;
        if (maxScroll <= 0) return;
        wrap.scrollTop += 1;
        if (wrap.scrollTop >= maxScroll) {
            // Pause at bottom, then reset
            _hlTickerPaused = true;
            setTimeout(function() {
                wrap.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(function() { _hlTickerPaused = false; }, 800);
            }, 2000);
        }
    }, 40);
}

// Initialize ticker on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initHeadlinesTicker, 1000);
    initAboutLangSwitch();
});

// About CPC language auto-switch
var _aboutLangInterval = null;
var _aboutLangPaused = false;
var _aboutLangCurrent = 'en'; // 'en' or 'hi'

function initAboutLangSwitch() {
    const box = document.getElementById('aboutCpcBox');
    const badge = document.getElementById('aboutLangBadge');
    if (!box) return;

    // Pause on hover
    box.addEventListener('mouseenter', function() { _aboutLangPaused = true; });
    box.addEventListener('mouseleave', function() { _aboutLangPaused = false; });

    // Pause on touch
    box.addEventListener('touchstart', function() { _aboutLangPaused = true; }, { passive: true });
    box.addEventListener('touchend', function() {
        setTimeout(function() { _aboutLangPaused = false; }, 4000);
    }, { passive: true });

    // Click badge to manually toggle
    if (badge) {
        badge.addEventListener('click', function(e) {
            e.stopPropagation();
            switchAboutLang();
        });
    }

    // Auto-switch every 8 seconds
    _aboutLangInterval = setInterval(function() {
        if (_aboutLangPaused) return;
        switchAboutLang();
    }, 8000);
}

function switchAboutLang() {
    const slideEn = document.getElementById('aboutSlideEn');
    const slideHi = document.getElementById('aboutSlideHi');
    const label = document.querySelector('.about-lang-label');
    if (!slideEn || !slideHi) return;

    if (_aboutLangCurrent === 'en') {
        slideEn.classList.remove('about-slide-active');
        slideHi.classList.add('about-slide-active');
        _aboutLangCurrent = 'hi';
        if (label) label.textContent = 'हिं';
    } else {
        slideHi.classList.remove('about-slide-active');
        slideEn.classList.add('about-slide-active');
        _aboutLangCurrent = 'en';
        if (label) label.textContent = 'EN';
    }
    // Reset scroll position
    const slider = document.querySelector('.about-slider');
    if (slider) slider.scrollTop = 0;
}

// Apply saved site config on page load
function applySiteConfig() {
    try {
        const config = JSON.parse(localStorage.getItem('site_config') || '{}');
        if (config.name) {
            const logoText = document.querySelector('.logo-text-small h2');
            if (logoText) logoText.textContent = config.name;
        }
        if (config.tagline) {
            const logoSub = document.querySelector('.logo-text-small p');
            if (logoSub) logoSub.textContent = config.tagline;
        }
    } catch(e) {}
}

// ---------------- Admin Authentication & Editor ----------------
function openAdminAuth() {
    document.getElementById('adminPassword').value = '';
    document.getElementById('adminAuthError').style.display = 'none';
    document.getElementById('adminAuthModal').classList.add('active');
        setTimeout(() => {
            const el = document.getElementById('adminPassword');
            if (el) el.focus();
        }, 120);
}

function closeAdminAuth() {
    document.getElementById('adminAuthModal').classList.remove('active');
}

function setAdminAuthenticated(flag) {
    try { sessionStorage.setItem('adminAuthenticated', flag ? 'true' : 'false'); } catch(e){}
}

function isAdminAuthenticated() {
    return sessionStorage.getItem('adminAuthenticated') === 'true';
}

function showAdminDashboard() {
    document.getElementById('adminDashboardModal').classList.add('active');
    renderAdminStats();
}

function closeAdminDashboard() {
    document.getElementById('adminDashboardModal').classList.remove('active');
}

function closeAdminEditor() {
    document.getElementById('adminEditorModal').classList.remove('active');
}

async function verifyAdminPassword(e) {
    if (e) e.preventDefault();
    const pass = document.getElementById('adminPassword').value || '';
    // Check stored admin password in localStorage first, otherwise fallback to hard-coded
    const stored = localStorage.getItem('admin_password');
    const validPassword = stored || 'Anurag@123';
    if (pass === validPassword) {
        setAdminAuthenticated(true);
        closeAdminAuth();
        showAdminDashboard();
    } else {
            const errEl = document.getElementById('adminAuthError');
            errEl.style.display = 'block';
            errEl.style.animation = 'shake 0.35s';
            setTimeout(()=> errEl.style.animation = '', 400);
        setAdminAuthenticated(false);
    }
}

    function toggleAdminPassword() {
        const el = document.getElementById('adminPassword');
        if (!el) return;
        el.type = el.type === 'password' ? 'text' : 'password';
    }

    function adminLogout() {
        setAdminAuthenticated(false);
        closeAdminDashboard();
        showToast('Logged out');
    }

function openSectionEditor(section) {
    if (!isAdminAuthenticated()) {
        openAdminAuth();
        return;
    }
    const editor = document.getElementById('adminEditorModal');
    const title = document.getElementById('editorTitle');
    const secInput = document.getElementById('editorSection');
    const fieldTitle = document.getElementById('editorFieldTitle');
    const fieldDesc = document.getElementById('editorFieldDesc');
    const preview = document.getElementById('editorPreview');

    const niceName = section.charAt(0).toUpperCase() + section.slice(1);
    title.innerText = `Edit: ${niceName}`;
    secInput.value = section;
    // If editing students, render the specialized students admin UI
    if (section === 'students') {
        renderStudentsAdmin(editor);
        return;
    }

    // load stored data for generic sections
    const stored = loadSectionData(section) || {};
    fieldTitle.value = stored.title || niceName;
    fieldDesc.value = stored.description || stored.desc || '';
    preview.innerHTML = '';
    if (stored.image) {
        const img = document.createElement('img');
        img.src = stored.image;
        img.style.maxWidth = '100%';
        img.style.borderRadius = '8px';
        preview.appendChild(img);
    }

    // attach live preview on file select
    const fileInput = document.getElementById('editorFieldImage');
    if (fileInput) {
        fileInput.onchange = async function() {
            if (fileInput.files && fileInput.files[0]) {
                try {
                    const data = await readFileAsDataURL(fileInput.files[0]);
                    preview.innerHTML = '';
                    const img = document.createElement('img'); img.src = data; preview.appendChild(img);
                } catch(e) { console.error('preview error', e); }
            }
        }
    }

    editor.classList.add('active');
}

function loadSectionData(section) {
    try {
        const raw = localStorage.getItem('sectionData_' + section);
        return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.onerror = reject;
        fr.readAsDataURL(file);
    });
}

function openDataUrlInNewTab(dataUrl) {
    try {
        const byteString = atob(dataUrl.split(',')[1]);
        const mimeType = dataUrl.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        const blob = new Blob([ab], { type: mimeType });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
    } catch(e) {
        console.error('Failed to open PDF:', e);
        showToast('Failed to open PDF');
    }
}

function viewMaterialPdf(id) {
    const doc = getMaterials().find(m => m.id === id);
    if (doc && doc.file) openDataUrlInNewTab(doc.file);
    else showToast('PDF not found');
}

function viewResultPdf(id) {
    const doc = getResultPDFs().find(p => p.id === id);
    if (doc && doc.file) openDataUrlInNewTab(doc.file);
    else showToast('PDF not found');
}

function downloadMaterialPdf(id) {
    const doc = getMaterials().find(m => m.id === id);
    if (doc && doc.file) downloadDataUrl(doc.file, (doc.title || 'document') + '.pdf');
    else showToast('PDF not found');
}

function downloadResultPdf(id) {
    const doc = getResultPDFs().find(p => p.id === id);
    if (doc && doc.file) downloadDataUrl(doc.file, (doc.title || 'result') + '.pdf');
    else showToast('PDF not found');
}

function downloadDataUrl(dataUrl, filename) {
    try {
        const byteString = atob(dataUrl.split(',')[1]);
        const mimeType = dataUrl.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        const blob = new Blob([ab], { type: mimeType });
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl; a.download = filename;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
    } catch(e) {
        console.error('Download failed:', e);
        showToast('Download failed');
    }
}

async function saveSectionData(e) {
    if (e) e.preventDefault();
    const section = document.getElementById('editorSection').value;
    const title = document.getElementById('editorFieldTitle').value;
    const desc = document.getElementById('editorFieldDesc').value;
    const fileInput = document.getElementById('editorFieldImage');

    let imageData = null;
    if (fileInput && fileInput.files && fileInput.files[0]) {
        try { imageData = await readFileAsDataURL(fileInput.files[0]); } catch(e){ imageData = null; }
    } else {
        const existing = loadSectionData(section);
        if (existing && existing.image) imageData = existing.image;
    }

    const payload = { title: title, description: desc, image: imageData };
    try { localStorage.setItem('sectionData_' + section, JSON.stringify(payload)); } catch (err) { console.error('save error', err); }

    showToast('Section saved');
    closeAdminEditor();
}

    function saveSectionDraft() {
        const section = document.getElementById('editorSection').value;
        const title = document.getElementById('editorFieldTitle').value;
        const desc = document.getElementById('editorFieldDesc').value;
        const existing = loadSectionData(section) || {};
        const payload = { title, description: desc, image: existing.image || null };
        try { localStorage.setItem('sectionData_' + section, JSON.stringify(payload)); } catch(e){}
        showToast('Draft saved locally');
    }

// --- Students admin helpers ---
function getStudents() {
    try { const raw = localStorage.getItem('students_list'); return raw ? JSON.parse(raw) : []; } catch (e) { return []; }
}

function saveStudents(list) { try { localStorage.setItem('students_list', JSON.stringify(list)); } catch(e){} }

function renderStudentsTable() {
    const container = document.getElementById('studentsTableContainer');
    const list = getStudents();
    if (!container) return;
    if (list.length === 0) { container.innerHTML = '<div style="color:var(--text-secondary);">No students yet.</div>'; return; }
    let html = '<table class="students-table"><thead><tr><th>Roll</th><th>Name</th><th>Class</th><th>Marks</th><th>Actions</th></tr></thead><tbody>';
    list.sort((a,b)=> (a.roll||0)-(b.roll||0));
    for (const s of list) {
        html += `<tr data-id="${s.id}"><td>${s.roll||''}</td><td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.class)}</td><td>${(s.marks && s.marks.length)?s.marks.length+' items':'—'}</td><td><button class="btn-action small" onclick="openStudentEditor(${s.id})">Edit</button> <button class="btn-action small" style="background:#e74c3c;" onclick="deleteStudent(${s.id})">Delete</button></td></tr>`;
    }
    html += '</tbody></table>';
    container.innerHTML = html;
}

function addStudentAdmin() {
    const name = document.getElementById('sa_name').value.trim();
    const cls = document.getElementById('sa_class').value.trim();
    const roll = parseInt(document.getElementById('sa_roll').value,10) || 0;
    if (!name || !cls) { showToast('Please fill name and class'); return; }
    const list = getStudents(); const id = Date.now(); list.push({ id, name, class: cls, roll, marks: [] }); saveStudents(list);
    document.getElementById('addStudentAdminForm').reset(); renderStudentsTable(); showToast('Student added'); trySendStudentToServer({ name, class_name: cls, roll });
}

function openStudentEditor(id) {
    const list = getStudents(); const s = list.find(x=>x.id===id); if (!s) return showToast('Student not found');
    const content = `
        <div style="padding:10px;">
            <h3 style="margin-top:0;">${escapeHtml(s.name)}</h3>
            <div style="margin-bottom:8px;"><strong>Roll:</strong> ${s.roll || ''} &nbsp; <strong>Class:</strong> ${escapeHtml(s.class)}</div>
            <div id="marksList" style="margin-bottom:10px;">
                ${(s.marks && s.marks.length)? s.marks.map(m=>`<div class=\"mark-item\">${escapeHtml(m.subject)}: <strong>${m.score}</strong></div>`).join('') : '<div style="color:var(--text-secondary);">No marks yet</div>'}
            </div>
            <div style="display:flex; gap:8px; align-items:center;">
                <input id="mark_subject" placeholder="Subject" style="flex:1; padding:8px; border-radius:8px; border:1px solid var(--border-color);">
                <input id="mark_score" placeholder="Score" style="width:90px; padding:8px; border-radius:8px; border:1px solid var(--border-color);">
                <button class="btn-action" id="addMarkBtn">Add</button>
            </div>
            <div style="margin-top:12px; display:flex; gap:8px;"><button class="btn-action" id="saveStudentBtn">Save</button> <button class="btn-action" id="closeStudentBtn" style="background:transparent; border:1px solid var(--border-color); color:var(--primary);">Close</button></div>
        </div>
    `;
    const modal = createSimpleModal('Student: ' + s.name, content);
    modal.querySelector('#addMarkBtn').onclick = function(){ const subj = modal.querySelector('#mark_subject').value.trim(); const score = modal.querySelector('#mark_score').value.trim(); if (!subj || !score) return showToast('Enter subject and score'); s.marks = s.marks || []; s.marks.push({ subject: subj, score }); modal.querySelector('#marksList').insertAdjacentHTML('beforeend', `<div class="mark-item">${escapeHtml(subj)}: <strong>${escapeHtml(score)}</strong></div>`); modal.querySelector('#mark_subject').value=''; modal.querySelector('#mark_score').value=''; };
    modal.querySelector('#saveStudentBtn').onclick = function(){ const listAll = getStudents(); const idx = listAll.findIndex(x=>x.id===s.id); if (idx>=0) { listAll[idx]=s; saveStudents(listAll); renderStudentsTable(); showToast('Student saved'); } removeModal(modal); };
    modal.querySelector('#closeStudentBtn').onclick = function(){ removeModal(modal); };
}

function deleteStudent(id) { if (!confirm('Delete student?')) return; let list = getStudents(); list = list.filter(s=>s.id!==id); saveStudents(list); renderStudentsTable(); showToast('Student deleted'); }

function importStudentsPrompt() { const json = prompt('Paste JSON array of students (name,class,roll)'); if (!json) return; try { const arr = JSON.parse(json); if (!Array.isArray(arr)) throw new Error('not array'); const list = getStudents(); for (const it of arr) { const id = Date.now() + Math.floor(Math.random()*1000); list.push({ id, name: it.name || it.fullName || '', class: it.class || it.class_name || '', roll: it.roll || 0, marks: it.marks||[] }); } saveStudents(list); renderStudentsTable(); showToast('Imported students'); } catch(e){ showToast('Invalid JSON'); } }

function trySendStudentToServer(student) { if (!window.fetch) return; fetch('/api/students', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(student) }).then(r=>{ if (!r.ok) throw new Error('no'); return r.json(); }).then(()=> console.log('synced')).catch(()=>{}); }

function createSimpleModal(title, contentHtml) { const modal = document.createElement('div'); modal.className = 'modal active simple-modal'; modal.innerHTML = `<div class="modal-content"><div class="modal-header"><h2>${escapeHtml(title)}</h2><button class="close-btn">&times;</button></div><div class="modal-body">${contentHtml}</div></div>`; document.body.appendChild(modal); modal.querySelector('.close-btn').onclick = ()=> removeModal(modal); modal.onclick = (e)=>{ if (e.target === modal) removeModal(modal); }; return modal; }

function removeModal(modal) { if (modal && modal.parentNode) modal.parentNode.removeChild(modal); }

function escapeHtml(s){ if(!s && s!==0) return ''; return String(s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]; }); }
// --- Additional admin section renderers (Timetable, Materials, Results, Attendance, Settings) ---

function getTimetable() { try { const raw = localStorage.getItem('timetable_entries'); return raw ? JSON.parse(raw) : []; } catch(e){ return []; } }
function saveTimetable(list) { try { localStorage.setItem('timetable_entries', JSON.stringify(list)); } catch(e){} }

function renderTimetableAdmin(editor) {
    const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const body = editor.querySelector('.modal-body');
    body.innerHTML = `
        <div class="admin-section-grid">
            <div style="max-width:400px;">
                <h3>Add Schedule</h3>
                <form id="ttForm">
                    <div class="form-group"><label>Class</label>
                        <select id="tt_class" required>
                            <option value="">Select Class</option>
                            ${CLASSES.map(c => `<option value="${c}">Class ${c}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group"><label>Day</label>
                        <select id="tt_day" required>
                            <option value="">Select Day</option>
                            ${DAYS.map(d => `<option value="${d}">${d}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group"><label>Time</label><input id="tt_time" required placeholder="e.g. 9:00 AM - 10:00 AM"></div>
                    <div class="form-group"><label>Subject</label><input id="tt_subject" required placeholder="e.g. Mathematics"></div>
                    <div style="margin-top:8px;"><button class="btn-action" type="submit">Add Schedule</button></div>
                </form>
            </div>
            <div style="flex:1;">
                <h3>All Schedules</h3>
                <div class="form-group" style="max-width:200px;margin-bottom:12px;">
                    <label>Filter by Class</label>
                    <select id="tt_filter_class" onchange="filterTimetableList()">
                        <option value="">All Classes</option>
                        ${CLASSES.map(c => `<option value="${c}">Class ${c}</option>`).join('')}
                    </select>
                </div>
                <div id="ttList"></div>
            </div>
        </div>
    `;
    document.getElementById('ttForm').onsubmit = function(e) {
        e.preventDefault();
        const cls = document.getElementById('tt_class').value;
        const day = document.getElementById('tt_day').value;
        const time = document.getElementById('tt_time').value.trim();
        const subj = document.getElementById('tt_subject').value.trim();
        if (!cls || !day || !subj) return showToast('Please fill all fields');
        const list = getTimetable();
        list.push({ id: Date.now(), class: cls, day, time, subject: subj });
        saveTimetable(list);
        renderTimetableList();
        e.target.reset();
        showToast('Schedule added');
    };
    window.filterTimetableList = function() { renderTimetableList(); };
    function renderTimetableList() {
        let list = getTimetable();
        const filterCls = document.getElementById('tt_filter_class') ? document.getElementById('tt_filter_class').value : '';
        if (filterCls) list = list.filter(r => r.class === filterCls);
        const dayOrder = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
        list.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));
        if (list.length === 0) {
            document.getElementById('ttList').innerHTML = '<div style="color:var(--text-secondary);padding:20px;text-align:center;">No schedules found.</div>';
            return;
        }
        let html = '<table style="width:100%;border-collapse:collapse;"><thead><tr style="background:var(--primary);color:#fff;"><th style="padding:10px;text-align:left;">Class</th><th style="padding:10px;text-align:left;">Day</th><th style="padding:10px;text-align:left;">Time</th><th style="padding:10px;text-align:left;">Subject</th><th style="padding:10px;text-align:center;">Action</th></tr></thead><tbody>';
        for (const r of list) {
            html += `<tr style="border-bottom:1px solid var(--border-color);">
                <td style="padding:10px;">${escapeHtml(r.class)}</td>
                <td style="padding:10px;">${escapeHtml(r.day)}</td>
                <td style="padding:10px;">${escapeHtml(r.time || '-')}</td>
                <td style="padding:10px;font-weight:600;">${escapeHtml(r.subject)}</td>
                <td style="padding:10px;text-align:center;"><button class="btn-action small" style="background:#ef4444;color:#fff;padding:4px 10px;font-size:12px;" onclick="deleteTimetableEntry(${r.id})">Delete</button></td>
            </tr>`;
        }
        html += '</tbody></table>';
        document.getElementById('ttList').innerHTML = html;
    }
    window.deleteTimetableEntry = function(id) {
        if (!confirm('Delete this schedule?')) return;
        let l = getTimetable();
        l = l.filter(x => x.id !== id);
        saveTimetable(l);
        renderTimetableList();
        showToast('Deleted');
    };
    renderTimetableList();
    editor.classList.add('active');
}

// --- Timetable Viewer (Public) ---
function openTimetableModal() {
    const modal = document.getElementById('timetableModal');
    const body = document.getElementById('timetableModalBody');
    if (!modal || !body) return;

    let html = '<div class="tt-viewer">';
    html += '<div class="tt-viewer-header"><h3>Select a Class</h3><p>Choose a class to view today\'s timetable</p></div>';
    html += '<div class="tt-class-grid">';
    CLASSES.forEach(cls => {
        html += `<button class="tt-class-card" onclick="showClassTimetable('${cls}')">
            <span class="tt-class-num">${cls}</span>
            <span class="tt-class-label">Class ${cls}</span>
        </button>`;
    });
    html += '</div>';
    html += '<div id="timetableViewContent"></div>';
    html += '</div>';

    body.innerHTML = html;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeTimetableModal() {
    const modal = document.getElementById('timetableModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function showClassTimetable(cls) {
    const container = document.getElementById('timetableViewContent');
    if (!container) return;

    const allEntries = getTimetable();
    const classEntries = allEntries.filter(e => e.class === cls);

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = dayNames[new Date().getDay()];
    const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Highlight selected class button
    document.querySelectorAll('.tt-class-card').forEach(btn => btn.classList.remove('tt-active'));
    const allBtns = document.querySelectorAll('.tt-class-card');
    allBtns.forEach(btn => {
        if (btn.querySelector('.tt-class-num').textContent === cls) btn.classList.add('tt-active');
    });

    if (classEntries.length === 0) {
        container.innerHTML = `
            <div class="tt-empty-state">
                <div style="font-size:48px;margin-bottom:12px;">📭</div>
                <h3>No Timetable Available</h3>
                <p>Timetable for Class ${cls} has not been set up yet.</p>
            </div>`;
        return;
    }

    // Get today's entries
    const todayEntries = classEntries.filter(e => e.day === today);
    todayEntries.sort((a, b) => (a.time || '').localeCompare(b.time || ''));

    let html = `<div class="tt-result-section">`;
    html += `<div class="tt-result-header">
        <h3>📅 Class ${cls} — ${today}'s Schedule</h3>
        <span class="tt-today-badge">${today === 'Sunday' ? '🔴 Holiday' : '🟢 Today'}</span>
    </div>`;

    if (today === 'Sunday') {
        html += '<div class="tt-holiday-banner">🎉 It\'s Sunday! No classes today. Enjoy your holiday!</div>';
    } else if (todayEntries.length === 0) {
        html += '<div class="tt-no-class-banner">📋 No classes scheduled for today.</div>';
    } else {
        html += '<div class="tt-schedule-list">';
        todayEntries.forEach((entry, i) => {
            html += `<div class="tt-schedule-item">
                <div class="tt-schedule-num">${i + 1}</div>
                <div class="tt-schedule-info">
                    <div class="tt-schedule-subject">${escapeHtml(entry.subject)}</div>
                    <div class="tt-schedule-time">${entry.time ? '🕐 ' + escapeHtml(entry.time) : ''}</div>
                </div>
            </div>`;
        });
        html += '</div>';
    }

    // Full week view
    html += '<div class="tt-week-divider"><span>Full Week Schedule</span></div>';
    html += '<div class="tt-week-grid">';
    DAYS_ORDER.forEach(day => {
        const dayEntries = classEntries.filter(e => e.day === day);
        dayEntries.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
        const isToday = day === today;
        html += `<div class="tt-day-card ${isToday ? 'tt-day-today' : ''}">
            <div class="tt-day-name">${day.substring(0, 3)}${isToday ? ' (Today)' : ''}</div>`;
        if (dayEntries.length === 0) {
            html += '<div class="tt-day-empty">No classes</div>';
        } else {
            dayEntries.forEach(e => {
                html += `<div class="tt-day-entry">
                    <div class="tt-day-subject">${escapeHtml(e.subject)}</div>
                    <div class="tt-day-time">${e.time ? escapeHtml(e.time) : ''}</div>
                </div>`;
            });
        }
        html += '</div>';
    });
    html += '</div></div>';

    container.innerHTML = html;
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getMaterials() { try { const raw = localStorage.getItem('materials_list'); return raw ? JSON.parse(raw) : []; } catch(e){ return []; } }
function saveMaterials(list) { try { localStorage.setItem('materials_list', JSON.stringify(list)); } catch(e){} }

const MATERIAL_SUBJECTS = {
    '6':  ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi'],
    '7':  ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi'],
    '8':  ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi'],
    '9':  ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi'],
    '10': ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi'],
    '11': ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English'],
    '12': ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English']
};

// ======== STUDY MATERIALS VIEWER ========
function openStudyMaterialsModal() {
    const modal = document.getElementById('studyMaterialsModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    showMaterialsClassGrid();
}

function closeStudyMaterialsModal() {
    const modal = document.getElementById('studyMaterialsModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showMaterialsClassGrid() {
    const body = document.getElementById('studyMaterialsBody');
    const classes = ['6', '7', '8', '9', '10', '11', '12'];
    body.innerHTML = `
        <div class="sm-intro">
            <div class="sm-intro-icon">🎓</div>
            <h3>Select Your Class</h3>
            <p>Choose your class to access study materials</p>
        </div>
        <div class="sm-class-grid">
            ${classes.map(c => `
                <div class="sm-class-card" onclick="showMaterialsSubjects('${c}')">
                    <div class="sm-class-num">Class ${c}</div>
                    <div class="sm-class-count">${getMaterialCountForClass(c)} documents</div>
                </div>
            `).join('')}
        </div>
    `;
}

function getMaterialCountForClass(cls) {
    return getMaterials().filter(m => m.classNum === cls).length;
}

function showMaterialsSubjects(cls) {
    const body = document.getElementById('studyMaterialsBody');
    const subjects = MATERIAL_SUBJECTS[cls] || [];
    const materials = getMaterials().filter(m => m.classNum === cls);

    body.innerHTML = `
        <div class="sm-breadcrumb">
            <span class="sm-breadcrumb-link" onclick="showMaterialsClassGrid()">📚 Classes</span>
            <span class="sm-breadcrumb-sep">›</span>
            <span class="sm-breadcrumb-current">Class ${cls}</span>
        </div>
        <div class="sm-subjects-grid">
            ${subjects.map((subj, i) => {
                const count = materials.filter(m => m.subject === subj).length;
                const icons = ['📐', '🔬', '🧪', '🧬', '📖', '🌍', '📝', '🔢'];
                return `
                <div class="sm-subject-card" onclick="showMaterialsDocs('${cls}', '${subj}')">
                    <div class="sm-subject-icon">${icons[i % icons.length]}</div>
                    <div class="sm-subject-name">${subj}</div>
                    <div class="sm-subject-count">${count} ${count === 1 ? 'file' : 'files'}</div>
                </div>`;
            }).join('')}
        </div>
    `;
}

function showMaterialsDocs(cls, subject) {
    const body = document.getElementById('studyMaterialsBody');
    const docs = getMaterials().filter(m => m.classNum === cls && m.subject === subject);

    let docsHtml = '';
    if (docs.length === 0) {
        docsHtml = `
            <div class="sm-empty">
                <div class="sm-empty-icon">📭</div>
                <h4>No Documents Yet</h4>
                <p>Materials for this subject will be uploaded soon.</p>
            </div>`;
    } else {
        docsHtml = `<div class="sm-docs-list">
            ${docs.map(d => `
                <div class="sm-doc-card">
                    <div class="sm-doc-icon">📄</div>
                    <div class="sm-doc-info">
                        <div class="sm-doc-title">${escapeHtml(d.title)}</div>
                        ${d.description ? `<div class="sm-doc-desc">${escapeHtml(d.description)}</div>` : ''}
                        <div class="sm-doc-meta">Uploaded: ${new Date(d.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                    <div class="sm-doc-actions">
                        ${d.file ? `<button onclick="downloadMaterialPdf(${d.id})" class="sm-doc-btn download" title="Download">⬇️ Download</button>` : ''}
                        ${d.file ? `<button onclick="viewMaterialPdf(${d.id})" class="sm-doc-btn view" title="View">👁️ View</button>` : ''}
                        ${d.link ? `<a href="${escapeHtml(d.link)}" target="_blank" class="sm-doc-btn view" title="Open Link">🔗 Open</a>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>`;
    }

    body.innerHTML = `
        <div class="sm-breadcrumb">
            <span class="sm-breadcrumb-link" onclick="showMaterialsClassGrid()">📚 Classes</span>
            <span class="sm-breadcrumb-sep">›</span>
            <span class="sm-breadcrumb-link" onclick="showMaterialsSubjects('${cls}')">Class ${cls}</span>
            <span class="sm-breadcrumb-sep">›</span>
            <span class="sm-breadcrumb-current">${subject}</span>
        </div>
        <div class="sm-docs-header">
            <h3>${subject} — Class ${cls}</h3>
            <span class="sm-docs-badge">${docs.length} document${docs.length !== 1 ? 's' : ''}</span>
        </div>
        ${docsHtml}
    `;
}

// ======== ADMIN MATERIALS SECTION ========
function renderMaterialsAdmin(editor) {
    const body = editor.querySelector('.modal-body');
    const title = editor.querySelector('.modal-header h2') || document.getElementById('editorTitle');
    if (title) title.innerText = 'Manage Study Materials';

    body.innerHTML = `
        <div class="admin-two-col">
            <div class="admin-form-col">
                <h3>📤 Upload Document</h3>
                <form id="adminMatForm">
                    <div class="form-group">
                        <label>Class</label>
                        <select id="adm_mat_class" required onchange="updateAdminMatSubjects()">
                            <option value="">-- Select Class --</option>
                            <option value="6">Class 6</option>
                            <option value="7">Class 7</option>
                            <option value="8">Class 8</option>
                            <option value="9">Class 9</option>
                            <option value="10">Class 10</option>
                            <option value="11">Class 11</option>
                            <option value="12">Class 12</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Subject</label>
                        <select id="adm_mat_subject" required>
                            <option value="">-- Select Class First --</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Document Title</label>
                        <input id="adm_mat_title" required placeholder="e.g. Chapter 1 Notes">
                    </div>
                    <div class="form-group">
                        <label>Description (optional)</label>
                        <textarea id="adm_mat_desc" rows="2" placeholder="Brief description"></textarea>
                    </div>
                    <div class="form-group">
                        <label>PDF File</label>
                        <input id="adm_mat_file" type="file" accept=".pdf" required>
                    </div>
                    <div class="form-group">
                        <label>Link (optional, alternative to file)</label>
                        <input id="adm_mat_link" placeholder="https://...">
                    </div>
                    <button class="btn-action" type="submit">📤 Upload Material</button>
                </form>
            </div>
            <div class="admin-list-col">
                <h3>📋 Uploaded Materials</h3>
                <div style="margin-bottom:10px;">
                    <select id="adm_mat_filter_class" onchange="renderAdminMatList()" style="padding:6px 10px;border-radius:8px;border:1px solid var(--border-color);background:var(--card-bg);color:var(--text-primary);">
                        <option value="">All Classes</option>
                        <option value="6">Class 6</option>
                        <option value="7">Class 7</option>
                        <option value="8">Class 8</option>
                        <option value="9">Class 9</option>
                        <option value="10">Class 10</option>
                        <option value="11">Class 11</option>
                        <option value="12">Class 12</option>
                    </select>
                </div>
                <div id="adminMatList" style="max-height:450px;overflow-y:auto;"></div>
            </div>
        </div>
    `;

    window.updateAdminMatSubjects = function() {
        const cls = document.getElementById('adm_mat_class').value;
        const subjSelect = document.getElementById('adm_mat_subject');
        const subjects = MATERIAL_SUBJECTS[cls] || [];
        subjSelect.innerHTML = '<option value="">-- Select Subject --</option>';
        subjects.forEach(s => {
            subjSelect.innerHTML += '<option value="' + s + '">' + s + '</option>';
        });
    };

    document.getElementById('adminMatForm').onsubmit = async function(e) {
        e.preventDefault();
        const cls = document.getElementById('adm_mat_class').value;
        const subject = document.getElementById('adm_mat_subject').value;
        const titleVal = document.getElementById('adm_mat_title').value.trim();
        const desc = document.getElementById('adm_mat_desc').value.trim();
        const link = document.getElementById('adm_mat_link').value.trim();
        const fileInput = document.getElementById('adm_mat_file');

        if (!cls || !subject || !titleVal) { showToast('Please fill all required fields'); return; }

        let dataUrl = '';
        if (fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            if (file.size > 15 * 1024 * 1024) {
                showToast('File too large! Max 15MB allowed.');
                return;
            }
            try { dataUrl = await readFileAsDataURL(file); } catch(err) { showToast('Error reading file'); return; }
        }

        if (!dataUrl && !link) { showToast('Please upload a PDF or provide a link'); return; }

        const list = getMaterials();
        list.push({
            id: Date.now(),
            classNum: cls,
            subject: subject,
            title: titleVal,
            description: desc,
            link: link,
            file: dataUrl,
            created_at: new Date().toISOString()
        });
        saveMaterials(list);
        document.getElementById('adminMatForm').reset();
        document.getElementById('adm_mat_subject').innerHTML = '<option value="">-- Select Class First --</option>';
        renderAdminMatList();
        showToast('Material uploaded successfully!');
    };

    window.renderAdminMatList = function() {
        const filterCls = document.getElementById('adm_mat_filter_class') ? document.getElementById('adm_mat_filter_class').value : '';
        let list = getMaterials();
        if (filterCls) list = list.filter(m => m.classNum === filterCls);
        list.sort((a, b) => (b.id || 0) - (a.id || 0));

        const container = document.getElementById('adminMatList');
        if (list.length === 0) {
            container.innerHTML = '<div style="color:var(--text-secondary);text-align:center;padding:20px;">No materials uploaded yet.</div>';
            return;
        }
        let html = '';
        list.forEach(m => {
            html += `<div class="admin-card-item">
                <div class="admin-card-left">
                    <div style="font-size:28px;">📄</div>
                    <div>
                        <strong>${escapeHtml(m.title)}</strong>
                        <div style="font-size:12px; color:var(--text-secondary);">Class ${m.classNum || '?'} • ${escapeHtml(m.subject || '')}</div>
                        ${m.description ? `<div style="font-size:11px; color:var(--text-secondary); margin-top:2px;">${escapeHtml(m.description)}</div>` : ''}
                        <div style="font-size:11px; color:var(--text-secondary); margin-top:2px;">${new Date(m.created_at).toLocaleDateString('en-IN')}</div>
                    </div>
                </div>
                <div class="admin-card-actions">
                    ${m.file ? `<button class="btn-action small" onclick="viewMaterialPdf(${m.id})">👁️</button>` : ''}
                    <button class="btn-action small" style="background:#e74c3c;" onclick="deleteAdminMaterial(${m.id})">🗑️</button>
                </div>
            </div>`;
        });
        container.innerHTML = html;
    };

    window.deleteAdminMaterial = function(id) {
        if (!confirm('Delete this material?')) return;
        let list = getMaterials();
        list = list.filter(m => m.id !== id);
        saveMaterials(list);
        renderAdminMatList();
        showToast('Material deleted');
    };

    renderAdminMatList();
    editor.classList.add('active');
}

function getResults(){ try { const raw = localStorage.getItem('results_list'); return raw ? JSON.parse(raw) : []; } catch(e){ return []; } }
function saveResults(list){ try { localStorage.setItem('results_list', JSON.stringify(list)); } catch(e){} }
function getResultPDFs(){ try { return JSON.parse(localStorage.getItem('results_pdfs')) || []; } catch(e){ return []; } }
function saveResultPDFs(list){ try { localStorage.setItem('results_pdfs', JSON.stringify(list)); } catch(e){} }

const RESULT_SUBJECTS = {
    '6':  ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi'],
    '7':  ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi'],
    '8':  ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi'],
    '9':  ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi'],
    '10': ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi'],
    '11': ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English'],
    '12': ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English']
};

// ======== RESULTS VIEWER ========
function openResultsModal() {
    document.getElementById('resultsViewerModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    showResultsClassGrid();
}
function closeResultsModal() {
    document.getElementById('resultsViewerModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showResultsClassGrid() {
    const body = document.getElementById('resultsViewerBody');
    const classes = ['6','7','8','9','10','11','12'];
    body.innerHTML = `
        <div class="rs-intro">
            <div class="rs-intro-icon">🏆</div>
            <h3>Select Your Class</h3>
            <p>Choose your class to view exam results</p>
        </div>
        <div class="rs-class-grid">
            ${classes.map(c => {
                const exams = getExamsForClass(c);
                return `<div class="rs-class-card" onclick="showResultsExams('${c}')">
                    <div class="rs-class-num">Class ${c}</div>
                    <div class="rs-class-count">${exams.length} exam${exams.length !== 1 ? 's' : ''}</div>
                </div>`;
            }).join('')}
        </div>`;
}

function getExamsForClass(cls) {
    const pdfs = getResultPDFs().filter(p => p.classNum === cls);
    const examNames = new Set();
    pdfs.forEach(p => examNames.add(p.examName));
    return [...examNames];
}

function showResultsExams(cls) {
    const body = document.getElementById('resultsViewerBody');
    const exams = getExamsForClass(cls);
    let examsHtml = '';
    if (exams.length === 0) {
        examsHtml = `<div class="rs-empty"><div class="rs-empty-icon">💭</div><h4>No Results Yet</h4><p>Results for this class will be published soon.</p></div>`;
    } else {
        const examIcons = ['📝', '📑', '🎯', '📋', '🏅', '⭐'];
        const pdfs = getResultPDFs().filter(p => p.classNum === cls);
        examsHtml = `<div class="rs-exams-grid">${exams.map((ex, i) => {
            const pdfCount = pdfs.filter(p => p.examName === ex).length;
            return `<div class="rs-exam-card" onclick="showResultsForExam('${cls}', '${escapeHtml(ex).replace(/'/g, "\\'")}')">
                <div class="rs-exam-icon">${examIcons[i % examIcons.length]}</div>
                <div class="rs-exam-name">${escapeHtml(ex)}</div>
                <div class="rs-exam-count">📄 ${pdfCount} PDF${pdfCount !== 1 ? 's' : ''}</div>
            </div>`;
        }).join('')}</div>`;
    }
    body.innerHTML = `
        <div class="sm-breadcrumb">
            <span class="sm-breadcrumb-link" onclick="showResultsClassGrid()">📊 Classes</span>
            <span class="sm-breadcrumb-sep">›</span>
            <span class="sm-breadcrumb-current">Class ${cls}</span>
        </div>
        <div class="rs-section-header"><h3>📝 Exams — Class ${cls}</h3></div>
        ${examsHtml}`;
}

function showResultsForExam(cls, examName) {
    const body = document.getElementById('resultsViewerBody');
    const pdfs = getResultPDFs().filter(p => p.classNum === cls && p.examName === examName);

    // PDF section
    let pdfHtml = '';
    if (pdfs.length > 0) {
        pdfHtml = `<div class="rs-pdf-section">
            <h4>📄 Result PDFs</h4>
            <div class="rs-pdf-list">
                ${pdfs.map(p => `
                    <div class="rs-pdf-card">
                        <div class="rs-pdf-icon">📄</div>
                        <div class="rs-pdf-info">
                            <div class="rs-pdf-title">${escapeHtml(p.title || examName)}</div>
                            <div class="rs-pdf-meta">Uploaded: ${new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        </div>
                        <div class="rs-pdf-actions">
                            <button onclick="viewResultPdf(${p.id})" class="sm-doc-btn view">👁️ View PDF</button>
                            <button onclick="downloadResultPdf(${p.id})" class="sm-doc-btn download">⬇️ Download</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>`;
    } else {
        pdfHtml = `<div class="rs-empty"><div class="rs-empty-icon">💭</div><h4>No Results</h4><p>No result PDFs found for this exam.</p></div>`;
    }

    body.innerHTML = `
        <div class="sm-breadcrumb">
            <span class="sm-breadcrumb-link" onclick="showResultsClassGrid()">📊 Classes</span>
            <span class="sm-breadcrumb-sep">›</span>
            <span class="sm-breadcrumb-link" onclick="showResultsExams('${cls}')">Class ${cls}</span>
            <span class="sm-breadcrumb-sep">›</span>
            <span class="sm-breadcrumb-current">${escapeHtml(examName)}</span>
        </div>
        <div class="rs-section-header">
            <h3>${escapeHtml(examName)} — Class ${cls}</h3>
            <span class="sm-docs-badge">${pdfs.length} PDF${pdfs.length !== 1 ? 's' : ''}</span>
        </div>
        ${pdfHtml}`;
}

// ======== ADMIN RESULTS SECTION ========
function renderResultsAdmin(editor) {
    const body = editor.querySelector('.modal-body');
    const title = editor.querySelector('.modal-header h2') || document.getElementById('editorTitle');
    if (title) title.innerText = 'Manage Results';

    body.innerHTML = `
        <div class="admin-two-col">
            <div class="admin-form-col">
                <h3>📝 Upload Results</h3>

                <!-- PDF upload form -->
                <div id="resFormPdf">
                    <form id="adminResPdfForm">
                        <div class="form-group">
                            <label>Class</label>
                            <select id="adm_res_pdf_class" required>
                                <option value="">-- Select Class --</option>
                                <option value="6">Class 6</option>
                                <option value="7">Class 7</option>
                                <option value="8">Class 8</option>
                                <option value="9">Class 9</option>
                                <option value="10">Class 10</option>
                                <option value="11">Class 11</option>
                                <option value="12">Class 12</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Exam Name</label>
                            <input id="adm_res_pdf_exam" required placeholder="e.g. Mid Term 2026">
                        </div>
                        <div class="form-group">
                            <label>Title (optional)</label>
                            <input id="adm_res_pdf_title" placeholder="e.g. Class 10 Mid Term Results">
                        </div>
                        <div class="form-group">
                            <label>Result PDF File</label>
                            <input id="adm_res_pdf_file" type="file" accept=".pdf" required>
                        </div>
                        <button class="btn-action" type="submit">📄 Upload Result PDF</button>
                    </form>
                </div>

                <div style="margin-top:16px;padding:12px;background:rgba(99,102,241,0.08);border-radius:12px;border:1px solid rgba(99,102,241,0.15);">
                    <strong>💡 Tip:</strong> <span style="font-size:13px;color:var(--text-secondary);">Upload result PDFs per class and exam. Students can view and download them from the Results section.</span>
                </div>
            </div>
            <div class="admin-list-col">
                <h3>📋 Uploaded Results</h3>
                <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap;">
                    <select id="adm_res_filter_class" onchange="renderAdminResList()" style="padding:6px 10px;border-radius:8px;border:1px solid var(--border-color);background:var(--card-bg);color:var(--text-primary);font-size:13px;">
                        <option value="">All Classes</option>
                        <option value="6">Class 6</option><option value="7">Class 7</option><option value="8">Class 8</option>
                        <option value="9">Class 9</option><option value="10">Class 10</option>
                        <option value="11">Class 11</option><option value="12">Class 12</option>
                    </select>
                    <select id="adm_res_filter_exam" onchange="renderAdminResList()" style="padding:6px 10px;border-radius:8px;border:1px solid var(--border-color);background:var(--card-bg);color:var(--text-primary);font-size:13px;">
                        <option value="">All Exams</option>
                    </select>
                </div>
                <div id="adminResList" style="max-height:420px;overflow-y:auto;"></div>
            </div>
        </div>
    `;

    // Populate exam filter options
    function updateExamFilter() {
        const examSet = new Set();
        getResultPDFs().forEach(p => examSet.add(p.examName));
        const exams = [...examSet];
        const sel = document.getElementById('adm_res_filter_exam');
        if (!sel) return;
        const cur = sel.value;
        sel.innerHTML = '<option value="">All Exams</option>';
        exams.forEach(ex => { sel.innerHTML += `<option value="${escapeHtml(ex)}">${escapeHtml(ex)}</option>`; });
        sel.value = cur;
    }

    window.renderAdminResList = function() {
        const filterCls = document.getElementById('adm_res_filter_class') ? document.getElementById('adm_res_filter_class').value : '';
        const filterExam = document.getElementById('adm_res_filter_exam') ? document.getElementById('adm_res_filter_exam').value : '';
        let pdfs = getResultPDFs();
        if (filterCls) { pdfs = pdfs.filter(p => p.classNum === filterCls); }
        if (filterExam) { pdfs = pdfs.filter(p => p.examName === filterExam); }
        pdfs.sort((a, b) => (b.id || 0) - (a.id || 0));

        const container = document.getElementById('adminResList');
        if (pdfs.length === 0) {
            container.innerHTML = '<div style="color:var(--text-secondary);text-align:center;padding:20px;">No results uploaded yet.</div>';
            return;
        }
        let html = '';
        // Show PDFs first
        pdfs.forEach(p => {
            html += `<div class="admin-card-item" style="border-left:3px solid #8b5cf6;">
                <div class="admin-card-left">
                    <div style="font-size:28px;">📄</div>
                    <div>
                        <strong>${escapeHtml(p.title)}</strong> <span style="font-size:10px;background:#8b5cf6;color:#fff;padding:2px 8px;border-radius:10px;font-weight:700;">PDF</span>
                        <div style="font-size:12px;color:var(--text-secondary);">Class ${p.classNum || '?'} • ${escapeHtml(p.examName)}</div>
                        <div style="font-size:11px;color:var(--text-secondary);">${new Date(p.created_at).toLocaleDateString('en-IN')}</div>
                    </div>
                </div>
                <div class="admin-card-actions">
                    <button class="btn-action small" onclick="viewResultPdf(${p.id})">👁️</button>
                    <button class="btn-action small" style="background:#e74c3c;" onclick="deleteAdminResultPdf(${p.id})">🗑️</button>
                </div>
            </div>`;
        });
        container.innerHTML = html;
    };

    // PDF form handler
    document.getElementById('adminResPdfForm').onsubmit = async function(e) {
        e.preventDefault();
        const cls = document.getElementById('adm_res_pdf_class').value;
        const exam = document.getElementById('adm_res_pdf_exam').value.trim();
        const pdfTitle = document.getElementById('adm_res_pdf_title').value.trim() || exam;
        const fileInput = document.getElementById('adm_res_pdf_file');

        if (!cls || !exam) { showToast('Please select class and enter exam name'); return; }
        if (!fileInput.files || !fileInput.files[0]) { showToast('Please select a PDF file'); return; }

        const file = fileInput.files[0];
        if (file.size > 15 * 1024 * 1024) { showToast('File too large! Max 15MB allowed.'); return; }

        let dataUrl = '';
        try { dataUrl = await readFileAsDataURL(file); } catch(err) { showToast('Error reading file'); return; }

        const pdfs = getResultPDFs();
        pdfs.push({
            id: Date.now(),
            classNum: cls,
            examName: exam,
            title: pdfTitle,
            file: dataUrl,
            created_at: new Date().toISOString()
        });
        saveResultPDFs(pdfs);
        document.getElementById('adminResPdfForm').reset();
        updateExamFilter();
        renderAdminResList();
        showToast('Result PDF uploaded!');
    };

    window.deleteAdminResultPdf = function(id) {
        if (!confirm('Delete this result PDF?')) return;
        let pdfs = getResultPDFs();
        pdfs = pdfs.filter(p => p.id !== id);
        saveResultPDFs(pdfs);
        updateExamFilter();
        renderAdminResList();
        showToast('PDF deleted');
    };

    updateExamFilter();
    renderAdminResList();
    editor.classList.add('active');
}

function renderAttendanceAdmin(editor){
    loadAttendanceData();
    const body = editor.querySelector('.modal-body');
    const title = editor.querySelector('.modal-header h2') || document.getElementById('editorTitle');
    if (title) title.innerText = 'Manage Attendance';

    body.innerHTML = `
        <div class="aa-container">
            <div class="aa-tabs">
                <button class="aa-tab active" onclick="switchAttAdminTab('mark')">📝 Mark Attendance</button>
                <button class="aa-tab" onclick="switchAttAdminTab('view')">👁️ View Records</button>
                <button class="aa-tab" onclick="switchAttAdminTab('stats')">📊 Statistics</button>
            </div>

            <!-- MARK TAB -->
            <div class="aa-tab-content" id="aaTabMark">
                <div class="aa-mark-top">
                    <div class="form-group" style="flex:1;min-width:120px;">
                        <label>Class</label>
                        <select id="aa_mark_class" onchange="aaLoadMarkStudents()">
                            <option value="">-- Select --</option>
                            ${CLASSES.map(c => `<option value="${c}">Class ${c}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group" style="flex:1;min-width:150px;">
                        <label>Date</label>
                        <input id="aa_mark_date" type="date" value="${new Date().toISOString().split('T')[0]}" onchange="aaLoadMarkStudents()">
                    </div>
                    <div class="form-group" style="align-self:flex-end;">
                        <button class="btn-action" onclick="aaSelectAll()" style="font-size:12px;">✅ All Present</button>
                    </div>
                    <div class="form-group" style="align-self:flex-end;">
                        <button class="btn-action" onclick="aaDeselectAll()" style="font-size:12px;background:transparent;border:1px solid var(--border-color);color:var(--text-primary);">❌ All Absent</button>
                    </div>
                </div>
                <div id="aaMarkStatus"></div>
                <div id="aaMarkList" class="aa-mark-list"></div>
                <div id="aaMarkActions" style="display:none;margin-top:14px;display:flex;gap:10px;">
                    <button class="btn-action" onclick="aaSubmitAttendance()">💾 Save Attendance</button>
                    <button class="btn-action" onclick="aaDeleteAttendance()" style="background:#ef4444;">🗑️ Delete This Day's Record</button>
                </div>
            </div>

            <!-- VIEW TAB -->
            <div class="aa-tab-content" id="aaTabView" style="display:none;">
                <div class="aa-mark-top">
                    <div class="form-group" style="flex:1;min-width:120px;">
                        <label>Class</label>
                        <select id="aa_view_class" onchange="aaLoadViewRecords()">
                            <option value="">-- Select --</option>
                            ${CLASSES.map(c => `<option value="${c}">Class ${c}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group" style="flex:1;min-width:150px;">
                        <label>Month</label>
                        <input id="aa_view_month" type="month" value="${new Date().toISOString().substring(0,7)}" onchange="aaLoadViewRecords()">
                    </div>
                </div>
                <div id="aaViewContent"></div>
            </div>

            <!-- STATS TAB -->
            <div class="aa-tab-content" id="aaTabStats" style="display:none;">
                <div class="aa-mark-top">
                    <div class="form-group" style="flex:1;min-width:120px;">
                        <label>Class</label>
                        <select id="aa_stats_class" onchange="aaLoadStats()">
                            <option value="">-- Select --</option>
                            ${CLASSES.map(c => `<option value="${c}">Class ${c}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div id="aaStatsContent"></div>
            </div>
        </div>
    `;

    editor.classList.add('active');
}

// ---- Admin Attendance Tab Switching ----
window.switchAttAdminTab = function(tab) {
    document.querySelectorAll('.aa-tab').forEach((btn, i) => {
        const tabs = ['mark','view','stats'];
        btn.classList.toggle('active', tabs[i] === tab);
    });
    document.getElementById('aaTabMark').style.display = tab === 'mark' ? '' : 'none';
    document.getElementById('aaTabView').style.display = tab === 'view' ? '' : 'none';
    document.getElementById('aaTabStats').style.display = tab === 'stats' ? '' : 'none';
};

// ---- MARK ATTENDANCE TAB ----
window.aaLoadMarkStudents = function() {
    const cls = document.getElementById('aa_mark_class').value;
    const date = document.getElementById('aa_mark_date').value;
    const container = document.getElementById('aaMarkList');
    const status = document.getElementById('aaMarkStatus');
    const actions = document.getElementById('aaMarkActions');
    if (!cls || !date) { container.innerHTML = ''; status.innerHTML = ''; actions.style.display = 'none'; return; }

    loadAttendanceData();
    const classData = attendanceData[cls] || { students: [], attendance: {} };
    if (!classData.students || classData.students.length === 0) {
        container.innerHTML = '<div class="aa-empty">No students in Class ' + cls + '. Add students first via the Students section.</div>';
        status.innerHTML = '';
        actions.style.display = 'none';
        return;
    }

    const isSun = isHoliday(date);
    const existing = classData.attendance[date];
    const hasRecords = existing && Object.keys(existing.records || {}).length > 0;

    // Status banner
    if (isSun) {
        status.innerHTML = '<div class="aa-status-banner aa-warn">🔴 This is a Sunday (Holiday). You can still override and mark attendance if needed.</div>';
    } else if (hasRecords) {
        status.innerHTML = `<div class="aa-status-banner aa-info">ℹ️ Attendance already marked by <strong>${escapeHtml(existing.markedBy || 'Unknown')}</strong> at ${escapeHtml(existing.markedAt || '?')}. You can edit and re-save.</div>`;
    } else {
        status.innerHTML = '<div class="aa-status-banner aa-ok">✅ No attendance marked yet for this date. Mark below.</div>';
    }

    const students = [...classData.students].sort((a, b) => parseInt(a.roll) - parseInt(b.roll));
    const records = (existing && existing.records) ? existing.records : {};

    container.innerHTML = students.map(s => {
        const isPresent = hasRecords ? records[s.id] === 'present' : true;
        return `<div class="aa-mark-row">
            <label class="aa-mark-label">
                <input type="checkbox" class="aa-mark-cb" data-sid="${s.id}" ${isPresent ? 'checked' : ''}>
                <span class="aa-mark-roll">${s.roll}</span>
                <span class="aa-mark-name">${escapeHtml(s.name)}</span>
            </label>
        </div>`;
    }).join('');

    actions.style.display = 'flex';
};

window.aaSelectAll = function() {
    document.querySelectorAll('.aa-mark-cb').forEach(cb => cb.checked = true);
};
window.aaDeselectAll = function() {
    document.querySelectorAll('.aa-mark-cb').forEach(cb => cb.checked = false);
};

window.aaSubmitAttendance = function() {
    const cls = document.getElementById('aa_mark_class').value;
    const date = document.getElementById('aa_mark_date').value;
    if (!cls || !date) return showToast('Select class and date first');

    loadAttendanceData();
    const classData = attendanceData[cls];
    if (!classData || !classData.students || classData.students.length === 0) return showToast('No students in this class');

    const checkboxes = document.querySelectorAll('.aa-mark-cb');
    if (checkboxes.length === 0) return showToast('No students loaded');

    const records = {};
    checkboxes.forEach(cb => {
        records[cb.dataset.sid] = cb.checked ? 'present' : 'absent';
    });

    if (!classData.attendance[date]) {
        classData.attendance[date] = { records: {}, markedBy: '', markedAt: '' };
    }
    classData.attendance[date].records = records;
    classData.attendance[date].markedBy = 'Admin';
    classData.attendance[date].markedAt = new Date().toLocaleString();

    saveAttendanceData();
    showToast('✅ Attendance saved for Class ' + cls + ' on ' + date);
    aaLoadMarkStudents();
};

window.aaDeleteAttendance = function() {
    const cls = document.getElementById('aa_mark_class').value;
    const date = document.getElementById('aa_mark_date').value;
    if (!cls || !date) return;
    if (!confirm('Delete attendance record for Class ' + cls + ' on ' + date + '?')) return;

    loadAttendanceData();
    if (attendanceData[cls] && attendanceData[cls].attendance[date]) {
        delete attendanceData[cls].attendance[date];
        saveAttendanceData();
        showToast('🗑️ Attendance record deleted');
        aaLoadMarkStudents();
    } else {
        showToast('No record found to delete');
    }
};

// ---- VIEW RECORDS TAB ----
window.aaLoadViewRecords = function() {
    const cls = document.getElementById('aa_view_class').value;
    const month = document.getElementById('aa_view_month').value;
    const container = document.getElementById('aaViewContent');
    if (!cls || !month) { container.innerHTML = ''; return; }

    loadAttendanceData();
    const classData = attendanceData[cls] || { students: [], attendance: {} };
    if (!classData.students || classData.students.length === 0) {
        container.innerHTML = '<div class="aa-empty">No students in Class ' + cls + '.</div>';
        return;
    }

    // Filter attendance dates for the selected month
    const dates = Object.keys(classData.attendance)
        .filter(d => d.startsWith(month) && !isHoliday(d))
        .sort();

    if (dates.length === 0) {
        container.innerHTML = '<div class="aa-empty">No attendance records for this month.</div>';
        return;
    }

    const students = [...classData.students].sort((a, b) => parseInt(a.roll) - parseInt(b.roll));

    // Build a calendar-style table
    let html = '<div class="aa-view-table-wrap"><table class="aa-view-table">';
    html += '<thead><tr><th class="aa-th-fixed">Roll</th><th class="aa-th-fixed">Name</th>';
    dates.forEach(d => {
        const day = parseInt(d.split('-')[2]);
        html += `<th class="aa-th-date">${day}</th>`;
    });
    html += '<th class="aa-th-pct">%</th></tr></thead><tbody>';

    students.forEach(s => {
        let present = 0, total = 0;
        html += `<tr><td class="aa-td-fixed">${s.roll}</td><td class="aa-td-fixed">${escapeHtml(s.name)}</td>`;
        dates.forEach(d => {
            const rec = classData.attendance[d]?.records || {};
            const st = rec[s.id];
            total++;
            if (st === 'present') {
                present++;
                html += '<td class="aa-td-present">P</td>';
            } else if (st === 'absent') {
                html += '<td class="aa-td-absent">A</td>';
            } else {
                html += '<td class="aa-td-none">-</td>';
            }
        });
        const pct = total === 0 ? 0 : Math.round((present / total) * 100);
        const pctColor = getAttendanceColorClass(pct);
        html += `<td class="aa-td-pct" style="color:${pctColor.color};font-weight:700;">${pct}%</td></tr>`;
    });

    // Totals row
    html += '<tr class="aa-totals-row"><td class="aa-td-fixed" colspan="2"><strong>Class Total</strong></td>';
    dates.forEach(d => {
        const rec = classData.attendance[d]?.records || {};
        const pCount = students.filter(s => rec[s.id] === 'present').length;
        html += `<td class="aa-td-total">${pCount}/${students.length}</td>`;
    });
    const overallPresent = students.reduce((sum, s) => sum + dates.reduce((s2, d) => s2 + ((classData.attendance[d]?.records || {})[s.id] === 'present' ? 1 : 0), 0), 0);
    const overallTotal = students.length * dates.length;
    const overallPct = overallTotal === 0 ? 0 : Math.round((overallPresent / overallTotal) * 100);
    html += `<td class="aa-td-pct" style="font-weight:800;">${overallPct}%</td></tr>`;

    html += '</tbody></table></div>';

    // Day-wise summary below
    html += '<div class="aa-day-summary"><h4 style="margin:16px 0 10px;">📅 Day-wise Details</h4>';
    dates.forEach(d => {
        const dayData = classData.attendance[d];
        const rec = dayData?.records || {};
        const pCount = students.filter(s => rec[s.id] === 'present').length;
        const aCount = students.length - pCount;
        const dayPct = students.length === 0 ? 0 : Math.round((pCount / students.length) * 100);
        const dayColor = getAttendanceColorClass(dayPct);
        const dayName = getDayName(d);
        const formD = new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'short' });
        html += `<div class="aa-day-row">
            <span class="aa-day-date">${formD} (${dayName})</span>
            <span class="aa-day-teacher">${escapeHtml(dayData?.markedBy || '?')}</span>
            <div class="aa-day-bar-wrap"><div class="aa-day-bar" style="width:${dayPct}%;background:${dayColor.color};"></div></div>
            <span class="aa-day-counts" style="color:${dayColor.color};">${pCount}P / ${aCount}A (${dayPct}%)</span>
        </div>`;
    });
    html += '</div>';

    container.innerHTML = html;
};

// ---- STATS TAB ----
window.aaLoadStats = function() {
    const cls = document.getElementById('aa_stats_class').value;
    const container = document.getElementById('aaStatsContent');
    if (!cls) { container.innerHTML = ''; return; }

    loadAttendanceData();
    const classData = attendanceData[cls] || { students: [], attendance: {} };
    if (!classData.students || classData.students.length === 0) {
        container.innerHTML = '<div class="aa-empty">No students in Class ' + cls + '.</div>';
        return;
    }

    const students = [...classData.students].sort((a, b) => parseInt(a.roll) - parseInt(b.roll));

    // Calculate total classes delivered
    let totalDelivered = 0;
    const allDates = Object.keys(classData.attendance).filter(d => {
        if (isHoliday(d)) return false;
        const rec = classData.attendance[d]?.records || {};
        return Object.keys(rec).length > 0;
    }).sort();
    totalDelivered = allDates.length;

    // Per-student stats
    const studentStats = students.map(s => {
        let present = 0;
        allDates.forEach(d => {
            if ((classData.attendance[d]?.records || {})[s.id] === 'present') present++;
        });
        const pct = totalDelivered === 0 ? 0 : Math.round((present / totalDelivered) * 100);
        return { ...s, present, absent: totalDelivered - present, pct };
    });

    // Sort by attendance % ascending to show lowest first
    const sorted = [...studentStats].sort((a, b) => a.pct - b.pct);

    // Class-level stats
    const avgPct = studentStats.length === 0 ? 0 : Math.round(studentStats.reduce((s, x) => s + x.pct, 0) / studentStats.length);
    const avgColor = getAttendanceColorClass(avgPct);
    const belowThresh = studentStats.filter(s => s.pct < 75).length;
    const perfect = studentStats.filter(s => s.pct === 100).length;

    let html = `<div class="aa-stats-summary">
        <div class="aa-stats-card" style="border-left:4px solid #6366f1;"><div class="aa-stats-num" style="color:#6366f1;">${totalDelivered}</div><div class="aa-stats-lbl">Total Classes</div></div>
        <div class="aa-stats-card" style="border-left:4px solid ${avgColor.color};"><div class="aa-stats-num" style="color:${avgColor.color};">${avgPct}%</div><div class="aa-stats-lbl">Class Average</div></div>
        <div class="aa-stats-card" style="border-left:4px solid #10b981;"><div class="aa-stats-num" style="color:#10b981;">${perfect}</div><div class="aa-stats-lbl">100% Attendance</div></div>
        <div class="aa-stats-card" style="border-left:4px solid #ef4444;"><div class="aa-stats-num" style="color:#ef4444;">${belowThresh}</div><div class="aa-stats-lbl">Below 75%</div></div>
    </div>`;

    html += '<h4 style="margin:18px 0 10px;">📋 Student-wise Attendance (sorted by %)</h4>';
    html += '<div class="aa-stats-list">';
    sorted.forEach(s => {
        const c = getAttendanceColorClass(s.pct);
        html += `<div class="aa-stats-row">
            <span class="aa-stats-roll">${s.roll}</span>
            <span class="aa-stats-name">${escapeHtml(s.name)}</span>
            <div class="aa-stats-bar-wrap"><div class="aa-stats-bar" style="width:${s.pct}%;background:${c.color};"></div></div>
            <span class="aa-stats-pct" style="color:${c.color};">${s.pct}%</span>
            <span class="aa-stats-detail">${s.present}/${totalDelivered}</span>
        </div>`;
    });
    html += '</div>';

    // Low attendance alert
    if (belowThresh > 0) {
        html += '<div class="aa-alert-box"><h4>⚠️ Low Attendance Alert (Below 75%)</h4><ul>';
        studentStats.filter(s => s.pct < 75).sort((a,b) => a.pct - b.pct).forEach(s => {
            html += `<li><strong>${escapeHtml(s.name)}</strong> (Roll ${s.roll}) — ${s.pct}% (${s.present}/${totalDelivered})</li>`;
        });
        html += '</ul></div>';
    }

    container.innerHTML = html;
};

function renderAdminSettings(editor){
    const body = editor.querySelector('.modal-body');
    const stored = localStorage.getItem('admin_password') || '';
    body.innerHTML = `
        <div style="max-width:520px;">
            <h3>Admin Settings</h3>
            <form id="adminSettingsForm">
                <div class="form-group"><label>Set Admin Password (used for web login)</label><input id="set_admin_pass" type="password" placeholder="New password"></div>
                <div style="display:flex;gap:8px"><button class="btn-action" type="submit">Save</button><button type="button" class="btn-action" id="syncAdminBtn" style="background:#e0e0e0; color:var(--text-primary);">Sync To Server</button></div>
            </form>
            <p style="color:var(--text-secondary); margin-top:12px;">Current: ${stored? 'A custom password is set' : 'Using default password'}</p>
        </div>
    `;
    document.getElementById('adminSettingsForm').onsubmit = function(e){ e.preventDefault(); const p = document.getElementById('set_admin_pass').value; if(!p) return showToast('Enter a password'); localStorage.setItem('admin_password', p); showToast('Admin password set'); };
    document.getElementById('syncAdminBtn').onclick = function(){ if(!confirm('Create/overwrite admin on server?')) return; const p = document.getElementById('set_admin_pass').value || localStorage.getItem('admin_password') || ''; if(!p) return showToast('Set a password first'); fetch('/api/admin/setup',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ username:'admin', password: p }) }).then(r=>r.json().then(j=>showToast('Synced to server'))).catch(()=>showToast('Server sync failed')) };
    editor.classList.add('active');
}

// ====== RENDER STUDENTS ADMIN ======
function renderStudentsAdmin(editor) {
    const body = editor.querySelector('.modal-body');
    const title = editor.querySelector('.modal-header h2') || document.getElementById('editorTitle');
    if (title) title.innerText = 'Manage Students';
    
    // Get all students across attendance data
    let allClassStudents = {};
    CLASSES.forEach(cls => {
        const cd = (attendanceData[cls] || {students:[]});
        allClassStudents[cls] = cd.students || [];
    });
    
    const totalStudents = Object.values(allClassStudents).reduce((a,b) => a + b.length, 0);
    
    body.innerHTML = `
        <div class="admin-panel-header">
            <div class="admin-panel-stats">
                <span class="admin-stat-badge">📊 Total: <strong>${totalStudents}</strong> students</span>
            </div>
        </div>
        <div class="admin-two-col">
            <div class="admin-form-col">
                <h3>➕ Add Student</h3>
                <form id="adminStudentForm">
                    <div class="form-group">
                        <label>Class</label>
                        <select id="adm_s_class" required>
                            ${CLASSES.map(c => `<option value="${c}">Class ${c}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Student Name</label>
                        <input id="adm_s_name" required placeholder="Full name">
                    </div>
                    <div class="form-group">
                        <label>Roll Number</label>
                        <input id="adm_s_roll" type="number" required placeholder="e.g. 1">
                    </div>
                    <button class="btn-action" type="submit">Add Student</button>
                </form>
                <hr style="margin:14px 0; border-color:var(--border-color);">
                <h4>📥 Bulk Import</h4>
                <p style="font-size:12px; color:var(--text-secondary); margin-bottom:8px;">Paste JSON: [{"name":"...", "roll":"...", "class":"6"}]</p>
                <textarea id="adm_s_bulk" rows="3" placeholder='[{"name":"Rahul","roll":"1","class":"6"}]' style="width:100%;padding:8px;border-radius:8px;border:1px solid var(--border-color);font-size:13px;"></textarea>
                <button class="btn-action" onclick="adminBulkImportStudents()" style="margin-top:6px;">Import JSON</button>
            </div>
            <div class="admin-list-col">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <h3>📋 Students List</h3>
                    <select id="adm_s_filter" onchange="adminFilterStudents()" style="padding:6px 10px; border-radius:8px; border:1px solid var(--border-color);">
                        <option value="all">All Classes</option>
                        ${CLASSES.map(c => `<option value="${c}">Class ${c}</option>`).join('')}
                    </select>
                </div>
                <input type="text" id="adm_s_search" placeholder="🔍 Search by name or roll..." onkeyup="adminFilterStudents()" style="width:100%;padding:8px 12px;border-radius:8px;border:1px solid var(--border-color);margin-bottom:10px;">
                <div id="adminStudentList" style="max-height:400px;overflow-y:auto;"></div>
            </div>
        </div>
    `;
    
    document.getElementById('adminStudentForm').onsubmit = function(e) {
        e.preventDefault();
        const cls = document.getElementById('adm_s_class').value;
        const name = document.getElementById('adm_s_name').value.trim();
        const roll = document.getElementById('adm_s_roll').value.trim();
        if (!name || !roll) return showToast('Fill all fields');
        
        const classData = attendanceData[cls];
        if (!classData) { attendanceData[cls] = {students:[], attendance:{}}; }
        if (classData.students.some(s => s.roll === roll)) return showToast('Roll number exists in this class!');
        if (classData.students.length >= MAX_STUDENTS) return showToast('Max students reached!');
        
        classData.students.push({ id: `${cls}-${Date.now()}`, name, roll: roll.toString() });
        saveAttendanceData();
        document.getElementById('adminStudentForm').reset();
        adminFilterStudents();
        showToast('Student added');
    };
    
    adminFilterStudents();
    editor.classList.add('active');
}

function adminFilterStudents() {
    const filter = document.getElementById('adm_s_filter').value;
    const search = (document.getElementById('adm_s_search').value || '').toLowerCase();
    const container = document.getElementById('adminStudentList');
    
    let results = [];
    const classes = filter === 'all' ? CLASSES : [filter];
    classes.forEach(cls => {
        const cd = attendanceData[cls] || {students:[]};
        (cd.students || []).forEach(s => {
            if (search && !s.name.toLowerCase().includes(search) && !String(s.roll).includes(search)) return;
            results.push({...s, class: cls});
        });
    });
    
    results.sort((a,b) => {
        if (a.class !== b.class) return parseInt(a.class) - parseInt(b.class);
        return parseInt(a.roll) - parseInt(b.roll);
    });
    
    if (results.length === 0) {
        container.innerHTML = '<div style="color:var(--text-secondary); padding:20px; text-align:center;">No students found</div>';
        return;
    }
    
    let html = '<table class="admin-data-table"><thead><tr><th>Class</th><th>Roll</th><th>Name</th><th>Actions</th></tr></thead><tbody>';
    results.forEach(s => {
        html += `<tr>
            <td>${s.class}</td>
            <td>${s.roll}</td>
            <td>${escapeHtml(s.name)}</td>
            <td>
                <button class="btn-action small" onclick="adminEditStudent('${s.class}','${s.id}')">✏️</button>
                <button class="btn-action small" style="background:#e74c3c;" onclick="adminDeleteStudent('${s.class}','${s.id}')">🗑️</button>
            </td>
        </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

window.adminEditStudent = function(cls, id) {
    const cd = attendanceData[cls];
    if (!cd) return;
    const s = cd.students.find(x => x.id === id);
    if (!s) return;
    const newName = prompt('Edit name:', s.name);
    if (newName === null) return;
    const newRoll = prompt('Edit roll:', s.roll);
    if (newRoll === null) return;
    s.name = newName.trim() || s.name;
    s.roll = newRoll.trim() || s.roll;
    saveAttendanceData();
    adminFilterStudents();
    showToast('Student updated');
};

window.adminDeleteStudent = function(cls, id) {
    if (!confirm('Delete this student permanently?')) return;
    const cd = attendanceData[cls];
    if (!cd) return;
    cd.students = cd.students.filter(s => s.id !== id);
    saveAttendanceData();
    adminFilterStudents();
    showToast('Student deleted');
};

window.adminBulkImportStudents = function() {
    const raw = document.getElementById('adm_s_bulk').value;
    if (!raw) return showToast('Paste JSON data first');
    try {
        const arr = JSON.parse(raw);
        if (!Array.isArray(arr)) throw new Error('Not an array');
        let count = 0;
        arr.forEach(item => {
            const cls = String(item.class || item.class_name || '6');
            if (!attendanceData[cls]) attendanceData[cls] = {students:[], attendance:{}};
            const cd = attendanceData[cls];
            const roll = String(item.roll || cd.students.length + 1);
            if (cd.students.some(s => s.roll === roll)) return;
            cd.students.push({ id: `${cls}-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, name: item.name || '', roll });
            count++;
        });
        saveAttendanceData();
        adminFilterStudents();
        document.getElementById('adm_s_bulk').value = '';
        showToast(`Imported ${count} students`);
    } catch(e) { showToast('Invalid JSON: ' + e.message); }
};

// ====== RENDER TEACHERS ADMIN ======
function getTeachersAdmin() { try { return JSON.parse(localStorage.getItem('admin_teachers')) || []; } catch(e){ return []; } }
function saveTeachersAdmin(list) { try { localStorage.setItem('admin_teachers', JSON.stringify(list)); } catch(e){} }

function renderTeachersAdmin(editor) {
    const body = editor.querySelector('.modal-body');
    const title = editor.querySelector('.modal-header h2') || document.getElementById('editorTitle');
    if (title) title.innerText = 'Manage Teachers';
    
    const list = getTeachersAdmin();
    
    body.innerHTML = `
        <div class="admin-two-col">
            <div class="admin-form-col">
                <h3>➕ Add Teacher</h3>
                <form id="adminTeacherForm">
                    <div class="form-group"><label>Name</label><input id="adm_t_name" required placeholder="Full name"></div>
                    <div class="form-group"><label>Subject / Department</label>
                        <select id="adm_t_subject">
                            <option value="physics">Physics</option>
                            <option value="chemistry">Chemistry</option>
                            <option value="biology">Biology</option>
                            <option value="mathematics">Mathematics</option>
                            <option value="english">English</option>
                            <option value="social">Social Studies</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="form-group"><label>Qualification</label><input id="adm_t_qual" placeholder="e.g. M.Sc, B.Tech"></div>
                    <div class="form-group"><label>Experience</label><input id="adm_t_exp" placeholder="e.g. 5 Years"></div>
                    <div class="form-group"><label>Email</label><input id="adm_t_email" type="email" placeholder="email@example.com"></div>
                    <div class="form-group"><label>Phone</label><input id="adm_t_phone" placeholder="+91 ..."></div>
                    <div class="form-group"><label>Photo (optional)</label><input id="adm_t_photo" type="file" accept="image/*"></div>
                    <button class="btn-action" type="submit">Add Teacher</button>
                </form>
            </div>
            <div class="admin-list-col">
                <h3>👨‍🏫 Faculty List</h3>
                <div id="adminTeacherList" style="max-height:450px;overflow-y:auto;"></div>
            </div>
        </div>
    `;
    
    document.getElementById('adminTeacherForm').onsubmit = async function(e) {
        e.preventDefault();
        const name = document.getElementById('adm_t_name').value.trim();
        const subject = document.getElementById('adm_t_subject').value;
        const qual = document.getElementById('adm_t_qual').value.trim();
        const exp = document.getElementById('adm_t_exp').value.trim();
        const email = document.getElementById('adm_t_email').value.trim();
        const phone = document.getElementById('adm_t_phone').value.trim();
        const fileInput = document.getElementById('adm_t_photo');
        let photo = '';
        if (fileInput.files && fileInput.files[0]) {
            try { photo = await readFileAsDataURL(fileInput.files[0]); } catch(e){}
        }
        if (!name) return showToast('Enter teacher name');
        const list = getTeachersAdmin();
        list.push({ id: Date.now(), name, subject, qualification: qual, experience: exp, email, phone, photo });
        saveTeachersAdmin(list);
        document.getElementById('adminTeacherForm').reset();
        renderTeachersList();
        renderTeacherSubjectButtons();
        showToast('Teacher added');
    };
    
    function renderTeachersList() {
        const list = getTeachersAdmin();
        const container = document.getElementById('adminTeacherList');
        if (list.length === 0) { container.innerHTML = '<div style="color:var(--text-secondary);text-align:center;padding:20px;">No teachers added yet</div>'; return; }
        let html = '';
        list.forEach(t => {
            html += `<div class="admin-card-item">
                <div class="admin-card-left">
                    ${t.photo ? `<img src="${t.photo}" class="admin-card-avatar">` : '<div class="admin-card-avatar-placeholder">👤</div>'}
                    <div>
                        <strong>${escapeHtml(t.name)}</strong>
                        <div style="font-size:12px; color:var(--text-secondary);">${escapeHtml(t.subject)} • ${escapeHtml(t.qualification || '')}</div>
                        <div style="font-size:11px; color:var(--text-secondary);">${escapeHtml(t.email || '')} ${t.phone ? '• '+escapeHtml(t.phone) : ''}</div>
                    </div>
                </div>
                <div class="admin-card-actions">
                    <button class="btn-action small" onclick="adminEditTeacher(${t.id})">✏️</button>
                    <button class="btn-action small" style="background:#e74c3c;" onclick="adminDeleteTeacher(${t.id})">🗑️</button>
                </div>
            </div>`;
        });
        container.innerHTML = html;
    }
    
    window.adminEditTeacher = function(id) {
        const list = getTeachersAdmin();
        const t = list.find(x => x.id === id);
        if (!t) return;
        const newName = prompt('Edit name:', t.name);
        if (newName === null) return;
        const newSubject = prompt('Edit subject:', t.subject);
        if (newSubject === null) return;
        const newQual = prompt('Edit qualification:', t.qualification);
        const newExp = prompt('Edit experience:', t.experience);
        const newEmail = prompt('Edit email:', t.email);
        const newPhone = prompt('Edit phone:', t.phone);
        t.name = newName.trim() || t.name;
        t.subject = newSubject.trim() || t.subject;
        t.qualification = newQual !== null ? newQual.trim() : t.qualification;
        t.experience = newExp !== null ? newExp.trim() : t.experience;
        t.email = newEmail !== null ? newEmail.trim() : t.email;
        t.phone = newPhone !== null ? newPhone.trim() : t.phone;
        saveTeachersAdmin(list);
        renderTeachersList();
        renderTeacherSubjectButtons();
        showToast('Teacher updated');
    };
    
    window.adminDeleteTeacher = function(id) {
        if (!confirm('Delete this teacher?')) return;
        let list = getTeachersAdmin();
        list = list.filter(x => x.id !== id);
        saveTeachersAdmin(list);
        renderTeachersList();
        renderTeacherSubjectButtons();
        showToast('Teacher deleted');
    };
    
    renderTeachersList();
    editor.classList.add('active');
}

// ====== RENDER GALLERY ADMIN ======
function getGalleryAdmin() { try { return JSON.parse(localStorage.getItem('admin_gallery')) || []; } catch(e){ return []; } }
function saveGalleryAdmin(list) {
    try { localStorage.setItem('admin_gallery', JSON.stringify(list)); } catch(e){}
    // Sync public gallery in real-time
    if (typeof window.refreshPublicGallery === 'function') window.refreshPublicGallery();
}

function renderGalleryAdmin(editor) {
    const body = editor.querySelector('.modal-body');
    const title = editor.querySelector('.modal-header h2') || document.getElementById('editorTitle');
    if (title) title.innerText = '🖼️ Manage Gallery';
    
    const list = getGalleryAdmin();
    const totalCount = list.length;
    const catCounts = {};
    list.forEach(g => { catCounts[g.category] = (catCounts[g.category] || 0) + 1; });

    body.innerHTML = `
        <div style="margin-bottom:16px;">
            <div class="admin-stats-bar" style="margin-bottom:16px;">
                <div class="admin-stat-item"><span class="stat-num">${totalCount}</span><span class="stat-label">Total</span></div>
                <div class="admin-stat-item"><span class="stat-num">${catCounts['events']||0}</span><span class="stat-label">Events</span></div>
                <div class="admin-stat-item"><span class="stat-num">${catCounts['awards']||0}</span><span class="stat-label">Awards</span></div>
                <div class="admin-stat-item"><span class="stat-num">${catCounts['classes']||0}</span><span class="stat-label">Classes</span></div>
                <div class="admin-stat-item"><span class="stat-num">${catCounts['sports']||0}</span><span class="stat-label">Sports</span></div>
            </div>
        </div>
        <div class="admin-two-col">
            <div class="admin-form-col">
                <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:14px 18px;border-radius:12px 12px 0 0;color:#fff;">
                    <h3 style="margin:0;font-size:16px;">➕ Add Gallery Image</h3>
                </div>
                <div style="padding:16px;background:var(--bg-secondary);border-radius:0 0 12px 12px;border:1px solid var(--border-color);border-top:none;">
                    <form id="adminGalleryForm">
                        <div class="form-group"><label>Title</label><input id="adm_g_title" required placeholder="e.g. Annual Function 2025"></div>
                        <div class="form-group"><label>Description</label><textarea id="adm_g_desc" rows="2" placeholder="Brief description of this photo"></textarea></div>
                        <div class="form-group"><label>Category</label>
                            <select id="adm_g_cat" style="width:100%;padding:8px 10px;border-radius:8px;border:1px solid var(--border-color);">
                                <option value="events">📅 Events</option>
                                <option value="awards">🏆 Awards</option>
                                <option value="classes">📚 Classes</option>
                                <option value="sports">⚽ Sports</option>
                            </select>
                        </div>
                        <div class="form-group"><label>Image</label><input id="adm_g_image" type="file" accept="image/*" required></div>
                        <div id="adm_g_preview" style="margin-bottom:10px;"></div>
                        <button class="btn-action" type="submit" style="width:100%;background:linear-gradient(135deg,#667eea,#764ba2);border:none;color:#fff;padding:10px;border-radius:8px;font-weight:600;cursor:pointer;">
                            <i class="fas fa-plus"></i> Add to Gallery
                        </button>
                    </form>
                </div>
            </div>
            <div class="admin-list-col">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                    <h3 style="margin:0;">🖼️ Gallery Items (${totalCount})</h3>
                    <select id="adminGalleryFilter" style="padding:6px 10px;border-radius:8px;border:1px solid var(--border-color);font-size:13px;">
                        <option value="all">All Categories</option>
                        <option value="events">Events</option>
                        <option value="awards">Awards</option>
                        <option value="classes">Classes</option>
                        <option value="sports">Sports</option>
                    </select>
                </div>
                <div id="adminGalleryList" style="max-height:500px;overflow-y:auto;"></div>
            </div>
        </div>
    `;
    
    document.getElementById('adm_g_image').onchange = async function() {
        const preview = document.getElementById('adm_g_preview');
        if (this.files && this.files[0]) {
            try {
                const data = await readFileAsDataURL(this.files[0]);
                preview.innerHTML = `<img src="${data}" style="max-width:100%;max-height:120px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">`;
            } catch(e) { preview.innerHTML = ''; }
        }
    };
    
    document.getElementById('adminGalleryForm').onsubmit = async function(e) {
        e.preventDefault();
        const title = document.getElementById('adm_g_title').value.trim();
        const desc = document.getElementById('adm_g_desc').value.trim();
        const cat = document.getElementById('adm_g_cat').value;
        const fileInput = document.getElementById('adm_g_image');
        let imageData = '';
        if (fileInput.files && fileInput.files[0]) {
            try { imageData = await readFileAsDataURL(fileInput.files[0]); } catch(e){}
        }
        if (!title || !imageData) return showToast('Title and image required');
        const list = getGalleryAdmin();
        list.push({ id: Date.now(), title, description: desc, category: cat, image: imageData, created_at: new Date().toISOString() });
        saveGalleryAdmin(list);
        document.getElementById('adminGalleryForm').reset();
        document.getElementById('adm_g_preview').innerHTML = '';
        renderGalleryList();
        showToast('Gallery item added ✓');
        fetch('/api/gallery', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title, description: desc, image: imageData, category: cat }) }).catch(()=>{});
    };

    // Admin filter
    document.getElementById('adminGalleryFilter').onchange = function() {
        renderGalleryList(this.value);
    };
    
    function renderGalleryList(filterCat) {
        let list = getGalleryAdmin();
        if (filterCat && filterCat !== 'all') list = list.filter(g => g.category === filterCat);
        const container = document.getElementById('adminGalleryList');
        if (list.length === 0) { container.innerHTML = '<div style="color:var(--text-secondary);text-align:center;padding:30px;"><i class="fas fa-images" style="font-size:40px;opacity:0.3;display:block;margin-bottom:10px;"></i>No gallery items</div>'; return; }
        let html = '<div class="admin-gallery-grid">';
        list.forEach(g => {
            const catLabel = {events:'📅',awards:'🏆',classes:'📚',sports:'⚽'}[g.category] || '📷';
            html += `<div class="admin-gallery-item" style="position:relative;">
                <img src="${g.image}" style="width:100%;height:100px;object-fit:cover;">
                <div style="padding:8px;">
                    <strong style="font-size:13px;display:block;margin-bottom:2px;">${escapeHtml(g.title)}</strong>
                    <div style="font-size:11px;color:var(--text-secondary);">${catLabel} ${escapeHtml(g.category)}</div>
                </div>
                <div style="display:flex;gap:4px;padding:0 8px 8px;">
                    <button class="btn-action small" style="flex:1;font-size:12px;" onclick="adminEditGallery(${g.id})">✏️ Edit</button>
                    <button class="btn-action small" style="flex:1;font-size:12px;background:#e74c3c;" onclick="adminDeleteGallery(${g.id})">🗑️ Delete</button>
                </div>
            </div>`;
        });
        html += '</div>';
        container.innerHTML = html;
    }
    
    window.adminEditGallery = function(id) {
        const list = getGalleryAdmin();
        const g = list.find(x => x.id === id);
        if (!g) return;
        const newTitle = prompt('Edit title:', g.title);
        if (newTitle === null) return;
        const newDesc = prompt('Edit description:', g.description);
        const newCat = prompt('Edit category (events/awards/classes/sports):', g.category);
        g.title = newTitle.trim() || g.title;
        g.description = newDesc !== null ? newDesc.trim() : g.description;
        if (newCat !== null && ['events','awards','classes','sports'].includes(newCat.trim())) {
            g.category = newCat.trim();
        }
        saveGalleryAdmin(list);
        renderGalleryList();
        showToast('Gallery item updated ✓');
    };
    
    window.adminDeleteGallery = function(id) {
        if (!confirm('Delete this gallery item?')) return;
        let list = getGalleryAdmin();
        list = list.filter(x => x.id !== id);
        saveGalleryAdmin(list);
        renderGalleryList();
        showToast('Gallery item deleted');
        fetch('/api/gallery/' + id, { method:'DELETE' }).catch(()=>{});
    };
    
    renderGalleryList();
    editor.classList.add('active');
}

// ====== RENDER TOPPERS ADMIN ======
function getToppersAdmin() { try { return JSON.parse(localStorage.getItem('admin_toppers')) || []; } catch(e){ return []; } }
function saveToppersAdmin(list) { try { localStorage.setItem('admin_toppers', JSON.stringify(list)); } catch(e){} }

const TOPPER_CATEGORIES = [
    { value: '10th', label: 'Class 10th' },
    { value: '12th', label: 'Class 12th' },
    { value: 'JEE', label: 'JEE' },
    { value: 'NEET', label: 'NEET' }
];

function seedDefaultToppers() {
    if (getToppersAdmin().length > 0) return;
    const defaults = [
        { id: 1, name: 'Riya Sharma', class: '10th', rank: '1st', score: '98.5%', year: '2026', photo: '' },
        { id: 2, name: 'Aryan Gupta', class: '10th', rank: '2nd', score: '97.8%', year: '2026', photo: '' },
        { id: 3, name: 'Priya Singh', class: '10th', rank: '3rd', score: '97.2%', year: '2026', photo: '' },
        { id: 4, name: 'Rahul Kumar', class: '12th', rank: '1st', score: '96.8%', year: '2026', photo: '' },
        { id: 5, name: 'Ananya Patel', class: '12th', rank: '2nd', score: '96.2%', year: '2026', photo: '' },
        { id: 6, name: 'Vikram Singh', class: '12th', rank: '3rd', score: '95.9%', year: '2026', photo: '' }
    ];
    saveToppersAdmin(defaults);
}

let _tpEditingId = null;

function renderToppersAdmin(editor) {
    const body = editor.querySelector('.modal-body');
    const title = editor.querySelector('.modal-header h2') || document.getElementById('editorTitle');
    if (title) title.innerText = 'Manage Toppers';
    _tpEditingId = null;

    body.innerHTML = `
        <div class="admin-two-col">
            <div class="admin-form-col">
                <h3 id="tpFormTitle">🏆 Add Topper</h3>
                <form id="adminTopperForm">
                    <div class="form-group"><label>Student Name</label><input id="adm_tp_name" required placeholder="Enter student name"></div>
                    <div class="form-group"><label>Category</label>
                        <select id="adm_tp_class">
                            ${TOPPER_CATEGORIES.map(c => `<option value="${c.value}">${c.label}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group"><label>Rank</label><input id="adm_tp_rank" placeholder="e.g. 1st, 2nd, AIR 156"></div>
                    <div class="form-group"><label>Percentage / Score</label><input id="adm_tp_score" placeholder="e.g. 98.5% or 650/720"></div>
                    <div class="form-group"><label>Year</label><input id="adm_tp_year" placeholder="e.g. 2026" value="2026"></div>
                    <div class="form-group">
                        <label>Photo</label>
                        <input id="adm_tp_photo" type="file" accept="image/*">
                        <div id="tpPhotoPreview" style="margin-top:6px;"></div>
                    </div>
                    <div style="display:flex;gap:8px;">
                        <button class="btn-action" type="submit" id="tpSubmitBtn">➕ Add Topper</button>
                        <button class="btn-action" type="button" id="tpCancelEdit" style="display:none;background:transparent;border:1px solid var(--border-color);color:var(--text-primary);" onclick="tpCancelEditing()">Cancel</button>
                    </div>
                </form>
            </div>
            <div class="admin-list-col">
                <h3>🏆 Toppers List</h3>
                <div style="margin-bottom:10px;display:flex;gap:8px;flex-wrap:wrap;">
                    <select id="tpFilterCat" onchange="renderToppersList()" style="padding:6px 10px;border-radius:8px;border:1px solid var(--border-color);background:var(--card-bg);color:var(--text-primary);font-size:13px;">
                        <option value="">All Categories</option>
                        ${TOPPER_CATEGORIES.map(c => `<option value="${c.value}">${c.label}</option>`).join('')}
                    </select>
                    <select id="tpFilterYear" onchange="renderToppersList()" style="padding:6px 10px;border-radius:8px;border:1px solid var(--border-color);background:var(--card-bg);color:var(--text-primary);font-size:13px;">
                        <option value="">All Years</option>
                    </select>
                </div>
                <div id="adminTopperList" style="max-height:450px;overflow-y:auto;"></div>
            </div>
        </div>
    `;

    // Populate year filter
    const years = [...new Set(getToppersAdmin().map(t => t.year).filter(Boolean))].sort().reverse();
    const yearSelect = document.getElementById('tpFilterYear');
    years.forEach(y => { yearSelect.innerHTML += `<option value="${y}">${y}</option>`; });

    // Photo preview on file select
    document.getElementById('adm_tp_photo').onchange = function() {
        const preview = document.getElementById('tpPhotoPreview');
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = e => { preview.innerHTML = `<img src="${e.target.result}" style="width:60px;height:60px;border-radius:50%;object-fit:cover;border:2px solid var(--primary);">`; };
            reader.readAsDataURL(this.files[0]);
        } else { preview.innerHTML = ''; }
    };

    document.getElementById('adminTopperForm').onsubmit = async function(e) {
        e.preventDefault();
        const name = document.getElementById('adm_tp_name').value.trim();
        const cls = document.getElementById('adm_tp_class').value;
        const rank = document.getElementById('adm_tp_rank').value.trim();
        const score = document.getElementById('adm_tp_score').value.trim();
        const year = document.getElementById('adm_tp_year').value.trim();
        const fileInput = document.getElementById('adm_tp_photo');
        let photo = '';
        if (fileInput.files && fileInput.files[0]) {
            try { photo = await readFileAsDataURL(fileInput.files[0]); } catch(err){}
        }
        if (!name) return showToast('Enter student name');

        const list = getToppersAdmin();

        if (_tpEditingId !== null) {
            // Update existing
            const t = list.find(x => x.id === _tpEditingId);
            if (t) {
                t.name = name;
                t.class = cls;
                t.rank = rank;
                t.score = score;
                t.year = year;
                if (photo) t.photo = photo; // only update photo if new one selected
            }
            saveToppersAdmin(list);
            showToast('✅ Topper updated');
            _tpEditingId = null;
        } else {
            // Add new
            list.push({ id: Date.now(), name, class: cls, rank, score, year, photo });
            saveToppersAdmin(list);
            showToast('✅ Topper added');
        }

        document.getElementById('adminTopperForm').reset();
        document.getElementById('adm_tp_year').value = '2026';
        document.getElementById('tpPhotoPreview').innerHTML = '';
        document.getElementById('tpFormTitle').textContent = '🏆 Add Topper';
        document.getElementById('tpSubmitBtn').textContent = '➕ Add Topper';
        document.getElementById('tpCancelEdit').style.display = 'none';
        renderToppersList();
    };

    window.tpCancelEditing = function() {
        _tpEditingId = null;
        document.getElementById('adminTopperForm').reset();
        document.getElementById('adm_tp_year').value = '2026';
        document.getElementById('tpPhotoPreview').innerHTML = '';
        document.getElementById('tpFormTitle').textContent = '🏆 Add Topper';
        document.getElementById('tpSubmitBtn').textContent = '➕ Add Topper';
        document.getElementById('tpCancelEdit').style.display = 'none';
    };

    window.renderToppersList = function() {
        const filterCat = document.getElementById('tpFilterCat')?.value || '';
        const filterYear = document.getElementById('tpFilterYear')?.value || '';
        let list = getToppersAdmin();
        if (filterCat) list = list.filter(t => t.class === filterCat);
        if (filterYear) list = list.filter(t => t.year === filterYear);
        const container = document.getElementById('adminTopperList');
        if (list.length === 0) { container.innerHTML = '<div class="aa-empty">No toppers found. Add one using the form.</div>'; return; }

        container.innerHTML = list.map(t => `
            <div class="tp-admin-card">
                <div class="tp-admin-photo">
                    ${t.photo ? `<img src="${t.photo}" alt="${escapeHtml(t.name)}">` : `<div class="tp-admin-avatar">${t.name.charAt(0).toUpperCase()}</div>`}
                </div>
                <div class="tp-admin-info">
                    <div class="tp-admin-name">${escapeHtml(t.name)}</div>
                    <div class="tp-admin-meta">${escapeHtml(t.class)} • Rank: ${escapeHtml(t.rank)} • ${escapeHtml(t.score)} • ${escapeHtml(t.year || '')}</div>
                </div>
                <div class="tp-admin-actions">
                    <button class="btn-action small" onclick="adminEditTopper(${t.id})" title="Edit">✏️</button>
                    <button class="btn-action small" style="background:#ef4444;" onclick="adminDeleteTopper(${t.id})" title="Delete">🗑️</button>
                </div>
            </div>
        `).join('');
    };

    window.adminEditTopper = function(id) {
        const list = getToppersAdmin();
        const t = list.find(x => x.id === id);
        if (!t) return;
        _tpEditingId = id;
        document.getElementById('adm_tp_name').value = t.name;
        document.getElementById('adm_tp_class').value = t.class;
        document.getElementById('adm_tp_rank').value = t.rank;
        document.getElementById('adm_tp_score').value = t.score;
        document.getElementById('adm_tp_year').value = t.year || '2026';
        document.getElementById('tpPhotoPreview').innerHTML = t.photo ? `<img src="${t.photo}" style="width:60px;height:60px;border-radius:50%;object-fit:cover;border:2px solid var(--primary);">` : '';
        document.getElementById('tpFormTitle').textContent = '✏️ Edit Topper';
        document.getElementById('tpSubmitBtn').textContent = '💾 Save Changes';
        document.getElementById('tpCancelEdit').style.display = '';
        // Scroll form into view
        document.getElementById('adminTopperForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    window.adminDeleteTopper = function(id) {
        if (!confirm('Delete this topper?')) return;
        let list = getToppersAdmin();
        list = list.filter(x => x.id !== id);
        saveToppersAdmin(list);
        renderToppersList();
        showToast('🗑️ Topper deleted');
    };

    renderToppersList();
    editor.classList.add('active');
}

// ====== RENDER HEADLINES ADMIN ======
function getHeadlinesAdmin() { try { return JSON.parse(localStorage.getItem('admin_headlines')) || []; } catch(e){ return []; } }
function saveHeadlinesAdmin(list) { try { localStorage.setItem('admin_headlines', JSON.stringify(list)); } catch(e){} }

function seedDefaultHeadlines() {
    const existing = getHeadlinesAdmin();
    if (existing.length > 0) return;
    const defaults = [
        { id: 1, icon: '🏆', title: 'Entrance Test Results 2026', description: 'Our students achieved outstanding results in Entrance Test 2026', priority: 'important', date: new Date().toLocaleDateString(), active: true },
        { id: 2, icon: '🎓', title: 'NEET 2025 Toppers', description: '8 students secured ranks under 1000 in NEET 2025', priority: 'urgent', date: new Date().toLocaleDateString(), active: true },
        { id: 3, icon: '📚', title: 'New Study Material Launch', description: 'Updated study materials for 2026 board exams now available', priority: 'normal', date: new Date().toLocaleDateString(), active: true },
        { id: 4, icon: '🎯', title: 'Scholarship Program', description: 'Merit-based scholarships available for deserving students', priority: 'normal', date: new Date().toLocaleDateString(), active: true }
    ];
    saveHeadlinesAdmin(defaults);
}

// Editing state for headlines
var _hlEditingId = null;

function renderHeadlinesAdmin(editor) {
    const body = editor.querySelector('.modal-body');
    const title = editor.querySelector('.modal-header h2') || document.getElementById('editorTitle');
    if (title) title.innerText = 'Manage Headlines & Notices';
    _hlEditingId = null;

    body.innerHTML = `
        <div class="hl-admin-wrap">
            <div class="hl-admin-form-panel">
                <div class="hl-form-header">
                    <span class="hl-form-icon">📰</span>
                    <h3 id="hlFormTitle">Add New Headline</h3>
                </div>
                <form id="adminHeadlineForm" class="hl-form">
                    <div class="hl-form-row">
                        <div class="hl-form-group hl-icon-group">
                            <label>Icon</label>
                            <input id="adm_h_icon" placeholder="📢" value="📢" maxlength="4">
                        </div>
                        <div class="hl-form-group hl-priority-group">
                            <label>Priority</label>
                            <select id="adm_h_priority">
                                <option value="normal">🟢 Normal</option>
                                <option value="important">🟡 Important</option>
                                <option value="urgent">🔴 Urgent</option>
                            </select>
                        </div>
                    </div>
                    <div class="hl-form-group">
                        <label>Title <span style="color:#e74c3c;">*</span></label>
                        <input id="adm_h_title" required placeholder="Enter headline title..." maxlength="100">
                    </div>
                    <div class="hl-form-group">
                        <label>Description</label>
                        <textarea id="adm_h_desc" rows="3" placeholder="Enter headline details..."></textarea>
                    </div>
                    <div class="hl-form-actions">
                        <button class="hl-btn hl-btn-publish" type="submit"><span>📢</span> Publish</button>
                        <button class="hl-btn hl-btn-cancel" type="button" id="hlCancelEditBtn" style="display:none;" onclick="hlCancelEdit()">Cancel</button>
                    </div>
                </form>
            </div>
            <div class="hl-admin-list-panel">
                <div class="hl-list-header">
                    <h3>📋 Headlines <span id="hlCountBadge" class="hl-count-badge">0</span></h3>
                    <div class="hl-list-actions">
                        <select id="hlFilterPriority" onchange="hlRenderList()" class="hl-filter-select">
                            <option value="all">All Priorities</option>
                            <option value="urgent">🔴 Urgent</option>
                            <option value="important">🟡 Important</option>
                            <option value="normal">🟢 Normal</option>
                        </select>
                    </div>
                </div>
                <div id="adminHeadlineList" class="hl-list-container"></div>
            </div>
        </div>
    `;

    document.getElementById('adminHeadlineForm').onsubmit = function(e) {
        e.preventDefault();
        const icon = document.getElementById('adm_h_icon').value.trim() || '📢';
        const headTitle = document.getElementById('adm_h_title').value.trim();
        const desc = document.getElementById('adm_h_desc').value.trim();
        const priority = document.getElementById('adm_h_priority').value;
        if (!headTitle) return showToast('Enter headline title');

        const list = getHeadlinesAdmin();

        if (_hlEditingId) {
            // Update existing
            const h = list.find(x => x.id === _hlEditingId);
            if (h) {
                h.icon = icon;
                h.title = headTitle;
                h.description = desc;
                h.priority = priority;
            }
            _hlEditingId = null;
            document.getElementById('hlFormTitle').textContent = 'Add New Headline';
            document.getElementById('hlCancelEditBtn').style.display = 'none';
            const pubBtn = document.querySelector('.hl-btn-publish');
            if (pubBtn) pubBtn.innerHTML = '<span>📢</span> Publish';
            showToast('Headline updated');
        } else {
            // Add new
            list.unshift({ id: Date.now(), icon, title: headTitle, description: desc, priority, date: new Date().toLocaleDateString(), active: true });
            showToast('Headline published');
        }

        saveHeadlinesAdmin(list);
        applyStoredHeadlines();
        document.getElementById('adminHeadlineForm').reset();
        document.getElementById('adm_h_icon').value = '📢';
        hlRenderList();
    };

    window.hlRenderList = function() {
        const allList = getHeadlinesAdmin();
        const filter = document.getElementById('hlFilterPriority')?.value || 'all';
        const list = filter === 'all' ? allList : allList.filter(h => h.priority === filter);
        const container = document.getElementById('adminHeadlineList');
        const badge = document.getElementById('hlCountBadge');
        if (badge) badge.textContent = allList.length;

        if (list.length === 0) {
            container.innerHTML = '<div class="hl-empty"><span>📭</span><p>No headlines found</p></div>';
            return;
        }

        let html = '';
        list.forEach((h, idx) => {
            const prioMap = { urgent: { color: '#e74c3c', bg: 'rgba(231,76,60,0.12)', label: 'URGENT', dot: '🔴' }, important: { color: '#f39c12', bg: 'rgba(243,156,18,0.12)', label: 'IMPORTANT', dot: '🟡' }, normal: { color: '#27ae60', bg: 'rgba(39,174,96,0.12)', label: 'NORMAL', dot: '🟢' } };
            const p = prioMap[h.priority] || prioMap.normal;
            const isEditing = _hlEditingId === h.id;

            html += `<div class="hl-card ${h.active ? '' : 'hl-card-inactive'} ${isEditing ? 'hl-card-editing' : ''}" style="border-left: 4px solid ${p.color};">
                <div class="hl-card-main">
                    <div class="hl-card-icon">${h.icon}</div>
                    <div class="hl-card-body">
                        <div class="hl-card-title">${escapeHtml(h.title)}</div>
                        ${h.description ? '<div class="hl-card-desc">' + escapeHtml(h.description) + '</div>' : ''}
                        <div class="hl-card-meta">
                            <span class="hl-priority-badge" style="background:${p.bg};color:${p.color};">${p.dot} ${p.label}</span>
                            <span class="hl-card-date">📅 ${h.date}</span>
                            <span class="hl-card-status" style="color:${h.active ? '#27ae60' : '#e74c3c'};">${h.active ? '● Active' : '● Inactive'}</span>
                        </div>
                    </div>
                </div>
                <div class="hl-card-controls">
                    <div class="hl-reorder-btns">
                        <button class="hl-ctrl-btn" onclick="hlMoveHeadline(${h.id},-1)" title="Move Up" ${idx === 0 ? 'disabled' : ''}>▲</button>
                        <button class="hl-ctrl-btn" onclick="hlMoveHeadline(${h.id},1)" title="Move Down" ${idx === list.length - 1 ? 'disabled' : ''}>▼</button>
                    </div>
                    <div class="hl-action-btns">
                        <button class="hl-ctrl-btn hl-btn-toggle" onclick="hlToggleHeadline(${h.id})" title="${h.active ? 'Deactivate' : 'Activate'}">${h.active ? '👁️' : '🚫'}</button>
                        <button class="hl-ctrl-btn hl-btn-edit" onclick="hlEditHeadline(${h.id})" title="Edit">✏️</button>
                        <button class="hl-ctrl-btn hl-btn-delete" onclick="hlDeleteHeadline(${h.id})" title="Delete">🗑️</button>
                    </div>
                </div>
            </div>`;
        });
        container.innerHTML = html;
    };

    window.hlEditHeadline = function(id) {
        const list = getHeadlinesAdmin();
        const h = list.find(x => x.id === id);
        if (!h) return;
        _hlEditingId = id;
        document.getElementById('adm_h_icon').value = h.icon || '📢';
        document.getElementById('adm_h_title').value = h.title;
        document.getElementById('adm_h_desc').value = h.description || '';
        document.getElementById('adm_h_priority').value = h.priority || 'normal';
        document.getElementById('hlFormTitle').textContent = 'Edit Headline';
        document.getElementById('hlCancelEditBtn').style.display = '';
        const pubBtn = document.querySelector('.hl-btn-publish');
        if (pubBtn) pubBtn.innerHTML = '<span>💾</span> Update';
        document.getElementById('adm_h_title').focus();
        hlRenderList();
    };

    window.hlCancelEdit = function() {
        _hlEditingId = null;
        document.getElementById('adminHeadlineForm').reset();
        document.getElementById('adm_h_icon').value = '📢';
        document.getElementById('hlFormTitle').textContent = 'Add New Headline';
        document.getElementById('hlCancelEditBtn').style.display = 'none';
        const pubBtn = document.querySelector('.hl-btn-publish');
        if (pubBtn) pubBtn.innerHTML = '<span>📢</span> Publish';
        hlRenderList();
    };

    window.hlToggleHeadline = function(id) {
        const list = getHeadlinesAdmin();
        const h = list.find(x => x.id === id);
        if (!h) return;
        h.active = !h.active;
        saveHeadlinesAdmin(list);
        applyStoredHeadlines();
        hlRenderList();
        showToast(h.active ? 'Headline activated' : 'Headline deactivated');
    };

    window.hlDeleteHeadline = function(id) {
        if (!confirm('Delete this headline permanently?')) return;
        let list = getHeadlinesAdmin();
        list = list.filter(x => x.id !== id);
        if (_hlEditingId === id) { _hlEditingId = null; hlCancelEdit(); }
        saveHeadlinesAdmin(list);
        applyStoredHeadlines();
        hlRenderList();
        showToast('Headline deleted');
    };

    window.hlMoveHeadline = function(id, direction) {
        const list = getHeadlinesAdmin();
        const idx = list.findIndex(x => x.id === id);
        if (idx < 0) return;
        const newIdx = idx + direction;
        if (newIdx < 0 || newIdx >= list.length) return;
        [list[idx], list[newIdx]] = [list[newIdx], list[idx]];
        saveHeadlinesAdmin(list);
        applyStoredHeadlines();
        hlRenderList();
    };

    hlRenderList();
    editor.classList.add('active');
}

// ====== RENDER CONTACTS/MESSAGES ADMIN ======
function getContactsAdmin() { try { return JSON.parse(localStorage.getItem('admin_contacts')) || []; } catch(e){ return []; } }
function saveContactsAdmin(list) { try { localStorage.setItem('admin_contacts', JSON.stringify(list)); } catch(e){} }

function renderContactsAdmin(editor) {
    const body = editor.querySelector('.modal-body');
    const title = editor.querySelector('.modal-header h2') || document.getElementById('editorTitle');
    if (title) title.innerText = 'Contact Messages';
    
    // Try to fetch from server
    const contacts = getContactsAdmin();
    
    body.innerHTML = `
        <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                <h3>📩 Messages (${contacts.length})</h3>
                <div style="display:flex;gap:8px;">
                    <button class="btn-action small" onclick="adminRefreshContacts()">🔄 Refresh from Server</button>
                    <button class="btn-action small" style="background:#e74c3c;" onclick="adminClearContacts()">🗑️ Clear All</button>
                </div>
            </div>
            <div id="adminContactsList" style="max-height:500px;overflow-y:auto;"></div>
        </div>
    `;
    
    function renderContactsList() {
        const list = getContactsAdmin();
        const container = document.getElementById('adminContactsList');
        if (list.length === 0) { container.innerHTML = '<div style="color:var(--text-secondary);text-align:center;padding:40px;">No messages yet</div>'; return; }
        let html = '';
        list.forEach((c, i) => {
            html += `<div class="admin-card-item" style="border-left:4px solid #3498db;">
                <div class="admin-card-left" style="flex:1;">
                    <div style="width:100%;">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <strong>${escapeHtml(c.name || 'Anonymous')}</strong>
                            <span style="font-size:11px;color:var(--text-secondary);">${c.created_at || c.date || ''}</span>
                        </div>
                        <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">${escapeHtml(c.email || '')} ${c.phone ? '• '+escapeHtml(c.phone) : ''}</div>
                        <div style="margin-top:6px;padding:10px;background:rgba(0,0,0,0.03);border-radius:8px;font-size:13px;">${escapeHtml(c.message || '')}</div>
                    </div>
                </div>
                <div class="admin-card-actions">
                    <button class="btn-action small" style="background:#e74c3c;" onclick="adminDeleteContact(${i})">🗑️</button>
                </div>
            </div>`;
        });
        container.innerHTML = html;
    }
    
    window.adminDeleteContact = function(idx) {
        if (!confirm('Delete this message?')) return;
        let list = getContactsAdmin();
        list.splice(idx, 1);
        saveContactsAdmin(list);
        renderContactsList();
        showToast('Message deleted');
    };
    
    window.adminClearContacts = function() {
        if (!confirm('Delete ALL messages? This cannot be undone.')) return;
        saveContactsAdmin([]);
        renderContactsList();
        showToast('All messages cleared');
    };
    
    window.adminRefreshContacts = function() {
        fetch('/api/contacts').then(r => r.json()).then(data => {
            if (Array.isArray(data)) {
                saveContactsAdmin(data);
                renderContactsList();
                showToast('Refreshed from server');
            }
        }).catch(() => showToast('Could not reach server'));
    };
    
    renderContactsList();
    editor.classList.add('active');
}

// ====== ENHANCED ADMIN SETTINGS ======
function renderAdminSettingsEnhanced(editor) {
    const body = editor.querySelector('.modal-body');
    const title = editor.querySelector('.modal-header h2') || document.getElementById('editorTitle');
    if (title) title.innerText = 'Admin Settings';
    
    const stored = localStorage.getItem('admin_password') || '';
    const siteConfig = JSON.parse(localStorage.getItem('site_config') || '{}');
    
    body.innerHTML = `
        <div style="max-width:600px;">
            <h3>🔐 Security</h3>
            <form id="adminSettingsForm" style="margin-bottom:20px;">
                <div class="form-group">
                    <label>Admin Password</label>
                    <input id="set_admin_pass" type="password" placeholder="New password">
                </div>
                <div class="form-group">
                    <label>Teacher Password (for attendance)</label>
                    <input id="set_teacher_pass" type="password" placeholder="Teacher password" value="${localStorage.getItem('teacher_password') || ''}">
                </div>
                <div style="display:flex;gap:8px;">
                    <button class="btn-action" type="submit">Save Passwords</button>
                    <button type="button" class="btn-action" id="syncAdminBtn" style="background:#e0e0e0; color:var(--text-primary);">Sync To Server</button>
                </div>
            </form>
            <p style="color:var(--text-secondary); margin-bottom:16px;">Status: ${stored ? '✅ Custom admin password set' : '⚠️ Using default password'}</p>
            
            <hr style="border-color:var(--border-color);margin:16px 0;">
            
            <h3>🏫 Site Configuration</h3>
            <form id="siteConfigForm">
                <div class="form-group"><label>Institute Name</label><input id="cfg_name" value="${escapeHtml(siteConfig.name || 'CONCEPTS CLASSES')}"></div>
                <div class="form-group"><label>Tagline / Location</label><input id="cfg_tagline" value="${escapeHtml(siteConfig.tagline || 'Bhakharuan More, Daudnagar')}"></div>
                <div class="form-group"><label>Contact Phone</label><input id="cfg_phone" value="${escapeHtml(siteConfig.phone || '+91 8228835898')}"></div>
                <div class="form-group"><label>Contact Email</label><input id="cfg_email" value="${escapeHtml(siteConfig.email || 'abhishek12796@icloud.com')}"></div>
                <div class="form-group"><label>Footer Text</label><input id="cfg_footer" value="${escapeHtml(siteConfig.footer || '')}"></div>
                <button class="btn-action" type="submit">Save Site Config</button>
            </form>
            
            <hr style="border-color:var(--border-color);margin:16px 0;">
            
            <h3>📦 Data Management</h3>
            <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;">
                <button class="btn-action" onclick="adminExportAllData()">📤 Export All Data</button>
                <button class="btn-action" onclick="adminImportAllData()">📥 Import Data</button>
                <button class="btn-action" style="background:#e74c3c;" onclick="adminResetAllData()">🗑️ Reset All Data</button>
            </div>
            <input type="file" id="adminImportFile" accept=".json" style="display:none;" onchange="adminHandleImport(event)">
        </div>
    `;
    
    document.getElementById('adminSettingsForm').onsubmit = function(e) {
        e.preventDefault();
        const p = document.getElementById('set_admin_pass').value;
        const tp = document.getElementById('set_teacher_pass').value;
        if (p) localStorage.setItem('admin_password', p);
        if (tp) localStorage.setItem('teacher_password', tp);
        showToast('Passwords saved');
    };
    
    document.getElementById('syncAdminBtn').onclick = function() {
        if (!confirm('Create/overwrite admin on server?')) return;
        const p = document.getElementById('set_admin_pass').value || localStorage.getItem('admin_password') || '';
        if (!p) return showToast('Set a password first');
        fetch('/api/admin/setup', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ username:'admin', password: p }) })
            .then(r => r.json().then(j => showToast('Synced to server')))
            .catch(() => showToast('Server sync failed'));
    };
    
    document.getElementById('siteConfigForm').onsubmit = function(e) {
        e.preventDefault();
        const config = {
            name: document.getElementById('cfg_name').value.trim(),
            tagline: document.getElementById('cfg_tagline').value.trim(),
            phone: document.getElementById('cfg_phone').value.trim(),
            email: document.getElementById('cfg_email').value.trim(),
            footer: document.getElementById('cfg_footer').value.trim()
        };
        localStorage.setItem('site_config', JSON.stringify(config));
        // Apply to the live page
        const logoText = document.querySelector('.logo-text-small h2');
        const logoSub = document.querySelector('.logo-text-small p');
        if (logoText && config.name) logoText.textContent = config.name;
        if (logoSub && config.tagline) logoSub.textContent = config.tagline;
        showToast('Site config saved & applied');
    };
    
    window.adminExportAllData = function() {
        const allData = {};
        ['attendanceData', 'admin_teachers', 'admin_gallery', 'admin_toppers', 'admin_headlines', 'admin_contacts', 'timetable_entries', 'materials_list', 'results_list', 'students_list', 'site_config', 'admin_password'].forEach(key => {
            allData[key] = localStorage.getItem(key);
        });
        const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `cpc_backup_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        showToast('Data exported');
    };
    
    window.adminImportAllData = function() {
        document.getElementById('adminImportFile').click();
    };
    
    window.adminHandleImport = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(ev) {
            try {
                const data = JSON.parse(ev.target.result);
                Object.keys(data).forEach(key => {
                    if (data[key]) localStorage.setItem(key, data[key]);
                });
                loadAttendanceData();
                showToast('Data imported successfully! Refresh page for full effect.');
            } catch(err) { showToast('Invalid backup file'); }
        };
        reader.readAsText(file);
    };
    
    window.adminResetAllData = function() {
        if (!confirm('⚠️ This will DELETE ALL data. Are you absolutely sure?')) return;
        if (!confirm('Last chance! This action CANNOT be undone. Proceed?')) return;
        ['attendanceData', 'admin_teachers', 'admin_gallery', 'admin_toppers', 'admin_headlines', 'admin_contacts', 'timetable_entries', 'materials_list', 'results_list', 'students_list', 'site_config'].forEach(key => {
            localStorage.removeItem(key);
        });
        loadAttendanceData();
        showToast('All data has been reset');
    };
    
    editor.classList.add('active');
}

// ====== ADMIN DASHBOARD STATS ======
function renderAdminStats() {
    const bar = document.getElementById('adminStatsBar');
    if (!bar) return;
    
    let totalStudents = 0;
    CLASSES.forEach(cls => {
        const cd = attendanceData[cls] || {students:[]};
        totalStudents += (cd.students || []).length;
    });
    const totalTeachers = getTeachersAdmin().length;
    const totalMaterials = getMaterials().length;
    const totalResults = getResultPDFs().length;
    const totalHeadlines = getHeadlinesAdmin().length;
    const totalContacts = getContactsAdmin().length;
    
    bar.innerHTML = `
        <div class="admin-stat-item"><span class="stat-num">${totalStudents}</span><span class="stat-label">Students</span></div>
        <div class="admin-stat-item"><span class="stat-num">${totalTeachers}</span><span class="stat-label">Teachers</span></div>
        <div class="admin-stat-item"><span class="stat-num">${totalMaterials}</span><span class="stat-label">Materials</span></div>
        <div class="admin-stat-item"><span class="stat-num">${totalResults}</span><span class="stat-label">Results</span></div>
        <div class="admin-stat-item"><span class="stat-num">${totalHeadlines}</span><span class="stat-label">Headlines</span></div>
        <div class="admin-stat-item"><span class="stat-num">${totalContacts}</span><span class="stat-label">Messages</span></div>
    `;
}

// Wire adminEditor openSectionEditor to use these for their section names
const originalOpenSectionEditor = openSectionEditor;
openSectionEditor = function(section){ 
    if (!isAdminAuthenticated()) { openAdminAuth(); return; }
    const editor = document.getElementById('adminEditorModal'); 
    const title = document.getElementById('editorTitle'); 
    const secInput = document.getElementById('editorSection'); 
    const fieldTitle = document.getElementById('editorFieldTitle'); 
    const fieldDesc = document.getElementById('editorFieldDesc'); 
    const preview = document.getElementById('editorPreview'); 
    const niceName = section.charAt(0).toUpperCase() + section.slice(1); 
    title.innerText = `Edit: ${niceName}`; 
    secInput.value = section;
    
    // Route to specialized renderers
    if(section === 'students'){ renderStudentsAdmin(editor); return; }
    if(section === 'timetable'){ renderTimetableAdmin(editor); return; }
    if(section === 'materials'){ renderMaterialsAdmin(editor); return; }
    if(section === 'results'){ renderResultsAdmin(editor); return; }
    if(section === 'attendance'){ renderAttendanceAdmin(editor); return; }
    if(section === 'teachers'){ renderTeachersAdmin(editor); return; }
    if(section === 'gallery'){ renderGalleryAdmin(editor); return; }
    if(section === 'toppers'){ renderToppersAdmin(editor); return; }
    if(section === 'headlines'){ renderHeadlinesAdmin(editor); return; }
    if(section === 'contacts'){ renderContactsAdmin(editor); return; }
    if(section === 'admin'){ renderAdminSettingsEnhanced(editor); return; }
    
    // fallback to original behaviour for others
    originalOpenSectionEditor(section);
};

// Close admin modals when clicking outside (basic UX)
document.addEventListener('click', function(e){
    ['adminAuthModal','adminDashboardModal','adminEditorModal'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.classList.contains('active') && e.target === el) {
            el.classList.remove('active');
        }
    });
});

function handleMenuClick(menuId) {
    // Close sidebar on mobile
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const menuBtn = document.getElementById('menuBtn');
    
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    menuBtn.classList.remove('active');
    
    // Get menu content
    const contentData = getMenuContent(menuId);
    
    // Show menu content section
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const menuSection = document.getElementById('menu-content');
    if (menuSection) {
        menuSection.style.display = 'block';
        menuSection.classList.add('active');
        
        // Set content
        document.getElementById('menu-content-title').innerHTML = contentData.title;
        document.getElementById('menu-content-body').innerHTML = contentData.content;
    }
}

function getMenuContent(menuId) {
    const contentMap = {
        'academic-calendar': {
            title: '📅 Academic Calendar',
            content: `
                <h2>Academic Year 2025-2026</h2>
                <p>The academic calendar provides a comprehensive schedule of all important dates and events throughout the academic year.</p>
                
                <h3 style="margin-top: 20px;">Important Dates:</h3>
                <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                    <tr style="background: var(--light);">
                        <th style="padding: 10px; border: 1px solid var(--grey-light); text-align: left;">Event</th>
                        <th style="padding: 10px; border: 1px solid var(--grey-light); text-align: left;">Date</th>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid var(--grey-light);">Session Start</td>
                        <td style="padding: 10px; border: 1px solid var(--grey-light);">April 1, 2025</td>
                    </tr>
                    <tr style="background: var(--light);">
                        <td style="padding: 10px; border: 1px solid var(--grey-light);">First Term Exams</td>
                        <td style="padding: 10px; border: 1px solid var(--grey-light);">June 15-30, 2025</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid var(--grey-light);">Summer Break</td>
                        <td style="padding: 10px; border: 1px solid var(--grey-light);">July 1-31, 2025</td>
                    </tr>
                    <tr style="background: var(--light);">
                        <td style="padding: 10px; border: 1px solid var(--grey-light);">Second Term Exams</td>
                        <td style="padding: 10px; border: 1px solid var(--grey-light);">September 10-25, 2025</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid var(--grey-light);">Annual Exams</td>
                        <td style="padding: 10px; border: 1px solid var(--grey-light);">January 15-February 28, 2026</td>
                    </tr>
                </table>
            `
        },
        'course-materials': {
            title: '📚 Course Materials',
            content: `
                <h2>Download Course Materials</h2>
                <p>Access comprehensive study materials for all subjects and classes. Materials are regularly updated by our expert faculty.</p>
                
                <h3 style="margin-top: 20px;">Available Materials:</h3>
                <div class="info-grid" style="margin-top: 15px;">
                    <div class="info-item">
                        <strong>📖 Lecture Notes</strong>
                        <p style="margin-top: 8px; color: #666;">Complete lecture notes for all chapters</p>
                    </div>
                    <div class="info-item">
                        <strong>✍️ Assignments</strong>
                        <p style="margin-top: 8px; color: #666;">Practice assignments with solutions</p>
                    </div>
                    <div class="info-item">
                        <strong>📊 Solved Examples</strong>
                        <p style="margin-top: 8px; color: #666;">Step-by-step solved problems</p>
                    </div>
                    <div class="info-item">
                        <strong>🎥 Video Tutorials</strong>
                        <p style="margin-top: 8px; color: #666;">Recorded video lessons available</p>
                    </div>
                </div>
            `
        },
        'syllabus': {
            title: '📖 Syllabus',
            content: `
                <h2>Complete Course Syllabus</h2>
                <p>Our curriculum is designed to cover all topics required by the board while emphasizing conceptual understanding.</p>
                
                <h3 style="margin-top: 20px;">Class-wise Syllabus:</h3>
                <ul>
                    <li><strong>Classes 6-8:</strong> Foundation courses in Mathematics, Science, and English</li>
                    <li><strong>Classes 9-10:</strong> Board preparation with NCERT and additional reference materials</li>
                    <li><strong>Classes 11-12:</strong> JEE/NEET/Board preparation with comprehensive coverage</li>
                </ul>
                
                <h3 style="margin-top: 20px;">Key Features:</h3>
                <ul>
                    <li>Aligned with CBSE/ICSE curriculum standards</li>
                    <li>Emphasis on conceptual clarity</li>
                    <li>Regular practice with problem-solving techniques</li>
                    <li>Time management and exam strategies</li>
                </ul>
            `
        },
        'class-schedule': {
            title: '🕐 Class Schedule',
            content: `
                <h2>Weekly Class Schedule</h2>
                <p>Our classes are scheduled to ensure optimal learning with adequate time for practice and doubt resolution.</p>
                
                <h3 style="margin-top: 20px;">Regular Classes:</h3>
                <p><strong>Monday to Friday:</strong> 7:00 AM - 10:00 AM & 4:00 PM - 7:00 PM</p>
                <p><strong>Saturday:</strong> 7:00 AM - 1:00 PM</p>
                <p><strong>Sunday:</strong> Revision & Doubt Clearing (Optional)</p>
                
                <h3 style="margin-top: 20px;">Special Sessions:</h3>
                <ul>
                    <li>One-on-one doubt clearing sessions available</li>
                    <li>Weekend batch for working professionals</li>
                    <li>Online classes for remote students</li>
                    <li>Exam preparation intensive sessions</li>
                </ul>
            `
        },
        'fee-status': {
            title: '💰 Fee Status',
            content: `
                <h2>Your Fee Status</h2>
                <p>Track your payment status and outstanding dues here.</p>
                
                <h3 style="margin-top: 20px;">Current Status:</h3>
                <div class="info-grid" style="margin-top: 15px;">
                    <div class="info-item">
                        <strong>Total Due</strong>
                        <p style="margin-top: 8px; color: var(--primary); font-size: 18px; font-weight: 700;">₹0</p>
                    </div>
                    <div class="info-item">
                        <strong>Status</strong>
                        <p style="margin-top: 8px; color: #27ae60; font-size: 16px; font-weight: 600;">✓ Paid Up</p>
                    </div>
                    <div class="info-item">
                        <strong>Last Payment</strong>
                        <p style="margin-top: 8px;">January 15, 2025</p>
                    </div>
                </div>
            `
        },
        'fee-payment': {
            title: '💳 Fee Payment',
            content: `
                <h2>Online Fee Payment</h2>
                <p>Pay your fees securely online through multiple payment options.</p>
                
                <h3 style="margin-top: 20px;">Payment Methods Available:</h3>
                <ul>
                    <li>Credit/Debit Card (Visa, MasterCard, RuPay)</li>
                    <li>Net Banking</li>
                    <li>UPI (Google Pay, PhonePe, Paytm)</li>
                    <li>Direct Bank Transfer</li>
                    <li>Check/DD Payment</li>
                </ul>
                
                <h3 style="margin-top: 20px;">Steps:</h3>
                <ol>
                    <li>Select payment method</li>
                    <li>Enter your registration number</li>
                    <li>Review fee structure</li>
                    <li>Complete payment</li>
                    <li>Download receipt</li>
                </ol>
            `
        },
        'receipts': {
            title: '🧾 Receipts',
            content: `
                <h2>Payment Receipts</h2>
                <p>View and download your payment receipts from here.</p>
                
                <h3 style="margin-top: 20px;">Recent Transactions:</h3>
                <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                    <tr style="background: var(--light);">
                        <th style="padding: 10px; border: 1px solid var(--grey-light); text-align: left;">Date</th>
                        <th style="padding: 10px; border: 1px solid var(--grey-light); text-align: left;">Amount</th>
                        <th style="padding: 10px; border: 1px solid var(--grey-light); text-align: left;">Type</th>
                        <th style="padding: 10px; border: 1px solid var(--grey-light); text-align: center;">Action</th>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid var(--grey-light);">January 15, 2025</td>
                        <td style="padding: 10px; border: 1px solid var(--grey-light);">₹15,000</td>
                        <td style="padding: 10px; border: 1px solid var(--grey-light);">Monthly Fee</td>
                        <td style="padding: 10px; border: 1px solid var(--grey-light); text-align: center;"><button class="btn-primary" style="padding: 5px 10px; font-size: 12px;">Download</button></td>
                    </tr>
                </table>
            `
        },
        'financial-reports': {
            title: '📊 Financial Reports',
            content: `
                <h2>Financial Reports & Analysis</h2>
                <p>View detailed financial reports and expense breakdown.</p>
                
                <h3 style="margin-top: 20px;">Fee Structure 2025-26:</h3>
                <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                    <tr style="background: var(--light);">
                        <th style="padding: 10px; border: 1px solid var(--grey-light); text-align: left;">Item</th>
                        <th style="padding: 10px; border: 1px solid var(--grey-light); text-align: right;">Amount</th>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid var(--grey-light);">Tuition Fee</td>
                        <td style="padding: 10px; border: 1px solid var(--grey-light); text-align: right;">₹12,000</td>
                    </tr>
                    <tr style="background: var(--light);">
                        <td style="padding: 10px; border: 1px solid var(--grey-light);">Registration Fee</td>
                        <td style="padding: 10px; border: 1px solid var(--grey-light); text-align: right;">₹1,000</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid var(--grey-light);">Study Material</td>
                        <td style="padding: 10px; border: 1px solid var(--grey-light); text-align: right;">₹2,000</td>
                    </tr>
                    <tr style="background: #fff3cd;">
                        <td style="padding: 10px; border: 1px solid var(--grey-light); font-weight: 700;">Total Monthly</td>
                        <td style="padding: 10px; border: 1px solid var(--grey-light); text-align: right; font-weight: 700;">₹15,000</td>
                    </tr>
                </table>
            `
        },
        'staff-directory': {
            title: '👥 Staff Directory',
            content: `
                <h2>Staff & Faculty Directory</h2>
                <p>Find contact information for all staff members and faculty.</p>
                
                <h3 style="margin-top: 20px;">Administration:</h3>
                <div class="info-grid" style="margin-top: 15px;">
                    <div class="info-item">
                        <strong>Founder & Director</strong>
                        <p style="margin-top: 8px;">Abhishek Raj</p>
                        <p style="color: #666; font-size: 12px;">Phone: +91 8863994647</p>
                    </div>
                    <div class="info-item">
                        <strong>Academic Coordinator</strong>
                        <p style="margin-top: 8px;">Available on Request</p>
                        <p style="color: #666; font-size: 12px;">Email: academics@concepts.edu</p>
                    </div>
                    <div class="info-item">
                        <strong>Student Support</strong>
                        <p style="margin-top: 8px;">Available</p>
                        <p style="color: #666; font-size: 12px;">Phone: +91 8228835898</p>
                    </div>
                </div>
                
                <h3 style="margin-top: 20px;">Department Heads:</h3>
                <ul>
                    <li><strong>Physics:</strong> Abhishek Raj</li>
                    <li><strong>Chemistry:</strong> Dr. Amit Singh</li>
                    <li><strong>Mathematics:</strong> Prof. Vikram Pandey</li>
                    <li><strong>Biology:</strong> Dr. Priya Verma</li>
                </ul>
            `
        },
        'notices': {
            title: '📢 Notices & Announcements',
            content: `
                <h2>Official Notices & Announcements</h2>
                <p>Stay updated with the latest notices from the institute.</p>
                
                <h3 style="margin-top: 20px;">Latest Notices:</h3>
                <div style="margin-top: 15px;">
                    <div class="info-item" style="margin-bottom: 15px;">
                        <strong style="color: var(--primary); font-size: 16px;">🎓 Class Schedules Updated</strong>
                        <p style="margin-top: 8px; color: #666;">New batch timings for Spring semester are now live. Check the class schedule section.</p>
                        <p style="margin-top: 8px; color: #999; font-size: 12px;">Posted: February 3, 2025</p>
                    </div>
                    <div class="info-item" style="margin-bottom: 15px;">
                        <strong style="color: var(--primary); font-size: 16px;">📝 Admission Open</strong>
                        <p style="margin-top: 8px; color: #666;">Admissions are now open for all classes. Limited seats available.</p>
                        <p style="margin-top: 8px; color: #999; font-size: 12px;">Posted: February 1, 2025</p>
                    </div>
                    <div class="info-item">
                        <strong style="color: var(--primary); font-size: 16px;">🏆 Merit Scholarships Available</strong>
                        <p style="margin-top: 8px; color: #666;">Merit-based scholarships up to 50% are available for deserving students.</p>
                        <p style="margin-top: 8px; color: #999; font-size: 12px;">Posted: January 28, 2025</p>
                    </div>
                </div>
            `
        },
        'leave-management': {
            title: '📝 Leave & Absence Management',
            content: `
                <h2>Leave & Attendance Management</h2>
                <p>Manage your leaves and track your attendance record.</p>
                
                <h3 style="margin-top: 20px;">Leave Policy:</h3>
                <ul>
                    <li><strong>Casual Leave:</strong> 10 days per academic year</li>
                    <li><strong>Medical Leave:</strong> As per medical certificate</li>
                    <li><strong>Maternity/Paternity Leave:</strong> As per institutional policy</li>
                    <li><strong>Approved Absence:</strong> For competitions/events (requires prior approval)</li>
                </ul>
                
                <h3 style="margin-top: 20px;">Absence Procedure:</h3>
                <ol>
                    <li>Notify your class teacher immediately</li>
                    <li>Submit formal leave application with supporting documents</li>
                    <li>Inform parents through parent portal</li>
                    <li>Complete assignments and make up missed classes</li>
                </ol>
            `
        },
        'certificates': {
            title: '🎖️ Certificates & Documents',
            content: `
                <h2>Request Certificates & Documents</h2>
                <p>Apply for various certificates and official documents.</p>
                
                <h3 style="margin-top: 20px;">Available Certificates:</h3>
                <div class="info-grid" style="margin-top: 15px;">
                    <div class="info-item">
                        <strong>Character Certificate</strong>
                        <p style="margin-top: 8px; color: #666;">Processing: 3-5 working days</p>
                    </div>
                    <div class="info-item">
                        <strong>Transfer Certificate</strong>
                        <p style="margin-top: 8px; color: #666;">Processing: 5-7 working days</p>
                    </div>
                    <div class="info-item">
                        <strong>Conduct Certificate</strong>
                        <p style="margin-top: 8px; color: #666;">Processing: 3-5 working days</p>
                    </div>
                    <div class="info-item">
                        <strong>Merit Certificate</strong>
                        <p style="margin-top: 8px; color: #666;">For toppers and achievers</p>
                    </div>
                </div>
            `
        },
        'ebooks': {
            title: '📱 E-Books & Digital Resources',
            content: `
                <h2>Digital Library - E-Books</h2>
                <p>Access our comprehensive collection of e-books and digital reading materials.</p>
                
                <h3 style="margin-top: 20px;">Available Collections:</h3>
                <ul>
                    <li><strong>NCERT Books:</strong> All subjects and classes (6-12)</li>
                    <li><strong>Reference Books:</strong> Popular reference materials</li>
                    <li><strong>JEE/NEET Prep:</strong> Comprehensive preparation materials</li>
                    <li><strong>Competitive Exams:</strong> Various entrance exam guides</li>
                    <li><strong>General Knowledge:</strong> Current affairs and GK updates</li>
                </ul>
                
                <h3 style="margin-top: 20px;">How to Access:</h3>
                <ol>
                    <li>Login with your student ID</li>
                    <li>Browse the digital library</li>
                    <li>Search by subject, class, or topic</li>
                    <li>Read online or download for offline access</li>
                </ol>
            `
        },
        'journals': {
            title: '📰 Journals & Magazines',
            content: `
                <h2>Academic Journals & Magazines</h2>
                <p>Access curated academic journals and educational magazines.</p>
                
                <h3 style="margin-top: 20px;">Featured Publications:</h3>
                <ul>
                    <li><strong>Science Today:</strong> Latest scientific research and discoveries</li>
                    <li><strong>Math Express:</strong> Mathematics problem-solving techniques</li>
                    <li><strong>Current Science:</strong> Scientific advancements and innovations</li>
                    <li><strong>Young Achievers:</strong> Student success stories and tips</li>
                </ul>
                
                <h3 style="margin-top: 20px;">Archive:</h3>
                <p>Access complete archives of all publications from the past 5 years.</p>
            `
        },
        'research-papers': {
            title: '🔬 Research Papers & Studies',
            content: `
                <h2>Research Papers Database</h2>
                <p>Browse and download research papers on various academic topics.</p>
                
                <h3 style="margin-top: 20px;">Research Areas:</h3>
                <ul>
                    <li>Physics & Quantum Mechanics</li>
                    <li>Chemistry & Biochemistry</li>
                    <li>Biology & Life Sciences</li>
                    <li>Mathematics & Statistics</li>
                    <li>Environmental Science</li>
                </ul>
                
                <h3 style="margin-top: 20px;">How to Use:</h3>
                <ol>
                    <li>Search by topic or author</li>
                    <li>Review abstract and summary</li>
                    <li>Download PDF for detailed reading</li>
                    <li>Cite in your assignments using standard formats</li>
                </ol>
            `
        },
        'video-lectures': {
            title: '🎥 Video Lectures & Tutorials',
            content: `
                <h2>Video Lecture Library</h2>
                <p>Access comprehensive video lectures covering all topics.</p>
                
                <h3 style="margin-top: 20px;">Content Features:</h3>
                <ul>
                    <li>High-quality video lectures by expert teachers</li>
                    <li>Subtitle support in English and Hindi</li>
                    <li>Downloadable lecture notes</li>
                    <li>Quiz questions after each video</li>
                    <li>Doubt resolution in comments section</li>
                </ul>
                
                <h3 style="margin-top: 20px;">Access Requirements:</h3>
                <ul>
                    <li>Valid student registration</li>
                    <li>Internet connection (minimum 512 kbps)</li>
                    <li>Compatible device (PC, tablet, smartphone)</li>
                </ul>
            `
        },
        'exam-schedule': {
            title: '📅 Exam Schedule & Details',
            content: `
                <h2>Examination Schedule</h2>
                <p>Complete examination schedule and important dates for the academic year.</p>
                
                <h3 style="margin-top: 20px;">Exam Calendar 2025-26:</h3>
                <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                    <tr style="background: var(--light);">
                        <th style="padding: 10px; border: 1px solid var(--grey-light); text-align: left;">Exam</th>
                        <th style="padding: 10px; border: 1px solid var(--grey-light); text-align: left;">Duration</th>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid var(--grey-light);">Unit Test 1</td>
                        <td style="padding: 10px; border: 1px solid var(--grey-light);">May 15-20, 2025</td>
                    </tr>
                    <tr style="background: var(--light);">
                        <td style="padding: 10px; border: 1px solid var(--grey-light);">Mid Term Exams</td>
                        <td style="padding: 10px; border: 1px solid var(--grey-light);">June 15-30, 2025</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid var(--grey-light);">Pre-Board Exams</td>
                        <td style="padding: 10px; border: 1px solid var(--grey-light);">December 20, 2025 - January 15, 2026</td>
                    </tr>
                    <tr style="background: var(--light);">
                        <td style="padding: 10px; border: 1px solid var(--grey-light);">Board Exams</td>
                        <td style="padding: 10px; border: 1px solid var(--grey-light);">January 25 - February 28, 2026</td>
                    </tr>
                </table>
            `
        },
        'admit-card': {
            title: '🎫 Admit Card',
            content: `
                <h2>Download Your Admit Card</h2>
                <p>Download and print your exam admit cards.</p>
                
                <h3 style="margin-top: 20px;">How to Obtain:</h3>
                <ol>
                    <li>Login with your registration number</li>
                    <li>Select the exam for which you need the admit card</li>
                    <li>Verify your details</li>
                    <li>Download and print the admit card</li>
                </ol>
                
                <h3 style="margin-top: 20px;">Important Instructions:</h3>
                <ul>
                    <li>Keep admit card safe and bring it on exam day</li>
                    <li>Check all details carefully</li>
                    <li>Report any discrepancies immediately</li>
                    <li>Arrive 30 minutes before exam time</li>
                </ul>
            `
        },
        'results': {
            title: '📈 Examination Results',
            content: `
                <h2>View Your Exam Results</h2>
                <p>Check your examination results and detailed performance analysis.</p>
                
                <h3 style="margin-top: 20px;">Recent Results:</h3>
                <div class="info-grid" style="margin-top: 15px;">
                    <div class="info-item">
                        <strong>Unit Test 1 (May 2025)</strong>
                        <p style="margin-top: 8px; font-size: 18px; color: var(--primary); font-weight: 700;">85/100</p>
                        <p style="color: #666; font-size: 12px;">Published: May 22, 2025</p>
                    </div>
                    <div class="info-item">
                        <strong>Mid Term Exams (June 2025)</strong>
                        <p style="margin-top: 8px;">Results pending</p>
                        <p style="color: #666; font-size: 12px;">Expected: July 5, 2025</p>
                    </div>
                </div>
                
                <h3 style="margin-top: 20px;">Features:</h3>
                <ul>
                    <li>Detailed subject-wise breakup</li>
                    <li>Percentile ranking</li>
                    <li>Performance trend analysis</li>
                    <li>Downloadable result sheet</li>
                </ul>
            `
        },
        'previous-papers': {
            title: '📄 Previous Question Papers',
            content: `
                <h2>Previous Exam Question Papers</h2>
                <p>Access and download previous years' question papers for exam preparation.</p>
                
                <h3 style="margin-top: 20px;">Available Papers:</h3>
                <ul>
                    <li>Last 5 years' board exam papers</li>
                    <li>Competitive entrance exam papers (JEE, NEET, etc.)</li>
                    <li>Unit test and mock exam papers</li>
                    <li>Sample papers prepared by faculty</li>
                </ul>
                
                <h3 style="margin-top: 20px;">How to Use:</h3>
                <ol>
                    <li>Select subject and year</li>
                    <li>Download the PDF</li>
                    <li>Attempt the paper in exam conditions</li>
                    <li>Check solutions provided</li>
                    <li>Analyze mistakes and improve</li>
                </ol>
            `
        },
        'hostel-info': {
            title: '🏠 Hostel Information',
            content: `
                <h2>Hostel Facilities & Information</h2>
                <p>Comprehensive information about our residential hostels.</p>
                
                <h3 style="margin-top: 20px;">Facilities Provided:</h3>
                <ul>
                    <li><strong>Accommodation:</strong> Well-ventilated rooms with basic amenities</li>
                    <li><strong>Food:</strong> Nutritious, home-cooked meals (vegetarian & non-vegetarian)</li>
                    <li><strong>Recreation:</strong> Common hall with TV, games area</li>
                    <li><strong>Internet:</strong> 24x7 high-speed WiFi connectivity</li>
                    <li><strong>Security:</strong> 24-hour security and CCTV surveillance</li>
                    <li><strong>Laundry:</strong> Laundry services available (chargeable)</li>
                </ul>
                
                <h3 style="margin-top: 20px;">Rules & Regulations:</h3>
                <ul>
                    <li>Mandatory attendance in classes</li>
                    <li>Lights off at 10:00 PM</li>
                    <li>No visitors after 6:00 PM</li>
                    <li>No ragging policy strictly enforced</li>
                </ul>
            `
        },
        'room-allocation': {
            title: '🛏️ Room Allocation',
            content: `
                <h2>Room Allocation & Management</h2>
                <p>Information about room allocation and room management policies.</p>
                
                <h3 style="margin-top: 20px;">Room Types:</h3>
                <div class="info-grid" style="margin-top: 15px;">
                    <div class="info-item">
                        <strong>Single Room</strong>
                        <p style="margin-top: 8px; color: #666;">For senior students (Class 11-12)</p>
                    </div>
                    <div class="info-item">
                        <strong>Double Sharing</strong>
                        <p style="margin-top: 8px; color: #666;">For junior and senior students</p>
                    </div>
                    <div class="info-item">
                        <strong>Triple Sharing</strong>
                        <p style="margin-top: 8px; color: #666;">For junior students (Class 6-8)</p>
                    </div>
                </div>
                
                <h3 style="margin-top: 20px;">Allocation Process:</h3>
                <ol>
                    <li>Submit hostel application form</li>
                    <li>Interview by hostel manager</li>
                    <li>Room allocation on merit</li>
                    <li>Confirmation and fee payment</li>
                </ol>
            `
        },
        'hostel-fees': {
            title: '💵 Hostel Fee Structure',
            content: `
                <h2>Hostel Fee Structure</h2>
                <p>Complete information about hostel fees and payment terms.</p>
                
                <h3 style="margin-top: 20px;">Monthly Fee Breakdown:</h3>
                <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                    <tr style="background: var(--light);">
                        <th style="padding: 10px; border: 1px solid var(--grey-light); text-align: left;">Item</th>
                        <th style="padding: 10px; border: 1px solid var(--grey-light); text-align: right;">Amount (₹)</th>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid var(--grey-light);">Room Rent (Single)</td>
                        <td style="padding: 10px; border: 1px solid var(--grey-light); text-align: right;">8,000</td>
                    </tr>
                    <tr style="background: var(--light);">
                        <td style="padding: 10px; border: 1px solid var(--grey-light);">Room Rent (Double)</td>
                        <td style="padding: 10px; border: 1px solid var(--grey-light); text-align: right;">5,000</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid var(--grey-light);">Meal Charges</td>
                        <td style="padding: 10px; border: 1px solid var(--grey-light); text-align: right;">4,000</td>
                    </tr>
                    <tr style="background: var(--light);">
                        <td style="padding: 10px; border: 1px solid var(--grey-light);">Utilities</td>
                        <td style="padding: 10px; border: 1px solid var(--grey-light); text-align: right;">1,000</td>
                    </tr>
                    <tr style="background: #fff3cd;">
                        <td style="padding: 10px; border: 1px solid var(--grey-light); font-weight: 700;">Total (Double)</td>
                        <td style="padding: 10px; border: 1px solid var(--grey-light); text-align: right; font-weight: 700;">10,000</td>
                    </tr>
                </table>
            `
        },
        'hostel-complaints': {
            title: '⚠️ Hostel Complaint & Feedback',
            content: `
                <h2>Complaint & Feedback Portal</h2>
                <p>Report any hostel-related issues or provide suggestions.</p>
                
                <h3 style="margin-top: 20px;">Types of Complaints:</h3>
                <ul>
                    <li>Maintenance and facilities issues</li>
                    <li>Food quality and menu suggestions</li>
                    <li>Room cleanliness and repairs</li>
                    <li>Discipline and behavioral issues</li>
                    <li>Administrative matters</li>
                </ul>
                
                <h3 style="margin-top: 20px;">How to File a Complaint:</h3>
                <ol>
                    <li>Submit form to hostel office (direct or online)</li>
                    <li>Provide detailed description</li>
                    <li>Attach photos/evidence if applicable</li>
                    <li>Response within 48 hours</li>
                </ol>
                
                <h3 style="margin-top: 20px;">Contact:</h3>
                <p><strong>Hostel Manager:</strong> Available daily, 3:00 PM - 5:00 PM</p>
            `
        },
        'book-catalog': {
            title: '📚 Library Book Catalog',
            content: `
                <h2>Library Book Catalog</h2>
                <p>Search and browse our comprehensive library book collection.</p>
                
                <h3 style="margin-top: 20px;">Collection Statistics:</h3>
                <div class="info-grid" style="margin-top: 15px;">
                    <div class="info-item">
                        <strong>Total Books</strong>
                        <p style="margin-top: 8px; font-size: 18px; color: var(--primary); font-weight: 700;">15,000+</p>
                    </div>
                    <div class="info-item">
                        <strong>Reference Books</strong>
                        <p style="margin-top: 8px; font-size: 18px; color: var(--primary); font-weight: 700;">3,500+</p>
                    </div>
                    <div class="info-item">
                        <strong>Fiction/General</strong>
                        <p style="margin-top: 8px; font-size: 18px; color: var(--primary); font-weight: 700;">4,000+</p>
                    </div>
                </div>
                
                <h3 style="margin-top: 20px;">Search Options:</h3>
                <ul>
                    <li>By subject or topic</li>
                    <li>By author name</li>
                    <li>By ISBN number</li>
                    <li>By publication year</li>
                </ul>
            `
        },
        'issue-return': {
            title: '📤 Book Issue & Return',
            content: `
                <h2>Library Book Issue & Return</h2>
                <p>Manage your book borrowing and returns.</p>
                
                <h3 style="margin-top: 20px;">Issue Policy:</h3>
                <ul>
                    <li><strong>Maximum Books:</strong> 3 books at a time</li>
                    <li><strong>Issue Period:</strong> 14 days</li>
                    <li><strong>Renewal:</strong> Can be extended for 7 days</li>
                    <li><strong>Reference Books:</strong> 2-hour reading only</li>
                </ul>
                
                <h3 style="margin-top: 20px;">Return Process:</h3>
                <ol>
                    <li>Check due date on your library card</li>
                    <li>Return books in good condition</li>
                    <li>No fines if returned on time</li>
                    <li>Late charges: ₹5 per book per day</li>
                </ol>
            `
        },
        'member-info': {
            title: '💳 Library Member Information',
            content: `
                <h2>Your Library Membership</h2>
                <p>View and manage your library membership details.</p>
                
                <h3 style="margin-top: 20px;">Your Profile:</h3>
                <div class="info-grid" style="margin-top: 15px;">
                    <div class="info-item">
                        <strong>Membership Status</strong>
                        <p style="margin-top: 8px; color: #27ae60; font-weight: 600;">✓ Active</p>
                    </div>
                    <div class="info-item">
                        <strong>Books Issued</strong>
                        <p style="margin-top: 8px; font-size: 18px; font-weight: 700;">2</p>
                    </div>
                    <div class="info-item">
                        <strong>Renewal Balance</strong>
                        <p style="margin-top: 8px; font-size: 18px; font-weight: 700;">1</p>
                    </div>
                </div>
                
                <h3 style="margin-top: 20px;">Current Books Issued:</h3>
                <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                    <tr style="background: var(--light);">
                        <th style="padding: 10px; border: 1px solid var(--grey-light);">Book Title</th>
                        <th style="padding: 10px; border: 1px solid var(--grey-light);">Due Date</th>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid var(--grey-light);">Physics for Class 11</td>
                        <td style="padding: 10px; border: 1px solid var(--grey-light);">February 15, 2025</td>
                    </tr>
                </table>
            `
        },
        'fine-dues': {
            title: '⚡ Library Fines & Dues',
            content: `
                <h2>Library Fines & Outstanding Dues</h2>
                <p>Check your library fines and outstanding dues.</p>
                
                <h3 style="margin-top: 20px;">Your Account Status:</h3>
                <div class="info-item" style="margin-top: 15px;">
                    <strong>Total Outstanding Dues</strong>
                    <p style="margin-top: 8px; font-size: 18px; color: #27ae60; font-weight: 700;">₹0</p>
                </div>
                
                <h3 style="margin-top: 20px;">Fine Charges:</h3>
                <ul>
                    <li><strong>Late Return:</strong> ₹5 per book per day</li>
                    <li><strong>Damaged Book:</strong> 50% of book value</li>
                    <li><strong>Lost Book:</strong> 100% of book value</li>
                    <li><strong>Maximum Fine:</strong> ₹500 per issue</li>
                </ul>
                
                <h3 style="margin-top: 20px;">Payment Options:</h3>
                <ul>
                    <li>Online payment through library portal</li>
                    <li>Direct payment at library counter</li>
                    <li>Deduction from fee account</li>
                </ul>
            `
        }
    };
    
    return contentMap[menuId] || {
        title: 'Page Not Found',
        content: '<p>Sorry, this page could not be found.</p>'
    };
}

function showSection(sectionName) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    if (sectionName === 'students') {
        renderStudentClasses();
    }
    if (sectionName === 'attendance') {
        loadAttendanceData();
        hideAllAttendanceScreens();
        document.getElementById('attendanceMainMenu').classList.remove('attendance-hidden');
    }
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`.nav-link[onclick="showSection('${sectionName}'); return false;"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Update sidebar nav active state
    const sidebarNavItems = document.querySelectorAll('.sidebar-nav-item');
    sidebarNavItems.forEach(item => {
        item.classList.remove('active');
    });
    const activeSidebarLink = document.querySelector(`.sidebar-nav-item[onclick*="showSection('${sectionName}')"]`);
    if (activeSidebarLink) {
        activeSidebarLink.classList.add('active');
    }
}

function openModal(modalName) {
    const modal = document.getElementById(modalName + 'Modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalName) {
    const modal = document.getElementById(modalName + 'Modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function openToppersModal() {
    seedDefaultToppers();
    const modal = document.getElementById('toppersModal');
    const body = document.getElementById('toppersModalBody');
    if (!body) { modal.classList.add('active'); document.body.style.overflow = 'hidden'; return; }

    const toppers = getToppersAdmin();
    const groups = {};
    TOPPER_CATEGORIES.forEach(c => { groups[c.value] = []; });
    toppers.forEach(t => {
        if (!groups[t.class]) groups[t.class] = [];
        groups[t.class].push(t);
    });

    const years = [...new Set(toppers.map(t => t.year).filter(Boolean))].sort().reverse();
    const displayYear = years.length > 0 ? years[0] : '2026';
    const headerEl = modal.querySelector('.modal-header h2');
    if (headerEl) headerEl.textContent = `🏆 BOARD TOPPERS [${displayYear}]`;

    const medalEmoji = ['🥇', '🥈', '🥉'];
    const medalGradient = [
        'linear-gradient(135deg, #ffd700 0%, #ffb347 50%, #ffd700 100%)',
        'linear-gradient(135deg, #e8e8e8 0%, #b8b8b8 50%, #e8e8e8 100%)',
        'linear-gradient(135deg, #cd7f32 0%, #e8a849 50%, #cd7f32 100%)'
    ];
    const cardGlow = [
        '0 8px 32px rgba(255,215,0,0.25)',
        '0 8px 32px rgba(192,192,192,0.2)',
        '0 8px 32px rgba(205,127,50,0.2)'
    ];

    let html = '<div class="tp-modal-wrap">';
    let hasAny = false;

    TOPPER_CATEGORIES.forEach(cat => {
        const catToppers = groups[cat.value] || [];
        if (catToppers.length === 0) return;
        hasAny = true;

        catToppers.sort((a, b) => (parseInt(a.rank) || 999) - (parseInt(b.rank) || 999));

        const catIcons = { '10th': '📘', '12th': '📗', 'JEE': '🎯', 'NEET': '🩺' };

        html += `<div class="tp-category">
            <div class="tp-cat-header">
                <span class="tp-cat-icon">${catIcons[cat.value] || '🏆'}</span>
                <h3>${cat.label} Toppers</h3>
            </div>
            <div class="tp-cards-row">`;

        catToppers.forEach((t, i) => {
            const isTop3 = i < 3;
            const medal = isTop3 ? medalEmoji[i] : '⭐';
            const glow = isTop3 ? cardGlow[i] : '0 4px 16px rgba(0,0,0,0.08)';
            const ringGrad = isTop3 ? medalGradient[i] : 'linear-gradient(135deg, var(--primary), #6366f1)';
            const isFirst = i === 0;

            html += `<div class="tp-card ${isFirst ? 'tp-card-first' : ''} ${isTop3 ? 'tp-card-medal' : ''}">
                <div class="tp-medal-badge">${medal}</div>
                <div class="tp-photo-ring" style="background:${ringGrad};box-shadow:${glow};">
                    ${t.photo
                        ? `<img src="${t.photo}" alt="${escapeHtml(t.name)}" class="tp-photo-img">`
                        : `<div class="tp-photo-initial">${t.name.charAt(0).toUpperCase()}</div>`
                    }
                </div>
                <h4 class="tp-name">${escapeHtml(t.name)}</h4>
                <div class="tp-rank-badge" ${isTop3 ? `style="background:${ringGrad};${i===0?'color:#5a3b00;':'color:#fff;'}"` : ''}>
                    ${escapeHtml(t.rank)}
                </div>
                <div class="tp-score">${escapeHtml(t.score)}</div>
                ${t.year ? `<div class="tp-year">${escapeHtml(t.year)}</div>` : ''}
            </div>`;
        });

        html += '</div></div>';
    });

    if (!hasAny) {
        html += `<div class="tp-empty">
            <div class="tp-empty-icon">🏆</div>
            <h3>No Toppers Added Yet</h3>
            <p>Toppers will be displayed here once added by admin.</p>
        </div>`;
    }

    html += '</div>';
    body.innerHTML = html;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

const SUBJECT_ICONS = { physics: '🔬', chemistry: '🧪', biology: '🧬', mathematics: '📐', english: '📚', social: '🌍', other: '📖', hindi: '🕉️' };
const SUBJECT_LABELS = { physics: 'Physics', chemistry: 'Chemistry', biology: 'Biology', mathematics: 'Mathematics', english: 'English', social: 'Social Studies', other: 'Other', hindi: 'Hindi' };

function seedDefaultTeachers() {
    const existing = getTeachersAdmin();
    if (existing.length > 0) return;
    const defaults = [
        { id: 1, name: 'Abhishek Raj', subject: 'physics', qualification: 'B.Tech', experience: '8+ Years', email: 'abhishek12796@icloud.com', phone: '+91 8863994647', photo: '' },
        { id: 2, name: 'Prof. Sunita Sharma', subject: 'physics', qualification: 'M.Sc Physics', experience: '10 Years', email: 'sunita.s@concepts.edu', phone: '+91 98765 43211', photo: '' },
        { id: 3, name: 'Dr. Amit Singh', subject: 'chemistry', qualification: 'Ph.D Chemistry', experience: '12 Years', email: 'amit.s@concepts.edu', phone: '+91 98765 43212', photo: '' },
        { id: 4, name: 'Dr. Priya Verma', subject: 'biology', qualification: 'M.Sc Botany, B.Ed', experience: '14 Years', email: 'priya.v@concepts.edu', phone: '+91 98765 43213', photo: '' },
        { id: 5, name: 'Prof. Vikram Pandey', subject: 'mathematics', qualification: 'M.Sc Mathematics', experience: '18 Years', email: 'vikram.p@concepts.edu', phone: '+91 98765 43214', photo: '' },
        { id: 6, name: 'Dr. Anita Joshi', subject: 'mathematics', qualification: 'Ph.D Mathematics', experience: '11 Years', email: 'anita.j@concepts.edu', phone: '+91 98765 43215', photo: '' },
        { id: 7, name: 'Ms. Sarah Johnson', subject: 'english', qualification: 'M.A English, B.Ed', experience: '13 Years', email: 'sarah.j@concepts.edu', phone: '+91 98765 43216', photo: '' },
        { id: 8, name: 'Prof. Ramesh Gupta', subject: 'social', qualification: 'M.A History, B.Ed', experience: '16 Years', email: 'ramesh.g@concepts.edu', phone: '+91 98765 43217', photo: '' }
    ];
    saveTeachersAdmin(defaults);
}

function openTeacherModal(subject) {
    const modal = document.getElementById('teacherViewModal');
    const title = document.getElementById('teacherViewTitle');
    const body = document.getElementById('teacherViewBody');
    const icon = SUBJECT_ICONS[subject] || '📖';
    const label = SUBJECT_LABELS[subject] || subject;
    title.textContent = icon + ' ' + label + ' Department Teachers';

    const teachers = getTeachersAdmin().filter(t => t.subject === subject);

    if (teachers.length === 0) {
        body.innerHTML = `<div style="text-align:center;padding:40px 20px;color:var(--text-secondary);">
            <div style="font-size:48px;margin-bottom:12px;">👤</div>
            <h3 style="margin:0 0 6px;">No Teachers Yet</h3>
            <p style="margin:0;font-size:14px;">Teachers for ${label} will be added soon.</p>
        </div>`;
    } else {
        body.innerHTML = `<div class="teacher-grid">
            ${teachers.map(t => `
                <div class="teacher-card">
                    <div class="teacher-photo-container">
                        ${t.photo ? `<img src="${t.photo}" class="teacher-photo" alt="${escapeHtml(t.name)}">` : `<div class="teacher-photo-placeholder">👤</div>`}
                    </div>
                    <div class="teacher-info">
                        <div class="teacher-name">${escapeHtml(t.name)}</div>
                        <div class="teacher-subject">${escapeHtml(label)} Teacher</div>
                        <div class="teacher-details">
                            ${t.email ? `<div class="teacher-detail-item"><strong>📧 Email:</strong><span>${escapeHtml(t.email)}</span></div>` : ''}
                            ${t.phone ? `<div class="teacher-detail-item"><strong>📞 Phone:</strong><span>${escapeHtml(t.phone)}</span></div>` : ''}
                            ${t.qualification ? `<div class="teacher-detail-item"><strong>🎓 Qualification:</strong><span>${escapeHtml(t.qualification)}</span></div>` : ''}
                            ${t.experience ? `<div class="teacher-detail-item"><strong>⏰ Experience:</strong><span>${escapeHtml(t.experience)}</span></div>` : ''}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>`;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeTeacherModal() {
    const modal = document.getElementById('teacherViewModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function renderTeacherSubjectButtons() {
    const container = document.querySelector('.teacher-section');
    if (!container) return;
    const teachers = getTeachersAdmin();
    const subjects = [...new Set(teachers.map(t => t.subject))];
    const order = ['physics', 'chemistry', 'biology', 'mathematics', 'english', 'social', 'hindi', 'other'];
    subjects.sort((a, b) => (order.indexOf(a) === -1 ? 99 : order.indexOf(a)) - (order.indexOf(b) === -1 ? 99 : order.indexOf(b)));

    let html = '<h4>TEACHERS:</h4>';
    subjects.forEach(s => {
        const label = SUBJECT_LABELS[s] || s.charAt(0).toUpperCase() + s.slice(1);
        html += `<button class="btn-teacher" onclick="openTeacherModal('${s}')">${label}</button>`;
    });
    html += `<button class="btn-teacher toppers-btn" onclick="openToppersModal()">🏆 Toppers</button>`;
    container.innerHTML = html;
}

window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
        if (event.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.href.includes('cpc.html') || link.href.endsWith('/')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Initialize hidden menus
    initializeHiddenMenus();
    
    // Load dark mode preference
    loadDarkModePreference();
    
    // Initialize attendance system if page loads
    initAttendanceSystem();
});

/* ===== ATTENDANCE MANAGEMENT SYSTEM ===== */
const TEACHER_PASSWORD = 'Anurag@123';
const CLASSES = ['6', '7', '8', '9', '10', '11', '12'];
const MAX_STUDENTS = 100;

let currentClass = '6';
let currentAttendanceClass = '6';
let isLoggedIn = false;
let attendanceData = {};
let currentMode = null;
let tempAttendanceMarks = {};
let currentStudentClass = '6';
let dateFilterMode = 'today';
let selectedDate = new Date().toISOString().split('T')[0];
let currentTeacherName = '';

function initAttendanceSystem() {
    loadAttendanceData();
}

function loadAttendanceData() {
    const saved = localStorage.getItem('attendanceData');
    if (saved) {
        attendanceData = JSON.parse(saved);
    } else {
        CLASSES.forEach(cls => {
            attendanceData[cls] = { students: [], attendance: {} };
        });
        saveAttendanceData();
    }
}

function saveAttendanceData() {
    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
}

function isHoliday(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.getDay() === 0;
}

function getDayName(dateStr) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateStr + 'T00:00:00');
    return days[date.getDay()];
}

function goToAddStudent() {
    currentMode = 'add';
    tempAttendanceMarks = {};
    currentTeacherName = '';
    document.getElementById('loginTitle').textContent = 'Teacher Access - Add Student';
    showAttendanceLoginScreen();
}

function goToMarkAttendance() {
    currentMode = 'mark';
    tempAttendanceMarks = {};
    document.getElementById('loginTitle').textContent = 'Teacher Access - Mark Attendance';
    showAttendanceLoginScreen();
}

function goToViewAttendance() {
    currentMode = 'view';
    isLoggedIn = true;
    tempAttendanceMarks = {};
    currentTeacherName = '';
    showAttendanceDashboard();
    showViewSection();
}

function showAttendanceLoginScreen() {
    document.getElementById('menuScreen').classList.add('attendance-hidden');
    document.getElementById('loginScreen').classList.remove('attendance-hidden');
    document.getElementById('dashboard').classList.remove('active');
}

function showAttendanceDashboard() {
    document.getElementById('menuScreen').classList.add('attendance-hidden');
    document.getElementById('loginScreen').classList.add('attendance-hidden');
    document.getElementById('dashboard').classList.add('active');
}

function backToMenu() {
    isLoggedIn = false;
    currentMode = null;
    tempAttendanceMarks = {};
    currentTeacherName = '';
    document.getElementById('menuScreen').classList.remove('attendance-hidden');
    document.getElementById('loginScreen').classList.add('attendance-hidden');
    document.getElementById('dashboard').classList.remove('attendance-dashboard');
    document.getElementById('passwordInput').value = '';
}

function togglePassword() {
    const input = document.getElementById('passwordInput');
    const toggle = document.querySelector('.attendance-password-toggle');
    if (input.type === 'password') {
        input.type = 'text';
        toggle.textContent = '🙈';
    } else {
        input.type = 'password';
        toggle.textContent = '👁️';
    }
}

function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('passwordInput').value;
    
    if (password === TEACHER_PASSWORD) {
        isLoggedIn = true;
        document.getElementById('passwordInput').value = '';
        showAttendanceDashboard();
        
        if (currentMode === 'add') {
            showAddStudentSection();
            showAttendanceAlert('✓ Login successful! Ready to add students.', 'success');
        } else if (currentMode === 'mark') {
            showMarkAttendanceSection();
            showAttendanceAlert('✓ Login successful! Ready to mark attendance.', 'success');
        }
    } else {
        showAttendanceAlert('✗ Invalid password!', 'error');
    }
}

function showAddStudentSection() {
    document.getElementById('addStudentSection').classList.add('active');
    document.getElementById('attendanceSection').classList.remove('active');
    document.getElementById('viewSection').classList.remove('active');
    document.getElementById('dashboardTitle').textContent = '📚 Add Students';
    renderAttendanceClassButtons();
    renderAttendanceStudentList();
}

function showMarkAttendanceSection() {
    const today = new Date().toISOString().split('T')[0];
    const isHolidayToday = isHoliday(today);
    
    if (isHolidayToday) {
        const dayName = getDayName(today);
        showAttendanceAlert(`⚠️ Today is ${dayName} - A Holiday. Attendance marking is not available.`, 'error');
        setTimeout(() => backToMenu(), 2000);
        return;
    }

    document.getElementById('addStudentSection').classList.remove('active');
    document.getElementById('attendanceSection').classList.add('active');
    document.getElementById('viewSection').classList.remove('active');
    document.getElementById('dashboardTitle').textContent = '✓ Mark Attendance';
    document.getElementById('attendanceClassNum').textContent = currentClass;
    renderAttendanceClassButtons();
    updateAttendanceDate();
    renderAttendanceList();
    loadTeacherNameForSession();
}

function showViewSection() {
    document.getElementById('addStudentSection').classList.remove('active');
    document.getElementById('attendanceSection').classList.remove('active');
    document.getElementById('viewSection').classList.add('active');
    document.getElementById('dashboardTitle').textContent = '👁️ View Attendance';
    renderAttendanceClassButtons();
    dateFilterMode = 'today';
    selectedDate = new Date().toISOString().split('T')[0];
    document.getElementById('attendanceDateFilter').valueAsDate = new Date();
    updateAttendanceDateButtons();
    updateAttendanceView();
}

function renderAttendanceClassButtons() {
    const container = document.getElementById('classButtons');
    container.innerHTML = CLASSES.map(cls => `
        <button class="attendance-class-btn ${cls === currentClass ? 'active' : ''}" 
                onclick="selectAttendanceClass('${cls}')">
            Class ${cls}
        </button>
    `).join('');
}

/* ===== STUDENT LIST VIEW (Reads from attendanceData) ===== */
function renderStudentClasses() {
    const container = document.getElementById('classListContainer');
    if (!container) return;
    container.innerHTML = CLASSES.map(cls => `
        <button class="class-select-btn ${cls === currentStudentClass ? 'active' : ''}" onclick="selectStudentClass('${cls}')">Class ${cls}</button>
    `).join('');
    // render default class
    selectStudentClass(currentStudentClass || CLASSES[0]);
}

function selectStudentClass(cls) {
    currentStudentClass = cls;
    const header = document.getElementById('studentClassHeader');
    if (header) header.textContent = `Class ${cls}`;
    renderStudentsForClass(cls);
    document.querySelectorAll('.class-select-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.trim() === `Class ${cls}`);
    });
}

function renderStudentsForClass(cls) {
    const container = document.getElementById('studentsCards');
    if (!container) return;
    const classData = attendanceData[cls] || { students: [] };
    if (!classData.students || classData.students.length === 0) {
        container.innerHTML = '<p class="attendance-empty-message">No students added yet for this class.</p>';
        return;
    }
    const students = [...classData.students].sort((a, b) => parseInt(a.roll) - parseInt(b.roll));
    container.innerHTML = students.map(s => `
        <div class="student-card">
            <div class="student-card-left">
                <div class="student-name">${s.name}</div>
                <div class="student-roll">Roll: ${s.roll}</div>
            </div>
            <div class="student-card-right">
                <button class="btn-primary" onclick="openStudentModal('${cls}','${s.id}')">View Details</button>
            </div>
        </div>
    `).join('');
}

function openStudentModal(cls, studentId) {
    const classData = attendanceData[cls] || { students: [], attendance: {} };
    const student = classData.students.find(s => s.id === studentId);
    if (!student) return;
    const modal = document.getElementById('studentModal');
    const body = document.getElementById('studentModalBody');
    if (!body) return;

    // --- Attendance calculation ---
    let totalDelivered = 0, totalPresent = 0, totalAbsent = 0;
    const monthlyStats = {};
    Object.entries(classData.attendance || {}).forEach(([dateStr, dayData]) => {
        if (!isHoliday(dateStr)) {
            const records = dayData.records || {};
            if (Object.keys(records).length > 0) {
                totalDelivered++;
                const status = records[studentId];
                if (status === 'present') totalPresent++;
                else totalAbsent++;
                // Monthly breakdown
                const month = dateStr.substring(0, 7); // YYYY-MM
                if (!monthlyStats[month]) monthlyStats[month] = { present: 0, absent: 0, total: 0 };
                monthlyStats[month].total++;
                if (status === 'present') monthlyStats[month].present++;
                else monthlyStats[month].absent++;
            }
        }
    });
    const attendancePct = totalDelivered === 0 ? 0 : Math.round((totalPresent / totalDelivered) * 100);
    const attColor = getAttendanceColorClass(attendancePct);
    const totalStudentsInClass = classData.students ? classData.students.length : 0;

    // --- Results PDFs for this class ---
    const classPdfs = getResultPDFs().filter(p => p.classNum === cls);
    const examNames = [...new Set(classPdfs.map(p => p.examName))];

    // --- Monthly breakdown HTML ---
    const sortedMonths = Object.keys(monthlyStats).sort();
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let monthlyHtml = '';
    if (sortedMonths.length > 0) {
        monthlyHtml = sortedMonths.map(m => {
            const ms = monthlyStats[m];
            const mPct = ms.total === 0 ? 0 : Math.round((ms.present / ms.total) * 100);
            const mColor = getAttendanceColorClass(mPct);
            const [y, mon] = m.split('-');
            const monthLabel = monthNames[parseInt(mon) - 1] + ' ' + y;
            return `<div class="sp-month-row">
                <span class="sp-month-label">${monthLabel}</span>
                <div class="sp-month-bar-wrap">
                    <div class="sp-month-bar" style="width:${mPct}%; background:${mColor.color};"></div>
                </div>
                <span class="sp-month-pct" style="color:${mColor.color};">${mPct}%</span>
                <span class="sp-month-detail">${ms.present}/${ms.total}</span>
            </div>`;
        }).join('');
    } else {
        monthlyHtml = '<p class="sp-no-data">No monthly data available yet.</p>';
    }

    // --- Results section HTML ---
    let resultsHtml = '';
    if (examNames.length > 0) {
        resultsHtml = examNames.map(examName => {
            const pdfs = classPdfs.filter(p => p.examName === examName);
            return `<div class="sp-exam-group">
                <div class="sp-exam-name">📝 ${escapeHtml(examName)}</div>
                <div class="sp-pdf-list">
                    ${pdfs.map(p => `
                        <div class="sp-pdf-card">
                            <div class="sp-pdf-icon">📄</div>
                            <div class="sp-pdf-info">
                                <div class="sp-pdf-title">${escapeHtml(p.title || examName)}</div>
                                <div class="sp-pdf-meta">Uploaded: ${new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                            </div>
                            <div class="sp-pdf-actions">
                                <button onclick="viewResultPdf(${p.id})" class="sm-doc-btn view">👁️ View</button>
                                <button onclick="downloadResultPdf(${p.id})" class="sm-doc-btn download">⬇️ Download</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>`;
        }).join('');
    } else {
        resultsHtml = '<p class="sp-no-data">No results published yet for this class.</p>';
    }

    // --- Subjects for this class ---
    const subjects = RESULT_SUBJECTS[cls] || [];

    body.innerHTML = `
        <div class="sp-profile">
            <!-- Student info header -->
            <div class="sp-header">
                <div class="sp-avatar">${student.name.charAt(0).toUpperCase()}</div>
                <div class="sp-header-info">
                    <h3 class="sp-name">${escapeHtml(student.name)}</h3>
                    <div class="sp-meta-row">
                        <span class="sp-badge">🎓 Class ${cls}</span>
                        <span class="sp-badge">🔢 Roll: ${student.roll}</span>
                        <span class="sp-badge">👥 ${totalStudentsInClass} students in class</span>
                    </div>
                    ${subjects.length > 0 ? `<div class="sp-subjects">${subjects.map(s => `<span class="sp-subject-tag">${s}</span>`).join('')}</div>` : ''}
                </div>
            </div>

            <!-- Attendance overview -->
            <div class="sp-section">
                <h4 class="sp-section-title">📊 Attendance Overview</h4>
                <div class="sp-attendance-grid">
                    <div class="sp-att-stat">
                        <div class="sp-att-num" style="color:${attColor.color}; font-size:28px;">${attendancePct}%</div>
                        <div class="sp-att-label">Overall</div>
                    </div>
                    <div class="sp-att-stat">
                        <div class="sp-att-num" style="color:#10b981;">${totalPresent}</div>
                        <div class="sp-att-label">Present</div>
                    </div>
                    <div class="sp-att-stat">
                        <div class="sp-att-num" style="color:#ef4444;">${totalAbsent}</div>
                        <div class="sp-att-label">Absent</div>
                    </div>
                    <div class="sp-att-stat">
                        <div class="sp-att-num" style="color:#6366f1;">${totalDelivered}</div>
                        <div class="sp-att-label">Total Classes</div>
                    </div>
                </div>
                <div class="sp-progress-wrap">
                    <div class="sp-progress-bar" style="width:${attendancePct}%; background:${attColor.color};"></div>
                </div>
                <div class="sp-progress-legend">
                    <span>${totalPresent} attended out of ${totalDelivered} delivered</span>
                    <span style="color:${attColor.color}; font-weight:600;">${attColor.text}</span>
                </div>
            </div>

            <!-- Monthly breakdown -->
            <div class="sp-section">
                <h4 class="sp-section-title">📅 Monthly Attendance Breakdown</h4>
                <div class="sp-monthly-breakdown">
                    ${monthlyHtml}
                </div>
            </div>

            <!-- Results section -->
            <div class="sp-section">
                <h4 class="sp-section-title">📋 Results</h4>
                <div class="sp-results-wrap">
                    ${resultsHtml}
                </div>
            </div>
        </div>
    `;

    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function openStudentsModal() {
    const modal = document.getElementById('studentModal');
    const body = document.getElementById('studentModalBody');
    if (!body || !modal) return;

    // Inject class list and students container into modal body
    body.innerHTML = `
        <div style="display:flex; gap:18px; align-items:flex-start;">
            <div style="min-width:160px; max-width:220px;" id="classListContainer"></div>
            <div style="flex:1;" id="studentsCardsContainer">
                <h3 id="studentClassHeader">Class ${currentStudentClass}</h3>
                <div id="studentsCards"></div>
            </div>
        </div>
    `;

    // Show modal and render classes/students
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderStudentClasses();
}

function selectAttendanceClass(cls) {
    currentClass = cls;
    document.getElementById('classNum').textContent = cls;
    document.getElementById('attendanceClassNum').textContent = cls;
    document.getElementById('viewClassNum').textContent = cls;
    document.getElementById('classHeader').textContent = `Class ${cls}`;
    renderAttendanceClassButtons();
    
    if (currentMode === 'add') {
        renderAttendanceStudentList();
    } else if (currentMode === 'mark') {
        renderAttendanceList();
    } else if (currentMode === 'view') {
        updateAttendanceView();
    }
}

function handleAddStudent(e) {
    e.preventDefault();
    const name = document.getElementById('studentName').value.trim();
    const roll = document.getElementById('studentRoll').value.trim();

    if (!name || !roll) {
        showAttendanceAlert('✗ Please fill all fields', 'error');
        return;
    }

    const classData = attendanceData[currentClass];
    if (classData.students.length >= MAX_STUDENTS) {
        showAttendanceAlert(`✗ Maximum ${MAX_STUDENTS} students reached!`, 'error');
        return;
    }

    if (classData.students.some(s => s.roll === roll)) {
        showAttendanceAlert('✗ Roll number already exists!', 'error');
        return;
    }

    const student = {
        id: `${currentClass}-${Date.now()}`,
        name: name,
        roll: roll
    };

    classData.students.push(student);
    saveAttendanceData();
    renderAttendanceStudentList();
    document.getElementById('addStudentForm').reset();
    showAttendanceAlert('✓ Student added successfully!', 'success');
}

function deleteAttendanceStudent(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        const classData = attendanceData[currentClass];
        classData.students = classData.students.filter(s => s.id !== studentId);
        saveAttendanceData();
        renderAttendanceStudentList();
        showAttendanceAlert('✓ Student deleted successfully!', 'success');
    }
}

function renderAttendanceStudentList() {
    const classData = attendanceData[currentClass];
    const container = document.getElementById('studentListContainer');
    const countElement = document.getElementById('studentCountText');

    countElement.textContent = classData.students.length;

    if (classData.students.length === 0) {
        container.innerHTML = '<p class="attendance-empty-message">No students added yet</p>';
        return;
    }

    const students = [...classData.students].sort((a, b) => parseInt(a.roll) - parseInt(b.roll));
    container.innerHTML = students.map(student => `
        <div class="attendance-student-item">
            <div class="attendance-student-info">
                <span class="name">Roll ${student.roll}: ${student.name}</span>
                <span class="roll">${student.name}</span>
            </div>
            <button class="attendance-delete-btn" onclick="deleteAttendanceStudent('${student.id}')">🗑️ Remove</button>
        </div>
    `).join('');
}

function markAttendance(studentId, status) {
    tempAttendanceMarks[studentId] = status;
    renderAttendanceList();
}

function renderAttendanceList() {
    const classData = attendanceData[currentClass];
    const today = new Date().toISOString().split('T')[0];
    const isHolidayToday = isHoliday(today);
    const dayName = getDayName(today);

    if (classData.students.length === 0) {
        document.getElementById('attendanceListContainer').innerHTML = 
            '<p class="attendance-empty-message">No students added yet. Add students first!</p>';
        return;
    }

    let holidayMessage = '';
    if (isHolidayToday) {
        holidayMessage = `<div style="padding: 15px; background: linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%); border: 2px solid #a855f7; border-radius: 10px; margin-bottom: 20px; color: #7c3aed; font-weight: 600;">⚠️ Today is ${dayName} - A Holiday. Attendance marking is not required.</div>`;
    }

    const students = [...classData.students].sort((a, b) => parseInt(a.roll) - parseInt(b.roll));
    const markedCount = Object.keys(tempAttendanceMarks).length;
    
    document.getElementById('markedStudents').textContent = markedCount;
    document.getElementById('totalStudents').textContent = students.length;

    document.getElementById('attendanceListContainer').innerHTML = holidayMessage + students.map(student => {
        const status = tempAttendanceMarks[student.id];
        const isMarked = status !== undefined;
        
        return `
            <div class="attendance-row">
                <div class="attendance-row-left">
                    <div class="attendance-row-name">Roll ${student.roll}: ${student.name}</div>
                    <div class="attendance-row-roll">${student.name}</div>
                </div>
                <div class="attendance-row-right">
                    <button class="attendance-option ${status === 'present' ? 'selected-present' : ''}" 
                            onclick="markAttendance('${student.id}', 'present')">
                        ✓ Present
                    </button>
                    <button class="attendance-option ${status === 'absent' ? 'selected-absent' : ''}" 
                            onclick="markAttendance('${student.id}', 'absent')">
                        ✗ Absent
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function saveTeacherName() {
    const teacherName = document.getElementById('teacherName').value.trim();
    
    if (!teacherName) {
        showAttendanceAlert('✗ Please enter teacher name', 'error');
        return;
    }

    currentTeacherName = teacherName;
    document.getElementById('teacherNameDisplay').textContent = teacherName;
    document.getElementById('teacherNameDisplay').classList.remove('empty');
    showAttendanceAlert('✓ Teacher name saved!', 'success');
}

function loadTeacherNameForSession() {
    const savedTeacher = sessionStorage.getItem('currentTeacher');
    if (savedTeacher) {
        currentTeacherName = savedTeacher;
        document.getElementById('teacherName').value = savedTeacher;
        document.getElementById('teacherNameDisplay').textContent = savedTeacher;
        document.getElementById('teacherNameDisplay').classList.remove('empty');
    }
}

function submitAttendance() {
    const today = new Date().toISOString().split('T')[0];
    const isHolidayToday = isHoliday(today);
    const dayName = getDayName(today);
    
    if (isHolidayToday) {
        showAttendanceAlert(`✗ Cannot mark attendance on ${dayName} - It's a holiday!`, 'error');
        return;
    }

    if (!currentTeacherName) {
        showAttendanceAlert('✗ Please enter teacher name before submitting!', 'error');
        return;
    }

    const classData = attendanceData[currentClass];
    const markedCount = Object.keys(tempAttendanceMarks).length;
    
    if (markedCount === 0) {
        showAttendanceAlert('✗ Please mark attendance for at least one student!', 'error');
        return;
    }

    // Prevent marking attendance more than once per day
    if (classData.attendance[today] && Object.keys(classData.attendance[today].records || {}).length > 0) {
        showAttendanceAlert('✗ Attendance already marked for today. It can only be marked once per day.', 'error');
        return;
    }

    if (!classData.attendance[today]) {
        classData.attendance[today] = { records: {}, markedBy: '', markedAt: '' };
    }

    Object.keys(tempAttendanceMarks).forEach(studentId => {
        classData.attendance[today].records[studentId] = tempAttendanceMarks[studentId];
    });

    classData.attendance[today].markedBy = currentTeacherName;
    classData.attendance[today].markedAt = new Date().toLocaleString();

    saveAttendanceData();
    sessionStorage.setItem('currentTeacher', currentTeacherName);
    tempAttendanceMarks = {};
    renderAttendanceList();
    showAttendanceAlert('✓ Attendance submitted successfully for today! (' + markedCount + ' students marked)', 'success');
}

function resetAttendance() {
    if (confirm('Are you sure you want to reset all marks for this class?')) {
        tempAttendanceMarks = {};
        renderAttendanceList();
        showAttendanceAlert('✓ All attendance marks reset!', 'info');
    }
}

function setDateFilter(mode) {
    dateFilterMode = mode;
    const today = new Date();
    
    if (mode === 'today') {
        selectedDate = today.toISOString().split('T')[0];
    } else if (mode === 'yesterday') {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        selectedDate = yesterday.toISOString().split('T')[0];
    } else if (mode === 'week') {
        selectedDate = '';
    } else if (mode === 'all') {
        selectedDate = '';
    }

    document.getElementById('attendanceDateFilter').valueAsDate = new Date(selectedDate + 'T00:00:00');
    updateAttendanceDateButtons();
    updateAttendanceView();
}

function updateAttendanceDateButtons() {
    document.querySelectorAll('.attendance-date-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const modeMap = {
        'today': 0,
        'yesterday': 1,
        'week': 2,
        'all': 3
    };
    if (modeMap[dateFilterMode] !== undefined) {
        document.querySelectorAll('.attendance-date-btn')[modeMap[dateFilterMode]].classList.add('active');
    }
}

function updateAttendanceView() {
    if (dateFilterMode === 'today' || dateFilterMode === 'yesterday') {
        renderAttendanceTableByDate(selectedDate);
    } else if (dateFilterMode === 'week') {
        renderAttendanceTableByWeek();
    } else if (dateFilterMode === 'all') {
        renderAttendanceTableAll();
    }
}

function renderAttendanceTableByDate(dateStr) {
    const classData = attendanceData[currentClass];
    const dayName = getDayName(dateStr);
    const isHolidayDate = isHoliday(dateStr);
    
    const formattedDate = new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    if (classData.students.length === 0) {
        document.getElementById('attendanceTableBody').innerHTML = 
            '<tr><td colspan="4" class="attendance-empty-message">No students in this class yet</td></tr>';
        return;
    }

    let holidayMessage = '';
    if (isHolidayDate) {
        holidayMessage = `<span class="attendance-holiday-badge">🔴 HOLIDAY (${dayName})</span>`;
    }

    document.getElementById('reportDateInfo').innerHTML = `📅 ${formattedDate}${holidayMessage}`;

    const attendanceForDate = classData.attendance[dateStr];
    const markedBySection = document.getElementById('markedBySection');
    
    if (attendanceForDate && attendanceForDate.markedBy) {
        markedBySection.style.display = 'block';
        document.getElementById('viewTeacherName').textContent = attendanceForDate.markedBy;
        document.getElementById('viewTeacherDate').textContent = new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        document.getElementById('viewTeacherTime').textContent = attendanceForDate.markedAt || '-';
    } else {
        markedBySection.style.display = 'none';
    }

    const records = attendanceForDate ? attendanceForDate.records || {} : {};
    const students = [...classData.students].sort((a, b) => parseInt(a.roll) - parseInt(b.roll));
    
    document.getElementById('attendanceTableBody').innerHTML = students.map(student => {
        const status = records[student.id];
        const attended = status === 'present';
        const marked = status !== undefined;
        
        let statusText = '❓ No Record';
        let statusClass = 'attendance-status-poor';
        
        if (isHolidayDate) {
            statusText = '🔴 Holiday';
            statusClass = 'attendance-status-poor';
        } else if (marked) {
            if (attended) {
                statusText = '✅ Present';
                statusClass = 'attendance-status-good';
            } else {
                statusText = '❌ Absent';
                statusClass = 'attendance-status-poor';
            }
        }

        return `
            <tr>
                <td>${student.roll}</td>
                <td>${student.name}</td>
                <td>
                    <div class="attendance-percentage-bar">
                        <div class="attendance-bar-bg">
                            <div class="attendance-bar-fill ${marked && attended ? 'good' : (marked && !attended ? 'poor' : 'moderate')}" style="width: ${marked && attended ? 100 : (marked && !attended ? 0 : 50)}%"></div>
                        </div>
                        <span class="attendance-percentage-text">${marked && attended ? '100%' : (marked && !attended ? '0%' : '-')}</span>
                    </div>
                </td>
                <td>
                    <span class="attendance-status-badge ${statusClass}">${statusText}</span>
                </td>
            </tr>
        `;
    }).join('');
}

function renderAttendanceTableByWeek() {
    const classData = attendanceData[currentClass];
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

    document.getElementById('reportDateInfo').innerHTML = '📅 This Week\'s Attendance';
    document.getElementById('markedBySection').style.display = 'none';

    if (classData.students.length === 0) {
        document.getElementById('attendanceTableBody').innerHTML = 
            '<tr><td colspan="4" class="attendance-empty-message">No students in this class yet</td></tr>';
        return;
    }

    const students = [...classData.students].sort((a, b) => parseInt(a.roll) - parseInt(b.roll));
    
    document.getElementById('attendanceTableBody').innerHTML = students.map(student => {
        let presentDays = 0;
        let workingDays = 0;

        for (let i = 0; i < 5; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            
            if (!isHoliday(dateStr)) {
                workingDays++;
                const attendanceForDate = classData.attendance[dateStr];
                const records = attendanceForDate ? attendanceForDate.records || {} : {};
                if (records[student.id] === 'present') {
                    presentDays++;
                }
            }
        }

        const percentage = workingDays > 0 ? Math.round((presentDays / workingDays) * 100) : 0;
        
        let statusClass = 'attendance-status-poor';
        let statusText = '❌ Poor';

        if (percentage >= 75) {
            statusClass = 'attendance-status-good';
            statusText = '✅ Good';
        } else if (percentage >= 50) {
            statusClass = 'attendance-status-moderate';
            statusText = '⚠️ Moderate';
        }

        let barClass = 'poor';
        if (percentage >= 75) {
            barClass = 'good';
        } else if (percentage >= 50) {
            barClass = 'moderate';
        }

        return `
            <tr>
                <td>${student.roll}</td>
                <td>${student.name}</td>
                <td>
                    <div class="attendance-percentage-bar">
                        <div class="attendance-bar-bg">
                            <div class="attendance-bar-fill ${barClass}" style="width: ${percentage}%"></div>
                        </div>
                        <span class="attendance-percentage-text">${percentage}%</span>
                    </div>
                </td>
                <td>
                    <span class="attendance-status-badge ${statusClass}">${statusText}</span>
                </td>
            </tr>
        `;
    }).join('');
}

function renderAttendanceTableAll() {
    const classData = attendanceData[currentClass];
    
    document.getElementById('reportDateInfo').innerHTML = '📅 Overall Attendance Record (All Time)';
    document.getElementById('markedBySection').style.display = 'none';

    if (classData.students.length === 0) {
        document.getElementById('attendanceTableBody').innerHTML = 
            '<tr><td colspan="4" class="attendance-empty-message">No students in this class yet</td></tr>';
        return;
    }

    const students = [...classData.students].sort((a, b) => parseInt(a.roll) - parseInt(b.roll));
    
    document.getElementById('attendanceTableBody').innerHTML = students.map(student => {
        const percentage = getAttendancePercentage(student.id);
        let statusClass = 'attendance-status-poor';
        let statusText = '❌ Poor';

        if (percentage >= 75) {
            statusClass = 'attendance-status-good';
            statusText = '✅ Good';
        } else if (percentage >= 50) {
            statusClass = 'attendance-status-moderate';
            statusText = '⚠️ Moderate';
        }

        let barClass = 'poor';
        if (percentage >= 75) {
            barClass = 'good';
        } else if (percentage >= 50) {
            barClass = 'moderate';
        }

        return `
            <tr>
                <td>${student.roll}</td>
                <td>${student.name}</td>
                <td>
                    <div class="attendance-percentage-bar">
                        <div class="attendance-bar-bg">
                            <div class="attendance-bar-fill ${barClass}" style="width: ${percentage}%"></div>
                        </div>
                        <span class="attendance-percentage-text">${percentage}%</span>
                    </div>
                </td>
                <td>
                    <span class="attendance-status-badge ${statusClass}">${statusText}</span>
                </td>
            </tr>
        `;
    }).join('');
}

function getAttendancePercentage(studentId) {
    const classData = attendanceData[currentClass];
    let present = 0;
    let total = 0;

    Object.entries(classData.attendance).forEach(([dateStr, attendanceRec]) => {
        if (!isHoliday(dateStr)) {
            const records = attendanceRec.records || {};
            if (records[studentId] !== undefined) {
                total++;
                if (records[studentId] === 'present') present++;
            }
        }
    });

    return total === 0 ? 0 : Math.round((present / total) * 100);
}

function updateAttendanceDate() {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    const el = document.getElementById('attendanceDateDisplay');
    if (el) el.textContent = `📅 ${dateStr}`;
}

function showAttendanceAlert(message, type = 'info') {
    showToast(message);
}

/* ===== NEW ATTENDANCE SYSTEM FUNCTIONS ===== */

// MAIN MENU NAVIGATION
function startAddStudent() {
    hideAllAttendanceScreens();
    document.getElementById('passwordScreen').classList.remove('attendance-hidden');
    document.getElementById('passwordInputField').focus();
}

function startMarkAttendance() {
    if (isHoliday(new Date().toISOString().split('T')[0])) {
        showAttendanceSystemAlert('⚠️ Today is Sunday - An official holiday. Attendance cannot be marked.', 'error');
        return;
    }
    hideAllAttendanceScreens();
    document.getElementById('markAttendancePasswordScreen').classList.remove('attendance-hidden');
    document.getElementById('markAttPasswordInput').value = '';
    setTimeout(() => { const el = document.getElementById('markAttPasswordInput'); if (el) el.focus(); }, 120);
}

function validateMarkAttendancePassword(event) {
    event.preventDefault();
    const password = document.getElementById('markAttPasswordInput').value;
    const validPassword = localStorage.getItem('teacher_password') || TEACHER_PASSWORD;
    
    if (password === validPassword) {
        document.getElementById('markAttPasswordInput').value = '';
        showAttendanceSystemAlert('✓ Password verified! Select your name.', 'success');
        hideAllAttendanceScreens();
        populateTeacherDropdownAndShow();
    } else {
        showAttendanceSystemAlert('✗ Incorrect password!', 'error');
        document.getElementById('markAttPasswordInput').value = '';
        document.getElementById('markAttPasswordInput').focus();
    }
}

function populateTeacherDropdownAndShow() {
    const teacherSelect = document.getElementById('teacherNameInput');
    if (!teacherSelect) return;

    // Get all teachers from admin localStorage
    const teachers = getTeachersAdmin();
    const subjectMap = {};
    teachers.forEach(t => {
        const name = (t.name || '').trim();
        if (!name) return;
        const label = SUBJECT_LABELS[t.subject] || t.subject || 'Other';
        if (!subjectMap[label]) subjectMap[label] = [];
        subjectMap[label].push(name);
    });

    teacherSelect.innerHTML = '<option value="">-- Select Teacher --</option>';

    const allSubjects = Object.keys(subjectMap);
    if (allSubjects.length === 0) {
        teacherSelect.innerHTML = '<option value="">No teachers found</option>';
        showAttendanceSystemAlert('⚠️ No teachers found. Add teachers in the Admin panel.', 'error');
    } else {
        allSubjects.sort().forEach(subj => {
            const group = document.createElement('optgroup');
            group.label = subj;
            subjectMap[subj].forEach(name => {
                const opt = document.createElement('option');
                opt.value = name;
                opt.textContent = name;
                group.appendChild(opt);
            });
            teacherSelect.appendChild(group);
        });
    }
    document.getElementById('teacherNameScreen').classList.remove('attendance-hidden');
}

function toggleMarkAttPasswordVisibility() {
    const input = document.getElementById('markAttPasswordInput');
    if (input) input.type = input.type === 'password' ? 'text' : 'password';
}

function startViewAttendance() {
    hideAllAttendanceScreens();
    renderClassButtons('viewAttendanceClassButtons');
    document.getElementById('viewAttendanceClassSelector').classList.remove('attendance-hidden');
}

function goBackToMainMenu() {
    hideAllAttendanceScreens();
    document.getElementById('attendanceMainMenu').classList.remove('attendance-hidden');
    const teacherInput = document.getElementById('teacherNameInput');
    if (teacherInput) teacherInput.value = '';
}

function goBackToClassSelection(mode) {
    hideAllAttendanceScreens();
    if (mode === 'markAttendance') {
        document.getElementById('markAttendanceClassSelector').classList.remove('attendance-hidden');
    } else if (mode === 'viewAttendance') {
        document.getElementById('viewAttendanceClassSelector').classList.remove('attendance-hidden');
    }
}

function hideAllAttendanceScreens() {
    const screens = [
        'attendanceMainMenu',
        'markAttendancePasswordScreen',
        'teacherNameScreen',
        'markAttendanceClassSelector',
        'markAttendanceScreen',
        'viewAttendanceClassSelector',
        'viewAttendanceScreen'
    ];
    screens.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('attendance-hidden');
    });
}

// PASSWORD VALIDATION FOR ADD STUDENT
function validatePassword(event) {
    event.preventDefault();
    const password = document.getElementById('passwordInputField').value;
    
    if (password === TEACHER_PASSWORD) {
        hideAllAttendanceScreens();
        renderClassButtons('addStudentClassButtons');
        document.getElementById('addStudentClassSelector').classList.remove('attendance-hidden');
        document.getElementById('passwordInputField').value = '';
        showAttendanceSystemAlert('✓ Password verified! Select a class.', 'success');
    } else {
        showAttendanceSystemAlert('✗ Incorrect password!', 'error');
        document.getElementById('passwordInputField').value = '';
        document.getElementById('passwordInputField').focus();
    }
}

function togglePasswordVisibility() {
    const input = document.getElementById('passwordInputField');
    const toggle = document.querySelector('.attendance-password-toggle');
    if (input.type === 'password') {
        input.type = 'text';
        toggle.textContent = '🙈';
    } else {
        input.type = 'password';
        toggle.textContent = '👁️';
    }
}

// ADD STUDENT WORKFLOW
function selectClassForAddStudent(cls) {
    currentAttendanceClass = cls;
    hideAllAttendanceScreens();
    document.getElementById('addStudentClassDisplay').textContent = cls;
    document.getElementById('addStudentFormScreen').classList.remove('attendance-hidden');
    renderStudentListInForm(cls);
}

function addNewStudent(event) {
    event.preventDefault();
    const name = document.getElementById('studentNameInput').value.trim();
    const roll = document.getElementById('studentRollInput').value.trim();
    
    if (!name || !roll) {
        showAttendanceSystemAlert('✗ Please fill all fields', 'error');
        return;
    }

    const classData = attendanceData[currentAttendanceClass];
    
    if (classData.students.length >= MAX_STUDENTS) {
        showAttendanceSystemAlert(`✗ Maximum ${MAX_STUDENTS} students reached!`, 'error');
        return;
    }

    if (classData.students.some(s => s.roll === roll.toString())) {
        showAttendanceSystemAlert('✗ Roll number already exists in this class!', 'error');
        return;
    }

    const student = {
        id: `${currentAttendanceClass}-${Date.now()}`,
        name: name,
        roll: roll.toString()
    };

    classData.students.push(student);
    saveAttendanceData();
    
    document.getElementById('studentDetailsForm').reset();
    renderStudentListInForm(currentAttendanceClass);
    showAttendanceSystemAlert('✓ Student added successfully!', 'success');
}

function renderStudentListInForm(cls) {
    const classData = attendanceData[cls];
    const countEl = document.getElementById('studentCountDisplay');
    const listEl = document.getElementById('studentListInForm');
    
    countEl.textContent = classData.students.length;
    
    if (classData.students.length === 0) {
        listEl.innerHTML = '<p style="color: #999; font-style: italic;">No students added yet</p>';
        return;
    }
    
    const students = [...classData.students].sort((a, b) => parseInt(a.roll) - parseInt(b.roll));
    listEl.innerHTML = `
        <h4 style="margin-bottom: 10px; color: #333;">Added Students:</h4>
        <ul style="list-style: none; padding: 0;">
            ${students.map(s => `
                <li style="padding: 8px; background: #f5f5f5; margin-bottom: 5px; border-radius: 5px; display: flex; justify-content: space-between; align-items: center;">
                    <span><strong>Roll ${s.roll}:</strong> ${s.name}</span>
                    <button type="button" class="attendance-btn" style="padding: 4px 8px; font-size: 12px;" onclick="deleteStudentFromClass('${s.id}', '${cls}')">🗑️</button>
                </li>
            `).join('')}
        </ul>
    `;
}

function deleteStudentFromClass(studentId, cls) {
    if (confirm('Delete this student?')) {
        attendanceData[cls].students = attendanceData[cls].students.filter(s => s.id !== studentId);
        saveAttendanceData();
        renderStudentListInForm(cls);
    }
}

// MARK ATTENDANCE WORKFLOW
function proceedToClassSelection(event) {
    event.preventDefault();
    const teacherName = document.getElementById('teacherNameInput').value.trim();
    
    if (!teacherName) {
        showAttendanceSystemAlert('✗ Please enter teacher name', 'error');
        return;
    }
    
    currentTeacherName = teacherName;
    hideAllAttendanceScreens();
    document.getElementById('displayTeacherName').textContent = teacherName;
    renderClassButtons('markAttendanceClassButtons');
    document.getElementById('markAttendanceClassSelector').classList.remove('attendance-hidden');
}

function selectClassForMarkAttendance(cls) {
    const today = new Date().toISOString().split('T')[0];
    
    if (isHoliday(today)) {
        showAttendanceSystemAlert('⚠️ Today is Sunday - An official holiday. Attendance cannot be marked.', 'error');
        return;
    }

    // Check if attendance already marked today for this class
    const classData = attendanceData[cls];
    if (classData.attendance[today] && Object.keys(classData.attendance[today].records || {}).length > 0) {
        showAttendanceSystemAlert('⚠️ Attendance has already been marked for Class ' + cls + ' today. It can only be marked once per day.', 'error');
        return;
    }

    currentAttendanceClass = cls;
    tempAttendanceMarks = {};
    
    hideAllAttendanceScreens();
    document.getElementById('markAttendanceClassDisplay').textContent = cls;
    document.getElementById('markAttendanceScreen').classList.remove('attendance-hidden');
    
    renderAttendanceMarkingList(cls);
}

function calculateAttendancePercentage(studentId, cls) {
    const classData = attendanceData[cls];
    let present = 0;
    let totalDelivered = 0;
    
    Object.entries(classData.attendance).forEach(([dateStr, dayData]) => {
        if (!isHoliday(dateStr)) {
            const records = dayData.records || {};
            // Count as a delivered class if any student has a record for this date
            if (Object.keys(records).length > 0) {
                totalDelivered++;
                if (records[studentId] === 'present') present++;
            }
        }
    });
    
    return totalDelivered === 0 ? 0 : Math.round((present / totalDelivered) * 100);
}

function getAttendanceColorClass(percentage) {
    if (percentage < 75) {
        return { color: '#ef4444', bg: '#fee2e2', text: 'Low' }; // Red
    } else if (percentage === 75) {
        return { color: '#eab308', bg: '#fef3c7', text: 'Fair' }; // Yellow
    } else {
        return { color: '#10b981', bg: '#e0fdf4', text: 'Good' }; // Green
    }
}

function renderAttendanceMarkingList(cls) {
    const classData = attendanceData[cls];
    const container = document.getElementById('attendanceListForMarking');
    
    if (classData.students.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No students in this class. Please add students first.</p>';
        return;
    }
    
    const students = [...classData.students].sort((a, b) => parseInt(a.roll) - parseInt(b.roll));
    const today = new Date().toISOString().split('T')[0];
    const isSunday = isHoliday(today);
    
    let html = '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 15px; margin-bottom: 20px;">';
    html += `<p style="text-align: center; color: #fff; margin: 0; font-weight: 600;">📅 ${new Date().toLocaleDateString('en-US', {weekday: 'long', month: 'short', day: 'numeric', year: 'numeric'})}</p>`;
    html += '</div>';
    html += '<div style="background: linear-gradient(135deg, #f5f7fa 0%, #fff 100%); padding: 20px; border-radius: 15px;">';
    
    html += students.map(student => {
        const status = tempAttendanceMarks[student.id];
        const percentage = calculateAttendancePercentage(student.id, cls);
        const colorClass = getAttendanceColorClass(percentage);
        
        return `
            <div style="padding: 15px; margin-bottom: 12px; background: #fff; border-radius: 12px; border-left: 5px solid ${colorClass.color}; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center;">
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: #1f2937; margin-bottom: 5px;">Roll ${student.roll}: ${student.name}</div>
                    <div style="font-size: 12px; color: #6b7280;">
                        <span style="display: inline-block; padding: 4px 12px; background: ${colorClass.bg}; color: ${colorClass.color}; border-radius: 20px; font-weight: 600;">${percentage}% Attendance</span>
                    </div>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button type="button" class="attendance-btn" 
                            onclick="markStudentAttendance('${student.id}', 'present')" 
                            style="padding: 8px 16px; background: ${status === 'present' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#e5e7eb'}; color: ${status === 'present' ? '#fff' : '#4b5563'}; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s;">
                        ✓ Present
                    </button>
                    <button type="button" class="attendance-btn" 
                            onclick="markStudentAttendance('${student.id}', 'absent')" 
                            style="padding: 8px 16px; background: ${status === 'absent' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : '#e5e7eb'}; color: ${status === 'absent' ? '#fff' : '#4b5563'}; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s;">
                        ✗ Absent
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    html += '</div>';
    container.innerHTML = html;
}

function markStudentAttendance(studentId, status) {
    if (tempAttendanceMarks[studentId] === status) {
        delete tempAttendanceMarks[studentId];
    } else {
        tempAttendanceMarks[studentId] = status;
    }
    renderAttendanceMarkingList(currentAttendanceClass);
}

function submitMarkedAttendance() {
    const today = new Date().toISOString().split('T')[0];
    const classData = attendanceData[currentAttendanceClass];
    const markedCount = Object.keys(tempAttendanceMarks).length;
    
    if (markedCount === 0) {
        showAttendanceSystemAlert('✗ Please mark attendance for at least one student!', 'error');
        return;
    }

    // Prevent marking attendance more than once per day
    if (classData.attendance[today] && Object.keys(classData.attendance[today].records || {}).length > 0) {
        showAttendanceSystemAlert('⚠️ Attendance already marked for today. It can only be marked once per day.', 'error');
        return;
    }
    
    if (!classData.attendance[today]) {
        classData.attendance[today] = { records: {}, markedBy: '', markedAt: '' };
    }
    
    Object.keys(tempAttendanceMarks).forEach(studentId => {
        classData.attendance[today].records[studentId] = tempAttendanceMarks[studentId];
    });
    
    classData.attendance[today].markedBy = currentTeacherName;
    classData.attendance[today].markedAt = new Date().toLocaleString();
    
    saveAttendanceData();
    showAttendanceSystemAlert(`✓ Attendance submitted! ${markedCount} student(s) marked.`, 'success');
    
    setTimeout(() => {
        currentTeacherName = '';
        goBackToMainMenu();
    }, 2000);
}

function resetMarkedAttendance() {
    if (confirm('Reset all attendance marks? This action cannot be undone.')) {
        tempAttendanceMarks = {};
        renderAttendanceMarkingList(currentAttendanceClass);
        showAttendanceSystemAlert('✓ All marks reset', 'info');
    }
}

// VIEW ATTENDANCE WORKFLOW
function selectClassForViewAttendance(cls) {
    currentAttendanceClass = cls;
    hideAllAttendanceScreens();
    document.getElementById('viewAttendanceClassDisplay').textContent = cls;
    document.getElementById('attendanceViewDateFilter').valueAsDate = new Date();
    document.getElementById('viewAttendanceScreen').classList.remove('attendance-hidden');
    updateViewAttendanceTable();
}

function updateViewAttendanceTable() {
    const cls = currentAttendanceClass;
    const classData = attendanceData[cls];
    const selectedDate = document.getElementById('attendanceViewDateFilter').value;
    const container = document.getElementById('viewAttendanceTableContainer');
    
    if (classData.students.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No students in this class.</p>';
        return;
    }
    
    const isSunday = isHoliday(selectedDate);
    const attendanceForDate = classData.attendance[selectedDate] || { records: {}, markedBy: '', markedAt: '' };
    const records = attendanceForDate.records || {};
    const students = [...classData.students].sort((a, b) => parseInt(a.roll) - parseInt(b.roll));
    
    const formattedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    let html = '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 15px; margin-bottom: 20px;">';
    html += `<h3 style="color: #fff; margin: 0 0 10px 0; display: flex; justify-content: space-between; align-items: center;">`;
    html += `<span>📊 Attendance Report - Class ${cls}</span>`;
    html += `</h3>`;
    html += `<p style="color: rgba(255,255,255,0.9); margin: 5px 0; font-weight: 500;">${formattedDate}</p>`;
    html += '</div>';
    
    // Calculate overall attendance stats for the class
    let totalClassesDelivered = 0;
    let totalClassesAttended = 0;
    let totalPossible = 0;
    Object.entries(classData.attendance).forEach(([dateStr, dayData]) => {
        if (!isHoliday(dateStr)) {
            const recs = dayData.records || {};
            const hasAnyRecord = Object.keys(recs).length > 0;
            if (hasAnyRecord) {
                totalClassesDelivered++;
                students.forEach(st => {
                    if (recs[st.id] !== undefined) {
                        totalPossible++;
                        if (recs[st.id] === 'present') totalClassesAttended++;
                    }
                });
            }
        }
    });
    const overallPercentage = totalPossible === 0 ? 0 : Math.round((totalClassesAttended / totalPossible) * 100);
    const overallColor = getAttendanceColorClass(overallPercentage);

    html += `<div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px;">
        <div style="flex: 1; min-width: 140px; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); padding: 16px; border-radius: 12px; text-align: center;">
            <div style="font-size: 28px; font-weight: 800; color: #0369a1;">${totalClassesDelivered}</div>
            <div style="font-size: 12px; font-weight: 600; color: #0c4a6e; margin-top: 4px;">Classes Delivered</div>
        </div>
        <div style="flex: 1; min-width: 140px; background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); padding: 16px; border-radius: 12px; text-align: center;">
            <div style="font-size: 28px; font-weight: 800; color: #15803d;">${totalClassesAttended}</div>
            <div style="font-size: 12px; font-weight: 600; color: #14532d; margin-top: 4px;">Total Present</div>
        </div>
        <div style="flex: 1; min-width: 140px; background: linear-gradient(135deg, ${overallColor.bg} 0%, ${overallColor.bg} 100%); padding: 16px; border-radius: 12px; text-align: center; border: 2px solid ${overallColor.color};">
            <div style="font-size: 28px; font-weight: 800; color: ${overallColor.color};">${overallPercentage}%</div>
            <div style="font-size: 12px; font-weight: 600; color: ${overallColor.color}; margin-top: 4px;">Overall Attendance</div>
        </div>
    </div>
    <div style="background: #f1f5f9; border-radius: 10px; height: 14px; overflow: hidden; margin-bottom: 20px;">
        <div style="height: 100%; width: ${overallPercentage}%; background: linear-gradient(90deg, ${overallColor.color}, ${overallColor.color}cc); border-radius: 10px; transition: width 0.5s;"></div>
    </div>`;

    let html2 = '<div style="background: linear-gradient(135deg, #f5f7fa 0%, #fff 100%); padding: 20px; border-radius: 15px;">';
    
    if (isSunday) {
        html2 += '<div style="padding: 15px; background: linear-gradient(135deg, #fed7aa 0%, #fecaca 100%); border: 2px solid #f97316; border-radius: 12px; margin: 15px 0; color: #b45309; font-weight: 600;">🔴 SUNDAY - Official Holiday (No attendance marked)</div>';
    } else if (attendanceForDate.markedBy) {
        html2 += `<div style="padding: 15px; background: linear-gradient(135deg, #e0f2fe 0%, #cffafe 100%); border-left: 5px solid #0284c7; margin: 15px 0; border-radius: 10px;">
            <p style="margin: 5px 0; font-size: 14px; font-weight: 600; color: #0c4a6e;"><strong>✓ Marked By:</strong> ${attendanceForDate.markedBy}</p>
            <p style="margin: 5px 0; font-size: 14px; color: #0c4a6e;"><strong>⏰ Marked At:</strong> ${attendanceForDate.markedAt}</p>
        </div>`;
    } else {
        html2 += '<div style="padding: 15px; background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border: 2px dashed #dc2626; border-radius: 10px; margin: 15px 0; color: #991b1b; font-weight: 600;">⚠️ No attendance marked for this date</div>';
    }
    
    html2 += '<table style="width: 100%; border-collapse: collapse; margin-top: 20px;">';
    html2 += '<thead><tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;"><th style="padding: 12px; text-align: left; border-radius: 8px 0 0 0;"><strong>Roll #</strong></th><th style="padding: 12px; text-align: left;"><strong>Student Name</strong></th><th style="padding: 12px; text-align: center;"><strong>Attendance</strong></th><th style="padding: 12px; text-align: center; border-radius: 0 8px 0 0;"><strong>Status</strong></th></tr></thead>';
    html2 += '<tbody>';
    
    students.forEach((student, index) => {
        const status = records[student.id];
        const percentage = calculateAttendancePercentage(student.id, cls);
        const colorClass = getAttendanceColorClass(percentage);
        
        let statusBadge = '❓ Not Marked';
        let statusColor = '#6b7280';
        let statusBg = '#f3f4f6';
        
        if (isSunday) {
            statusBadge = '🔴 Holiday';
            statusColor = '#f97316';
            statusBg = '#fed7aa';
        } else if (status === 'present') {
            statusBadge = '✅ Present';
            statusColor = '#10b981';
            statusBg = '#e0fdf4';
        } else if (status === 'absent') {
            statusBadge = '❌ Absent';
            statusColor = '#ef4444';
            statusBg = '#fee2e2';
        }
        
        const rowBg = index % 2 === 0 ? '#f9fafb' : '#fff';
        
        html2 += `<tr style="border-bottom: 1px solid #e5e7eb; background: ${rowBg};">
            <td style="padding: 12px; color: #374151; font-weight: 600;">${student.roll}</td>
            <td style="padding: 12px; color: #1f2937;">${student.name}</td>
            <td style="padding: 12px; text-align: center;">
                <div style="display: inline-block; padding: 6px 14px; background: ${colorClass.bg}; color: ${colorClass.color}; border-radius: 20px; font-weight: 700; font-size: 13px;">
                    ${percentage}%
                </div>
            </td>
            <td style="padding: 12px; text-align: center;">
                <span style="display: inline-block; padding: 6px 12px; background: ${statusBg}; color: ${statusColor}; border-radius: 8px; font-weight: 600; font-size: 13px;">${statusBadge}</span>
            </td>
        </tr>`;
    });
    
    html2 += '</tbody></table>';
    html2 += '</div>';
    
    container.innerHTML = html + html2;
}

// UTILITY FUNCTIONS
function renderClassButtons(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = CLASSES.map(cls => `
        <button type="button" class="attendance-class-btn" onclick="handleClassSelection('${cls}', '${containerId}')">
            Class ${cls}
        </button>
    `).join('');
}

function handleClassSelection(cls, containerId) {
    if (containerId.includes('addStudent')) {
        selectClassForAddStudent(cls);
    } else if (containerId.includes('markAttendance')) {
        selectClassForMarkAttendance(cls);
    } else if (containerId.includes('viewAttendance')) {
        selectClassForViewAttendance(cls);
    }
}

function showAttendanceSystemAlert(message, type = 'info') {
    showToast(message);
}

// EVENT LISTENERS FOR NAVIGATION
document.addEventListener('DOMContentLoaded', function() {
    loadAttendanceData();
});