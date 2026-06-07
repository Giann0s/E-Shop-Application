package com.example.demo2.controllers;

import com.example.demo2.dto.ProductSlim;
import com.example.demo2.models.Category;
import com.example.demo2.models.Product;
import com.example.demo2.repositories.ProductRepository;
import com.example.demo2.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    ProductService productService;
    @Autowired
    ProductRepository productRepository;

    @PostMapping
    @PreAuthorize("hasAuthority('PRIVILEGED')")
    public ResponseEntity<Product> addProduct(@RequestBody Product product){
       Product newProduct = productService.addProduct(product);
       return new ResponseEntity<>(newProduct, HttpStatus.CREATED);
    }

    @GetMapping()
    public List<ProductSlim> getProducts(@RequestParam(required = false) Float maxPrice,
                                         @RequestParam (required = false) List<Long> categoryIds) {

        if (categoryIds != null) {
            categoryIds = categoryIds.stream()
                    .filter(id -> id != null) 
                    .collect(Collectors.toList());
        }

        List<Product> products;

        boolean hasCategories = (categoryIds != null && !categoryIds.isEmpty());
        boolean hasPrice = (maxPrice != null);

        if (hasCategories && hasPrice) {
            products = productService.getFilteredPriceAndCategoryProducts(categoryIds, maxPrice);
        }
        else if (hasCategories) {
            products = productService.getFilteredProducts(categoryIds);
        }
        else if (hasPrice) {
            products = productService.getFilteredPriceProducts(maxPrice);
        }
        else {
            products = productService.getAllProducts();
        }

        return products.stream()
                .map(product -> {
                    List<String> categoryNames = product.getCategoryList()
                            .stream()
                            .map(category -> category.getName())
                            .collect(Collectors.toList());
                    return new ProductSlim(product.getId(), product.getName(), product.getPrice(), categoryNames);
                })
                .collect(Collectors.toList());
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('PRIVILEGED')")
    public ProductSlim updateProduct(@PathVariable Long id,
                                     @RequestBody Product productUpdates) {
        Product updatedProduct = productService.updateProduct(id, productUpdates.getName(), productUpdates.getPrice(), productUpdates.getCategoryList());

        List<String> categoryNames = updatedProduct.getCategoryList()
                .stream()
                .map(category -> category.getName())
                .collect(Collectors.toList());

        return new ProductSlim(updatedProduct.getId(), updatedProduct.getName(), updatedProduct.getPrice(), categoryNames);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PRIVILEGED')")
    public List<Product> deleteProduct(
            @RequestParam Long id){
        return productService.deleteProduct(id);
    }

    @GetMapping("/search")
    public List<ProductSlim> searchProducts(@RequestParam String keyword) {
        List<Product> searchResults = productRepository.findBySimilarName(keyword);

        return searchResults.stream()
                .map(product -> {
                    List<String> categoryNames = product.getCategoryList()
                            .stream()
                            .map(category -> category.getName())
                            .collect(Collectors.toList());
                    return new ProductSlim(product.getId(), product.getName(), product.getPrice(), categoryNames);
                })
                .collect(Collectors.toList());
    }


}
