package com.app.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "recharge_history")
public class RechargeHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long transactionId;

    @Column(name = "amount_added")
    private Integer amountAdded;

    @Column(name = "payment_id")
    private String paymentId;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    // ===== GETTERS =====

    public Long getTransactionId() {
        return transactionId;
    }

    public Integer getAmountAdded() {
        return amountAdded;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public Student getStudent() {
        return student;
    }

    // ===== SETTERS =====

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }

    public void setAmountAdded(Integer amountAdded) {
        this.amountAdded = amountAdded;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public void setStudent(Student student) {
        this.student = student;
    }
}
