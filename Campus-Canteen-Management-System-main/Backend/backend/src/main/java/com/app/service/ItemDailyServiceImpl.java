package com.app.service;

import java.util.List;
import java.time.LocalDate;

import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.dto.ApiResponse;
import com.app.dto.ItemDailyDTO;
import com.app.entities.ItemDaily;
import com.app.entities.ItemMaster;
import com.app.exceptions.ResourceNotFoundException;
import com.app.repository.ItemDailyRepository;
import com.app.repository.ItemMasterRepository;

@Service
@Transactional
public class ItemDailyServiceImpl implements ItemDailyService {

    @Autowired
    private ItemDailyRepository itemRepo;

    @Autowired
    private ItemMasterRepository itemMasRepo;

    @Autowired
    private ModelMapper mapper;

    // ================= GET ALL =================
    @Override
    public List<ItemDailyDTO> getAllDailyItems() {
        return itemRepo.findAll()
                .stream()
                .map(item -> {
                    ItemDailyDTO dto = mapper.map(item, ItemDailyDTO.class);
                    // Manually map fields that might be missed by strict ModelMapper compilation
                    dto.setDailyId(item.getDailyId());
                    dto.setItemId(item.getItem().getId()); // Crucial: Link to Master Item
                    dto.setItemName(item.getItem().getItemName());
                    dto.setItemMasterId(item.getItem().getId());

                    // Added fields for Frontend Display
                    dto.setItemPrice(item.getItem().getItemPrice());
                    dto.setItemImgLink(item.getItem().getItemImgLink());
                    dto.setItemCategory(item.getItem().getItemCategory().toString());

                    return dto;
                })
                .collect(Collectors.toList());
    }

    // ================= ADD =================
    @Override
    public ApiResponse addNewitem(Long itemMasId, ItemDailyDTO dto) {
        if (itemMasId == null) {
            throw new ResourceNotFoundException("Item Master ID cannot be null");
        }

        ItemMaster itemMaster = itemMasRepo.findById(itemMasId)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid Item Master ID"));

        // Check if already exists for today
        java.util.Optional<ItemDaily> existingItem = itemRepo.findByItemAndDate(itemMaster, LocalDate.now());

        if (existingItem.isPresent()) {
            // Update existing item with new quantity
            ItemDaily item = existingItem.get();
            item.setInitialQty(dto.getInitialQty());
            itemRepo.save(item);

            return new ApiResponse("Updated existing daily item: " + itemMaster.getItemName());
        }

        // Create new daily item
        ItemDaily item = new ItemDaily();
        item.setItem(itemMaster); // ✅ FK handled here
        item.setInitialQty(dto.getInitialQty());
        item.setSoldQty(0); // ✅ REQUIRED

        itemRepo.save(item);

        return new ApiResponse(
                "Added item to daily menu: " + itemMaster.getItemName());
    }

    // ================= UPDATE =================
    @Override
    public ItemDailyDTO updateItem(Long dailyId, ItemDailyDTO dto) {

        ItemDaily item = itemRepo.findById(dailyId)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid Daily Item ID"));

        if (dto.getInitialQty() != null) {
            item.setInitialQty(dto.getInitialQty());
        }

        if (dto.getSoldQty() != null) {
            item.setSoldQty(dto.getSoldQty());
        }

        return mapper.map(item, ItemDailyDTO.class);
    }

    // ================= GET ONE =================
    @Override
    public ItemDailyDTO getItemDetails(Long dailyId) {
        ItemDaily item = itemRepo.findById(dailyId)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid Daily Item ID"));

        return mapper.map(item, ItemDailyDTO.class);
    }

    // ================= DELETE ONE =================
    @Override
    public ApiResponse deleteItemDetails(Long dailyId) {

        ItemDaily item = itemRepo.findById(dailyId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        itemRepo.delete(item);

        return new ApiResponse(
                "Daily item deleted with ID " + dailyId);
    }

    // ================= DELETE ALL =================
    @Override
    public ApiResponse deleteAllDailyItems() {
        itemRepo.deleteAll();
        return new ApiResponse("All daily items deleted");
    }
}
