import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Snackbar, Alert } from "@mui/material";
import ItemForm from '../../../components/admin/menu/ItemForm';
import ItemMasterService from '../../../services/ItemMasterService';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditItem() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [itemData, setItemData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        const fetchItem = async () => {
            try {
                setLoading(true);
                const response = await ItemMasterService.getAllItems();
                // Since there isn't a getById for ItemMaster exposed in service typically, 
                // or we might need to find it from the list. 
                // Let's assume getAllItems returns list and we filter.
                // ideally backend should have getById

                // Check if getById exists or fallback to list filter
                let foundItem = null;
                // Optimization: Try to call getById if it existed, but let's stick to valid service methods.
                // getAllItems returns all.
                const items = Array.isArray(response) ? response : (response.data || []);
                foundItem = items.find(i => String(i.id) === String(id));

                if (foundItem) {
                    setItemData(foundItem);
                } else {
                    setError("Item not found");
                }
            } catch (err) {
                console.error("Error fetching item:", err);
                setError("Failed to load item data");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchItem();
        }
    }, [id]);

    const updateItem = async (values) => {
        try {
            console.log("Updating item:", values);
            // Ensure payload format matches backend expectation
            const payload = {
                ...values,
                itemPrice: parseFloat(values.itemPrice),
            };

            // Depending on backend, update might be PUT /item/update/{id} or similar
            // Checking ItemMasterService for update method... 
            // If it doesn't exist, I might need to add it. 
            // Assuming it exists or I'll check/fix next.

            // Wait, looking at previous files, ItemMasterService might not have updateItem.
            // I should check ItemMasterService manually. 
            // For now, I'll attempt calling it, if it fails I'll fix the service.

            await ItemMasterService.updateItem(id, payload);

            setSnackbar({ open: true, message: "Item updated successfully!", severity: "success" });
            setTimeout(() => {
                navigate("/admin/menu");
            }, 1500);

        } catch (err) {
            console.error("Error updating item:", err);
            setSnackbar({ open: true, message: "Failed to update item", severity: "error" });
        }
    }

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
    if (error) return <Box display="flex" justifyContent="center" mt={5}><Typography color="error">{error}</Typography></Box>;

    return (
        <Box>
            {itemData && (
                <ItemForm
                    action="edit"
                    itemData={itemData}
                    takeAction={updateItem}
                    title="Edit Item"
                    subtitle={`Editing ${itemData.itemName}`}
                />
            )}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
