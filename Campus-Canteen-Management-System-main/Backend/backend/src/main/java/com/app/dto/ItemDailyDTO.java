package com.app.dto;

public class ItemDailyDTO {

    private Long itemId;
    private Integer initialQty;
    private Integer soldQty;
    private Long itemMasterId;
    private String itemName;

    // ===== GETTERS =====

    public Long getItemId() {
        return itemId;
    }

    public Integer getInitialQty() {
        return initialQty;
    }

    public Integer getSoldQty() {
        return soldQty;
    }

    public Long getItemMasterId() {
        return itemMasterId;
    }

    public String getItemName() {
        return itemName;
    }

    // ===== SETTERS =====

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public void setInitialQty(Integer initialQty) {
        this.initialQty = initialQty;
    }

    public void setSoldQty(Integer soldQty) {
        this.soldQty = soldQty;
    }

    public void setItemMasterId(Long itemMasterId) {
        this.itemMasterId = itemMasterId;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }
}
