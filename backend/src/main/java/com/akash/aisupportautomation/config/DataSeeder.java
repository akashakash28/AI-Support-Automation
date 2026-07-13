package com.akash.aisupportautomation.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.akash.aisupportautomation.model.Role;
import com.akash.aisupportautomation.model.User;
import com.akash.aisupportautomation.repository.UserRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public void run(String... args) throws Exception {
        
        // Seed Admin User
        if (userRepository.findByEmail("admin@example.com").isEmpty()) {
            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            admin.setEnabled(true);
            userRepository.save(admin);
            System.out.println("Default ADMIN account seeded: admin@example.com / admin123");
        }

        // Seed Support Agent User
        if (userRepository.findByEmail("agent@example.com").isEmpty()) {
            User agent = new User();
            agent.setName("Support Agent");
            agent.setEmail("agent@example.com");
            agent.setPassword(passwordEncoder.encode("agent123"));
            agent.setRole(Role.SUPPORT_AGENT);
            agent.setEnabled(true);
            userRepository.save(agent);
            System.out.println("Default SUPPORT_AGENT account seeded: agent@example.com / agent123");
        }
        
        // Seed Employee User
        if (userRepository.findByEmail("employee@example.com").isEmpty()) {
            User employee = new User();
            employee.setName("Test Employee");
            employee.setEmail("employee@example.com");
            employee.setPassword(passwordEncoder.encode("employee123"));
            employee.setRole(Role.EMPLOYEE);
            employee.setEnabled(true);
            userRepository.save(employee);
            System.out.println("Default EMPLOYEE account seeded: employee@example.com / employee123");
        }
    }
}
