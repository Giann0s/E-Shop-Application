package com.example.demo2.models;


import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts")
public class Cart {
    @Id
    @GeneratedValue
    private Long id;
    private Float totalAmount;
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> cartItems = new ArrayList<>();
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Cart(){

    }

    public Cart(User user){
        this.user = user;
    }

    public void addItem(CartItem item){
        this.cartItems.add(item);
        item.setCart(this);
    }

    public void removeItem(CartItem item){
        this.cartItems.remove(item);
        item.setCart(null);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Float totalAmount) {
        this.totalAmount = totalAmount;
    }

    public List<CartItem> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<CartItem> cartItems) {
        this.cartItems = cartItems;
    }

    public void calculateTotalAmount(){
        this.totalAmount = this.cartItems.stream()
                .map(item -> item.getTotalPrice() != null ? item.getTotalPrice() : 0.0f)
                .reduce(0.0f, Float::sum);
    }
}
