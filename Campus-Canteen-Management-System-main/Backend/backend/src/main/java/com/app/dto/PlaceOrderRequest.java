package com.app.dto;

import java.util.List;

public class PlaceOrderRequest {

    private List<CartItem> items;

    // ===== GETTERS & SETTERS =====

    public List<CartItem> getItems() {
        return items;
    }

    public void setItems(List<CartItem> items) {
        this.items = items;
    }

    // ===== CALCULATIONS =====

    public int calculateTotalQty() {
        return items.stream()
                .mapToInt(CartItem::getQtyOrdered)
                .sum();
    }

    public int calculateTotalAmount() {
        return items.stream()
                .mapToInt(CartItem::calculateNetPrice)
                .sum();
    }
}
