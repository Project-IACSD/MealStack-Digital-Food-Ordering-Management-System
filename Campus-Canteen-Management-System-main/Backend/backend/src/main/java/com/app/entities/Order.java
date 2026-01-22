package com.app.entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id", nullable = false, unique = true)
    private Long orderId;

    private LocalDateTime time;

    @Column(name = "quantity")
    private int qty;

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

    private Integer amount;

    @Column(name = "transaction_id", nullable = false, unique = true)
    private String transactionId;

    @Column(name = "items_served", nullable = false)
    private Integer itemsServed;

    @Column(name = "is_served", nullable = false)
    private Boolean isServed = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status", nullable = false)
    private OrderStatus orderStatus;

    @Column(name = "discount_percentage")
    private Integer discountPercentage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Cart> cartList = new ArrayList<>();

    // ===== GETTERS =====

    public Long getOrderId() {
        return orderId;
    }

    public LocalDateTime getTime() {
        return time;
    }

    public int getQty() {
        return qty;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public Integer getAmount() {
        return amount;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public Integer getItemsServed() {
        return itemsServed;
    }

    public Boolean getIsServed() {
        return isServed;
    }

    public OrderStatus getOrderStatus() {
        return orderStatus;
    }

    public Integer getDiscountPercentage() {
        return discountPercentage;
    }

    public Student getStudent() {
        return student;
    }

    public List<Cart> getCartList() {
        return cartList;
    }

    // ===== SETTERS =====

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }

    public void setQty(int qty) {
        this.qty = qty;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public void setItemsServed(Integer itemsServed) {
        this.itemsServed = itemsServed;
    }

    public void setIsServed(Boolean isServed) {
        this.isServed = isServed;
    }

    public void setOrderStatus(OrderStatus orderStatus) {
        this.orderStatus = orderStatus;
    }

    public void setDiscountPercentage(Integer discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public void setCartList(List<Cart> cartList) {
        this.cartList = cartList;
    }

    // ===== RELATION HELPERS =====

    public void addCart(Cart cart) {
        cartList.add(cart);
        cart.setOrder(this);
    }

    public void removeCart(Cart cart) {
        cartList.remove(cart);
        cart.setOrder(null);
    }
}
