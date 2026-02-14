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
});