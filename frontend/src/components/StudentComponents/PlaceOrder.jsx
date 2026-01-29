import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, Button, Grid, Card, CardContent, Divider, List, ListItem, ListItemText, Alert, CircularProgress } from "@mui/material";
import { tokens } from "../../theme";
import { useLocation, useNavigate } from "react-router-dom";
import StudentService from "../../services/studentService";
import OrderService from "../../services/OrderService";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getStudentId } from "../../utils/jwtUtils";

export default function PlaceOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { order = [], totalAmount = 0 } = location.state || {};

  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const studentId = getStudentId();

  useEffect(() => {
    if (studentId) {
      StudentService.getBalance(studentId).then(setBalance).catch(console.error);
    }
    if (!order.length) {
      navigate("/student/todaysmenu");
    }
  }, [studentId, order, navigate]);

  const handlePayByWallet = async () => {
    setLoading(true);
    setError("");
    try {
      if (balance < totalAmount) {
        throw new Error("Insufficient balance in wallet!");
      }

      // 1. Deduct balance
      await StudentService.deductBalance(studentId, totalAmount);

      // 2. Create Order in backend
      // Backend expects PlaceOrderRequest with items list
      const orderPayload = {
        studentId: studentId,
        items: order.map(item => ({
          itemId: item.itemMasterId || item.itemId || item.id, // Use Master ID, itemId, or id as fallback
          qtyOrdered: item.quantity,
          itemPrice: item.itemPrice
        }))
      };

      await OrderService.insertOrder(orderPayload);

      setSuccess(true);
      setTimeout(() => navigate("/student/orderhistory"), 2000);
    } catch (err) {
      console.error("Order placement failed:", err);
      // Extract meaningful error message
      let errorMessage = "Payment failed";
      if (err.response && err.response.data) {
        // If it's a map (Validation errors)
        if (typeof err.response.data === 'object' && !err.response.data.message) {
          errorMessage = "Validation Error: " + JSON.stringify(err.response.data);
        } else {
          errorMessage = err.response.data.message || err.response.data;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayByRazorpay = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    if (window.Razorpay) {
      const options = {
        key: "rzp_test_AtG9VVI9mbh1sa",
        amount: totalAmount * 100,
        currency: "INR",
        name: "Campus Canteen System",
        description: "Order Payment",
        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay via UPI",
                instruments: [
                  {
                    method: "upi"
                  }
                ]
              },
              other: {
                name: "Other Payment Modes",
                instruments: [
                  {
                    method: "card"
                  },
                  {
                    method: "netbanking"
                  },
                  {
                    method: "wallet"
                  }
                ]
              }
            },
            sequence: ["block.upi", "block.other"],
            preferences: {
              show_default_blocks: false
            }
          }
        },
        handler: async (response) => {
          setLoading(true);
          try {
            await OrderService.insertOrder({
              studentId: studentId,
              items: order.map(item => ({
                itemId: item.itemMasterId || item.itemId || item.id, // Use Master ID, itemId, or id as fallback
                qtyOrdered: item.quantity,
                itemPrice: item.itemPrice
              }))
              // Status and Transaction ID should ideally be handled backend or sent if backend supports
              // But PlaceOrderRequest only has items. 
              // If backend doesn't support transactionId update here, we might need a separate call
              // or just rely on items for now.
            });
            setSuccess(true);
            setTimeout(() => navigate("/student/orderhistory"), 2000);
          } catch (e) {
            setError("Order record failed after payment");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: "Student",
          email: `student${studentId}@examples.com`,
          contact: "9999999999"
        },
        theme: { color: colors.blueAccent[500] }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      alert("Razorpay SDK not loaded");
    }
  };

  if (success) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="80vh">
        <CheckCircleIcon sx={{ fontSize: 100, color: colors.greenAccent[500], mb: 2 }} />
        <Typography variant="h3" color={colors.grey[100]}>Order Placed Successfully!</Typography>
        <Typography variant="h5" color={colors.grey[300]}>Redirecting to your orders...</Typography>
      </Box>
    );
  }

  return (
    <Box p={4} maxWidth="800px" mx="auto">
      <Typography variant="h2" color={colors.grey[100]} fontWeight="bold" gutterBottom>
        Checkout
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Card sx={{ backgroundColor: colors.primary[400], borderRadius: "16px", p: 2 }}>
            <CardContent>
              <Typography variant="h4" color={colors.grey[100]} gutterBottom>Review Items</Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {order.map((item, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={item.itemName}
                      secondary={`Qty: ${item.quantity}`}
                      primaryTypographyProps={{ color: colors.grey[100], fontWeight: "bold" }}
                      secondaryTypographyProps={{ color: colors.grey[300] }}
                    />
                    <Typography variant="h6" color={colors.grey[100]}>
                      ₹{(item.itemPrice * item.quantity).toFixed(2)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" color={colors.grey[100]}>Total Payable:</Typography>
                <Typography variant="h3" color={colors.greenAccent[500]} fontWeight="bold">
                  ₹{totalAmount.toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Typography variant="h4" color={colors.grey[100]} gutterBottom>Payment Method</Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box display="flex" flexDirection="column" gap={2}>
            {/* Wallet Payment */}
            <Card sx={{
              backgroundColor: colors.primary[400],
              cursor: "pointer",
              border: "2px solid",
              borderColor: "transparent",
              "&:hover": { borderColor: colors.greenAccent[500] }
            }} onClick={handlePayByWallet}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <AccountBalanceWalletIcon color="secondary" />
                  <Box>
                    <Typography variant="h6" color={colors.grey[100]}>Wallet Balance</Typography>
                    <Typography variant="h5" color={colors.greenAccent[500]} fontWeight="bold">
                      ₹{balance !== null ? balance.toFixed(2) : "..."}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  sx={{ mt: 2 }}
                  disabled={loading || totalAmount > (balance || 0)}
                >
                  {loading ? <CircularProgress size={24} /> : "Pay with Wallet"}
                </Button>
              </CardContent>
            </Card>

            {/* Online Payment */}
            <Card sx={{
              backgroundColor: colors.primary[400],
              cursor: "pointer",
              border: "2px solid",
              borderColor: "transparent",
              "&:hover": { borderColor: colors.blueAccent[500] }
            }} onClick={handlePayByRazorpay}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <PaymentIcon sx={{ color: colors.blueAccent[500] }} />
                  <Box>
                    <Typography variant="h6" color={colors.grey[100]}>Online Payment</Typography>
                    <Typography variant="body2" color={colors.grey[300]}>Credit Card, UPI, etc.</Typography>
                  </Box>
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2, backgroundColor: colors.blueAccent[600] }}
                >
                  Pay Online
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
