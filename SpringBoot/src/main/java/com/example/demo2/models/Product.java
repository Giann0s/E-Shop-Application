package com.example.demo2.models;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name="products")
public class Product {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private Float price;
    @ManyToMany
    @JoinTable(name="products_categories",
        joinColumns = @JoinColumn(
                        name = "product_id"),
        inverseJoinColumns = @JoinColumn(
                                name="category_id"))
    private List<Category> categoryList = new ArrayList<>();

    public Product(String name, Float price){
        super();
        this.name = name;
        this.price = price;
    }

    public Product(){

    }


    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Float getPrice() {
        return price;
    }

    public List<Category> getCategoryList() {
        return categoryList;
    }

    public void setCategoryList(List<Category> categoryList) {
        this.categoryList = categoryList;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

}
