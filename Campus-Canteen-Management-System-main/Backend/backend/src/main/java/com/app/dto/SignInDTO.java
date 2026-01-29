package com.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class SignInDTO {

    @NotBlank(message = "Username can't be blank")
    private String userName;

    @NotBlank(message = "Password can't be blank")
    @Size(min = 5, max = 20, message = "Password must be between 5 and 20 characters")
    private String password;
}
