import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';
import { getStudentId } from '../../utils/jwtUtils';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  AccountBalanceWallet,
  Person,
  Lock,
  Logout
} from '@mui/icons-material';

function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const studentId = getStudentId() || user?.studentId;

  useEffect(() => {
    fetchStudentData();
    fetchBalance();
  }, []);

  const fetchStudentData = async () => {
    try {
      if (!studentId) {
        setError('Student ID not found');
        return;
      }
      const response = await api.get(`/student/${studentId}`);
      setStudentData(response.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch student data');
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    try {
      if (!studentId) return;
      const response = await api.get(`/student/${studentId}/balance`);
      setBalance(response.data);
    } catch (err) {
      console.error('Failed to fetch balance:', err);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await api.put(`/student/changepassword/${studentId}`, {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      setSuccess('Password changed successfully');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setShowChangePassword(false);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to change password');
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
          Student Dashboard
        </Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Logout />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Person sx={{ mr: 1, fontSize: 30 }} color="primary" />
                <Typography variant="h6">Profile Information</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {studentData && (
                <Box>
                  <Typography><strong>Name:</strong> {studentData.name}</Typography>
                  <Typography><strong>Email:</strong> {studentData.email}</Typography>
                  <Typography><strong>Mobile:</strong> {studentData.mobileNo}</Typography>
                  <Typography><strong>Course:</strong> {studentData.courseName}</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Balance Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AccountBalanceWallet sx={{ mr: 1, fontSize: 30 }} color="primary" />
                <Typography variant="h6">Wallet Balance</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h4" color="primary">
                ₹{balance !== null ? balance : '0.00'}
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => navigate('/student/wallettopup')}
              >
                Recharge Wallet
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Change Password Card */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Lock sx={{ mr: 1, fontSize: 30 }} color="primary" />
                <Typography variant="h6">Change Password</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {!showChangePassword ? (
                <Button
                  variant="outlined"
                  onClick={() => setShowChangePassword(true)}
                >
                  Change Password
                </Button>
              ) : (
                <form onSubmit={handleChangePassword}>
                  <TextField
                    fullWidth
                    label="Old Password"
                    type="password"
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    margin="normal"
                    required
                  />
                  <Box mt={2}>
                    <Button type="submit" variant="contained" sx={{ mr: 1 }}>
                      Update Password
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setShowChangePassword(false);
                        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </form>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default StudentDashboard;
