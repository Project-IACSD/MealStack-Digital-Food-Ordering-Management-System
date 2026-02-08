package com.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

@RestController
@RequestMapping("/api/migration")
@CrossOrigin(origins = "*")
public class DatabaseMigrationController {

    @Autowired
    private DataSource dataSource;

    @PostMapping("/update-image-column")
    public ResponseEntity<String> updateImageColumn() {
        try (Connection conn = dataSource.getConnection();
                Statement stmt = conn.createStatement()) {

            // Execute the ALTER TABLE command
            String sql = "ALTER TABLE item_master MODIFY COLUMN item_img_link LONGTEXT";
            stmt.executeUpdate(sql);

            return ResponseEntity.ok("Database column updated successfully! item_img_link is now LONGTEXT.");

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Error updating database: " + e.getMessage());
        }
    }
}
