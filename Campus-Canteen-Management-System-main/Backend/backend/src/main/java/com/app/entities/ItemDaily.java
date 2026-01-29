package com.app.entities;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "item_daily")
public class ItemDaily {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "daily_id")
    private Long dailyId;

    @Column(name = "item_date", nullable = false)
    private LocalDate date;

    @Column(name = "init_qty", nullable = false)
    private Integer initialQty;

    @Column(name = "sold_qty", nullable = false)
    private Integer soldQty = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private ItemMaster item;

    public ItemDaily() {
        this.date = LocalDate.now();
    }

    // Getters and Setters
    public Long getDailyId() { return dailyId; }
    public void setDailyId(Long dailyId) { this.dailyId = dailyId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public Integer getInitialQty() { return initialQty; }
    public void setInitialQty(Integer initialQty) { this.initialQty = initialQty; }

    public Integer getSoldQty() { return soldQty; }
    public void setSoldQty(Integer soldQty) { this.soldQty = soldQty; }

    public ItemMaster getItem() { return item; }
    public void setItem(ItemMaster item) { this.item = item; }
    
    // Helper method to check availability
    public int getAvailableQty() {
        return this.initialQty - this.soldQty;
    }
}