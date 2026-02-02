import React, { useEffect, useState } from "react";
import { Grid, Snackbar, Alert } from '@mui/material';
import ItemMasterTable from '../../../components/admin/menu/ItemMasterTable';
import ItemDailyTable from '../../../components/admin/menu/ItemDailyTable';
import MenuService from "../../../api/menuService";
import { useAuth } from "../../../auth/AuthContext";

export default function MenuSelector() {
  const [itemsData, setItemsData] = useState([]); // Pure Inventory (Master)
  const [dailyMenuItems, setDailyMenuItems] = useState([]); // Pure Daily (Transaction)
  const [loading, setLoading] = useState(false);
  const { role, token } = useAuth();

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
  const showSnackbar = (message, severity = "success") => setSnackbar({ open: true, message, severity });

  // --- Fetch Data Strictly Separated ---
  const fetchItemsData = async () => {
    try {
      const [inventoryRes, dailyRes] = await Promise.all([
        MenuService.getAllItems(),
        MenuService.getAllItemsDaily()
      ]);

      // 1. Process Inventory
      let inventoryList = Array.isArray(inventoryRes) ? inventoryRes : (inventoryRes?.data || []);
      setItemsData(inventoryList);

      // 2. Process Daily Items
      // The backend returns ItemDailyDTO objects. We display them directly.
      let dailyList = Array.isArray(dailyRes) ? dailyRes : (dailyRes?.data || []);

      // Map backend DTOs to standard table format if needed, but keep them distinct
      const formattedDaily = dailyList.map(item => ({
        ...item,
        id: item.dailyId || item.id, // Ensure unique ID for table key
        itemId: item.itemId || item.itemMasterId, // Reference to Master
        initialQty: item.initialQty,
        soldQty: item.soldQty,
        // If the backend DTO includes name/price/cat, use them. If not, match with inventory for display only.
        itemName: item.itemName || inventoryList.find(inv => inv.id === (item.itemId || item.itemMasterId))?.itemName || "Unknown",
        itemPrice: item.itemPrice || inventoryList.find(inv => inv.id === (item.itemId || item.itemMasterId))?.itemPrice || 0,
        itemCategory: item.itemCategory || inventoryList.find(inv => inv.id === (item.itemId || item.itemMasterId))?.itemCategory || ""
      }));

      setDailyMenuItems(formattedDaily);

    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar("Failed to refresh menu data.", "error");
    }
  };

  useEffect(() => {
    fetchItemsData();
  }, []);

  // --- Add to Daily (Drafting) ---
  const handleAddToDaily = (selectionModel) => {
    let selectedIds = [];
    if (Array.isArray(selectionModel)) selectedIds = selectionModel;
    else if (selectionModel instanceof Set) selectedIds = Array.from(selectionModel);
    else if (selectionModel?.ids instanceof Set) selectedIds = Array.from(selectionModel.ids);

    if (!selectedIds.length) return;

    // Filter items from Inventory
    const selectedMasterItems = itemsData.filter(item =>
      selectedIds.some(id => String(id) === String(item.id))
    );

    // Prevent Duplicates in Frontend Draft
    const newItems = selectedMasterItems.filter(masterItem =>
      !dailyMenuItems.some(dailyItem => String(dailyItem.itemId) === String(masterItem.id))
    );

    if (newItems.length === 0) {
      showSnackbar("Selected items are already in today's menu.", "warning");
      return;
    }

    // Create Draft Daily Items
    const draftItems = newItems.map(item => ({
      ...item,
      id: `draft-${item.id}-${Date.now()}`, // Temporary ID for UI key
      itemId: item.id, // Explicit link to Master
      initialQty: 50, // Default start quantity
      soldQty: 0,
      isDraft: true // Mark as unsaved
    }));

    setDailyMenuItems([...dailyMenuItems, ...draftItems]);
    showSnackbar(`Added ${draftItems.length} items to pending list. Set Qty & Confirm!`, "info");
  };

  const handleUpdateQuantity = (id, newQty) => {
    setDailyMenuItems(prev => prev.map(item =>
      item.id === id ? { ...item, initialQty: parseInt(newQty) || 0 } : item
    ));
  };

  const handleRemoveFromDaily = async (id) => {
    const idStr = String(id);

    // 1. If Draft -> Just remove from Client State
    if (idStr.startsWith('draft') || idStr.startsWith('dr')) {
      setDailyMenuItems(prev => prev.filter(item => item.id !== id));
      showSnackbar("Removed draft item.", "info");
      return;
    }

    // 2. If Saved in DB -> Confirm & Call API
    if (window.confirm("Delete this item from today's menu? This cannot be undone.")) {
      try {
        await MenuService.deleteDailyItem(id);
        setDailyMenuItems(prev => prev.filter(item => item.id !== id));
        showSnackbar("Deleted from Daily Menu.", "success");
      } catch (error) {
        console.error("Delete failed", error);
        showSnackbar("Failed to delete from database.", "error");
      }
    }
  };

  // --- Confirm & Save ---
  const handleConfirmMenu = async () => {
    if (!dailyMenuItems.length) return;
    setLoading(true);

    // Only save items marked as 'draft' or if we want to update all, logic depends on backend capabilities.
    // The previous logic attempted to save EVERYTHING. 
    // Ideally, we should filter for "New" or "Modified" items, but to be safe and ensure sync, we can try saving all UNLESS they have a real 'dailyId'.
    // However, the backend 'addDailyItem' often throws error if exists. 
    // Let's focus on saving NEW items (drafts).

    const itemsToSave = dailyMenuItems.filter(item => item.isDraft);

    if (itemsToSave.length === 0) {
      showSnackbar("No new items to save.", "info");
      setLoading(false);
      return;
    }

    let successCount = 0;
    let failItems = [];

    for (const item of itemsToSave) {
      try {
        await MenuService.addDailyItem({
          id: item.itemId, // Master ID for the endpoint path
          initialQty: item.initialQty,
          itemName: item.itemName
        });
        successCount++;
      } catch (err) {
        failItems.push(item.itemName);
        console.error("Save failed for:", item, err);
      }
    }

    setLoading(false);
    if (failItems.length === 0) {
      showSnackbar(`Saved ${successCount} new items successfully!`, "success");
      fetchItemsData(); // Refresh to get real dailyIds
    } else {
      showSnackbar(`Saved ${successCount} items. Failed: ${failItems.join(", ")}`, "warning");
      fetchItemsData();
    }
  };

  return (
    <Grid container spacing={2} sx={{ p: "10px" }}>
      <Grid item xs={12} sm={6}>
        <ItemMasterTable
          items={itemsData}
          onAddItems={handleAddToDaily}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
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
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
