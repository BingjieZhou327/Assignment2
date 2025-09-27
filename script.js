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
        this.updateSubmitButtonState();
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
        this.bindRowEvents();
    }

    bindRowEvents() {
        document.querySelectorAll('.row-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.handleCheckboxChange(e));
        });

        document.querySelectorAll('.expand-arrow').forEach(arrow => {
            arrow.addEventListener('click', (e) => this.handleRowExpand(e));
        });
    }

    addNewStudent() {
        console.log('Add new student clicked');
    }

    submitSelectedAwards() {
        if (this.selectedRows.size === 0) {
            alert('Please select at least one student');
            return;
        }

        const selectedStudents = Array.from(this.selectedRows)
            .map(id => this.students.find(s => s.id === id))
            .filter(s => s)
            .map(s => s.name);

        alert(`Successfully submitted ${this.selectedRows.size} student scholarship applications:\n${selectedStudents.join(', ')}`);
    }

    handleCheckboxChange(event) {
        const checkbox = event.target;
        const rowId = parseInt(checkbox.dataset.row);
        const studentRow = document.querySelector(`tr.student-row[data-student-id="${rowId}"]`);

        if (checkbox.checked) {
            this.selectedRows.add(rowId);
            studentRow.classList.add('selected');
            this.createActionButtons(rowId);
        } else {
            this.selectedRows.delete(rowId);
            studentRow.classList.remove('selected');
            this.removeActionButtons(rowId);
        }

        this.updateSubmitButtonState();
    }

    handleRowExpand(event) {
        const arrow = event.target;
        const rowId = parseInt(arrow.dataset.row);
        const detailsRow = document.querySelector(`tr.details-row[data-student-id="${rowId}"]`);

        if (detailsRow.style.display === 'none' || !detailsRow.style.display) {
            detailsRow.style.display = 'table-row';
            arrow.textContent = '▲';
        } else {
            detailsRow.style.display = 'none';
            arrow.textContent = '▼';
        }
    }

    createActionButtons(rowId) {
        const studentRow = document.querySelector(`tr.student-row[data-student-id="${rowId}"]`);
        const deleteCol = studentRow.querySelector('.delete-col');
        const editCol = studentRow.querySelector('.edit-col');

        if (!deleteCol.querySelector('.delete-btn')) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => this.deleteStudent(rowId));
            deleteCol.appendChild(deleteBtn);
        }

        if (!editCol.querySelector('.edit-btn')) {
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => this.editStudent(rowId));
            editCol.appendChild(editBtn);
        }
    }

    removeActionButtons(rowId) {
        const studentRow = document.querySelector(`tr.student-row[data-student-id="${rowId}"]`);
        const deleteBtn = studentRow.querySelector('.delete-btn');
        const editBtn = studentRow.querySelector('.edit-btn');

        if (deleteBtn) deleteBtn.remove();
        if (editBtn) editBtn.remove();
    }

    updateSubmitButtonState() {
        if (this.selectedRows.size > 0) {
            this.submitBtn.disabled = false;
            this.submitBtn.classList.add('enabled');
        } else {
            this.submitBtn.disabled = true;
            this.submitBtn.classList.remove('enabled');
        }
    }

    deleteStudent(studentId) {
        console.log('Delete student:', studentId);
    }

    editStudent(studentId) {
        console.log('Edit student:', studentId);
    }

    renderTable() {
        this.tableBody.innerHTML = '';
        
        this.students.forEach(student => {
            const studentRow = this.createStudentRow(student);
            this.tableBody.appendChild(studentRow);
            
            const detailsRow = this.createDetailsRow(student);
            this.tableBody.appendChild(detailsRow);
        });

        this.bindRowEvents();
        
        // Restore selected state
        this.selectedRows.forEach(rowId => {
            const checkbox = document.querySelector(`.row-checkbox[data-row="${rowId}"]`);
            if (checkbox) {
                checkbox.checked = true;
                const studentRow = document.querySelector(`tr.student-row[data-student-id="${rowId}"]`);
                if (studentRow) {
                    studentRow.classList.add('selected');
                    this.createActionButtons(rowId);
                }
            }
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