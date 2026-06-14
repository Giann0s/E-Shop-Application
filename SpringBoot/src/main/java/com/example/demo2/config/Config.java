package com.example.demo2.config;

import com.example.demo2.models.Category;
import com.example.demo2.models.Product;
import com.example.demo2.models.User;
import com.example.demo2.repositories.CategoryRepository;
import com.example.demo2.repositories.ProductRepository;
import com.example.demo2.repositories.UserRepository;
import com.example.demo2.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

@Configuration
public class Config {

    @Bean
    public CommandLineRunner commandLineRunner(
            UserRepository userRepository,
            UserService userService,
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            PasswordEncoder passwordEncoder,
            JdbcTemplate jdbcTemplate) {

        return args -> {

            try {
                jdbcTemplate.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm;");
                System.out.println("Το extension pg_trgm ενεργοποιήθηκε με επιτυχία.");
            } catch (Exception e) {
                System.out.println("ΠΡΟΣΟΧΗ: Δεν ήταν δυνατή η δημιουργία του pg_trgm extension.");
            }

            Optional<User> userOptional = userRepository.findByEmail("admin@eshop.gr");

            if (!userOptional.isPresent()) {
                User admin = new User("admin@eshop.gr", "12345");
                admin.setRoles("PRIVILEGED");

                userService.createUser(admin);

                System.out.println("Ο αρχικός Admin δημιουργήθηκε");
            }

            if (categoryRepository.count() == 0) {

                Category catMen = new Category("ΑΝΔΡΙΚΑ");
                Category catWomen = new Category("ΓΥΝΑΙΚΕΙΑ");
                categoryRepository.saveAll(java.util.Arrays.asList(catMen, catWomen));

                Product p1 = new Product("Μαύρο T-Shirt", 19.99f);
                p1.setImageUrl("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsSKfMNaO9XdQV9Be3AtoBE-2KY_QrEqek4g&s");
                p1.getCategoryList().add(catMen);

                Product p2 = new Product("Κόκκινο Φόρεμα", 49.99f);
                p2.setImageUrl("https://www.iconworld.gr/wp-content/uploads/2022/09/075.50.02.021_RED-mdl.jpg");
                p2.getCategoryList().add(catWomen);

                productRepository.saveAll(java.util.Arrays.asList(p1, p2));
        }
    };
    }
}
