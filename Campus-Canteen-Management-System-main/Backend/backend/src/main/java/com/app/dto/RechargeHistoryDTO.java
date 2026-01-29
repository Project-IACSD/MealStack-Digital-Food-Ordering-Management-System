package com.app.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class RechargeHistoryDTO {

    @JsonProperty(access = Access.READ_ONLY)
    private Long transactionId;

    private String paymentId;

    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timeStamp;

    @NotNull
    private Integer amountAdded;

    @NotNull
    private Long studentId;

    // Lombok generates getters/setters
    // private String paymentId; // Added above
}
