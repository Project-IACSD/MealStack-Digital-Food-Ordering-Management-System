import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  useTheme,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Fade,
  CircularProgress
} from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import Header from "../admin/common/Header";
import RechargeHistoryService from '../../services/RechargeHistoryService.jsx';
import StudentService from '../../services/studentService';
import { getStudentId } from '../../utils/jwtUtils';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

export default function RechargeHistoryTable() {
  const [rechargeHistory, setRechargeHistory] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const studentId = getStudentId();
        if (studentId) {
          // Parallel fetch for better performance
          const [historyRes, balanceRes] = await Promise.all([
            RechargeHistoryService.getAllRechargeHistoryByStudentId(Number(studentId)),
            StudentService.getBalance(studentId)
          ]);

          // Handle History Data
          let data = Array.isArray(historyRes) ? historyRes : (historyRes?.data && Array.isArray(historyRes.data) ? historyRes.data : []);
          // Sort by latest first
          data.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
          setRechargeHistory(data);

          // Handle Balance
          setBalance(balanceRes);
        }
      } catch (err) {
        console.error("Error fetching recharge history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const columns = [
    {
      headerName: "Transaction ID",
      field: "transactionId",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2" fontWeight="bold" sx={{ fontFamily: 'monospace', color: colors.grey[100] }}>
            {params.value}
          </Typography>
          <Tooltip title="Copy ID">
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleCopyId(params.value); }}>
              <ContentCopyIcon fontSize="inherit" sx={{ fontSize: '14px', color: colors.grey[400] }} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    },
    {
      headerName: "Amount Added",
      field: "amountAdded",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="h6" fontWeight="bold" color={colors.greenAccent[500]}>
          + ₹{params.value}
        </Typography>
      )
    },
    {
      headerName: "Details",
      field: "paymentId",
      flex: 1.2,
      minWidth: 150,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" color={colors.grey[100]}>
            Wallet Recharge
          </Typography>
          <Typography variant="caption" color={colors.grey[400]}>
            {params.value ? `Ref: ${params.value}` : 'System Credit'}
          </Typography>
        </Box>
      )
    },
    {
      headerName: "Date & Time",
      field: "timeStamp",
      flex: 1.2,
      minWidth: 180,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1} height="100%">
          <AccessTimeFilledIcon sx={{ fontSize: 16, color: colors.grey[500] }} />
          <Typography variant="body2" color={colors.grey[100]}>
            {formatDateTime(params.value)}
          </Typography>
        </Box>
      ),
    },
    {
      headerName: "Status",
      field: "status",
      flex: 0.8,
      minWidth: 120,
      renderCell: () => (
        <Chip
          icon={<CheckCircleIcon />}
          label="Success"
          color="success"
          size="small"
          variant="filled"
          sx={{ fontWeight: 'bold' }}
        />
      )
    }
  ];

  if (!loading && rechargeHistory.length === 0) {
    return (
      <Box m="20px">
        <Header title="Recharge History" subtitle="View your wallet transactions" />

        {/* Wallet Card even if empty history */}
        {balance !== null && (
          <Card sx={{ mt: 3, mb: 4, background: `linear-gradient(135deg, ${colors.blueAccent[700]} 0%, ${colors.blueAccent[500]} 100%)`, maxWidth: 400 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <AccountBalanceWalletIcon sx={{ fontSize: 40, color: "#fff" }} />
                <Box>
                  <Typography variant="h5" color="#e0e0e0">Current Balance</Typography>
                  <Typography variant="h2" fontWeight="bold" color="#fff">₹ {balance.toFixed(2)}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="50vh" gap={2}>
          <ReceiptLongIcon sx={{ fontSize: 80, color: colors.grey[600], opacity: 0.5 }} />
          <Typography variant="h4" color={colors.grey[400]}>No recharge history found</Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box m="20px">
      <Header title="Recharge History" subtitle="Track your wallet top-ups" />

      {/* Top Section: Wallet Summary */}
      <Fade in={!loading}>
        <Box mb={4} mt={3}>
          {balance !== null ? (
            <Card sx={{
              background: `linear-gradient(to right, ${colors.primary[400]}, ${colors.blueAccent[800]})`,
              maxWidth: 350,
              borderRadius: '16px',
              boxShadow: 6
            }}>
              <CardContent sx={{ p: '24px !important' }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h6" color={colors.grey[300]} fontWeight="500">
                      Wallet Balance
                    </Typography>
                    <Typography variant="h2" fontWeight="bold" color="#fff" sx={{ mt: 1 }}>
                      ₹ {balance.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box
                    bgcolor="rgba(255,255,255,0.1)"
                    p={1.5}
                    borderRadius="50%"
                    display="flex"
                  >
                    <AccountBalanceWalletIcon sx={{ fontSize: 32, color: colors.greenAccent[400] }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ) : null}
        </Box>
      </Fade>

      {/* Table Section */}
      <Card sx={{ backgroundColor: colors.primary[400], borderRadius: '12px', boxShadow: 3 }}>
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
              fontSize: "1rem"
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: `1px solid ${colors.primary[500]}`,
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-row:hover": { // Hover effect
              backgroundColor: colors.primary[500]
            }
          }}
        >
          <DataGrid
            loading={loading}
            getRowId={(row) => row.transactionId}
            rows={rechargeHistory}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
          />
        </Box>
      </Card>
    </Box>
  );
}
