package com.app.repository;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.app.entities.ItemDaily;
import com.app.entities.ItemMaster;

@Repository
public interface ItemDailyRepository extends JpaRepository<ItemDaily, Long> {
    Optional<ItemDaily> findByItemAndDate(ItemMaster item, LocalDate date);
}
