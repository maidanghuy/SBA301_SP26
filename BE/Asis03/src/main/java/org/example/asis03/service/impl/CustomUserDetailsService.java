package org.example.asis03.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.asis03.entity.AS03Customer;
import org.example.asis03.entity.Role;
import org.example.asis03.repository.AS03CustomerRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final AS03CustomerRepository customerRepository;

    @Value("${app.staff.email}")
    private String staffEmail;

    @Value("${app.staff.password}")
    private String staffPassword;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        if (username != null && username.equalsIgnoreCase(staffEmail)) {
            return new User(
                    staffEmail,
                    staffPassword,
                    List.of(new SimpleGrantedAuthority("ROLE_" + Role.STAFF.name()))
            );
        }

        AS03Customer c = customerRepository.findByEmail(username)
                .filter(AS03Customer::getActive)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        return new User(
                c.getEmail(),
                c.getPasswordHash(),
                List.of(new SimpleGrantedAuthority("ROLE_" + c.getRole().name()))
        );
    }
}