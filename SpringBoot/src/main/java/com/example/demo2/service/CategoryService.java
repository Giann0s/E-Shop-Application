package com.example.demo2.service;

import com.example.demo2.models.Category;
import com.example.demo2.models.Product;
import com.example.demo2.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    CategoryRepository categoryRepository;

    public Category addCategory(Category category){
        return categoryRepository.save(category);
    }

    public List<Category> deleteCategory(Long id) {
        Optional<Category> categoryOptional = categoryRepository.findById(id);
        if(!categoryOptional.isPresent())
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Not Found");
        categoryRepository.deleteById(id);
        return categoryRepository.findAll();
    }
}
