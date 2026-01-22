package com.app.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "item_daily")
public class ItemDaily {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long itemId;

    @Column(name = "init_qty", nullable = false)
    private Integer initialQty;

    @Column(name = "sold_qty", nullable = false)
    private Integer soldQty;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", insertable = false, updatable = false)
    private ItemMaster item;

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

    public ItemMaster getItem() {
        return item;
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

    public void setItem(ItemMaster item) {
        this.item = item;
    }
}
