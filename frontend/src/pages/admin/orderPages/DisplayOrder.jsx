import React from 'react'
import OrderDetails from '../../../components/admin/order/OrderDetails'
import { Box } from "@mui/material";
import OrderService from '../../../services/OrderService';
import { useNavigate } from 'react-router-dom';

export default function DisplayOrder() {
  const navigate = useNavigate();

  const completeOrder = async (id) => {
    try {
      await OrderService.updateOrderStatus(id, 'SERVED');
      console.log("Order marked as completed");
      // Navigate back to pending orders list
      navigate('/admin/orders/pending');
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to mark order as completed. Please try again.");
    }
  }
  return (
    <Box>
      <OrderDetails action="display" takeAction={completeOrder}></OrderDetails>
    </Box>
  )
}
