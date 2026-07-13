package com.akash.aisupportautomation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
@EnableScheduling
public class AisupportautomationApplication {

	public static void main(String[] args) {
		SpringApplication.run(AisupportautomationApplication.class, args);
	}

	@Bean
	public CommandLineRunner fixDatabaseColumns(JdbcTemplate jdbcTemplate) {
		return args -> {
			try {
				jdbcTemplate.execute("ALTER TABLE ticket MODIFY COLUMN description TEXT");
				System.out.println("Successfully altered ticket description column to TEXT");
			} catch (Exception e) {
				System.out.println("Could not alter table (might already be TEXT): " + e.getMessage());
			}
		};
	}

}
