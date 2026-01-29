import React from "react";
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Divider,
    useTheme
} from "@mui/material";
import { tokens } from "../../theme";
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';

const CartSummary = ({ order, menuItems, totalAmount, onPlaceOrder }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const hasItems = totalAmount > 0;

    // Filter items that are actually in the cart
    const cartItems = Object.keys(order)
        .filter(id => order[id] > 0)
        .map(itemId => {
            const item = menuItems.find(i => i.id === parseInt(itemId));
            return { ...item, qty: order[itemId] };
        })
        .filter(item => item.id); // Valid items only

    return (
        <Paper
            elevation={5}
            sx={{
                p: 3,
                borderRadius: '16px',
                backgroundColor: colors.primary[400],
                position: 'sticky',
                top: '20px'
            }}
        >
            <Box display="flex" alignItems="center" mb={2}>
                <ShoppingCartCheckoutIcon sx={{ fontSize: '30px', mr: 1, color: colors.greenAccent[500] }} />
                <Typography variant="h4" fontWeight="bold" color={colors.grey[100]}>
                    Checkout List
                </Typography>
            </Box>
            <Divider sx={{ mb: 2, backgroundColor: colors.grey[100] }} />

            <TableContainer sx={{ mb: 3, maxHeight: '400px' }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                align="left"
                                sx={{
                                    backgroundColor: colors.blueAccent[800],
                                    color: colors.grey[100],
                                    fontWeight: 'bold',
                                    borderBottom: 'none'
                                }}
                            >
                                Item
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{
                                    backgroundColor: colors.blueAccent[800],
                                    color: colors.grey[100],
                                    fontWeight: 'bold',
                                    borderBottom: 'none'
                                }}
                            >
                                Qty
                            </TableCell>
                            <TableCell
                                align="right"
                                sx={{
                                    backgroundColor: colors.blueAccent[800],
                                    color: colors.grey[100],
                                    fontWeight: 'bold',
                                    borderBottom: 'none'
                                }}
                            >
                                Price
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cartItems.map((item) => (
                            <TableRow key={item.id} hover>
                                <TableCell sx={{ color: colors.grey[100], borderBottom: `1px solid ${colors.primary[500]}` }}>
                                    {item.itemName}
                                </TableCell>
                                <TableCell align="center" sx={{ color: colors.grey[100], borderBottom: `1px solid ${colors.primary[500]}` }}>
                                    {item.qty}
                                </TableCell>
                                <TableCell align="right" sx={{ color: colors.greenAccent[500], fontWeight: 'bold', borderBottom: `1px solid ${colors.primary[500]}` }}>
                                    ₹{item.itemPrice * item.qty}
                                </TableCell>
                            </TableRow>
                        ))}
                        {!hasItems && (
                            <TableRow>
                                <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                                    <Box display="flex" flexDirection="column" alignItems="center">
                                        <ProductionQuantityLimitsIcon sx={{ fontSize: 40, color: colors.grey[500], mb: 1 }} />
                                        <Typography color={colors.grey[300]}>
                                            Cart is empty
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={2}
                borderRadius="8px"
                bgcolor={colors.primary[500]}
                mb={3}
            >
                <Typography variant="h5" color={colors.grey[100]}>Total Payment</Typography>
                <Typography variant="h3" color={colors.greenAccent[500]} fontWeight="bold">
                    ₹ {totalAmount.toFixed(2)}
                </Typography>
            </Box>

            <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={onPlaceOrder}
                disabled={!hasItems}
                sx={{
                    py: 1.5,
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    backgroundColor: colors.greenAccent[600],
                    color: '#fff',
                    '&:hover': { backgroundColor: colors.greenAccent[500] },
                    '&.Mui-disabled': { backgroundColor: colors.grey[600], color: colors.grey[300] }
                }}
            >
                PLACE ORDER
            </Button>
        </Paper>
    );
};

export default CartSummary;
