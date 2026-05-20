package com.example.demo2.controllers;

import com.example.demo2.dto.ProductSlim;
import com.example.demo2.models.Category;
import com.example.demo2.models.Product;
import com.example.demo2.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    ProductService productService;

    @PostMapping
    public ResponseEntity<Product> addProduct(@RequestBody Product product){
       Product newProduct = productService.addProduct(product);
       return new ResponseEntity<>(newProduct, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ProductSlim getProduct(@PathVariable Long id) {
        Product product = productService.getProduct(id);

        List<String> categoryNames = product.getCategoryList()
                .stream()
                .map(category -> category.getName())
                .collect(Collectors.toList());


        return new ProductSlim(product.getId(), product.getName(), product.getPrice(), categoryNames);
    }

    @PutMapping("/{id}")
    public ProductSlim updateProduct(@PathVariable Long id,
                                     @RequestBody Product productUpdates) {
        Product updatedProduct = productService.updateProduct(id, productUpdates.getName(), productUpdates.getPrice(), productUpdates.getCategoryList());

        List<String> categoryNames = updatedProduct.getCategoryList()
                .stream()
                .map(category -> category.getName())
                .collect(Collectors.toList());

        return new ProductSlim(updatedProduct.getId(), updatedProduct.getName(), updatedProduct.getPrice(), categoryNames);
    }


}
