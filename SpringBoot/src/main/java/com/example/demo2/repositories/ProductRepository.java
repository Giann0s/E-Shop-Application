package com.example.demo2.repositories;

import com.example.demo2.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT DISTINCT p FROM Product p JOIN p.categoryList c WHERE c.id IN :categoryIds")
    List<Product> findByCategories(@Param("categoryIds") List<Long> categoryIds);
}
