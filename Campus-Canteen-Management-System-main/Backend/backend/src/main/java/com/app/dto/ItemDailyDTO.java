package com.app.dto;

public class ItemDailyDTO {

    private Long dailyId; // New Surrogate PK
    private Long itemId; // Stores ItemMaster ID
    private Long itemMasterId; // Redundant but keeping for safety
    private Integer initialQty;
    private Integer soldQty;

    private String itemName;
    private Integer itemPrice;
    private String itemImgLink;
    private String itemCategory;

    // ===== GETTERS =====
    public Long getDailyId() {
        return dailyId;
    }

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

    public Integer getItemPrice() {
        return itemPrice;
    }

    public String getItemImgLink() {
        return itemImgLink;
    }

    public String getItemCategory() {
        return itemCategory;
    }

    // ===== SETTERS =====
    public void setDailyId(Long dailyId) {
        this.dailyId = dailyId;
    }

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

    public void setItemPrice(Integer itemPrice) {
        this.itemPrice = itemPrice;
    }

    public void setItemImgLink(String itemImgLink) {
        this.itemImgLink = itemImgLink;
    }

    public void setItemCategory(String itemCategory) {
        this.itemCategory = itemCategory;
    }
}
