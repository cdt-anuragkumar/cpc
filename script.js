function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const menuBtn = document.getElementById('menuBtn');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    menuBtn.classList.toggle('active');
}

function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the selected section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update navigation active state
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Find and activate the corresponding nav link
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

function uploadPhoto(teacherId) {
    const fileInput = document.getElementById(teacherId + '-upload');
    const file = fileInput.files[0];
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = document.getElementById(teacherId + '-img');
            const placeholder = document.getElementById(teacherId + '-placeholder');
            
            img.src = e.target.result;
            img.style.display = 'block';
            placeholder.style.display = 'none';
            
            // Store the image in localStorage to persist across sessions
            localStorage.setItem(teacherId + '-photo', e.target.result);
        };
        
        reader.readAsDataURL(file);
    }
}

function uploadFounderPhoto() {
    const fileInput = document.getElementById('founder-photo-upload');
    const file = fileInput.files[0];
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = document.getElementById('founder-photo-img');
            const placeholder = document.getElementById('founder-photo-placeholder');
            
            img.src = e.target.result;
            img.style.display = 'block';
            placeholder.style.display = 'none';
            
            // Store the image in localStorage to persist across sessions
            localStorage.setItem('founder-photo', e.target.result);
        };
        
        reader.readAsDataURL(file);
    }
}

// Load saved photos from localStorage when page loads
window.addEventListener('DOMContentLoaded', function() {
    const teacherIds = [
        'physics-teacher1', 'physics-teacher2',
        'chemistry-teacher1',
        'biology-teacher1',
        'mathematics-teacher1', 'mathematics-teacher2',
        'english-teacher1',
        'social-teacher1'
    ];
    
    teacherIds.forEach(function(teacherId) {
        const savedPhoto = localStorage.getItem(teacherId + '-photo');
        if (savedPhoto) {
            const img = document.getElementById(teacherId + '-img');
            const placeholder = document.getElementById(teacherId + '-placeholder');
            
            if (img && placeholder) {
                img.src = savedPhoto;
                img.style.display = 'block';
                placeholder.style.display = 'none';
            }
        }
    });

    // Load founder photo
    const founderPhoto = localStorage.getItem('founder-photo');
    if (founderPhoto) {
        const img = document.getElementById('founder-photo-img');
        const placeholder = document.getElementById('founder-photo-placeholder');
        
        if (img && placeholder) {
            img.src = founderPhoto;
            img.style.display = 'block';
            placeholder.style.display = 'none';
        }
    }
});

window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
        if (event.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
}

// Highlight current nav link
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.href.includes('cpc.html') || link.href.endsWith('/')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// Attendance Functions
function viewAttendance(subject) {
    // Close teacher modal
    closeTeacherModal(subject);
    
    // Open class selection for viewing attendance
    openModal('classSelection');
    // Store the action type
    sessionStorage.setItem('attendanceAction', 'view');
    sessionStorage.setItem('subject', subject);
}

function markAttendancePrompt() {
    // Close current teacher modal
    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(modal => modal.classList.remove('active'));
    
    // Determine subject from the modal that was open
    let subject = '';
    const teacherModals = ['physicsModal', 'chemistryModal', 'biologyModal', 'mathematicsModal', 'englishModal', 'socialModal'];
    teacherModals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal && modal.classList.contains('active')) {
            subject = modalId.replace('Modal', '');
        }
    });
    
    // Store the subject
    sessionStorage.setItem('subject', subject);
    
    // Open password modal
    openModal('password');
}

function checkPassword() {
    const password = document.getElementById('attendancePassword').value;
    const errorElement = document.getElementById('passwordError');
    
    if (password === 'Anurag@123') {
        closeModal('password');
        openModal('classSelection');
        sessionStorage.setItem('attendanceAction', 'mark');
        document.getElementById('attendancePassword').value = '';
        errorElement.style.display = 'none';
    } else {
        errorElement.style.display = 'block';
    }
}

function selectClass(classNum) {
    console.log('selectClass called with:', classNum);
    closeModal('classSelection');
    
    const action = sessionStorage.getItem('attendanceAction');
    const subject = sessionStorage.getItem('subject');
    
    console.log('Action:', action, 'Subject:', subject);
    
    // Store the selected class for later use
    sessionStorage.setItem('selectedClass', classNum);
    
    if (action === 'view') {
        openModal('viewAttendance');
        showAttendanceRecords(subject, classNum);
    } else if (action === 'mark') {
        // Populate the modal content first, then open it
        console.log('Calling showMarkAttendanceInterface');
        showMarkAttendanceInterface(subject, classNum);
        openModal('markAttendance');
    }
}

function showAttendanceRecords(subject, classNum) {
    const recordsDiv = document.getElementById('attendanceRecords');
    const today = new Date().toISOString().split('T')[0];
    
    recordsDiv.innerHTML = `
        <h3>Present Students - ${subject.charAt(0).toUpperCase() + subject.slice(1)} - Class ${classNum}</h3>
        <div id="dataSourceIndicator" class="data-indicator"></div>
        <div class="date-selector">
            <label for="attendanceViewDate">Select Date:</label>
            <input type="date" id="attendanceViewDate" value="${today}" onchange="updateAttendanceView('${subject}', ${classNum})">
        </div>
        <div class="attendance-summary" id="presentSummary">
            <div class="summary-item">
                <span class="summary-label">Total Present:</span>
                <span class="summary-value" id="present-count-view">0</span>
            </div>
        </div>
        <div class="attendance-table">
            <table id="attendanceTable">
                <thead>
                    <tr>
                        <th>Serial No.</th>
                        <th>Roll No.</th>
                        <th>Student Name</th>
                        <th>Class</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody id="attendanceTableBody">
                    <!-- Present students will be populated here -->
                </tbody>
            </table>
        </div>
    `;
    
    // Load initial data for today
    updateAttendanceView(subject, classNum);
}

function updateAttendanceView(subject, classNum) {
    const selectedDate = document.getElementById('attendanceViewDate').value;
    const tableBody = document.getElementById('attendanceTableBody');
    const dataIndicator = document.getElementById('dataSourceIndicator');
    
    // Check for stored attendance data
    const attendanceKey = `attendance_${subject}_${classNum}_${selectedDate}`;
    const storedData = localStorage.getItem(attendanceKey);
    
    let attendanceData;
    let isRealData = false;
    
    if (storedData) {
        // Use stored attendance data
        isRealData = true;
        const markedAttendance = JSON.parse(storedData);
        
        // Get the actual students for this class
        const students = getStudentsForClass(classNum);
        
        // Create attendance data from marked records and filter only present students
        attendanceData = students
            .filter(student => markedAttendance[student.rollNo] === 'Present')
            .map((student, index) => ({
                serialNo: index + 1,
                rollNo: student.rollNo,
                name: student.name,
                status: 'Present'
            }));
    } else {
        // Fallback to sample data for demonstration - filter only present students
        const sampleData = {
            '2024-01-15': [
                { rollNo: '001', name: 'Aarav Sharma', status: 'Present' },
                { rollNo: '002', name: 'Vihaan Gupta', status: 'Present' },
                { rollNo: '004', name: 'Reyansh Patel', status: 'Present' },
                { rollNo: '005', name: 'Ishaan Kumar', status: 'Present' },
                { rollNo: '006', name: 'Advait Joshi', status: 'Present' },
                { rollNo: '008', name: 'Kabir Verma', status: 'Present' }
            ],
            '2024-01-16': [
                { rollNo: '001', name: 'Aarav Sharma', status: 'Present' },
                { rollNo: '002', name: 'Vihaan Gupta', status: 'Present' },
                { rollNo: '003', name: 'Arjun Singh', status: 'Present' },
                { rollNo: '004', name: 'Reyansh Patel', status: 'Present' },
                { rollNo: '005', name: 'Ishaan Kumar', status: 'Present' },
                { rollNo: '006', name: 'Advait Joshi', status: 'Present' },
                { rollNo: '007', name: 'Arnav Agarwal', status: 'Present' },
                { rollNo: '008', name: 'Kabir Verma', status: 'Present' }
            ],
            '2024-01-17': [
                { rollNo: '001', name: 'Aarav Sharma', status: 'Present' },
                { rollNo: '002', name: 'Vihaan Gupta', status: 'Present' },
                { rollNo: '004', name: 'Reyansh Patel', status: 'Present' },
                { rollNo: '005', name: 'Ishaan Kumar', status: 'Present' },
                { rollNo: '006', name: 'Advait Joshi', status: 'Present' },
                { rollNo: '007', name: 'Arnav Agarwal', status: 'Present' }
            ]
        };
        
        const rawData = sampleData[selectedDate] || [];
        attendanceData = rawData
            .filter(student => student.status === 'Present')
            .map((student, index) => ({
                serialNo: index + 1,
                rollNo: student.rollNo,
                name: student.name,
                status: 'Present'
            }));
    }
    
    // Update data source indicator
    if (isRealData) {
        dataIndicator.innerHTML = '<span class="real-data">📝 Real attendance data marked by teacher</span>';
    } else if (attendanceData.length > 0) {
        dataIndicator.innerHTML = '<span class="sample-data">📊 Sample data for demonstration</span>';
    } else {
        dataIndicator.innerHTML = '<span class="no-data">❌ No present students found for this date</span>';
    }
    
    // Update present count
    document.getElementById('present-count-view').textContent = attendanceData.length;
    
    // Generate table rows
    const rows = attendanceData.map(student => `
        <tr>
            <td>${student.serialNo}</td>
            <td>${student.rollNo}</td>
            <td>${student.name}</td>
            <td>${classNum}</td>
            <td>${selectedDate}</td>
        </tr>
    `).join('');
    
    tableBody.innerHTML = rows;
}

function showMarkAttendanceInterface(subject, classNum) {
    console.log('showMarkAttendanceInterface called with:', subject, classNum);
    
    const contentDiv = document.getElementById('markAttendanceContent');
    if (!contentDiv) {
        console.error('markAttendanceContent div not found');
        return;
    }
    
    const today = new Date().toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Get students for the selected class
    const students = getStudentsForClass(classNum);
    
    // Store students globally for other functions
    window.currentStudents = students;
    
    // Generate table rows dynamically
    const tableRows = students.map((student, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${student.rollNo}</td>
            <td>${student.name}</td>
            <td>${classNum}</td>
            <td id="status-${student.rollNo}">Not Marked</td>
            <td>
                <div class="attendance-buttons">
                    <button class="btn-present" onclick="markStudent(${student.rollNo}, 'Present')">Present</button>
                    <button class="btn-absent" onclick="markStudent(${student.rollNo}, 'Absent')">Absent</button>
                </div>
            </td>
        </tr>
    `).join('');
    
    contentDiv.innerHTML = `
        <div class="attendance-header">
            <h3>Mark Attendance for ${subject.charAt(0).toUpperCase() + subject.slice(1)} - Class ${classNum}</h3>
            <div class="attendance-date">Date: ${today}</div>
        </div>
        <div class="attendance-table">
            <table>
                <thead>
                    <tr>
                        <th>Serial No.</th>
                        <th>Roll Number</th>
                        <th>Student Name</th>
                        <th>Class</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </div>
        <div class="attendance-summary">
            <div class="summary-item">
                <span class="summary-label">Total Students:</span>
                <span class="summary-value" id="total-students">${students.length}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Present:</span>
                <span class="summary-value" id="present-count">0</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Absent:</span>
                <span class="summary-value" id="absent-count">0</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Not Marked:</span>
                <span class="summary-value" id="not-marked-count">${students.length}</span>
            </div>
        </div>
        <div class="attendance-actions">
            <button class="btn-primary" onclick="submitAttendance()">Submit Attendance</button>
            <button class="btn-secondary" onclick="markAllPresent()">Mark All Present</button>
            <button class="btn-secondary" onclick="clearAll()">Clear All</button>
        </div>
    `;
    
    console.log('Content populated successfully');
    
    // Initialize attendance tracking
    window.attendanceData = {};
    window.totalStudents = students.length;
}

function getStudentsForClass(classNum) {
    // Sample student data for each class
    const classStudents = {
        6: [
            { rollNo: '001', name: 'Aarav Sharma' },
            { rollNo: '002', name: 'Vihaan Gupta' },
            { rollNo: '003', name: 'Arjun Singh' },
            { rollNo: '004', name: 'Reyansh Patel' },
            { rollNo: '005', name: 'Ishaan Kumar' },
            { rollNo: '006', name: 'Advait Joshi' },
            { rollNo: '007', name: 'Arnav Agarwal' },
            { rollNo: '008', name: 'Kabir Verma' },
            { rollNo: '009', name: 'Anaya Mishra' },
            { rollNo: '010', name: 'Diya Choudhary' }
        ],
        7: [
            { rollNo: '101', name: 'Saanvi Reddy' },
            { rollNo: '102', name: 'Aanya Nair' },
            { rollNo: '103', name: 'Pari Mehta' },
            { rollNo: '104', name: 'Anika Shah' },
            { rollNo: '105', name: 'Navya Jain' },
            { rollNo: '106', name: 'Aaradhya Rao' },
            { rollNo: '107', name: 'Myra Kapoor' },
            { rollNo: '108', name: 'Sara Khan' },
            { rollNo: '109', name: 'Zara Ali' },
            { rollNo: '110', name: 'Riya Das' }
        ],
        8: [
            { rollNo: '201', name: 'Aditya Roy' },
            { rollNo: '202', name: 'Veer Malhotra' },
            { rollNo: '203', name: 'Rohan Saxena' },
            { rollNo: '204', name: 'Aryan Chauhan' },
            { rollNo: '205', name: 'Devansh Bhatia' },
            { rollNo: '206', name: 'Rudra Thakur' },
            { rollNo: '207', name: 'Atharv Pandey' },
            { rollNo: '208', name: 'Kartik Yadav' },
            { rollNo: '209', name: 'Shaurya Gill' },
            { rollNo: '210', name: 'Prateek Sharma' }
        ],
        9: [
            { rollNo: '301', name: 'Ishita Singh' },
            { rollNo: '302', name: 'Kavya Gupta' },
            { rollNo: '303', name: 'Anushka Patel' },
            { rollNo: '304', name: 'Priya Kumar' },
            { rollNo: '305', name: 'Sneha Joshi' },
            { rollNo: '306', name: 'Tanya Agarwal' },
            { rollNo: '307', name: 'Ritika Verma' },
            { rollNo: '308', name: 'Pooja Mishra' },
            { rollNo: '309', name: 'Neha Choudhary' },
            { rollNo: '310', name: 'Simran Reddy' }
        ],
        10: [
            { rollNo: '401', name: 'Rahul Nair' },
            { rollNo: '402', name: 'Vikram Mehta' },
            { rollNo: '403', name: 'Arjun Shah' },
            { rollNo: '404', name: 'Karan Jain' },
            { rollNo: '405', name: 'Rishi Rao' },
            { rollNo: '406', name: 'Amit Kapoor' },
            { rollNo: '407', name: 'Suresh Khan' },
            { rollNo: '408', name: 'Rajesh Ali' },
            { rollNo: '409', name: 'Manoj Das' },
            { rollNo: '410', name: 'Sunil Roy' }
        ],
        11: [
            { rollNo: '501', name: 'Nisha Malhotra' },
            { rollNo: '502', name: 'Meera Saxena' },
            { rollNo: '503', name: 'Kritika Chauhan' },
            { rollNo: '504', name: 'Alisha Bhatia' },
            { rollNo: '505', name: 'Shreya Thakur' },
            { rollNo: '506', name: 'Divya Pandey' },
            { rollNo: '507', name: 'Ruchi Yadav' },
            { rollNo: '508', name: 'Swati Gill' },
            { rollNo: '509', name: 'Preeti Sharma' },
            { rollNo: '510', name: 'Anjali Singh' }
        ],
        12: [
            { rollNo: '601', name: 'Aman Gupta' },
            { rollNo: '602', name: 'Rohit Patel' },
            { rollNo: '603', name: 'Sandeep Kumar' },
            { rollNo: '604', name: 'Vivek Joshi' },
            { rollNo: '605', name: 'Naveen Agarwal' },
            { rollNo: '606', name: 'Deepak Verma' },
            { rollNo: '607', name: 'Raj Kumar' },
            { rollNo: '608', name: 'Santosh Mishra' },
            { rollNo: '609', name: 'Vinod Choudhary' },
            { rollNo: '610', name: 'Mahesh Reddy' }
        ]
    };
    
    return classStudents[classNum] || [
        { rollNo: '001', name: 'Sample Student 1' },
        { rollNo: '002', name: 'Sample Student 2' },
        { rollNo: '003', name: 'Sample Student 3' }
    ];
}

function submitAttendance() {
    const attendanceData = window.attendanceData || {};
    const totalStudents = window.totalStudents || 8;
    const markedStudents = Object.keys(attendanceData).length;
    
    if (markedStudents === 0) {
        alert('Please mark attendance for at least one student before submitting.');
        return;
    }
    
    if (markedStudents < totalStudents) {
        if (!confirm(`You have marked ${markedStudents} out of ${totalStudents} students. Do you want to submit anyway?`)) {
            return;
        }
    }
    
    // Save attendance data to localStorage
    const subject = sessionStorage.getItem('subject');
    const classNum = sessionStorage.getItem('selectedClass');
    const today = new Date().toISOString().split('T')[0];
    
    const attendanceKey = `attendance_${subject}_${classNum}_${today}`;
    localStorage.setItem(attendanceKey, JSON.stringify(attendanceData));
    
    alert('Attendance submitted successfully!');
    closeModal('markAttendance');
}

function markStudent(rollNo, status) {
    const statusCell = document.getElementById(`status-${rollNo}`);
    const presentBtn = statusCell.nextElementSibling.querySelector('.btn-present');
    const absentBtn = statusCell.nextElementSibling.querySelector('.btn-absent');
    
    // Update status display
    if (status === 'Present') {
        statusCell.innerHTML = '<span class="status-present">Present</span>';
        statusCell.className = 'status-present-cell';
        presentBtn.classList.add('active');
        absentBtn.classList.remove('active');
    } else {
        statusCell.innerHTML = '<span class="status-absent">Absent</span>';
        statusCell.className = 'status-absent-cell';
        absentBtn.classList.add('active');
        presentBtn.classList.remove('active');
    }
    
    // Store attendance data
    if (!window.attendanceData) window.attendanceData = {};
    window.attendanceData[rollNo] = status;
    
    // Update summary
    updateAttendanceSummary();
}

function updateAttendanceSummary() {
    const attendanceData = window.attendanceData || {};
    const totalStudents = window.totalStudents || 0;
    const presentCount = Object.values(attendanceData).filter(status => status === 'Present').length;
    const absentCount = Object.values(attendanceData).filter(status => status === 'Absent').length;
    const notMarkedCount = totalStudents - presentCount - absentCount;
    
    document.getElementById('present-count').textContent = presentCount;
    document.getElementById('absent-count').textContent = absentCount;
    document.getElementById('not-marked-count').textContent = notMarkedCount;
}

function markAllPresent() {
    const students = window.currentStudents || [];
    students.forEach(student => {
        markStudent(student.rollNo, 'Present');
    });
}

function clearAll() {
    if (confirm('Are you sure you want to clear all attendance marks?')) {
        window.attendanceData = {};
        
        const students = window.currentStudents || [];
        students.forEach(student => {
            const statusCell = document.getElementById(`status-${student.rollNo}`);
            if (statusCell) {
                const buttons = statusCell.nextElementSibling.querySelectorAll('button');
                
                statusCell.innerHTML = 'Not Marked';
                statusCell.className = '';
                buttons.forEach(btn => btn.classList.remove('active'));
            }
        });
        
        updateAttendanceSummary();
    }
}