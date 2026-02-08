import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Snackbar, Box, Button } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ListIcon from '@mui/icons-material/List';
import StudentForm from '../../../components/admin/StudentForm';
import StudentService from '../../../services/studentService';

export default function AddStudent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formKey, setFormKey] = useState(0); // Key to reset form
  const formRef = useRef(null);

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
        message: `Student "${student.name}" added successfully! You can add another student or view all students.`,
        severity: 'success'
      });

      // Reset form by changing key
      setFormKey(prevKey => prevKey + 1);

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
        key={formKey} // This will reset the form when key changes
        action="add"
        takeAction={addStudent}
        title="Add Student"
        subtitle="Student Registration Form"
        loading={loading}
      />

      {/* Action Buttons */}
      <Box
        display="flex"
        justifyContent="center"
        gap={2}
        mt={2}
        mb={4}
      >
        <Button
          variant="outlined"
          color="primary"
          startIcon={<PersonAddIcon />}
          onClick={() => setFormKey(prevKey => prevKey + 1)}
        >
          Clear Form
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<ListIcon />}
          onClick={() => navigate('/admin/students')}
        >
          View All Students
        </Button>
      </Box>

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
