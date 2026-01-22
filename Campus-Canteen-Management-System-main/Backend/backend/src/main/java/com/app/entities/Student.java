package com.app.entities;

import java.time.LocalDate;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id")
    private Long studentId;

    @Column(length = 20, name = "name")
    private String name;

    @Column(length = 40, name = "email")
    private String email;

    @Column(length = 20, name = "password")
    private String password;

    @Column(length = 10, name = "mobile_no")
    private String mobileNo;

    @Column(name = "balance")
    private int balance;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(name = "course_name")
    private Course courseName;

    @OneToMany(
            mappedBy = "student",
            fetch = FetchType.EAGER,
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<RechargeHistory> rechargeHistoryList;

    @OneToMany(
            mappedBy = "student",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Order> orderList;

    // ===== GETTERS =====

    public Long getStudentId() {
        return studentId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getMobileNo() {
        return mobileNo;
    }

    public int getBalance() {
        return balance;
    }

    public LocalDate getDob() {
        return dob;
    }

    public Course getCourseName() {
        return courseName;
    }

    public List<RechargeHistory> getRechargeHistoryList() {
        return rechargeHistoryList;
    }

    public List<Order> getOrderList() {
        return orderList;
    }

    // ===== SETTERS =====

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setMobileNo(String mobileNo) {
        this.mobileNo = mobileNo;
    }

    public void setBalance(int balance) {
        this.balance = balance;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public void setCourseName(Course courseName) {
        this.courseName = courseName;
    }

    public void setRechargeHistoryList(List<RechargeHistory> rechargeHistoryList) {
        this.rechargeHistoryList = rechargeHistoryList;
    }

    public void setOrderList(List<Order> orderList) {
        this.orderList = orderList;
    }

    // ===== RELATION HELPERS =====

    public void addOrder(Order ord) {
        orderList.add(ord);
        ord.setStudent(this);
    }

    public void removeOrder(Order ord) {
        orderList.remove(ord);
        ord.setStudent(null);
    }

    public void addRechargeHistory(RechargeHistory recharge) {
        rechargeHistoryList.add(recharge);
        recharge.setStudent(this);
    }

    public void removeRechargeHistory(RechargeHistory recharge) {
        rechargeHistoryList.remove(recharge);
        recharge.setStudent(null);
    }
}
