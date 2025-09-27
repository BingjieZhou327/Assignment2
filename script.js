class StudentManagementSystem {
    constructor() {
        this.students = [];
        this.selectedRows = new Set();
        this.nextStudentId = 4;
        this.currentEditingStudent = null;
        
        this.init();
    }

    init() {
        this.initializeElements();
        this.loadInitialData();
        this.bindEvents();
        this.renderTable();
        console.log('Student management system initialized');
    }

    initializeElements() {
        this.tableBody = document.getElementById('tableBody');
        this.submitBtn = document.getElementById('submitBtn');
        this.addStudentBtn = document.getElementById('addStudentBtn');
    }

    loadInitialData() {
        this.students = [
            {
                id: 1,
                name: 'Student 1',
                advisor: 'Teacher 1',
                awardStatus: 'Approved',
                semester: 'Fall',
                type: 'TA',
                budget: '12345',
                percentage: '100%',
                details: {
                    awardDetails: 'Honors Student',
                    period: 'Fall 1-2024(TA)',
                    comments: 'Outstanding',
                    status: 'A'
                }
            },
            {
                id: 2,
                name: 'Student 2',
                advisor: 'Teacher 2',
                awardStatus: 'Approved',
                semester: 'Fall',
                type: 'TA',
                budget: '23456',
                percentage: '100%',
                details: {
                    awardDetails: 'Honors Student',
                    period: 'Fall 1-2024(TA)',
                    comments: 'Outstanding',
                    status: 'A'
                }
            },
            {
                id: 3,
                name: 'Student 3',
                advisor: 'Teacher 3',
                awardStatus: 'Approved',
                semester: 'Fall',
                type: 'TA',
                budget: '34567',
                percentage: '100%',
                details: {
                    awardDetails: 'Honors Student',
                    period: 'Fall 1-2024(TA)',
                    comments: 'Outstanding',
                    status: 'A'
                }
            }
        ];
    }

    bindEvents() {
        this.addStudentBtn.addEventListener('click', () => this.addNewStudent());
        this.submitBtn.addEventListener('click', () => this.submitSelectedAwards());
    }

    addNewStudent() {
        console.log('Add new student clicked');
    }

    submitSelectedAwards() {
        console.log('Submit selected awards clicked');
    }

    renderTable() {
        this.tableBody.innerHTML = '';
        
        this.students.forEach(student => {
            const studentRow = this.createStudentRow(student);
            this.tableBody.appendChild(studentRow);
            
            const detailsRow = this.createDetailsRow(student);
            this.tableBody.appendChild(detailsRow);
        });
    }

    createStudentRow(student) {
        const row = document.createElement('tr');
        row.className = 'student-row';
        row.setAttribute('data-student-id', student.id);
        
        row.innerHTML = `
            <td class="checkbox-col">
                <input type="checkbox" class="row-checkbox" data-row="${student.id}">
                <span class="expand-arrow" data-row="${student.id}">▼</span>
            </td>
            <td>${student.name}</td>
            <td>${student.advisor}</td>
            <td>${student.awardStatus}</td>
            <td>${student.semester}</td>
            <td>${student.type}</td>
            <td>${student.budget}</td>
            <td>${student.percentage}</td>
            <td class="action-col delete-col"></td>
            <td class="action-col edit-col"></td>
        `;
        
        return row;
    }

    createDetailsRow(student) {
        const row = document.createElement('tr');
        row.className = 'details-row';
        row.setAttribute('data-student-id', student.id);
        row.style.display = 'none';
        
        row.innerHTML = `
            <td colspan="10">
                <div class="student-details">
                    <h4>${student.name} Details:</h4>
                    <p><strong>Award Details:</strong> ${student.details.awardDetails}</p>
                    <p><strong>${student.details.period}</strong></p>
                    <p><strong>Comments:</strong> ${student.details.comments}</p>
                    <p><strong>Award Status:</strong> ${student.details.status}</p>
                </div>
            </td>
        `;
        
        return row;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, initializing student management system...');
    window.studentSystem = new StudentManagementSystem();
});