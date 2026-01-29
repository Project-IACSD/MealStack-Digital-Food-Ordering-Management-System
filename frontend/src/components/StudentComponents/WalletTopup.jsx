import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  Card,
  CardContent,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Fade,
  InputAdornment
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../admin/common/Header";
import StudentService from "../../services/studentService";
import RechargeHistoryService from "../../services/RechargeHistoryService";
import { useNavigate } from "react-router-dom";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddCardIcon from '@mui/icons-material/AddCard';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function WalletTopup() {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [balance, setBalance] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [error, setError] = useState("");

  const studentId = localStorage.getItem("studentId");
  const quickAmounts = [100, 200, 500, 1000, 2000];

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const res = await StudentService.getBalance(studentId);
      setBalance(res);
    } catch (err) {
      console.error("Failed to fetch balance", err);
    }
  };

  const handleAmountChange = (e) => {
    const val = e.target.value;
    if (val === "" || /^[0-9\b]+$/.test(val)) {
      setAmount(val);
      setError("");
    }
  };

  const handleQuickAdd = (val) => {
    setAmount(val.toString());
    setError("");
  };

  const isValidAmount = () => {
    const num = Number(amount);
    if (!amount) return false;
    if (num < 100) return "Minimum amount is ₹100";
    if (num > 10000) return "Maximum amount is ₹10,000";
    return true;
  };

  const handleProceed = () => {
    const valid = isValidAmount();
    if (valid === true) {
      setOpenConfirm(true);
    } else {
      setError(valid);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleConfirmPayment = async () => {
    setOpenConfirm(false);
    setLoading(true);

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Please check your internet connection.");
      setLoading(false);
      return;
    }

    const options = {
      key: "rzp_test_AtG9VVI9mbh1sa", // Test Key
      amount: Number(amount) * 100,
      currency: "INR",
      name: "Campus Canteen",
      description: "Wallet Top-up",
      image: "https://cdn-icons-png.flaticon.com/512/272/272525.png", // Optional Logo
      handler: async function (response) {
        try {
          await RechargeHistoryService.addRechargeHistory({
            studentId: Number(studentId),
            amountAdded: Number(amount),
            paymentId: response.razorpay_payment_id,
            transactionId: 0
          });

          // Success Feedback
          alert("Top-up Successful! Balance Updated.");
          navigate("/student/rechargehistory");
        } catch (err) {
          console.error("Recharge saving failed", err);
          alert("Payment successful but failed to update record. Please contact admin.");
          navigate("/student/rechargehistory");
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: "Student",
        email: "student@example.com",
        contact: "9999999999"
      },
      theme: { color: colors.blueAccent[500] },
      modal: {
        ondismiss: function () {
          setLoading(false);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <Box m="20px">
      <Header title="Wallet Top-Up" subtitle="Add money to your canteen wallet securely" />

      <Grid container spacing={4} mt={1}>
        {/* Left Column: Wallet Summary */}
        <Grid item xs={12} md={5}>
          <Fade in={true} timeout={500}>
            <Card sx={{
              background: `linear-gradient(135deg, ${colors.greenAccent[600]} 0%, ${colors.greenAccent[800]} 100%)`,
              borderRadius: '20px',
              boxShadow: 8,
              mb: 3,
              color: '#fff'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                  <AccountBalanceWalletIcon sx={{ fontSize: 40, opacity: 0.9 }} />
                  <Typography variant="h5" fontWeight="500" sx={{ opacity: 0.9 }}>
                    Current Balance
                  </Typography>
                </Box>
                <Typography variant="h1" fontWeight="bold">
                  ₹ {balance !== null ? balance.toFixed(2) : "..."}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
                  Safe & Secure Payments via Razorpay
                </Typography>
              </CardContent>
            </Card>
          </Fade>

          <Typography variant="body1" color={colors.grey[300]} lineHeight={1.8}>
            💡 <b>Tip:</b> Keeping a sufficient balance helps you checkout faster during busy lunch hours!
          </Typography>
        </Grid>

        {/* Right Column: Top Up Form */}
        <Grid item xs={12} md={7}>
          <Card sx={{ backgroundColor: colors.primary[400], borderRadius: '16px', boxShadow: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <AddCardIcon sx={{ color: colors.blueAccent[500], fontSize: 32 }} />
                <Typography variant="h4" color={colors.grey[100]} fontWeight="bold">
                  Add Amount
                </Typography>
              </Box>

              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter amount (e.g. 500)"
                value={amount}
                onChange={handleAmountChange}
                error={!!error}
                helperText={error || "Min: ₹100, Max: ₹10,000"}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Typography color={colors.grey[100]} variant="h4">₹</Typography></InputAdornment>,
                  style: { fontSize: '1.5rem', fontWeight: 'bold' }
                }}
                sx={{ mb: 3 }}
              />

              <Typography variant="body2" color={colors.grey[300]} mb={1}>
                Quick Select:
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap" mb={4}>
                {quickAmounts.map((amt) => (
                  <Chip
                    key={amt}
                    label={`+ ₹${amt}`}
                    onClick={() => handleQuickAdd(amt)}
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      backgroundColor: amount == amt ? colors.blueAccent[600] : colors.primary[500],
                      color: amount == amt ? 'white' : colors.grey[200],
                      '&:hover': { backgroundColor: colors.blueAccent[500] }
                    }}
                  />
                ))}
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleProceed}
                disabled={loading}
                sx={{
                  backgroundColor: colors.greenAccent[600],
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  '&:hover': { backgroundColor: colors.greenAccent[700] }
                }}
                startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <SecurityIcon />}
              >
                {loading ? "Processing..." : "Proceed to Pay"}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Confirmation Modal */}
      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        PaperProps={{ sx: { borderRadius: '16px', backgroundColor: colors.primary[400], minWidth: '350px' } }}
      >
        <DialogTitle sx={{ borderBottom: `1px solid ${colors.primary[500]}` }}>
          <Box display="flex" alignItems="center" gap={1}>
            <CheckCircleIcon color="success" />
            <Typography variant="h5" color={colors.grey[100]}>Confirm Details</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography color={colors.grey[300]}>Top-up Amount</Typography>
            <Typography variant="h5" fontWeight="bold" color={colors.greenAccent[500]}>₹ {amount}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography color={colors.grey[300]}>Transaction Fee</Typography>
            <Typography color={colors.grey[100]}>₹ 0.00</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mt={2} pt={2} borderTop={`1px dashed ${colors.grey[500]}`}>
            <Typography color={colors.grey[100]} fontWeight="bold">Total Payable</Typography>
            <Typography variant="h4" fontWeight="bold" color={colors.greenAccent[500]}>₹ {amount}</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${colors.primary[500]}` }}>
          <Button onClick={() => setOpenConfirm(false)} color="error">Cancel</Button>
          <Button variant="contained" onClick={handleConfirmPayment} color="secondary">
            Pay Securely
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
