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
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
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
    const modal = document.getElementById('toppersModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function openTeacherModal(subject) {
    const modal = document.getElementById(subject + 'Modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeTeacherModal(subject) {
    const modal = document.getElementById(subject + 'Modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
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
    document.getElementById('attendanceDateDisplay').textContent = `📅 ${dateStr}`;
}

function showAttendanceAlert(message, type = 'info') {
    const alert = document.getElementById('alert');
    alert.textContent = message;
    alert.className = `attendance-alert attendance-alert-${type} show`;
    setTimeout(() => {
        alert.classList.remove('show');
    }, 3000);
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
    document.getElementById('teacherNameScreen').classList.remove('attendance-hidden');
    document.getElementById('teacherNameInput').focus();
}

function startViewAttendance() {
    hideAllAttendanceScreens();
    renderClassButtons('viewAttendanceClassButtons');
    document.getElementById('viewAttendanceClassSelector').classList.remove('attendance-hidden');
}

function goBackToMainMenu() {
    hideAllAttendanceScreens();
    document.getElementById('attendanceMainMenu').classList.remove('attendance-hidden');
    document.getElementById('passwordInputField').value = '';
    document.getElementById('teacherNameInput').value = '';
}

function goBackToClassSelection(mode) {
    hideAllAttendanceScreens();
    if (mode === 'addStudent') {
        document.getElementById('addStudentClassSelector').classList.remove('attendance-hidden');
    } else if (mode === 'markAttendance') {
        document.getElementById('markAttendanceClassSelector').classList.remove('attendance-hidden');
    } else if (mode === 'viewAttendance') {
        document.getElementById('viewAttendanceClassSelector').classList.remove('attendance-hidden');
    }
}

function hideAllAttendanceScreens() {
    const screens = [
        'attendanceMainMenu',
        'passwordScreen',
        'addStudentClassSelector',
        'addStudentFormScreen',
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
    let total = 0;
    
    Object.entries(classData.attendance).forEach(([dateStr, attendanceData]) => {
        if (!isHoliday(dateStr)) {
            const records = attendanceData.records || {};
            if (records[studentId] !== undefined) {
                total++;
                if (records[studentId] === 'present') present++;
            }
        }
    });
    
    return total === 0 ? 0 : Math.round((present / total) * 100);
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
    // Use browser alert as fallback for system alerts
    if (type === 'error') {
        alert(message);
    } else {
        console.log(message);
    }
}

// EVENT LISTENERS FOR NAVIGATION
document.addEventListener('DOMContentLoaded', function() {
    loadAttendanceData();
});