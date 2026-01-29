import React from 'react';
import ItemForm from '../../../components/admin/menu/ItemForm';
import ItemMasterService from '../../../services/ItemMasterService';
import { useNavigate } from 'react-router-dom';

export default function AddItem() {
    const navigate = useNavigate();

    const addItem = (item) => {
        // Ensure price is a number
        const payload = {
            ...item,
            itemPrice: parseFloat(item.itemPrice),
            soldQty: 0,
            totalQty: 0,
        };
        console.log("Adding item payload:", payload);

        ItemMasterService.addItem(payload)
            .then((response) => {
                console.log("Item added successfully:", response);
                alert("Item added successfully!");
                navigate("/admin/menu");
            })
            .catch((error) => {
                console.error("Error adding item:", error);
                const errorMsg = error.message || error.toString();
                alert(`Failed to add item: ${errorMsg}`);
            });
    }

    return (
        <div>
            <ItemForm action="add" takeAction={addItem} title="Add New Item" subtitle="Create a new menu item"></ItemForm>
        </div>
    )
}
