package com.example.demo2.service;

import com.example.demo2.models.Category;
import com.example.demo2.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CategoryService {

    @Autowired
    CategoryRepository categoryRepository;

    public Category addCategory(Category category){
        return categoryRepository.save(category);
    }
}
