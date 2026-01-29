package com.app.controller;

import com.app.dto.GetAllStudentDTO;
import com.app.dto.RegisterStudentDTO;
import com.app.service.StudentService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final StudentService studentService;

    public AdminController(StudentService studentService) {
        this.studentService = studentService;
    }

    // ✅ Simple admin check
    @GetMapping("/dashboard")
    public String adminOnly() {
        return "Admin access";
    }

    // ✅ Admin can view all students
    @GetMapping("/students")
    public ResponseEntity<List<GetAllStudentDTO>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    // ✅ Admin can register a student
    @PostMapping("/register/student")
    public ResponseEntity<String> registerStudent(@RequestBody @Valid RegisterStudentDTO dto) {
        try {
            String result = studentService.registerStudent(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

    // ✅ Admin stats
    @GetMapping("/totalstudents")
    public ResponseEntity<Long> getTotalRegisteredStudents() {
        return ResponseEntity.ok(studentService.getTotalRegisteredStudents());
    }
}
