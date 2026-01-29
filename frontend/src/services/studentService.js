import api from '../config/api';

class StudentService {

    // ================= ADMIN OPERATIONS =================

    async getAllStudents() {
        try {
            const response = await api.get('/admin/students');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async getStudentCount() {
        try {
            const response = await api.get('/admin/totalstudents');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async insertStudent(student) {
        try {
            student.courseName = student.courseName || "DAC";
            // Set password as DOB in YYYYMMDD format (removing hyphens)
            student.password = String(student.dob).replace(/-/g, '');
            const response = await api.post('/admin/register/student', student);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async updateStudent(student) {
        try {
            const response = await api.put(`/student/${student.studentId}`, student);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async deleteStudent(id) {
        try {
            const response = await api.delete(`/student/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    // ================= AUTHENTICATION =================

    async login(credentials) {
        try {
            const response = await api.post('/student/login', credentials);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async registerStudent(student) {
        try {
            const response = await api.post('/student/register', student);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async changePassword(id, passwordData) {
        try {
            const response = await api.put(`/student/changepassword/${id}`, passwordData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    // ================= STUDENT OPERATIONS =================

    async getById(id) {
        try {
            const response = await api.get(`/student/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async getStudentByEmail(email) {
        try {
            const response = await api.get(`/student/email/${email}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async getBalance(id) {
        try {
            const response = await api.get(`/student/${id}/balance`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async addBalance(data) {
        try {
            const currentBalance = await this.getBalance(data.id);
            const newBalance = parseInt(currentBalance) + parseInt(data.addAmount);

            const requestBody = { value: newBalance };
            const response = await api.put(`/student/${data.id}/balance`, requestBody);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    async deductBalance(id, amount) {
        try {
            const currentBalance = await this.getBalance(id);
            const newBalance = parseInt(currentBalance) - parseInt(amount);

            if (newBalance < 0) {
                throw new Error('Insufficient balance');
            }

            const requestBody = { value: newBalance };
            const response = await api.put(`/student/${id}/balance`, requestBody);
            return newBalance;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }

    // Alias for getById (for backward compatibility)
    async getStudentById(id) {
        return this.getById(id);
    }

    // Alias for updateBalance (for backward compatibility)
    async updateBalance(studentId, balance) {
        try {
            const response = await api.put(`/student/${studentId}/balance`, {
                value: balance
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}

export default new StudentService();
