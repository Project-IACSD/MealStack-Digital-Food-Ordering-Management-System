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

import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor
@ToString(exclude = "order")
@Entity
@Table(name = "carts")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id", nullable = false, unique = true)
    private Long cartId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private ItemMaster item;

    @Column(name = "qty_ordered", nullable = false)
    private Integer qtyOrdered;

    @Column(name = "net_price", nullable = false)
    private Integer netPrice;

    // ===== GETTERS =====

    public Long getCartId() {
        return cartId;
    }

    public Order getOrder() {
        return order;
    }

    public ItemMaster getItem() {
        return item;
    }

    public Integer getQtyOrdered() {
        return qtyOrdered;
    }

    public Integer getNetPrice() {
        return netPrice;
    }

    // ===== SETTERS =====

    public void setCartId(Long cartId) {
        this.cartId = cartId;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public void setItem(ItemMaster item) {
        this.item = item;
    }

    public void setQtyOrdered(Integer qtyOrdered) {
        this.qtyOrdered = qtyOrdered;
    }

    public void setNetPrice(Integer netPrice) {
        this.netPrice = netPrice;
    }
}
