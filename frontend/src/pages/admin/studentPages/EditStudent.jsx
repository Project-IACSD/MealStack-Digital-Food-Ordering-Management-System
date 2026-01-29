import React from 'react';
import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Snackbar, Alert } from '@mui/material';
import StudentForm from '../../../components/admin/StudentForm';
import { useParams, useNavigate } from 'react-router-dom';
import StudentService from '../../../services/studentService';

export default function EditStudent() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching student with ID:', id);
        const response = await StudentService.getById(id);
        console.log('Student data response:', response);

        // Handle different response structures
        const data = response.data || response;
        console.log('Extracted data:', data);
        setUserData(data);
      } catch (error) {
        console.error('Error fetching student:', error);

        // Extract detailed error message
        let errorMessage = 'Failed to load student data';
        if (error.response) {
          errorMessage = `API Error: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`;
        } else if (error.message) {
          errorMessage = error.message;
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserProfile();
    } else {
      setError('No student ID provided');
      setLoading(false);
    }
  }, [id]);

  const editStudent = async (student) => {
    try {
      console.log('Updating student:', student);
      const response = await StudentService.updateStudent(student);

      if (response.status === 200 || response) {
        setSnackbar({
          open: true,
          message: `Student "${student.name}" updated successfully!`,
          severity: 'success'
        });

        // Redirect after 1.5 seconds
        setTimeout(() => {
          navigate('/admin/students');
        }, 1500);
      }
    } catch (error) {
      console.error('Update error:', error);

      let errorMessage = 'Failed to update student';
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
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress />
        <Typography>Loading student data...</Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
        <Typography>
          Student ID: {id}
        </Typography>
      </Box>
    );
  }

  // Data loaded successfully
  return (
    <div>
      {userData && (
        <StudentForm
          action="edit"
          takeAction={editStudent}
          title="Edit Student"
          subtitle="Update Student Details"
          studentData={userData}
        />
      )}

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
