package com.app.entities;

import java.time.LocalDateTime;

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
@Table(name = "recharge_history")
public class RechargeHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long transactionId;

    @Column(name = "amount_added")
    private Integer amountAdded;

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

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public void setStudent(Student student) {
        this.student = student;
    }
}
