package com.app.dto;

import java.time.LocalDateTime;
import java.util.List;
import com.app.entities.OrderStatus;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class OrderDTO {

	@JsonProperty(access = Access.READ_ONLY)
	private Long orderId;

	private LocalDateTime time;

	private Integer qty;

	@NotNull
	private String paymentMethod;

	private Integer amount;

	@NotNull
	private String transactionId;

	private Integer itemsServed;

	private Boolean isServed;

	private OrderStatus orderStatus;

	private Integer discountPercentage;

	// @JsonProperty(access = Access.WRITE_ONLY)
	private Long studentId;

	private String studentName;
	private List<CartDTO> cartList; // Cart items for this order
}
