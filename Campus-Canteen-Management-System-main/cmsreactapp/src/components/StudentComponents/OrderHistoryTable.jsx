import React from "react";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockData1 } from "../../pages/admin/orderPages/mockData1";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../admin/common/Header";
import { useNavigate } from "react-router-dom";

export default function OrderHistoryTable() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const columns = [
    {
      headerName: "Order Id",
      field: "orderId",
      type: "number",
      flex: 1,
    },
    {
      headerName: "Order Qty",
      field: "qty",
      type: "number",
      flex: 1,
    },
    {
      headerName: "Amount",
      field: "amount",
      type: "number",
      flex: 1,
    },
  ];

  const handleRowClick = (params) => {
    const order = mockData1.find(
      (item) => item.orderId === Number(params.id)
    );

    navigate(`/student/orders/display/${params.id}`, {
      state: order,
    });
  };

  return (
    <Box m="20px">
      <Header title="Order History" subtitle="Your past orders" />

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
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
        }}
      >
        <DataGrid
          getRowId={(row) => row.orderId}
          rows={mockData1}
          columns={columns}
          onRowClick={handleRowClick}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
        />
      </Box>
    </Box>
  );
}
