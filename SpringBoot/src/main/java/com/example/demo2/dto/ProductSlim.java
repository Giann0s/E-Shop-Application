package com.example.demo2.dto;

import java.util.List;

public class ProductSlim {
    private Long id;
    private String name;
    private Float price;
    private List<String> categories;

    public ProductSlim(Long id, String name, Float price, List<String> categories){
        super();
        this.id = id;
        this.name = name;
        this.price = price;
        this.categories = categories;

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getPrice() {
        return price;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getCategories() {
        return categories;
    }

    public void setCategories(List<String> categories) {
        this.categories = categories;
    }
}
