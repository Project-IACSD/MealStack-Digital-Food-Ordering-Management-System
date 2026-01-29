package com.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UpdatePasswordDTO {

    @NotBlank(message = "Old password can't be blank")
    private String oldPassword;

    @NotBlank(message = "New password can't be blank")
    @Size(min = 5, max = 20, message = "New password must be between 5 and 20 characters")
    private String newPassword;
}
