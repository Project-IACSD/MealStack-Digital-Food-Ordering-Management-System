import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobileNo: '',
    courseName: 'DAC'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const courses = ['DAC', 'DBDA', 'DESD', 'DITISS', 'DMC', 'DVLSI'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post('/student/register', formData);
      
      // Handle different response formats
      const message = typeof response.data === 'string' 
        ? response.data 
        : response.data.message || 'Registration successful';
      
      setSuccess(message);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errorMessage = err?.response?.data?.message 
        || err?.response?.data 
        || err?.message 
        || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Student Registration
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Create your account to start ordering
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
            autoComplete="name"
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            autoComplete="email"
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            autoComplete="new-password"
          />

          <TextField
            fullWidth
            label="Mobile Number"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ maxLength: 10 }}
          />

          <TextField
            fullWidth
            select
            label="Course Name"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            margin="normal"
            required
          >
            {courses.map((course) => (
              <MenuItem key={course} value={course}>
                {course}
              </MenuItem>
            ))}
          </TextField>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
        </form>

        <Box textAlign="center" mt={2}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Button variant="text" size="small" onClick={() => navigate('/login')}>
              Login here
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Register;
