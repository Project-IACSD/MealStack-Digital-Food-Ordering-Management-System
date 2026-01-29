import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, Chip } from "@mui/material";
import { tokens } from "../../../theme";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Header from "../../../components/admin/common/Header";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";
import OrderService from "../../../services/OrderService";

export default function PendingOrderTable() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [pendingOrders, setPendingOrders] = useState([]);

  useEffect(() => {
    loadPendingOrders();
  }, []);

  const loadPendingOrders = async () => {
    try {
      const data = await OrderService.getPendingOrders();
      setPendingOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load pending orders", error);
    }
  };

  const viewOrder = (event, params) => {
    event.stopPropagation();
    navigate(`/admin/orders/display/${params.id}`, { state: params.row });
  };

  const markCompleted = async (event, params) => {
    event.stopPropagation();
    try {
      await OrderService.updateOrderStatus(params.id, "SERVED");

      // Show success message
      alert(`Order #${params.id} marked as completed successfully!`);

      // Refresh pending orders list
      await loadPendingOrders();
    } catch (error) {
      console.error("Failed to update order status", error);

      // Show detailed error message
      const errorMsg = error.response?.data?.message || error.message || "Unknown error";
      alert(`Failed to mark order as completed: ${errorMsg}`);
    }
  };

  const cancelOrder = (event, params) => {
    event.stopPropagation();
    navigate(`/admin/orders/delete/${params.id}`, { state: params.row });
  };

  const displayOrder = (params) => {
    navigate(`/admin/orders/display/${params.id}`, { state: params.row });
  };

  // Format date and time
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <Chip label="Pending" color="warning" size="small" />;
      case 'SERVED':
        return <Chip label="Served" color="success" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const colStructure = [
    {
      headerName: "Order ID",
      field: "orderId",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 0.8,
    },
    {
      headerName: "Student Name",
      field: "studentName", // Fixed: was "name"
      type: "text",
      headerAlign: "left",
      align: "left",
      flex: 1.5,
    },
    {
      headerName: "Order Time",
      field: "time",
      headerAlign: "left",
      align: "left",
      flex: 1.3,
      renderCell: (params) => (
        <Typography variant="body2">
          {formatDateTime(params.value)}
        </Typography>
      )
    },
    {
      headerName: "Qty",
      field: "qty",
      type: "number",
      headerAlign: "center",
      align: "center",
      flex: 0.6,
    },
    {
      headerName: "Amount",
      field: "amount",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 0.8,
      renderCell: (params) => (
        <Typography fontWeight="bold">
          ₹{params.value}
        </Typography>
      )
    },
    {
      headerName: "Payment",
      field: "paymentMethod",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      headerName: "Status",
      field: "orderStatus",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => getStatusBadge(params.value)
    },
    {
      headerName: "Actions",
      type: "actions",
      headerAlign: "left",
      align: "left",
      flex: 1,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<VisibilityIcon />}
          label="View Details"
          onClick={(event) => viewOrder(event, params)}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<CheckCircleIcon />}
          label="Mark Completed"
          onClick={(event) => markCompleted(event, params)}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<CancelIcon />}
          label="Cancel Order"
          onClick={(event) => cancelOrder(event, params)}
          showInMenu
          sx={{ color: 'error.main' }}
        />
      ],
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="Pending Orders"
        subtitle="Orders awaiting preparation and completion"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[800],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[800],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          getRowId={(row) => row.orderId}
          rows={pendingOrders}
          columns={colStructure}
          onRowClick={displayOrder}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 25]}
        />
      </Box>
    </Box>
  );
}
