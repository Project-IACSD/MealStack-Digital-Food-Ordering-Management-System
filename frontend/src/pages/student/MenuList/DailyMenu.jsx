import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Alert
} from "@mui/material";
import { tokens } from "../../../theme";
import ItemDailyService from "../../../services/ItemDailyService";
import { useNavigate } from "react-router-dom";
// Use a placeholder if defimg fails import, but we'll try to import it safely or usage text
import defimg from '../../../assets/pick-meals-image.png';

export default function DailyMenu() {
  const navigate = useNavigate();
  const theme = useTheme();
  // Safe fallback for tokens
  const colors = tokens ? tokens(theme.palette.mode) : { grey: { 100: "#ccc" }, primary: { 400: "#333", 500: "#000" }, greenAccent: { 500: "green" } };

  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState({});
  const [error, setError] = useState(null);

  const current = new Date();
  const dateStr = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayString = daysOfWeek[current.getDay()];

  console.log("DailyMenu: Rendering...");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        console.log("DailyMenu: Fetching items...");
        // Check if service exists
        if (!ItemDailyService) {
          throw new Error("ItemDailyService is not defined");
        }

        const items = await ItemDailyService.getAllItemsDaily();
        console.log("DailyMenu: Fetched items:", items);
        if (Array.isArray(items)) {
          setMenuItems(items);
        } else {
          console.error("DailyMenu: Items is not an array", items);
          setMenuItems([]);
        }
      } catch (error) {
        console.error("Error fetching daily menu:", error);
        setError("Could not load menu. Please try again later.");
        setMenuItems([]);
      }
    };
    fetchMenu();
  }, []);

  const addToCart = (id) => {
    setCart(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => {
      const newQty = (prev[id] || 0) - 1;
      if (newQty <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: newQty };
    });
  };

  const totalAmount = Object.keys(cart).reduce((total, id) => {
    const item = menuItems.find(m => m.id === parseInt(id));
    return total + (item ? item.itemPrice * cart[id] : 0);
  }, 0);

  const checkout = () => {
    const orderItems = Object.keys(cart).map(id => {
      const item = menuItems.find(m => m.id === parseInt(id));
      if (!item) return null;
      return {
        ...item,
        quantity: cart[id],
        itemMasterId: item.itemMasterId || item.id,
        itemId: item.itemMasterId || item.id
      };
    }).filter(Boolean); // Remove nulls
    navigate("/student/placeorder", { state: { order: orderItems, totalAmount } });
  };

  if (!colors) return <div>Loading Theme...</div>;

  return (
    <Box p={3} sx={{ backgroundColor: theme.palette.mode === "dark" ? colors.primary[500] : "#fcfcfc", minHeight: '100vh' }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h2" color={colors.grey[100]} fontWeight="bold">
          Daily Menu
        </Typography>
        <Typography variant="h5" color={colors.greenAccent[500]} sx={{ mt: 1 }}>
          {dayString}, {dateStr}
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={4}>
        {/* Menu Items Grid */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Typography variant="h4" color={colors.grey[100]} gutterBottom sx={{ mb: 3 }}>
            Select Your Items
          </Typography>
          <Grid container spacing={3}>
            {menuItems.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                <Card sx={{
                  backgroundColor: colors.primary[400],
                  borderRadius: '16px',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.02)' }
                }}>
                  <CardMedia
                    component="img"
                    height="160"
                    // Use itemImgLink if available, else defimg. 
                    image={item.itemImgLink ? item.itemImgLink : defimg}
                    alt={item.itemName}
                    onError={(e) => { e.target.src = defimg; }} // Fallback if URL fails
                    sx={{
                      objectFit: 'cover',
                      height: '160px',
                      width: '100%'
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" fontWeight="bold" color={colors.grey[100]} noWrap>
                      {item.itemName}
                    </Typography>
                    <Typography variant="h6" color={colors.greenAccent[500]}>
                      ₹{item.itemPrice}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', pb: 2, px: 2 }}>
                    <Button
                      variant="contained"
                      color="error" // Ensure color is valid MUI (error, success, warning, info, primary, secondary)
                      size="small"
                      onClick={() => removeFromCart(item.id)}
                      disabled={!cart[item.id]}
                    >
                      -
                    </Button>
                    <Typography variant="h5" color={colors.grey[100]}>{cart[item.id] || 0}</Typography>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => addToCart(item.id)}
                    >
                      +
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
            {menuItems.length === 0 && !error && (
              <Typography variant="h6" color={colors.grey[300]} sx={{ ml: 2 }}>
                No items available for today.
              </Typography>
            )}
          </Grid>
        </Grid>

        {/* Cart Sidebar */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper sx={{
            p: 3,
            backgroundColor: colors.primary[400],
            borderRadius: '16px',
            position: 'sticky',
            top: '100px'
          }}>
            <Typography variant="h4" color={colors.grey[100]} gutterBottom>
              Your Cart
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TableContainer sx={{ mb: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: colors.grey[300] }}>Item</TableCell>
                    <TableCell align="center" sx={{ color: colors.grey[300] }}>Qty</TableCell>
                    <TableCell align="right" sx={{ color: colors.grey[300] }}>Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(cart).map(id => {
                    const item = menuItems.find(m => m.id === parseInt(id));
                    if (!item) return null;
                    return (
                      <TableRow key={id}>
                        <TableCell sx={{ color: colors.grey[100] }}>{item.itemName}</TableCell>
                        <TableCell align="center" sx={{ color: colors.grey[100] }}>{cart[id]}</TableCell>
                        <TableCell align="right" sx={{ color: colors.grey[100] }}>₹{item.itemPrice * cart[id]}</TableCell>
                      </TableRow>
                    );
                  })}
                  {Object.keys(cart).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ color: colors.grey[400], py: 4 }}>
                        Cart is empty
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography variant="h5" color={colors.grey[100]}>Total:</Typography>
              <Typography variant="h4" color={colors.greenAccent[500]} fontWeight="bold">
                ₹{totalAmount.toFixed(2)}
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={totalAmount === 0}
              onClick={checkout}
              sx={{
                backgroundColor: colors.greenAccent[400],
                color: colors.primary[500],
                fontWeight: "bold",
                fontSize: "1.1rem",
                "&:hover": { backgroundColor: colors.greenAccent[300] }
              }}
            >
              Checkout Order
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
