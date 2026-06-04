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
 * AdminDashboard — Page Object for admin panel (menu management, order
 * management).
 *
 * INTERVIEW TIP:
 * "The admin panel tests required a different login flow, so I created a
 * separate
 * Page Object. Even though both use the same login form HTML, the roles and
 * subsequent pages are entirely different — warranting a distinct POM class."
 */
public class AdminDashboard {

    private static final Logger logger = LogManager.getLogger(AdminDashboard.class);
    private final WebDriver driver;
    private final WaitHelper wait;

    // ─── Admin Navigation ─────────────────────────────────────────────────────

    @FindBy(css = "a[href*='admin/menu'], .menu-management-link, [class*='menu-nav']")
    private WebElement menuManagementLink;

    @FindBy(css = "a[href*='admin/orders'], .orders-link, [class*='orders-nav']")
    private WebElement ordersLink;

    @FindBy(css = ".admin-header, [class*='admin-title'], h1.admin")
    private WebElement adminHeader;

    // ─── Add Menu Item Form ────────────────────────────────────────────────────

    @FindBy(css = "button[class*='add-item'], .add-menu-item, button.btn-primary[class*='add']")
    private WebElement addMenuItemButton;

    @FindBy(css = "input[name='itemName'], input[name='name'], input[placeholder*='Item Name' i]")
    private WebElement itemNameInput;

    @FindBy(css = "input[name='description'], textarea[name='description'], input[placeholder*='Description' i]")
    private WebElement descriptionInput;

    @FindBy(css = "input[name='price'], input[placeholder*='Price' i]")
    private WebElement priceInput;

    @FindBy(css = "input[name='category'], select[name='category']")
    private WebElement categoryInput;

    @FindBy(css = "input[name='quantity'], input[placeholder*='Quantity' i]")
    private WebElement quantityInput;

    @FindBy(css = "button[type='submit'].save-item, .submit-item, button[class*='save']")
    private WebElement saveItemButton;

    @FindBy(css = "button[class*='cancel'], .cancel-btn, .close-modal")
    private WebElement cancelButton;

    // ─── Menu Items Table ──────────────────────────────────────────────────────

    @FindBy(css = ".menu-table tbody tr, .items-list .item-row, [class*='menu-item-row']")
    private List<WebElement> menuItemRows;

    @FindBy(css = ".edit-item-btn, button[aria-label*='edit' i]")
    private List<WebElement> editButtons;

    @FindBy(css = ".delete-item-btn, button[aria-label*='delete' i]")
    private List<WebElement> deleteButtons;

    // ─── Orders Table ─────────────────────────────────────────────────────────

    @FindBy(css = ".orders-table tbody tr, .order-row, [class*='order-item']")
    private List<WebElement> orderRows;

    @FindBy(css = ".order-status-select, select[name='status'], [class*='status-dropdown']")
    private List<WebElement> statusDropdowns;

    // ─── Constructor ──────────────────────────────────────────────────────────

    public AdminDashboard(WebDriver driver) {
        this.driver = driver;
        this.wait = new WaitHelper(driver);
        PageFactory.initElements(driver, this);
        logger.info("AdminDashboard initialised");
    }

    // ─── Navigation ───────────────────────────────────────────────────────────

    public AdminDashboard goToMenuManagement() {
        try {
            wait.waitForClickable(menuManagementLink);
            menuManagementLink.click();
            logger.info("Navigated to Menu Management");
        } catch (Exception e) {
            logger.warn("Menu management link not found: {}", e.getMessage());
        }
        return this;
    }

    public AdminDashboard goToOrders() {
        try {
            wait.waitForClickable(ordersLink);
            ordersLink.click();
            logger.info("Navigated to Orders");
        } catch (Exception e) {
            logger.warn("Orders link not found: {}", e.getMessage());
        }
        return this;
    }

    // ─── Menu Item CRUD ───────────────────────────────────────────────────────

    /** Open the 'Add Menu Item' form */
    public AdminDashboard clickAddMenuItem() {
        wait.waitForClickable(addMenuItemButton);
        addMenuItemButton.click();
        wait.waitForVisible(itemNameInput);
        logger.info("Add menu item form opened");
        return this;
    }

    public AdminDashboard fillMenuItemForm(java.util.Map<String, String> itemData) {
        fillField(itemNameInput, itemData.getOrDefault("name", ""));
        fillField(descriptionInput, itemData.getOrDefault("description", ""));
        fillField(priceInput, itemData.getOrDefault("price", "0"));
        fillField(quantityInput, itemData.getOrDefault("quantity", "1"));

        // Category might be a text input or a select
        try {
            fillField(categoryInput, itemData.getOrDefault("category", "Main Course"));
        } catch (Exception ignored) {
        }

        logger.info("Menu item form filled: {}", itemData.get("name"));
        return this;
    }

    private void fillField(WebElement field, String value) {
        try {
            field.clear();
            field.sendKeys(value);
        } catch (Exception e) {
            logger.debug("Could not fill field: {}", e.getMessage());
        }
    }

    /** Save (submit) the menu item form */
    public AdminDashboard saveMenuItem() {
        wait.waitForClickable(saveItemButton);
        saveItemButton.click();
        logger.info("Save menu item clicked");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException ignored) {
        }
        return this;
    }

    /**
     * Full flow: open form → fill → save
     */
    public AdminDashboard addMenuItem(java.util.Map<String, String> itemData) {
        clickAddMenuItem();
        fillMenuItemForm(itemData);
        saveMenuItem();
        logger.info("Menu item added: {}", itemData.get("name"));
        return this;
    }

    /** Click 'Edit' for the Nth item in the menu table */
    public AdminDashboard clickEditItem(int itemIndex) {
        try {
            wait.waitForAllVisible(By.cssSelector(".edit-item-btn, button[aria-label*='edit' i]"));
            editButtons.get(itemIndex).click();
            wait.waitForVisible(itemNameInput);
            logger.info("Edit form opened for item at index {}", itemIndex);
        } catch (Exception e) {
            logger.error("Could not click edit for item {}: {}", itemIndex, e.getMessage());
        }
        return this;
    }

    /** Delete the Nth menu item */
    public AdminDashboard deleteMenuItem(int itemIndex) {
        try {
            wait.waitForAllVisible(By.cssSelector(".delete-item-btn, button[aria-label*='delete' i]"));
            deleteButtons.get(itemIndex).click();
            // Handle confirmation dialog if any
            try {
                wait.waitForAlert();
                driver.switchTo().alert().accept();
            } catch (Exception ignored) {
            }
            logger.info("Deleted menu item at index {}", itemIndex);
            try {
                Thread.sleep(800);
            } catch (InterruptedException ignored) {
            }
        } catch (Exception e) {
            logger.error("Could not delete item {}: {}", itemIndex, e.getMessage());
        }
        return this;
    }

    // ─── Verification Methods ─────────────────────────────────────────────────

    public boolean isAdminDashboardDisplayed() {
        try {
            wait.waitForVisible(adminHeader);
            return adminHeader.isDisplayed();
        } catch (Exception e) {
            return driver.getCurrentUrl().contains("admin");
        }
    }

    public int getMenuItemCount() {
        try {
            wait.waitForAllVisible(By.cssSelector(".menu-table tbody tr, .items-list .item-row"));
            return menuItemRows.size();
        } catch (Exception e) {
            return 0;
        }
    }

    public int getOrderCount() {
        try {
            wait.waitForAllVisible(By.cssSelector(".orders-table tbody tr, .order-row"));
            return orderRows.size();
        } catch (Exception e) {
            return 0;
        }
    }

    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }
}
