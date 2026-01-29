import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  Alert,
  CircularProgress
} from '@mui/material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tabValue, setTabValue] = useState(0); // 0 = Student, 1 = Admin
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { studentLogin, adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (tabValue === 0) {
        // Student Login
        result = await studentLogin(email, password);
        if (result.success) {
          navigate('/student/dashboard');
        }
      } else {
        // Admin Login
        result = await adminLogin(email, password);
        if (result.success) {
          navigate('/admin/dashboard');
        }
      }
    } catch (err) {
      const errorMessage = err?.message || err?.toString() || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Campus Canteen Management
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom align="center" color="text.secondary">
          Login
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Student Login" />
            <Tab label="Admin Login" />
          </Tabs>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            autoComplete="email"
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </form>

        <Box textAlign="center" mt={2}>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Button
              variant="text"
              size="small"
              onClick={() => navigate('/register')}
              disabled={tabValue === 1} // Only show for students
            >
              Register here
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
