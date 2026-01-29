package com.app.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentDTO {

    private Long studentId;

    @NotBlank(message = "Name cannot be blank")
    private String name;

    @NotBlank(message = "Email cannot be blank")
    private String email;

    @NotBlank(message = "Password cannot be blank")
    private String password;

    @NotBlank(message = "Mobile number cannot be blank")
    private String mobileNo;

    @NotNull(message = "Balance is required")
    private Integer balance;   // ✅ Wrapper instead of int

    @NotNull(message = "Date of birth is required")
    private LocalDate dob;

    @NotNull(message = "Course is required")
    private String courseName;     // ✅ DTO should carry ID, not entity
}
