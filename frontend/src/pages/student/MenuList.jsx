import React, { useState, useEffect } from "react";
import ItemDailyService from "../../services/ItemDailyService";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Grid, useTheme, CircularProgress } from "@mui/material";
import { tokens } from "../../theme";
import MenuItemCard from "../../components/StudentComponents/MenuItemCard";
import CartSummary from "../../components/StudentComponents/CartSummary";
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

export default function MenuList() {
  const [menuItems, setMenuItems] = useState([]);
  const [order, setOrder] = useState({}); // { itemId: qty }
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const items = await ItemDailyService.getAllItemsDaily();
        setMenuItems(Array.isArray(items) ? items : []);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  const addToOrder = (item) => {
    setOrder(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1
    }));
  };

  const removeFromOrder = (item) => {
    setOrder(prev => {
      const currentQty = prev[item.id] || 0;
      if (currentQty <= 1) {
        const { [item.id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [item.id]: currentQty - 1 };
    });
  };

  const totalAmount = Object.keys(order).reduce((total, itemId) => {
    const menuItem = menuItems.find(item => item.id === parseInt(itemId));
    return total + (menuItem ? menuItem.itemPrice * order[itemId] : 0);
  }, 0);

  const placeOrder = () => {
    const orderList = Object.keys(order).map(itemId => {
      const item = menuItems.find(i => i.id === parseInt(itemId));
      return {
        ...item,
        quantity: order[itemId],
        itemMasterId: item.itemMasterId || item.id, // Ensure ID for backend
        itemId: item.itemId || item.id
      }
    }).filter(i => i.quantity > 0);

    navigate("/student/placeorder", { state: { order: orderList, totalAmount } });
  }

  return (
    <Box p={3} sx={{ backgroundColor: theme.palette.mode === 'dark' ? colors.primary[500] : '#fcfcfc', minHeight: '100vh' }}>
      {/* Header */}
      <Box textAlign="center" mb={4} mt={1}>
        <Typography
          variant="h2"
          color={colors.grey[100]}
          fontWeight="bold"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}
        >
          <RestaurantMenuIcon fontSize="large" sx={{ color: colors.greenAccent[500] }} />
          Today's Menu
        </Typography>
        <Typography variant="h5" color={colors.greenAccent[400]} mt={1}>
          Freshly prepared for you!
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" height="50vh" alignItems="center">
          <CircularProgress color="secondary" size={60} />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {/* Left Side: Menu Items Grid */}
          <Grid item xs={12} lg={8}>
            <Typography variant="h4" fontWeight="600" color={colors.grey[100]} mb={3} ml={1}>
              Available Items ({menuItems.length})
            </Typography>

            <Grid container spacing={3}>
              {menuItems.map((item) => (
                <Grid item key={item.id} xs={12} sm={6} md={4}>
                  <MenuItemCard
                    item={item}
                    orderQty={order[item.id]}
                    onAdd={addToOrder}
                    onRemove={removeFromOrder}
                  />
                </Grid>
              ))}
              {menuItems.length === 0 && (
                <Grid item xs={12}>
                  <Typography variant="h5" color={colors.grey[300]} align="center" mt={4}>
                    Sorry, no items are currently available on the menu.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Grid>

          {/* Right Side: Cart Summary (Sticky) */}
          <Grid item xs={12} lg={4}>
            <CartSummary
              order={order}
              menuItems={menuItems}
              totalAmount={totalAmount}
              onPlaceOrder={placeOrder}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
