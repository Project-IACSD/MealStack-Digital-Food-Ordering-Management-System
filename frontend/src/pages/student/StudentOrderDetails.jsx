import React, { useRef } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    useTheme,
    Button,
    Grid,
    Chip,
    Divider,
    IconButton,
    Tooltip,
    Paper,
    Fade
} from "@mui/material";
import { tokens } from "../../theme";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PrintIcon from '@mui/icons-material/Print';
import ReplayIcon from '@mui/icons-material/Replay';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpIcon from '@mui/icons-material/Help';

export default function StudentOrderDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const invoiceRef = useRef();

    // Handle missing state
    if (!location.state) {
        return (
            <Box display="flex" alignItems="center" justifyContent="center" minHeight="80vh">
                <Box textAlign="center">
                    <HelpIcon sx={{ fontSize: 60, color: colors.grey[500], mb: 2 }} />
                    <Typography variant="h4" color={colors.grey[100]} gutterBottom>
                        Order Not Found
                    </Typography>
                    <Typography variant="body1" color={colors.grey[300]} mb={3}>
                        We couldn't find the details for this order. It matches no records.
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate("/student/orderhistory")}
                        sx={{ backgroundColor: colors.blueAccent[700] }}
                    >
                        Return to History
                    </Button>
                </Box>
            </Box>
        );
    }

    const orderData = location.state;
    const carts = orderData.cartList || [];

    // --- Actions ---

    const handlePrint = () => {
        window.print();
    };

    const handleReorder = () => {
        // Map current carts to the structure PlaceOrder expects
        // PlaceOrder expects: { id, quantity, itemPrice, itemName }
        const reorderItems = carts.map(cart => ({
            id: cart.itemId,      // Ensure CartDTO has this!
            itemMasterId: cart.itemId, // Fallback
            quantity: cart.qtyOrdered,
            itemPrice: cart.price,
            itemName: cart.itemName
        }));

        navigate("/student/placeorder", {
            state: {
                order: reorderItems,
                totalAmount: orderData.amount
            }
        });
    };

    const handleCopyTxnId = () => {
        if (orderData.transactionId) {
            navigator.clipboard.writeText(orderData.transactionId);
            // Optional: Toast notification
        }
    };

    const goBack = () => {
        navigate("/student/orderhistory");
    };

    // --- Formatters ---

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return "N/A";
        const date = new Date(dateTimeString);
        return date.toLocaleString('en-IN', {
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        let config = { label: status, color: "default", icon: <HelpIcon /> };

        switch (status) {
            case 'PENDING':
                config = { label: "Pending", color: "warning", icon: <AccessTimeFilledIcon /> };
                break;
            case 'PREPARING':
                config = { label: "Preparing", color: "info", icon: <AccessTimeFilledIcon /> };
                break;
            case 'SERVED':
                config = { label: "Completed", color: "success", icon: <CheckCircleIcon /> };
                break;
            case 'CANCELLED':
                config = { label: "Cancelled", color: "error", icon: <CancelIcon /> };
                break;
        }

        return (
            <Chip
                icon={config.icon}
                label={config.label}
                color={config.color}
                variant="filled"
                sx={{
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    px: 1,
                    '& .MuiChip-icon': { color: 'inherit' }
                }}
            />
        );
    };

    return (
        <Box
            p={3}
            sx={{
                minHeight: "100vh",
                backgroundColor: theme.palette.mode === "dark" ? colors.primary[500] : "#fcfcfc",
                "@media print": {
                    p: 0,
                    backgroundColor: "#fff",
                    color: "#000"
                }
            }}
        >
            {/* Global Print Styles */}
            <style>
                {`
                    @media print {
                        .no-print { display: none !important; }
                        .print-only { display: block !important; }
                        body { background-color: white; color: black; }
                        .MuiPaper-root { box-shadow: none !important; border: 1px solid #ccc !important; }
                        .MuiTypography-root { color: black !important; }
                        .MuiChip-root { border: 1px solid #000 !important; color: black !important; background: transparent !important; }
                    }
                `}
            </style>

            <Box maxWidth="1000px" mx="auto">

                {/* Header Action Bar */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} className="no-print">
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={goBack}
                        sx={{ color: colors.grey[100], textTransform: 'none', fontSize: '1rem' }}
                    >
                        Back to History
                    </Button>
                    <Box display="flex" gap={2}>
                        <Button
                            variant="outlined"
                            startIcon={<ReplayIcon />}
                            onClick={handleReorder}
                            color="secondary"
                            sx={{ fontWeight: "bold" }}
                        >
                            Reorder
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<PrintIcon />}
                            onClick={handlePrint}
                            sx={{ backgroundColor: colors.blueAccent[700] }}
                        >
                            Download Invoice
                        </Button>
                    </Box>
                </Box>

                {/* Main Order Card */}
                <Fade in={true} timeout={500}>
                    <Paper
                        elevation={4}
                        sx={{
                            p: 4,
                            borderRadius: '16px',
                            backgroundColor: colors.primary[400],
                            borderTop: `6px solid ${orderData.orderStatus === 'SERVED' ? colors.greenAccent[500] : colors.blueAccent[500]}`
                        }}
                        ref={invoiceRef}
                    >
                        {/* Title Section */}
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
                            <Box display="flex" gap={2}>
                                <ReceiptIcon sx={{ fontSize: 48, color: colors.greenAccent[500] }} />
                                <Box>
                                    <Typography variant="h3" fontWeight="bold" color={colors.grey[100]}>
                                        Order #{orderData.orderId}
                                    </Typography>
                                    <Typography variant="subtitle1" color={colors.grey[300]}>
                                        Placed on {formatDateTime(orderData.time)}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box textAlign="right">
                                {getStatusBadge(orderData.orderStatus)}
                                <Typography variant="h6" mt={1} color={colors.grey[100]}>
                                    Total: ₹{orderData.amount}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ mb: 4 }} />

                        <Grid container spacing={4}>
                            {/* Left Column: Items */}
                            <Grid item xs={12} md={8}>
                                <Typography variant="h5" fontWeight="bold" color={colors.grey[100]} mb={2}>
                                    Items Ordered ({carts.length})
                                </Typography>
                                <Box display="flex" flexDirection="column" gap={2}>
                                    {carts.map((item, idx) => (
                                        <Card
                                            key={idx}
                                            variant="outlined"
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                p: 2,
                                                backgroundColor: colors.primary[500],
                                                border: 'none'
                                            }}
                                        >
                                            <Box flexGrow={1}>
                                                <Typography variant="h6" fontWeight="bold" color={colors.grey[100]}>
                                                    {item.itemName}
                                                </Typography>
                                                <Typography variant="body2" color={colors.grey[400]}>
                                                    {item.qtyOrdered} x ₹{item.price}
                                                </Typography>
                                            </Box>
                                            <Typography variant="h6" fontWeight="bold" color={colors.greenAccent[500]}>
                                                ₹{item.netPrice || (item.price * item.qtyOrdered)}
                                            </Typography>
                                        </Card>
                                    ))}
                                </Box>
                            </Grid>

                            {/* Right Column: details */}
                            <Grid item xs={12} md={4}>
                                <Card sx={{ backgroundColor: colors.primary[500], p: 2, height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h5" fontWeight="bold" color={colors.grey[100]} mb={2}>
                                            Billing Summary
                                        </Typography>

                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography color={colors.grey[300]}>Items Total</Typography>
                                            <Typography color={colors.grey[100]} fontWeight="bold">₹{orderData.amount}</Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography color={colors.grey[300]}>Tax</Typography>
                                            <Typography color={colors.grey[100]}>₹0.00</Typography>
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        <Box display="flex" justifyContent="space-between" mb={3}>
                                            <Typography variant="h5" fontWeight="bold" color={colors.grey[100]}>Grand Total</Typography>
                                            <Typography variant="h5" fontWeight="bold" color={colors.greenAccent[500]}>₹{orderData.amount}</Typography>
                                        </Box>

                                        <Box mt={4}>
                                            <Typography variant="subtitle2" color={colors.grey[400]} gutterBottom>
                                                Payment Information
                                            </Typography>
                                            <Typography variant="body1" color={colors.grey[100]} fontWeight="500">
                                                {orderData.paymentMethod}
                                            </Typography>

                                            <Box mt={2} bgcolor={colors.primary[400]} p={1} borderRadius={1} border={`1px dashed ${colors.grey[600]}`}>
                                                <Typography variant="caption" color={colors.grey[400]} display="block">
                                                    Transaction ID
                                                </Typography>
                                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                                    <Typography variant="body2" color={colors.grey[200]} sx={{ fontFamily: 'monospace' }}>
                                                        {orderData.transactionId ? `${orderData.transactionId.substring(0, 12)}...` : 'N/A'}
                                                    </Typography>
                                                    {orderData.transactionId && (
                                                        <Tooltip title="Copy ID">
                                                            <IconButton size="small" onClick={handleCopyTxnId} className="no-print">
                                                                <ContentCopyIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        <Box mt={4} textAlign="center" className="print-only" display="none">
                            <Typography variant="caption">Thank you for ordering with Campus Canteen System!</Typography>
                        </Box>

                    </Paper>
                </Fade>
            </Box>
        </Box>
    );
}
