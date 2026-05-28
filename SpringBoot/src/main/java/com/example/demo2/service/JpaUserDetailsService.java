package com.example.demo2.service;

import com.example.demo2.models.SecurityUser;
import com.example.demo2.models.User;
import com.example.demo2.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class JpaUserDetailsService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println(username);
        Optional<User> userOptional = userRepository.findByEmail(username);
        if(userOptional.isPresent()){
            return new SecurityUser(userOptional.get());
        }
        throw new UsernameNotFoundException("Email not found: " + username);
    }
}
