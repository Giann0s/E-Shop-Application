package com.example.demo2.controllers;

import com.example.demo2.dto.OrderRequest;
import com.example.demo2.models.Order;
import com.example.demo2.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(
            @RequestBody OrderRequest request,
            Principal principal) {

        Order newOrder = orderService.createOrder(principal.getName(), request);

        return ResponseEntity.status(HttpStatus.CREATED).body(newOrder);
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders(Principal principal) {
        List<Order> orders = orderService.getUserOrders(principal.getName());
        return ResponseEntity.ok(orders);
    }
}