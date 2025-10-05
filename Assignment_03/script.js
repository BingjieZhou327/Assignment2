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
        this.messageModal = document.getElementById('messageModal');
        this.modalMessage = document.getElementById('modalMessage');
        this.editModal = document.getElementById('editModal');
        this.editTitle = document.getElementById('editTitle');
        this.editInput = document.getElementById('editInput');
        this.editOkBtn = document.getElementById('editOkBtn');
        this.editCancelBtn = document.getElementById('editCancelBtn');
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
        document.querySelector('.close').addEventListener('click', () => this.closeMessageModal());
        this.editOkBtn.addEventListener('click', () => this.handleEditOk());
        this.editCancelBtn.addEventListener('click', () => this.closeEditModal());

        window.addEventListener('click', (event) => {
            if (event.target === this.messageModal) {
                this.closeMessageModal();
            }
            if (event.target === this.editModal) {
                this.closeEditModal();
            }
        });

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
        try {
            const existingIds = this.students.map(s => s.id).sort((a, b) => a - b);
            let newId = 1;
            
            for (let i = 0; i < existingIds.length; i++) {
                if (existingIds[i] !== newId) {
                    break;
                }
                newId++;
            }

            const newStudent = {
                id: newId,
                name: `Student ${newId}`,
                advisor: `Teacher ${newId}`,
                awardStatus: 'Approved',
                semester: 'Fall',
                type: 'TA',
                budget: `${10000 + newId * 1111}`,
                percentage: '100%',
                details: {
                    awardDetails: 'Honors Student',
                    period: 'Fall 1-2024(TA)',
                    comments: 'Outstanding',
                    status: 'A'
                }
            };

            this.students.push(newStudent);
            this.students.sort((a, b) => a.id - b.id);
            this.renderTable();
            this.showMessage(`${newStudent.name} Record added successfully`, 'success');
            
        } catch (error) {
            this.showMessage('Failed to add student record', 'error');
            console.error('Add student failed:', error);
        }
    }

    submitSelectedAwards() {
        if (this.selectedRows.size === 0) {
            this.showMessage('Please select at least one student', 'error');
            return;
        }

        const selectedStudents = Array.from(this.selectedRows)
            .map(id => this.students.find(s => s.id === id))
            .filter(s => s)
            .map(s => s.name);

        this.showMessage(
            `Successfully submitted ${this.selectedRows.size} student scholarship applications:\n${selectedStudents.join(', ')}`, 
            'success'
        );
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
            detailsRow.classList.add('slide-down');
            arrow.classList.add('expanded');
            arrow.textContent = '▲';
        } else {
            detailsRow.style.display = 'none';
            detailsRow.classList.remove('slide-down');
            arrow.classList.remove('expanded');
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
        try {
            const student = this.students.find(s => s.id === studentId);
            if (!student) {
                throw new Error('Student not found');
            }

            this.students = this.students.filter(s => s.id !== studentId);
            this.selectedRows.delete(studentId);
            this.renderTable();
            this.updateSubmitButtonState();
            this.showMessage(`${student.name} Record deleted successfully`, 'success');
            
        } catch (error) {
            this.showMessage('Failed to delete student record', 'error');
            console.error('Delete student failed:', error);
        }
    }

    editStudent(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (!student) {
            this.showMessage('Student not found', 'error');
            return;
        }

        this.currentEditingStudent = studentId;
        this.editTitle.textContent = `Edit details of ${student.name}`;
        this.editInput.value = '';
        this.editModal.style.display = 'flex';
        this.editInput.focus();
    }

    handleEditOk() {
        const inputValue = this.editInput.value.trim();
        
        if (inputValue) {
            const student = this.students.find(s => s.id === this.currentEditingStudent);
            this.showMessage(`${student.name} data updated successfully`, 'success');
        } else {
            this.showMessage('Please enter valid data', 'error');
            return;
        }
        
        this.closeEditModal();
    }

    closeEditModal() {
        this.editModal.style.display = 'none';
        this.currentEditingStudent = null;
        this.editInput.value = '';
    }

    showMessage(message, type = 'info') {
        this.modalMessage.textContent = message;
        this.modalMessage.style.color = type === 'error' ? '#f44336' : '#4CAF50';
        this.messageModal.style.display = 'flex';
        
        setTimeout(() => {
            this.closeMessageModal();
        }, 3000);
    }

    closeMessageModal() {
        this.messageModal.style.display = 'none';
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
        row.className = 'student-row fade-in';
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

window.utils = {
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    generateBudgetNumber: () => {
        return Math.floor(Math.random() * 90000) + 10000;
    },

    validateInput: (value) => {
        return value && value.trim().length > 0;
    }
};