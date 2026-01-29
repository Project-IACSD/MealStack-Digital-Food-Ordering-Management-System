package com.app.service;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.dto.CartDTO;
import com.app.dto.CartItem;
import com.app.dto.CreateOrderDTO;
import com.app.dto.OrderDTO;
import com.app.dto.PlaceOrderRequest;
import com.app.entities.Cart;
import com.app.entities.Order;
import com.app.entities.OrderStatus;
import com.app.entities.Student;
import com.app.exceptions.ResourceNotFoundException;
import com.app.entities.ItemMaster;
import com.app.entities.ItemDaily;
import com.app.repository.ItemMasterRepository;
import com.app.repository.ItemDailyRepository;
import com.app.repository.OrderRepository;
import com.app.repository.StudentRepository;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

	@Autowired
	private OrderRepository orderRepository;

	@Autowired
	private StudentRepository studRepo;

	@Autowired
	private ItemMasterRepository itemMasterRepo;

	@Autowired
	private ItemDailyRepository itemDailyRepo;

	@Autowired
	private ModelMapper mapper;

	@Override
	public List<OrderDTO> getOrdersByStatus(OrderStatus orderStatus) {
		return orderRepository.findByOrderStatus(orderStatus)
				.stream()
				.map(order -> {
					OrderDTO orderDTO = mapper.map(order, OrderDTO.class);
					if (order.getStudent() != null) {
						// Set Student information in OrderDTO
						orderDTO.setStudentId(order.getStudent().getStudentId());
						orderDTO.setStudentName(order.getStudent().getName());

					}
					// Map cart items to CartDTO list
					if (order.getCartList() != null && !order.getCartList().isEmpty()) {
						orderDTO.setCartList(order.getCartList().stream()
								.map(cart -> {
									CartDTO cartDTO = mapper.map(cart, CartDTO.class);
									// Set item name from ItemMaster
									if (cart.getItem() != null) {
										cartDTO.setItemName(cart.getItem().getItemName());
									}
									return cartDTO;
								})
								.collect(Collectors.toList()));
					}
					return orderDTO;
				})
				.collect(Collectors.toList());
	}

	@Override
	public OrderDTO createOrder(OrderDTO dto) {
		Student stud = studRepo.findById(dto.getStudentId())
				.orElseThrow(() -> new ResourceNotFoundException("Invalid Student Id!!!"));
		Order order = mapper.map(dto, Order.class);
		stud.addOrder(order);
		Order savedOrder = orderRepository.save(order);
		System.out.println("order id " + order.getOrderId() + " " + savedOrder.getOrderId());
		return mapper.map(savedOrder, OrderDTO.class);

	}

	@Override
	public OrderDTO getOrderById(Long orderId) {
		Order order = orderRepository.findById(orderId)
				.orElseThrow(() -> new ResourceNotFoundException("Invalid Order Id !!!!"));

		OrderDTO orderDTO = mapper.map(order, OrderDTO.class);

		if (order.getStudent() != null) {
			// Set Student information in OrderDTO
			orderDTO.setStudentId(order.getStudent().getStudentId());
			orderDTO.setStudentName(order.getStudent().getName());
		}

		// Map cart items to CartDTO list with item names and prices
		if (order.getCartList() != null && !order.getCartList().isEmpty()) {
			orderDTO.setCartList(order.getCartList().stream()
					.map(cart -> {
						CartDTO cartDTO = mapper.map(cart, CartDTO.class);
						// Set item name and price from ItemMaster
						if (cart.getItem() != null) {
							cartDTO.setItemName(cart.getItem().getItemName());
							cartDTO.setItemId(cart.getItem().getId());
							// Set individual item price for frontend
							cartDTO.setPrice(cart.getItem().getItemPrice());
						}
						return cartDTO;
					})
					.collect(Collectors.toList()));
		}

		return orderDTO;
	}

	@Override
	public List<OrderDTO> getAllOrdersByStudentId(Long studentId) {
		List<Order> orderList = orderRepository.findByStudentStudentId(studentId);
		return orderList.stream().map(order -> {
			OrderDTO orderDTO = mapper.map(order, OrderDTO.class);

			if (order.getStudent() != null) {
				// Set Student information in OrderDTO
				orderDTO.setStudentId(order.getStudent().getStudentId());
				orderDTO.setStudentName(order.getStudent().getName());
			}

			// Map cart items to CartDTO list with item names and prices
			if (order.getCartList() != null && !order.getCartList().isEmpty()) {
				orderDTO.setCartList(order.getCartList().stream()
						.map(cart -> {
							CartDTO cartDTO = mapper.map(cart, CartDTO.class);
							// Set item name and price from ItemMaster
							if (cart.getItem() != null) {
								cartDTO.setItemName(cart.getItem().getItemName());
								cartDTO.setItemId(cart.getItem().getId());
								// Set individual item price for frontend
								cartDTO.setPrice(cart.getItem().getItemPrice());
							}
							return cartDTO;
						})
						.collect(Collectors.toList()));
			}

			return orderDTO;
		}).collect(Collectors.toList());
	}

	@Override
	public Long getCountOfOrdersByStatus(OrderStatus orderStatus) {
		return orderRepository.countByOrderStatus(orderStatus);
	}
	//
	// @Override
	// public CreateOrderDTO placeOrder(Long studentId, PlaceOrderRequest request) {
	//
	// Optional<Student> studentOptional = studRepo.findById(studentId);
	// if (studentOptional.isEmpty()) {
	// throw new ResourceNotFoundException("Student not found");
	// }
	//
	// Student student = studentOptional.get();
	//
	//
	// Order order = new Order();
	// order.setStudent(student);
	// order.setQty(request.calculateTotalQty());
	// order.setAmount(request.calculateTotalAmount());
	// order.setItemsServed(0);
	// order.setOrderStatus(OrderStatus.PENDING);
	//
	//
	// for (CartItem cartItem : request.getItems()) {
	// CartDTO cart = new CartDTO();
	// cart.setItemId(cartItem.getItemId());
	// cart.setQtyOrdered(cartItem.getQtyOrdered());
	// cart.setNetPrice(cartItem.calculateNetPrice());
	// order.getCartList().add(mapper.map(cart, Cart.class));
	// }
	//
	// // Save the order to the repository
	// orderRepository.save(order);
	//
	// CreateOrderDTO orderdto = mapper.map(order, CreateOrderDTO.class);
	// // Convert the order entity to DTO and return
	// return orderdto;
	// }

	@Override
	public CreateOrderDTO placeOrder(Long studentId, PlaceOrderRequest request) {
		if (studentId == null) {
			throw new ResourceNotFoundException("Student ID cannot be null");
		}
		Optional<Student> studentOptional = studRepo.findById(studentId);
		if (studentOptional.isEmpty()) {
			throw new ResourceNotFoundException("Student not found");
		}

		Student student = studentOptional.get();

		Order order = new Order();
		order.setStudent(student);
		order.setTime(LocalDateTime.now()); // Set order timestamp

		// Payment configuration
		String paymentMethod = "WALLET"; // Default to wallet payment
		order.setPaymentMethod(paymentMethod);
		order.setTransactionId("TXN-" + paymentMethod + "-" + UUID.randomUUID().toString());

		order.setQty(request.calculateTotalQty());
		order.setAmount(request.calculateTotalAmount());
		order.setItemsServed(0);
		order.setDiscountPercentage(0);

		// All orders start as PENDING (matches database schema)
		order.setOrderStatus(OrderStatus.PENDING);
		order.setIsServed(false);

		LocalDate today = LocalDate.now();

		// Process cart items and deduct from DAILY inventory
		for (CartItem cartItem : request.getItems()) {
			// Fetch the ItemMaster entity
			ItemMaster itemMaster = itemMasterRepo.findById(cartItem.getItemId())
					.orElseThrow(() -> new ResourceNotFoundException("Invalid Item ID: " + cartItem.getItemId()));

			// Find today's daily menu entry for this item
			ItemDaily dailyItem = itemDailyRepo.findByItemAndDate(itemMaster, today)
					.orElseThrow(() -> new IllegalStateException(
							"Item not available in today's menu: " + itemMaster.getItemName()));

			// Validate sufficient daily quantity
			int availableQty = dailyItem.getAvailableQty(); // init_qty - sold_qty
			int orderedQty = cartItem.getQtyOrdered();

			if (availableQty < orderedQty) {
				throw new IllegalStateException(
						"Insufficient daily stock for item: " + itemMaster.getItemName() +
								". Available: " + availableQty + ", Requested: " + orderedQty);
			}

			// Increment sold_qty in item_daily (NOT item_master)
			dailyItem.setSoldQty(dailyItem.getSoldQty() + orderedQty);
			itemDailyRepo.save(dailyItem);

			// Create cart entity
			CartDTO cart = new CartDTO();
			cart.setItemId(cartItem.getItemId());
			cart.setQtyOrdered(cartItem.getQtyOrdered());
			cart.setNetPrice(cartItem.calculateNetPrice());
			Cart cartEntity = mapper.map(cart, Cart.class);
			cartEntity.setOrder(order);
			cartEntity.setItem(itemMaster); // ✅ CRITICAL FIX: Set the ItemMaster entity
			order.getCartList().add(cartEntity);

		}

		orderRepository.save(order);

		CreateOrderDTO orderdto = mapper.map(order, CreateOrderDTO.class);

		return orderdto;
	}

	@Override
	@Transactional
	public OrderDTO updateOrderStatus(Long orderId, OrderStatus status) {
		Order order = orderRepository.findById(orderId)
				.orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

		// Update order status
		order.setOrderStatus(status);

		// Set isServed flag when marking as SERVED
		if (status == OrderStatus.SERVED) {
			order.setIsServed(true);
		}

		// NO inventory changes - already deducted at order placement

		Order updatedOrder = orderRepository.save(order);
		return mapper.map(updatedOrder, OrderDTO.class);
	}

}
