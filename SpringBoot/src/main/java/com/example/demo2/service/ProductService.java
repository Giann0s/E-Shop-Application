package com.example.demo2.service;

import com.example.demo2.models.Category;
import com.example.demo2.models.Product;
import com.example.demo2.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    ProductRepository productRepository;

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProduct(Long id){
        Optional<Product> prod = productRepository.findById(id);
        if (!prod.isPresent())
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Not Found");
        return prod.get();
    }

    public Product updateProduct(Long id, String name, Float price, List<Category> categoryList){
        Optional<Product> prod = productRepository.findById(id);
        if (!prod.isPresent())
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Not Found");
        Product product = prod.get();
        if (name != null)
            product.setName(name);
        if (price != null)
            product.setPrice(price);
        if (categoryList != null)
            product.setCategoryList(categoryList);
        productRepository.save(product);
        return product;
    }


    public List<Product> deleteProduct(Long id) {
        Optional<Product> productOptional = productRepository.findById(id);
        if(!productOptional.isPresent())
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Not Found");
        productRepository.deleteById(id);
        return productRepository.findAll();
    }
}
