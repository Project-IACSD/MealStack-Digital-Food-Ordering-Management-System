import React from 'react';
import { Box, Button, Grid, TextField, CircularProgress, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../common/Header";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ItemDailyTable({ items = [], onUpdateQuantity, onRemoveItem, onConfirm, loading = false }) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const colStructure = [
        {
            headerName: "ID",
            field: "id",
            flex: 0.5,
            minWidth: 50,
        },
        {
            headerName: "Item Name",
            field: "itemName",
            flex: 2,
            minWidth: 150,
        },
        {
            headerName: "Price",
            field: "itemPrice",
            type: "number",
            headerAlign: "left",
            align: "left",
            flex: 1,
            minWidth: 100,
        },
        {
            headerName: "Initial Qty",
            field: "initialQty",
            flex: 1,
            minWidth: 120,
            renderCell: (params) => {
                const id = params.row.id;
                return (
                    <TextField
                        type='number'
                        variant="outlined"
                        size="small"
                        inputProps={{ min: 1, style: { padding: '5px' } }}
                        value={params.row.initialQty}
                        onChange={(e) => onUpdateQuantity(id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        sx={{ width: "80px" }}
                    />
                )
            }
        },
        {
            headerName: "Sold Qty",
            field: "soldQty",
            type: "number",
            headerAlign: "left",
            align: "left",
            flex: 0.8,
            minWidth: 80,
            renderCell: (params) => {
                const soldQty = params.row.soldQty || 0;
                return (
                    <Box sx={{ fontWeight: 'bold', color: colors.greenAccent[400] }}>
                        {soldQty}
                    </Box>
                );
            }
        },
        {
            headerName: "Available",
            field: "available",
            flex: 1.2,
            minWidth: 140,
            renderCell: (params) => {
                const initialQty = params.row.initialQty || 0;
                const soldQty = params.row.soldQty || 0;
                const available = initialQty - soldQty;

                // Low-stock indicators
                let color, bgColor, label;
                if (available <= 0) {
                    color = colors.redAccent[400];
                    bgColor = colors.redAccent[700];
                    label = "SOLD OUT";
                } else if (available < 5) {
                    color = colors.redAccent[300];
                    bgColor = colors.redAccent[800];
                    label = "LOW";
                } else if (available <= 10) {
                    color = colors.orangeAccent[300];
                    bgColor = colors.orangeAccent[800];
                    label = "MEDIUM";
                } else {
                    color = colors.greenAccent[300];
                    bgColor = colors.greenAccent[800];
                    label = "IN STOCK";
                }

                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{
                            fontWeight: 'bold',
                            color: color,
                            minWidth: '30px'
                        }}>
                            {available}
                        </Box>
                        <Chip
                            label={label}
                            size="small"
                            sx={{
                                backgroundColor: bgColor,
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '0.7rem'
                            }}
                        />
                    </Box>
                );
            }
        },
        {
            headerName: "Actions",
            field: "actions",
            flex: 1,
            minWidth: 100,
            renderCell: (params) => {
                return (
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => onRemoveItem(params.row.id)}
                    >
                        <DeleteIcon />
                    </Button>
                )
            }
        }
    ];

    return (
        <Box m="20px">
            <Header
                title="Daily items"
                subtitle="Menu items for today"
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
                    getRowId={(row) => row.id}
                    rows={items}
                    columns={colStructure}
                    disableRowSelectionOnClick
                    pageSizeOptions={[5, 10, 25]}
                    autoHeight
                    initialState={{
                        pagination: { paginationModel: { pageSize: 5 } },
                    }}
                />
            </Box>

            <Grid container spacing={2} sx={{ mt: "10px" }}>
                <Grid size={12}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: colors.greenAccent[600],
                            width: "100%",
                            padding: "10px",
                            "&:disabled": {
                                backgroundColor: colors.primary[400],
                            }
                        }}
                        onClick={onConfirm}
                        disabled={items.length === 0 || loading}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            <>
                                <CheckCircleIcon />
                                &nbsp;&nbsp;Confirm Daily Menu
                            </>
                        )}
                    </Button>
                </Grid>
            </Grid>
        </Box >
    );
}
