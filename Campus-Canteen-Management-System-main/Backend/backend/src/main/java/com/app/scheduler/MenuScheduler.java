package com.app.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import com.app.service.ItemDailyService;

@Component
public class MenuScheduler {

    @Autowired
    private ItemDailyService dailyService;

    // Run at 00:00:00 (Midnight) every day
    @Scheduled(cron = "0 0 0 * * ?")
    public void resetDailyMenu() {
        System.out.println("Executing Daily Menu Reset...");
        try {
            dailyService.deleteAllDailyItems();
            System.out.println("Daily Menu has been reset successfully.");
        } catch (Exception e) {
            System.err.println("Error resetting daily menu: " + e.getMessage());
        }
    }
}
