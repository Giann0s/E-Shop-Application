package com.example.demo2.service;

import com.example.demo2.models.Cart;
import com.example.demo2.models.CartItem;
import com.example.demo2.models.Product;
import com.example.demo2.models.User;
import com.example.demo2.repositories.CartRepository;
import com.example.demo2.repositories.ProductRepository;
import com.example.demo2.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class CartService {

    @Autowired
    CartRepository cartRepository;
    @Autowired
    ProductRepository productRepository;
    @Autowired
    UserRepository userRepository;

    public Cart getCartByUserEmail(String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return cartRepository.findByUser(user).orElseGet(() -> {
            Cart newCart = new Cart(user);
            newCart.setTotalAmount(0f);
            return cartRepository.save(newCart);
        });
    }

    public Cart clearCart(String email){
        Cart cart = getCartByUserEmail(email);

        cart.getCartItems().forEach(item -> item.setCart(null));
        cart.getCartItems().clear();
        cart.setTotalAmount(0f);

        return cartRepository.save(cart);
    }

    public Cart addToCart(String email, Long productId, int quantity){
        Cart cart = getCartByUserEmail(email);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        Optional<CartItem> existingItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            item.calculateTotalPrice();
        } else {
            CartItem newItem = new CartItem();
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            newItem.setUnitPrice(product.getPrice());
            newItem.calculateTotalPrice();
            cart.addItem(newItem);
        }

        cart.calculateTotalAmount();
        return cartRepository.save(cart);
    }

    public Cart removeFromCart(String email, Long cartItemId){
        Cart cart = getCartByUserEmail(email);

        CartItem itemToRemove = cart.getCartItems().stream()
                .filter(item -> item.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found in cart"));

        cart.removeItem(itemToRemove);
        cart.calculateTotalAmount();

        return cartRepository.save(cart);
    }

    public Cart updateItemQuantity(String email, Long cartItemId, int newQuantity){
        if (newQuantity <= 0) {
            return removeFromCart(email, cartItemId);
        }

        Cart cart = getCartByUserEmail(email);

        CartItem itemToUpdate = cart.getCartItems().stream()
                .filter(item -> item.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found in cart"));

        itemToUpdate.setQuantity(newQuantity);

        itemToUpdate.calculateTotalPrice();
        cart.calculateTotalAmount();
        return cartRepository.save(cart);
    }



}
