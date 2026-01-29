import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from "@mui/material";
import StudentDetails from '../../../components/admin/StudentDetails';
import { useNavigate, useParams } from "react-router-dom";
import StudentService from '../../../services/studentService';

export default function DisplayStudent() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching student details:', id);
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

  const goBack = () => {
    navigate('/admin/students');
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
          action="display"
          takeAction={goBack}
        />
      )}
    </Box>
  );
}
