package com.app.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CartDTO {

	@JsonProperty(access = Access.READ_ONLY)
	private Long cartId;

	// private Long orderId;

	private Long itemId;

	private String itemName; // Item name for display

	private Integer price; // Individual item price

	private Integer qtyOrdered;

	private Integer netPrice; // Total price (price * qtyOrdered)
}
