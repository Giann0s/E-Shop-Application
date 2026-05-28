package com.example.demo2.config;

import com.example.demo2.models.User;
import com.example.demo2.repositories.CategoryRepository;
import com.example.demo2.repositories.ProductRepository;
import com.example.demo2.repositories.UserRepository;
import com.example.demo2.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@Configuration
public class Config {

    @Bean
    public CommandLineRunner commandLineRunner(
            UserRepository userRepository,
            UserService userService,
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            Optional<User> userOptional = userRepository.findByEmail("admin@eshop.gr");

            if (!userOptional.isPresent()) {
                User admin = new User("admin@eshop.gr", "12345");
                admin.setRoles("PRIVILEGED");

                userService.createUser(admin);

                System.out.println("Ο αρχικός Admin δημιουργήθηκε");
            }
        };
    }
}
