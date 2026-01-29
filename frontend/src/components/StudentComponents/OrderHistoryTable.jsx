import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  Typography,
  Chip,
  Button,
  Tooltip,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
  Fade,
  InputAdornment,
  TextField
} from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import Header from "../admin/common/Header";
import { useNavigate } from "react-router-dom";
import OrderService from "../../services/OrderService";
import { getStudentId } from "../../utils/jwtUtils";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FilterListIcon from '@mui/icons-material/FilterList';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SearchIcon from '@mui/icons-material/Search';

export default function OrderHistoryTable() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, PENDING, SERVED
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders(filterStatus);
  }, [orders, filterStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const studentId = getStudentId();
      if (studentId) {
        const data = await OrderService.getOrdersByStudentId(studentId);
        // Sort orders by time (latest first)
        const sortedData = Array.isArray(data)
          ? data.sort((a, b) => new Date(b.time) - new Date(a.time))
          : [];
        setOrders(sortedData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filterOrders = (status) => {
    if (status === 'ALL') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order =>
        // Handle "Completed" as SERVED for backend consistency if needed
        // Although backend uses SERVED. 
        status === 'COMPLETED' ? order.orderStatus === 'SERVED' : order.orderStatus === status
      ));
    }
  }

  const handleFilterChange = (event, newStatus) => {
    if (newStatus !== null) {
      setFilterStatus(newStatus);
    }
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    // Optional: Add toast here
  }

  // Format date and time
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    const date = new Date(dateTimeString);
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-IN', options);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <Chip label="Pending" color="warning" size="small" sx={{ fontWeight: 'bold' }} variant="filled" />;
      case 'SERVED':
        return <Chip label="Completed" color="success" size="small" sx={{ fontWeight: 'bold' }} variant="filled" />;
      case 'CANCELLED':
        return <Chip label="Cancelled" color="error" size="small" sx={{ fontWeight: 'bold' }} variant="filled" />;
      default:
        return <Chip label={status} size="small" sx={{ fontWeight: 'bold' }} />;
    }
  };

  // Get items summary
  const getItemsSummary = (cartList) => {
    if (!cartList || cartList.length === 0) return "No items";
    const itemNames = cartList.map(item => item.itemName).join(", ");

    return (
      <Tooltip title={itemNames} arrow placement="top">
        <Typography variant="body2" sx={{ cursor: 'pointer', textDecoration: 'underline', textDecorationColor: colors.grey[500] }}>
          {cartList.length === 1 ? cartList[0].itemName : `${cartList.length} items`}
        </Typography>
      </Tooltip>
    );
  };

  const columns = [
    {
      headerName: "Order ID",
      field: "orderId",
      type: "number",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2" fontWeight="bold">#{params.value}</Typography>
          <Tooltip title="Copy ID">
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleCopyId(params.value); }}>
              <ContentCopyIcon fontSize="inherit" sx={{ fontSize: '14px', color: colors.grey[400] }} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    },
    {
      headerName: "Date & Time",
      field: "time",
      flex: 1.2,
      minWidth: 160,
      renderCell: (params) => (
        <Typography variant="body2" color={colors.grey[100]}>
          {formatDateTime(params.value)}
        </Typography>
      ),
    },
    {
      headerName: "Items",
      field: "cartList",
      flex: 1.2,
      minWidth: 120,
      renderCell: (params) => getItemsSummary(params.value),
    },
    {
      headerName: "Status",
      field: "orderStatus",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => getStatusBadge(params.value),
    },
    {
      headerName: "Amount",
      field: "amount",
      type: "number",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body1" fontWeight="bold" color={colors.greenAccent[500]}>
          ₹{params.value}
        </Typography>
      ),
    },
    {
      headerName: "Action",
      field: "actions",
      flex: 0.8,
      minWidth: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          startIcon={<VisibilityIcon />}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/student/orders/display/${params.row.orderId}`, {
              state: params.row,
            });
          }}
          sx={{
            backgroundColor: colors.primary[500],
            color: colors.grey[100],
            border: `1px solid ${colors.blueAccent[700]}`,
            '&:hover': {
              backgroundColor: colors.blueAccent[800],
            }
          }}
        >
          View
        </Button>
      ),
    },
  ];

  // Custom Toolbar
  const CustomToolbar = () => {
    return (
      <GridToolbarContainer sx={{ p: 2, justifyContent: 'space-between', borderBottom: `1px solid ${colors.primary[500]}` }}>
        <Box display="flex" gap={2} alignItems="center">
          <FilterListIcon sx={{ color: colors.grey[300] }} />
          <ToggleButtonGroup
            value={filterStatus}
            exclusive
            onChange={handleFilterChange}
            aria-label="order status filter"
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                color: colors.grey[300],
                borderColor: colors.primary[500],
                '&.Mui-selected': {
                  backgroundColor: colors.blueAccent[700],
                  color: '#fff',
                  '&:hover': { backgroundColor: colors.blueAccent[800] }
                }
              }
            }}
          >
            <ToggleButton value="ALL">All Orders</ToggleButton>
            <ToggleButton value="PENDING">Pending</ToggleButton>
            <ToggleButton value="COMPLETED">Completed</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Typography variant="caption" color={colors.grey[400]}>
          Showing {filteredOrders.length} orders
        </Typography>
      </GridToolbarContainer>
    )
  }

  // Empty state
  if (!loading && orders.length === 0) {
    return (
      <Box m="20px">
        <Header title="Order History" subtitle="Your past orders" />
        <Fade in={true} timeout={800}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="60vh"
            gap={3}
            p={5}
            sx={{
              backgroundColor: colors.primary[400],
              borderRadius: '16px',
              textAlign: 'center'
            }}
          >
            <ReceiptLongIcon sx={{ fontSize: 100, color: colors.grey[600], opacity: 0.5 }} />
            <Box>
              <Typography variant="h3" color={colors.grey[300]} fontWeight="bold" gutterBottom>
                No orders yet
              </Typography>
              <Typography variant="h5" color={colors.grey[500]}>
                Looks like you haven't ordered anything yet. <br />
                Hungry? Check out our delicious menu!
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/student/todaysmenu")}
              sx={{
                mt: 2,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                backgroundColor: colors.greenAccent[600],
                '&:hover': { backgroundColor: colors.greenAccent[700] }
              }}
            >
              Browse Daily Menu
            </Button>
          </Box>
        </Fade>
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Header title="Order History" subtitle="Track your past and current orders" />

      <Card
        sx={{
          mt: 3,
          backgroundColor: colors.primary[400],
          backgroundImage: 'none',
          boxShadow: 3,
          borderRadius: '12px',
          border: `1px solid ${colors.primary[500]}`
        }}
      >
        <Box
          height="70vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${colors.primary[500]}`,
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[800],
              borderBottom: "none",
              fontWeight: 'bold',
              fontSize: '1rem',
              color: colors.grey[100]
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: `1px solid ${colors.primary[500]}`,
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: colors.primary[500],
              cursor: 'pointer'
            }
          }}
        >
          <DataGrid
            getRowId={(row) => row.orderId}
            rows={filteredOrders}
            columns={columns}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            loading={loading}
            slots={{
              toolbar: CustomToolbar
            }}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            onRowClick={(params) => {
              navigate(`/student/orders/display/${params.row.orderId}`, {
                state: params.row,
              });
            }}
          />
        </Box>
      </Card>
    </Box>
  );
}
