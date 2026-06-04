package com.mealstack.pages;

import com.mealstack.utils.WaitHelper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

import java.util.List;

/**
 * OrderHistoryPage — Page Object for viewing past/current orders.
 */
public class OrderHistoryPage {

    private static final Logger logger = LogManager.getLogger(OrderHistoryPage.class);
    private final WebDriver driver;
    private final WaitHelper wait;

    // ─── Page Elements ────────────────────────────────────────────────────────

    @FindBy(css = ".order-history, [class*='orders-container'], main[class*='order']")
    private WebElement orderHistoryContainer;

    /** Individual order cards or rows */
    @FindBy(css = ".order-card, .order-item, [class*='order-row'], tbody tr")
    private List<WebElement> orderCards;

    /** Order status badges within each card */
    @FindBy(css = ".order-status, [class*='status-badge'], .badge")
    private List<WebElement> orderStatuses;

    /** Order IDs or numbers */
    @FindBy(css = ".order-id, [class*='order-number'], .order-ref")
    private List<WebElement> orderIds;

    /** Order total prices */
    @FindBy(css = ".order-total, [class*='order-amount'], .total")
    private List<WebElement> orderTotals;

    /** 'View Details' button for each order */
    @FindBy(css = ".view-order, button[class*='view'], a[class*='details']")
    private List<WebElement> viewDetailButtons;

    /** No orders placeholder */
    @FindBy(css = ".no-orders, .empty-orders, [class*='no-order']")
    private WebElement noOrdersMessage;

    /** Page heading */
    @FindBy(css = "h1, h2, .page-title, [class*='orders-title']")
    private WebElement pageHeading;

    // ─── Constructor ──────────────────────────────────────────────────────────

    public OrderHistoryPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WaitHelper(driver);
        PageFactory.initElements(driver, this);
        logger.info("OrderHistoryPage initialised");
    }

    // ─── Page Actions ─────────────────────────────────────────────────────────

    /** Open order details for the Nth order */
    public OrderHistoryPage viewOrderDetails(int orderIndex) {
        try {
            wait.waitForAllVisible(By.cssSelector(".view-order, button[class*='view']"));
            viewDetailButtons.get(orderIndex).click();
            logger.info("Opened details for order at index {}", orderIndex);
        } catch (Exception e) {
            // Try clicking the order card itself
            try {
                orderCards.get(orderIndex).click();
            } catch (Exception ex) {
                logger.warn("Could not view order details: {}", ex.getMessage());
            }
        }
        return this;
    }

    // ─── Verification Methods ─────────────────────────────────────────────────

    public boolean isOrderHistoryPageDisplayed() {
        try {
            wait.waitForVisible(orderHistoryContainer);
            return orderHistoryContainer.isDisplayed();
        } catch (Exception e) {
            return driver.getCurrentUrl().contains("order") || driver.getCurrentUrl().contains("history");
        }
    }

    /** Get total number of orders displayed */
    public int getOrderCount() {
        try {
            wait.waitForAllVisible(By.cssSelector(".order-card, .order-item, tbody tr"));
            int count = orderCards.size();
            logger.info("Order history count: {}", count);
            return count;
        } catch (Exception e) {
            return 0;
        }
    }

    /** Check if "no orders" message is shown */
    public boolean isNoOrdersMessageDisplayed() {
        try {
            return noOrdersMessage.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /** Get the status of the most recent (first) order */
    public String getLatestOrderStatus() {
        try {
            wait.waitForAllVisible(By.cssSelector(".order-status, [class*='status-badge']"));
            if (!orderStatuses.isEmpty()) {
                String status = orderStatuses.get(0).getText().trim();
                logger.info("Latest order status: {}", status);
                return status;
            }
        } catch (Exception e) {
            logger.warn("Could not get order status: {}", e.getMessage());
        }
        return "UNKNOWN";
    }

    /** Get the order ID of the Nth order as text */
    public String getOrderId(int index) {
        try {
            wait.waitForAllVisible(By.cssSelector(".order-id, [class*='order-number']"));
            if (index < orderIds.size()) {
                return orderIds.get(index).getText().trim();
            }
        } catch (Exception e) {
            logger.warn("Could not get order ID: {}", e.getMessage());
        }
        return "";
    }

    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }
}
