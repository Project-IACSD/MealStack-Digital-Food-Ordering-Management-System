package com.app.controller;

import java.io.IOException;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.CreateOrderDTO;
import com.app.dto.OrderDTO;
import com.app.dto.PlaceOrderRequest;
import com.app.entities.OrderStatus;
import com.app.service.OrderService;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingOrders() {
        // Return PENDING orders for admin to manage
        java.util.List<OrderDTO> pendingOrders = orderService.getOrdersByStatus(OrderStatus.PENDING);
        return ResponseEntity.ok(pendingOrders);
    }

    @GetMapping("/served")
    public ResponseEntity<?> getFulfilledOrders() {
        return ResponseEntity.ok(orderService.getOrdersByStatus(OrderStatus.SERVED));
    }

    @GetMapping("/completed")
    public ResponseEntity<?> getCompletedOrders() {
        // Return SERVED orders (completed orders)
        return ResponseEntity.ok(orderService.getOrdersByStatus(OrderStatus.SERVED));
    }

    @PostMapping("/{studentId}/orders")
    public ResponseEntity<CreateOrderDTO> placeOrder(
            @PathVariable Long studentId,
            @Valid @RequestBody PlaceOrderRequest request) {

        CreateOrderDTO orderDTO = orderService.placeOrder(studentId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(orderDTO);
    }

    @GetMapping("/students/{studentId}")
    public ResponseEntity<?> getOrderDetailsByStudent(
            @PathVariable Long studentId) throws IOException {

        return ResponseEntity.ok(orderService.getAllOrdersByStudentId(studentId));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderDetails(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    @GetMapping("/pending/count")
    public ResponseEntity<Long> getCountOfPendingOrders() {
        return ResponseEntity.ok(
                orderService.getCountOfOrdersByStatus(OrderStatus.PENDING));
    }

    @GetMapping("/served/count")
    public ResponseEntity<Long> getCountOfServedOrders() {
        return ResponseEntity.ok(
                orderService.getCountOfOrdersByStatus(OrderStatus.SERVED));
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {
        OrderDTO updatedOrder = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(updatedOrder);
    }
}
