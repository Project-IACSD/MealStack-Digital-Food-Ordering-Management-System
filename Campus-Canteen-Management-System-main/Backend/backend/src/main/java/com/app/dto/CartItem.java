package com.app.dto;

public class CartItem {

    private Long itemId;
    private int qtyOrdered;
    private int itemPrice;

    // ===== GETTERS =====

    public Long getItemId() {
        return itemId;
    }

    public int getQtyOrdered() {
        return qtyOrdered;
    }

    public int getItemPrice() {
        return itemPrice;
    }

    // ===== SETTERS =====

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public void setQtyOrdered(int qtyOrdered) {
        this.qtyOrdered = qtyOrdered;
    }

    public void setItemPrice(int itemPrice) {
        this.itemPrice = itemPrice;
    }

    // ===== BUSINESS LOGIC =====

    public int calculateNetPrice() {
        return this.qtyOrdered * this.itemPrice;
    }
}
