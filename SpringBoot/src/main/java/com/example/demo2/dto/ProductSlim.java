package com.example.demo2.dto;

public class ProductSlim {
    private Long id;
    private String name;
    private Float price;

    public ProductSlim(Long id, String name, Float price){
        super();
        this.id = id;
        this.name = name;
        this.price = price;

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
}
