import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Snackbar } from '@mui/material';
import StudentForm from '../../../components/admin/StudentForm';
import StudentService from '../../../services/studentService';

export default function AddStudent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const addStudent = async (student) => {
    try {
      setLoading(true);
      console.log('Adding student:', student);

      const response = await StudentService.insertStudent(student);
      console.log('Add student response:', response);

      // Show success message
      setSnackbar({
        open: true,
        message: `Student "${student.name}" added successfully!`,
        severity: 'success'
      });

      // Redirect to student list after 1.5 seconds
      setTimeout(() => {
        navigate('/admin/students');
      }, 1500);

    } catch (error) {
      console.error('Error adding student:', error);

      // Extract error message
      let errorMessage = 'Failed to add student';
      if (error.response?.data) {
        errorMessage = typeof error.response.data === 'string'
          ? error.response.data
          : error.response.data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <StudentForm
        action="add"
        takeAction={addStudent}
        title="Add Student"
        subtitle="Student Registration Form"
        loading={loading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
