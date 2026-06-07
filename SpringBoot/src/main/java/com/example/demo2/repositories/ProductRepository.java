package com.example.demo2.repositories;

import com.example.demo2.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT DISTINCT p FROM Product p JOIN p.categoryList c WHERE c.id IN :categoryIds")
    List<Product> findByCategories(@Param("categoryIds") List<Long> categoryIds);

    @Query("SELECT DISTINCT p FROM Product p WHERE p.price <= :maxPrice")
    List<Product> findByPrice(@Param("maxPrice") Float maxPrice);

    @Query("SELECT DISTINCT p FROM Product p JOIN p.categoryList c WHERE c.id IN :categoryIds AND p.price <= :maxPrice")
    List<Product> findByCategoriesAndPrice(@Param("categoryIds") List<Long> categoryIds, @Param("maxPrice") Float maxPrice);

    @Query(value = "SELECT * FROM products WHERE " +
            "LOWER(name) LIKE LOWER(CONCAT('%', :input, '%')) " +
            "OR similarity(LOWER(name), LOWER(:input)) > 0.2",
            nativeQuery = true)
    List<Product> findBySimilarName(@Param("input") String input);


}
