import React, { useEffect, useState } from "react";
import { Grid, Snackbar, Alert } from '@mui/material';
import ItemMasterTable from '../../../components/admin/menu/ItemMasterTable';
import ItemDailyTable from '../../../components/admin/menu/ItemDailyTable';
import MenuService from "../../../api/menuService";
import { useAuth } from "../../../auth/AuthContext";

export default function MenuSelector() {
  const [itemsData, setItemsData] = useState([]);
  const [dailyMenuItems, setDailyMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { role, token } = useAuth();

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Fetch Items from backend
  const fetchItemsData = async () => {
    try {
      const [inventoryRes, dailyRes] = await Promise.all([
        MenuService.getAllItems(),
        MenuService.getAllItemsDaily().catch(err => {
          console.warn("Failed to fetch daily items independently.", err);
          return [];
        })
      ]);

      let data = Array.isArray(inventoryRes) ? inventoryRes : (inventoryRes?.data || inventoryRes || []);
      if (!Array.isArray(data)) data = [];
      data = data.filter(item => item && (item.id !== undefined && item.id !== null));
      setItemsData(data);

      let dailyData = Array.isArray(dailyRes) ? dailyRes : (dailyRes?.data || dailyRes || []);
      if (!Array.isArray(dailyData)) dailyData = [];

      const formattedDailyItems = dailyData.map(dailyItem => {
        // With Surrogate Keys: dailyItem.id (or dailyId) is unique transaction ID. 
        // dailyItem.itemId is the foreign key to ItemMaster.
        let masterId = dailyItem.itemId || dailyItem.itemMasterId;

        let inventoryItem = null;
        if (masterId) {
          inventoryItem = data.find(inv => String(inv.id) === String(masterId));
        }

        // Fallback: If Master ID is missing or not found, try to match by Item Name
        if (!inventoryItem && dailyItem.itemName) {
          inventoryItem = data.find(inv => inv.itemName.trim().toLowerCase() === dailyItem.itemName.trim().toLowerCase());
          if (inventoryItem) {
            masterId = inventoryItem.id;
          }
        }

        // Final Fallback: Use surrogate ID if available (though less reliable for Master ID)
        if (!masterId) {
          masterId = dailyItem.id;
        }

        return {
          ...dailyItem,
          // Use Surrogate ID if available, else fall back to Master ID (legacy support)
          id: dailyItem.dailyId || dailyItem.id || masterId,
          // Ensure we preserve the Master ID for logic
          itemId: masterId,
          itemName: dailyItem.itemName || inventoryItem?.itemName || "Unknown Item",
          itemPrice: dailyItem.itemPrice || inventoryItem?.itemPrice || 0,
          itemCategory: dailyItem.itemCategory || inventoryItem?.itemCategory || "",
          initialQty: dailyItem.initialQty || 1,
          soldQty: dailyItem.soldQty || 0
        };
      });
      setDailyMenuItems(formattedDailyItems);

    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar("Failed to fetch menu data. Check console for details.", "error");
    }
  };

  useEffect(() => {
    fetchItemsData();
  }, []);

  const handleAddToDaily = (selectionModel) => {
    let selectedIds = [];
    if (Array.isArray(selectionModel)) {
      selectedIds = selectionModel;
    } else if (selectionModel instanceof Set) {
      selectedIds = Array.from(selectionModel);
    } else if (selectionModel?.ids instanceof Set) {
      selectedIds = Array.from(selectionModel.ids);
    }

    if (!selectedIds || selectedIds.length === 0) {
      showSnackbar("No items selected", "info");
      return;
    }

    const newItems = itemsData.filter(item =>
      selectedIds.some(id => String(id) === String(item.id))
    );

    const uniqueNewItems = newItems.filter(newItem =>
      !dailyMenuItems.some(dailyItem => String(dailyItem.itemId) === String(newItem.id))
    );

    if (uniqueNewItems.length === 0) {
      showSnackbar("Selected items already in Daily Menu.", "warning");
      return;
    }

    const itemsWithQty = uniqueNewItems.map(item => ({
      ...item,
      itemId: item.id, // Explicitly map Master ID for consistency
      initialQty: 1,
      soldQty: 0
    }));

    setDailyMenuItems([...dailyMenuItems, ...itemsWithQty]);
    showSnackbar(`Added ${itemsWithQty.length} items to selection.`, "success");
  }

  const handleUpdateQuantity = (id, newQty) => {
    setDailyMenuItems(prevItems =>
      prevItems.map(item =>
        item.id == id ? { ...item, initialQty: parseInt(newQty) || 0 } : item
      )
    );
  }

  const handleRemoveFromDaily = (id) => {
    setDailyMenuItems(prevItems => prevItems.filter(item => item.id != id));
  }

  const handleConfirmMenu = async () => {
    if (dailyMenuItems.length === 0) {
      showSnackbar("Daily menu is empty", "warning");
      return;
    }

    if (!token) {
      showSnackbar("Session expired. Please log in again.", "error");
      return;
    }

    if (role !== 'ADMIN') {
      showSnackbar(`Current role (${role}) is NOT Admin. Please log in as Admin.`, "error");
      return;
    }

    setLoading(true);
    let successCount = 0;
    let failItems = [];

    try {
      console.log("Confirming Daily Menu (Sequential Loop):", dailyMenuItems);

      // Sequentially add each item to the daily menu
      for (const item of dailyMenuItems) {
        try {
          // IMPORTANT: The backend endpoint is POST /dailyitems/{itemMasId}
          // We MUST use item.itemId (which maps to Master ID)
          await MenuService.addDailyItem({ ...item, id: item.itemId });
          successCount++;
        } catch (err) {
          console.error(`Failed to add item: ${item.itemName}`, err);
          // Extract error message if available
          const backendMsg = err.response?.data?.message || err.message || JSON.stringify(err);
          failItems.push(`${item.itemName} (${backendMsg})`);
        }
      }

      if (failItems.length === 0) {
        showSnackbar("Successfully saved all daily menu items!", "success");
        fetchItemsData();
      } else if (successCount > 0) {
        showSnackbar(`Partially saved. Failed for: ${failItems.join(", ")}`, "warning");
        fetchItemsData();
      } else {
        const firstError = failItems[0];
        showSnackbar(`Failed to save: ${firstError}`, "error");
      }
    } catch (error) {
      console.error("Confirm Process Error:", error);
      showSnackbar("A critical error occurred while processing the menu.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Grid container spacing={2} sx={{ p: "10px" }}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ItemMasterTable
          items={itemsData}
          onAddItems={handleAddToDaily}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ItemDailyTable
          items={dailyMenuItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveFromDaily}
          onConfirm={handleConfirmMenu}
          loading={loading}
        />
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  )
}
