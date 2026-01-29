package com.app.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApiResponse {

    private String status;
    private String message;

    // ✅ No-arg constructor (important for Jackson)
    public ApiResponse() {
    }

    // ✅ Single-arg constructor
    public ApiResponse(String message) {
        this.status = "SUCCESS";
        this.message = message;
    }

    // ✅ TWO-ARG constructor (THIS FIXES YOUR ERROR)
    public ApiResponse(String status, String message) {
        this.status = status;
        this.message = message;
    }
}
