package com.app.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.app.dto.ItemDailyDTO;
import com.app.service.ItemDailyService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/dailyitems")
@CrossOrigin(origins = "http://localhost:5173")
public class ItemDailyController {

    @Autowired
    private ItemDailyService itemService;

    // ✅ GET all daily items
    @GetMapping
    public ResponseEntity<?> getAllItemDetails() {
        return ResponseEntity.ok(itemService.getAllDailyItems());
    }

    // ✅ GET single daily item
    @GetMapping("/{itemId}")
    public ResponseEntity<?> getItemDetails(@PathVariable Long itemId) {
        return ResponseEntity.ok(itemService.getItemDetails(itemId));
    }

    // ✅ ADD itemMaster into daily menu (IMPORTANT)
    @PostMapping("/{itemMasId}")
    @Operation(summary = "Add itemMaster into itemDaily")
    public ResponseEntity<?> addNewItem(
            @PathVariable @NotNull Long itemMasId,
            @RequestBody @Valid ItemDailyDTO itemDto) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(itemService.addNewitem(itemMasId, itemDto));
    }

    // ✅ UPDATE quantity
    @PutMapping("/{itemId}")
    public ResponseEntity<?> updateItem(
            @PathVariable Long itemId,
            @RequestBody @Valid ItemDailyDTO itemDto) {

        return ResponseEntity.ok(itemService.updateItem(itemId, itemDto));
    }

    // ✅ DELETE one daily item
    @DeleteMapping("/{itemId}")
    public ResponseEntity<?> deleteItem(@PathVariable Long itemId) {
        return ResponseEntity.ok(itemService.deleteItemDetails(itemId));
    }

    // ✅ DELETE ALL daily items
    @DeleteMapping("/all")
    public ResponseEntity<?> deleteAllItems() {
        itemService.deleteAllDailyItems();
        return ResponseEntity.ok("All daily items deleted successfully");
    }
}
