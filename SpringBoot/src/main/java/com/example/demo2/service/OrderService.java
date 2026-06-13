package com.example.demo2.service;

import com.example.demo2.dto.OrderRequest;
import com.example.demo2.models.*;
import com.example.demo2.repositories.OrderRepository;
import com.example.demo2.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CartService cartService;

    public Order createOrder(String email, OrderRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Cart cart = cartService.getCartByUserEmail(email);

        if (cart.getCartItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot place an order with an empty cart");
        }

        Order order = new Order(user, request.getShippingAddress(), cart.getTotalAmount());

        for (CartItem cartItem : cart.getCartItems()) {
            OrderItem orderItem = new OrderItem(
                    cartItem.getProduct(),
                    cartItem.getQuantity(),
                    cartItem.getUnitPrice(),
                    cartItem.getTotalPrice()
            );

            order.addOrderItem(orderItem);
        }

        Order savedOrder = orderRepository.save(order);
        cartService.clearCart(email);

        return savedOrder;
    }

    public List<Order> getUserOrders(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return orderRepository.findByUserOrderByOrderDateDesc(user);
    }
}