import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Snackbar, Alert } from "@mui/material";
import StudentDetails from '../../../components/admin/StudentDetails';
import { useParams, useNavigate } from 'react-router-dom';
import StudentService from '../../../services/studentService';

export default function DeleteStudent() {
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
        console.log('Fetching student for delete:', id);
        const response = await StudentService.getById(id);
        const data = response.data || response;
        setUserData(data);
      } catch (error) {
        console.error('Error fetching student:', error);
        let errorMessage = 'Failed to load student data';
        if (error.response) {
          errorMessage = `API Error: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserProfile();
    }
  }, [id]);

  const deleteStudent = async (id) => {
    try {
      console.log("Deleting student:", id);
      const response = await StudentService.deleteStudent(id);

      setSnackbar({
        open: true,
        message: `Student ID ${id} deleted successfully!`,
        severity: 'success'
      });

      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate('/admin/students');
      }, 1500);

    } catch (err) {
      console.error("Delete error:", err);
      let errorMessage = 'Failed to delete student';
      if (err.response?.data) {
        errorMessage = typeof err.response.data === 'string'
          ? err.response.data
          : err.response.data.message || errorMessage;
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', flexDirection: 'column', gap: 2 }}>
        <CircularProgress />
        <Typography>Loading student details...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', flexDirection: 'column', gap: 2 }}>
        <Typography color="error" variant="h6">Error: {error}</Typography>
        <Typography>Student ID: {id}</Typography>
      </Box>
    );
  }

  return (
    <Box m={"20px"}>
      {userData && (
        <StudentDetails
          student={userData}
          action="delete"
          takeAction={deleteStudent}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
