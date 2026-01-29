import React, { useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../common/Header";
import PostAddIcon from '@mui/icons-material/PostAdd';
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

export default function ItemMasterTable({ items = [], onAddItems }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  const colStructure = [
    {
      headerName: "Item Id",
      field: "id",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 1
    },
    {
      headerName: "Item Name",
      field: "itemName",
      headerAlign: "center",
      align: "center",
      flex: 1
    },
    {
      headerName: "Item Price",
      field: "itemPrice",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 1
    },
    {
      headerName: "Item Category",
      field: "itemCategory",
      type: "text",
      headerAlign: "center",
      align: "center",
      flex: 1
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: ({ row: { id } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
          >
            <Button
              color="secondary"
              variant="contained"
              onClick={() => navigate(`/admin/menu/edit/${id}`)}
              startIcon={<EditIcon />}
            >
              Edit
            </Button>
          </Box>
        );
      },
    }
  ];

  const addItem = () => {
    navigate("/admin/menu/add")
  }


  const handleAddToDaily = () => {
    if (onAddItems) {
      onAddItems(rowSelectionModel);
    }
  }

  return (
    <Box m="20px">
      <Header
        title="Menu Items in Inventory"
        subtitle="All menu items previously registered"
      ></Header>
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
          getRowId={(row) => row.id}
          rows={items}
          columns={colStructure}
          checkboxSelection
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
        ></DataGrid>
      </Box>
      <Grid container spacing={2} sx={{ mt: "10px" }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: colors.blueAccent[400],
              width: "100%"
            }}
            onClick={addItem}
          >
            <PostAddIcon />
            &nbsp;&nbsp;Add New Item To Inventory
          </Button>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: colors.greenAccent[600],
              width: "100%"
            }}
            onClick={handleAddToDaily}
            disabled={rowSelectionModel.length === 0}
          >
            <PlaylistAddIcon />
            &nbsp;&nbsp;Add Selected to Daily Menu
          </Button>
          <div></div>
        </Grid>
      </Grid>
    </Box>
  );
}
