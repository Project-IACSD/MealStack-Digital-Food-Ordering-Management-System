package com.app.entities;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long studentId;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, unique = true, length = 60)
    private String email;

    // BCrypt password
    @Column(nullable = false, length = 100)
    private String password;

    @Column(nullable = false, length = 15)
    private String mobileNo;

    private int balance;

    private LocalDate dob;

    /* ========= ENUM COURSE ========= */
    @Enumerated(EnumType.STRING)
    @Column(name = "course_name", length = 20)
    private Course courseName;

    /* ========= RECHARGE HISTORY ========= */
    @OneToMany(
            mappedBy = "student",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @Builder.Default
    private List<RechargeHistory> rechargeHistoryList = new ArrayList<>();

    /* ========= ORDERS ========= */
    @OneToMany(
            mappedBy = "student",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @Builder.Default
    private List<Order> orderList = new ArrayList<>();

    /* ========= SECURITY USER ========= */
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /* ========= RELATION HELPERS ========= */
    public void addOrder(Order order) {
        orderList.add(order);
        order.setStudent(this);
    }

    public void addRechargeHistory(RechargeHistory recharge) {
        rechargeHistoryList.add(recharge);
        recharge.setStudent(this);
    }
}
