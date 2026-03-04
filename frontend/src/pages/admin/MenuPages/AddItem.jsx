import React from 'react';
import ItemForm from '../../../components/admin/menu/ItemForm';
import ItemMasterService from '../../../services/ItemMasterService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AddItem() {
    const navigate = useNavigate();

    const addItem = (item) => {
        const payload = {
            ...item,
            itemPrice: parseFloat(item.itemPrice),
            soldQty: 0,
            totalQty: 0,
        };

        ItemMasterService.addItem(payload)
            .then(() => {
                toast.success("Item added successfully!");
                navigate("/admin/menu");
            })
            .catch((error) => {
                const errorMsg = error.message || error.toString();
                toast.error(`Failed to add item: ${errorMsg}`);
            });
    }

    return (
        <div>
            <ItemForm action="add" takeAction={addItem} title="Add New Item" subtitle="Create a new menu item"></ItemForm>
        </div>
    )
}
