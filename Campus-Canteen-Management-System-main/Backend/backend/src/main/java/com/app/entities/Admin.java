package com.app.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="Admin")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Admin {
	
	@Id
	@Column(name="Admin_username")
	private String username;
	
	@Column(length = 20, name = "Admin_password")
	private String password;
	@OneToOne
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

}
