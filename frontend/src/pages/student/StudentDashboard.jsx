import React, { useEffect, useState } from 'react';
import StudentService from '../../services/studentService';
import OrderService from '../../services/OrderService';
import { useAuth } from '../../auth/AuthContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
  Avatar,
  Divider,
  Skeleton,
  Chip,
  Stack
} from '@mui/material';
import { tokens } from "../../theme";
import { useNavigate } from 'react-router-dom';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import TimelineIcon from '@mui/icons-material/Timeline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';

const StudentDashboard = () => {
  const auth = useAuth();
  const { user } = auth || {};
  const theme = useTheme();
  // Safe tokens access
  const colors = tokens ? tokens(theme.palette.mode) : { grey: { 100: "#ccc" }, primary: { 400: "#333", 500: "#000" }, greenAccent: { 500: "green" } };
  const navigate = useNavigate();

  const [balance, setBalance] = useState(0);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentId = user?.id || user?.studentId || localStorage.getItem("studentId");

    console.log("Dashboard: Loaded. User:", user, "StudentId:", studentId);

    if (studentId) {
      fetchData(studentId);
    } else {
      console.warn("Dashboard: No Student ID found.");
      setLoading(false);
    }
  }, [user]);

  const fetchData = async (id) => {
    try {
      setLoading(true);
      const [balanceData, profileData, ordersData] = await Promise.all([
        StudentService.getBalance(id),
        StudentService.getById(id),
        OrderService.getOrdersByStudentId(id)
      ]);

      setBalance(balanceData);
      setProfile(profileData);

      // Handle orders (ensure array)
      const orderList = Array.isArray(ordersData) ? ordersData : (ordersData?.data || []);
      // Sort by latest
      orderList.sort((a, b) => new Date(b.time) - new Date(a.time));
      setOrders(orderList);

    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate Stats
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
  const recentOrders = orders.slice(0, 3); // Top 3

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const StatCard = ({ title, value, icon, gradient, onClick }) => (
    <Card sx={{
      background: gradient,
      borderRadius: '16px',
      color: '#fff',
      height: '100%',
      cursor: onClick ? 'pointer' : 'default',
      position: 'relative',
      overflow: 'hidden'
    }} onClick={onClick}>
      <Box sx={{
        position: 'absolute',
        top: -10,
        right: -10,
        opacity: 0.2,
        transform: 'rotate(15deg)'
      }}>
        {React.cloneElement(icon, { sx: { fontSize: 100 } })}
      </Box>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          {React.cloneElement(icon, { sx: { fontSize: 24 } })}
          <Typography variant="h6" fontWeight="bold">{title}</Typography>
        </Box>
        <Typography variant="h3" fontWeight="bold">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box p={3}>
        <Skeleton variant="text" width={300} height={60} />
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} mt={1}>
          <Skeleton variant="rectangular" height={140} width="100%" sx={{ borderRadius: 4 }} />
          <Skeleton variant="rectangular" height={140} width="100%" sx={{ borderRadius: 4 }} />
          <Skeleton variant="rectangular" height={140} width="100%" sx={{ borderRadius: 4 }} />
        </Stack>
      </Box>
    );
  }

  // Safety checks for undefined colors
  const greenAccent = colors.greenAccent ? colors.greenAccent[500] : 'green';
  const greenAccentDark = colors.greenAccent ? colors.greenAccent[600] : 'darkgreen';
  const blueAccent = colors.blueAccent ? colors.blueAccent[500] : 'blue';
  const redAccent = colors.redAccent ? colors.redAccent[500] : 'red';
  const grey100 = colors.grey ? colors.grey[100] : '#fff';
  const grey300 = colors.grey ? colors.grey[300] : '#ccc';
  const primary300 = colors.primary ? colors.primary[300] : '#333';
  const primary400 = colors.primary ? colors.primary[400] : '#222';

  return (
    <Box p={3}>
      {/* Header */}
      <Box mb={4} display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
        <Box>
          <Box display="flex" alignItems="center" gap={1}>
            <EmojiPeopleIcon sx={{ color: greenAccent, fontSize: 32 }} />
            <Typography variant="h2" fontWeight="bold" color={grey100}>
              {getGreeting()}, {profile?.name || "Student"}!
            </Typography>
          </Box>
          <Typography variant="h5" color={grey300}>
            Here's what's happening today.
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" color={grey100} textAlign="right">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }} gap={3} mb={4}>
        <Box>
          <StatCard
            title="Wallet Balance"
            value={`₹ ${typeof balance === 'number' ? balance.toFixed(2) : '0.00'}`}
            icon={<AccountBalanceWalletIcon />}
            gradient={`linear-gradient(135deg, ${greenAccent}, ${greenAccentDark})`}
            onClick={() => navigate('/student/wallettopup')}
          />
        </Box>
        <Box>
          <StatCard
            title="Total Orders"
            value={totalOrders}
            icon={<ShoppingBasketIcon />}
            gradient={`linear-gradient(135deg, ${blueAccent}, ${colors.blueAccent ? colors.blueAccent[700] : 'darkblue'})`}
            onClick={() => navigate('/student/orderhistory')}
          />
        </Box>
        <Box>
          <StatCard
            title="Total Spent"
            value={`₹ ${totalSpent.toFixed(2)}`}
            icon={<TimelineIcon />}
            gradient={`linear-gradient(135deg, ${redAccent}, ${colors.redAccent ? colors.redAccent[700] : 'darkred'})`}
          />
        </Box>
      </Box>

      {/* Main Content Area */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>

        {/* Left Column: Quick Actions & Recent Activity */}
        <Box flex={2}>

          {/* Quick Actions */}
          <Typography variant="h4" fontWeight="bold" color={grey100} mb={2}>
            Quick Actions
          </Typography>
          <Box display="grid" gridTemplateColumns={{ xs: '1fr 1fr', sm: '1fr 1fr 1fr 1fr' }} gap={2} mb={4}>
            <Button
              fullWidth variant="outlined"
              sx={{
                p: 3,
                flexDirection: 'column',
                borderRadius: '12px',
                gap: 1,
                borderColor: primary300,
                color: grey100,
                backgroundColor: primary400,
                '&:hover': { borderColor: greenAccent }
              }}
              onClick={() => navigate('/student/todaysmenu')}
            >
              <FastfoodIcon sx={{ fontSize: 32, color: greenAccent }} />
              <Typography fontWeight="600">Order Food</Typography>
            </Button>

            <Button
              fullWidth variant="outlined"
              sx={{
                p: 3,
                flexDirection: 'column',
                borderRadius: '12px',
                gap: 1,
                borderColor: primary300,
                color: grey100,
                backgroundColor: primary400,
                '&:hover': { borderColor: blueAccent }
              }}
              onClick={() => navigate('/student/wallettopup')}
            >
              <AccountBalanceWalletIcon sx={{ fontSize: 32, color: blueAccent }} />
              <Typography fontWeight="600">Top Up</Typography>
            </Button>

            <Button
              fullWidth variant="outlined"
              sx={{
                p: 3,
                flexDirection: 'column',
                borderRadius: '12px',
                gap: 1,
                borderColor: primary300,
                color: grey100,
                backgroundColor: primary400,
                '&:hover': { borderColor: greenAccent } // Use greenAccent instead of non-existent yellow
              }}
              onClick={() => navigate('/student/orderhistory')}
            >
              <HistoryIcon sx={{ fontSize: 32, color: greenAccent }} />
              <Typography fontWeight="600">History</Typography>
            </Button>

            <Button
              fullWidth variant="outlined"
              sx={{
                p: 3,
                flexDirection: 'column',
                borderRadius: '12px',
                gap: 1,
                borderColor: primary300,
                color: grey100,
                backgroundColor: primary400,
                '&:hover': { borderColor: redAccent }
              }}
              onClick={() => navigate('/student/profile')}
            >
              <PersonIcon sx={{ fontSize: 32, color: redAccent }} />
              <Typography fontWeight="600">Profile</Typography>
            </Button>
          </Box>

          {/* Recent Orders */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4" fontWeight="bold" color={grey100}>
              Recent Activity
            </Typography>
            <Button
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/student/orderhistory')}
              sx={{ color: greenAccent }}
            >
              View All
            </Button>
          </Box>
          <Card sx={{ backgroundColor: primary400, borderRadius: '16px' }}>
            <CardContent sx={{ p: 0 }}>
              {recentOrders.length > 0 ? (
                recentOrders.map((order, index) => (
                  <Box key={order.orderId}>
                    <Box
                      p={2}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: colors.primary ? colors.primary[500] : '#444' }
                      }}
                      onClick={() => navigate('/student/orders/display/' + order.orderId, { state: order })}
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: greenAccentDark }}>
                          <FastfoodIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" color={grey100}>Order #{order.orderId}</Typography>
                          <Typography variant="body2" color={colors.grey ? colors.grey[400] : '#aaa'}>
                            {new Date(order.time).toLocaleDateString()} • {order.qty} Items
                          </Typography>
                        </Box>
                      </Box>
                      <Box textAlign="right">
                        <Typography variant="h6" fontWeight="bold" color={greenAccent}>
                          ₹{order.amount}
                        </Typography>
                        <Chip
                          label={order.orderStatus}
                          size="small"
                          color={order.orderStatus === 'SERVED' ? 'success' : order.orderStatus === 'PENDING' ? 'warning' : 'default'}
                          variant="filled"
                        />
                      </Box>
                    </Box>
                    {index < recentOrders.length - 1 && <Divider />}
                  </Box>
                ))
              ) : (
                <Box p={4} textAlign="center">
                  <Typography color={colors.grey ? colors.grey[400] : '#aaa'}>No recent orders found.</Typography>
                  <Button sx={{ mt: 1 }} variant="contained" color="secondary" onClick={() => navigate('/student/todaysmenu')}>
                    Place your first order!
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Right Column: Profile Summary */}
        <Box flex={1}>
          <Card sx={{ backgroundColor: primary400, borderRadius: '16px', height: '100%' }}>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" py={3}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: blueAccent, fontSize: 40, mb: 2 }}>
                  {profile?.name?.charAt(0) || "S"}
                </Avatar>
                <Typography variant="h3" fontWeight="bold" color={grey100}>
                  {profile?.name}
                </Typography>
                <Typography variant="body1" color={greenAccent} gutterBottom>
                  {profile?.courseName || "Student"}
                </Typography>
                <Chip label={`ID: ${profile?.studentId}`} size="small" sx={{ mt: 1 }} />
              </Box>
              <Divider />
              <Box p={2}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography color={colors.grey ? colors.grey[400] : '#aaa'}>Email</Typography>
                  <Typography color={grey100}>{profile?.email}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography color={colors.grey ? colors.grey[400] : '#aaa'}>Phone</Typography>
                  <Typography color={grey100}>{profile?.mobileNo || "N/A"}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography color={colors.grey ? colors.grey[400] : '#aaa'}>DOB</Typography>
                  <Typography color={grey100}>{profile?.dob || "N/A"}</Typography>
                </Box>
              </Box>
              <Box p={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate('/student/profile')}
                >
                  View Full Profile
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

      </Stack>
    </Box>
  );
};

export default StudentDashboard;
