package com.app.controller;

import java.io.IOException;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.RechargeHistoryDTO;
import com.app.service.RechargeHistoryService;

@RestController
@RequestMapping("/recharge")
@CrossOrigin(origins = "http://localhost:5173")
public class RechargeHistoryController {

    private final RechargeHistoryService rechService;

    public RechargeHistoryController(RechargeHistoryService rechService) {
        this.rechService = rechService;
    }

    @GetMapping("/students/{studentId}")
    public ResponseEntity<?> getRechargeDetailsByStudent(
            @PathVariable Long studentId) throws IOException {

        return ResponseEntity.ok(
                rechService.getAllRechargeHistoryOfStudent(studentId));
    }

    @GetMapping("/{tranId}")
    public ResponseEntity<?> getRechargeDetails(@PathVariable Long tranId) {
        return ResponseEntity.ok(
                rechService.getRechargeDetails(tranId));
    }

    @PostMapping
    public ResponseEntity<?> addNewRecharge(
            @Valid @RequestBody RechargeHistoryDTO dto) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(rechService.addRecharge(dto));
    }

    @PutMapping("/{tranId}")
    public ResponseEntity<?> updateRecharge(
            @PathVariable Long tranId,
            @Valid @RequestBody RechargeHistoryDTO dto) {

        return ResponseEntity.ok(
                rechService.updateRecharge(tranId, dto));
    }

    @DeleteMapping("/{tranId}")
    public ResponseEntity<?> deleteRecharge(@PathVariable Long tranId) {
        return ResponseEntity.ok(
                rechService.deleteRechargeHistory(tranId));
    }
}
