import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  People,
  Logout,
  Refresh
} from '@mui/icons-material';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch all students
      const studentsResponse = await api.get('/admin/students');
      setStudents(studentsResponse.data || []);

      // Fetch total student count
      const countResponse = await api.get('/admin/totalstudents');
      setTotalStudents(countResponse.data || 0);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchData}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Logout />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <People sx={{ mr: 2, fontSize: 40 }} color="primary" />
                <Box>
                  <Typography variant="h6" color="text.secondary">
                    Total Students
                  </Typography>
                  <Typography variant="h3" color="primary">
                    {totalStudents}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <People sx={{ mr: 2, fontSize: 40 }} color="secondary" />
                <Box>
                  <Typography variant="h6" color="text.secondary">
                    Registered Students
                  </Typography>
                  <Typography variant="h3" color="secondary">
                    {students.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Students Table */}
      <Paper sx={{ mt: 3 }}>
        <Box p={2}>
          <Typography variant="h6" gutterBottom>
            All Students
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Student ID</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Mobile</strong></TableCell>
                <TableCell><strong>Course</strong></TableCell>
                <TableCell><strong>Balance</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="text.secondary">
                      No students found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student.studentId}>
                    <TableCell>{student.studentId}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.mobileNo}</TableCell>
                    <TableCell>
                      <Chip label={student.courseName} size="small" />
                    </TableCell>
                    <TableCell>₹{student.balance || '0.00'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}

export default AdminDashboard;
