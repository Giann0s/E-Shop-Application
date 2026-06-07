package com.example.demo2.controllers;

import com.example.demo2.models.Cart;
import com.example.demo2.service.CartService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo2.dto.CartAddRequest;
import com.example.demo2.dto.CartUpdateRequest;

import java.security.Principal;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    CartService cartService;

    @GetMapping
    public ResponseEntity<Cart> getCart(Principal principal){
        Cart cart = cartService.getCartByUserEmail(principal.getName());
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(
            @RequestBody CartAddRequest request,
            Principal principal){

        Cart updatedCart = cartService.addToCart(principal.getName(), request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(updatedCart);
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<Cart> removeFromCart(
            @PathVariable Long cartItemId,
            Principal principal) {
        Cart updatedCart = cartService.removeFromCart(principal.getName(), cartItemId);
        return ResponseEntity.ok(updatedCart);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Cart> clearCart(Principal principal) {
        Cart emptyCart = cartService.clearCart(principal.getName());
        return ResponseEntity.ok(emptyCart);
    }

    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<Cart> updateQuantity(
            @PathVariable Long cartItemId,
            @RequestBody CartUpdateRequest request,
            Principal principal) {

        Cart updatedCart = cartService.updateItemQuantity(principal.getName(), cartItemId, request.getQuantity());
        return ResponseEntity.ok(updatedCart);
    }



}
