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
 * HomePage — Page Object for the main menu browsing page.
 *
 * INTERVIEW TIP:
 * "HomePage is the most complex page in a food ordering app. I separately
 * modelled:
 * - Navigation bar actions (logout, cart icon)
 * - Menu browsing (category filter, search)
 * - Individual item interaction (add to cart)
 * This aligns with the Single Responsibility Principle at the method level."
 */
public class HomePage {

    private static final Logger logger = LogManager.getLogger(HomePage.class);
    private final WebDriver driver;
    private final WaitHelper wait;

    // ─── Navigation Bar ───────────────────────────────────────────────────────

    @FindBy(css = ".navbar-brand, .logo, img[alt*='MealStack' i]")
    private WebElement logo;

    @FindBy(css = "a[href*='cart'], .cart-icon, button[aria-label*='cart' i]")
    private WebElement cartIcon;

    /** Cart item count badge */
    @FindBy(css = ".cart-count, .badge, [class*='cart-badge']")
    private WebElement cartCount;

    @FindBy(css = "button[aria-label*='logout' i], .logout-btn, a[href*='logout']")
    private WebElement logoutButton;

    @FindBy(css = ".user-menu, .profile-dropdown, [class*='user-section']")
    private WebElement userMenu;

    @FindBy(css = "a[href*='orders'], a[href*='history'], .order-history-link")
    private WebElement orderHistoryLink;

    // ─── Search & Filter ──────────────────────────────────────────────────────

    @FindBy(css = "input[type='search'], input[placeholder*='Search' i], .search-input")
    private WebElement searchInput;

    @FindBy(css = ".search-btn, button[type='submit'][class*='search']")
    private WebElement searchButton;

    /** Category filter buttons/tabs */
    @FindBy(css = ".category-btn, .filter-btn, [class*='category']")
    private List<WebElement> categoryFilters;

    // ─── Menu Items ───────────────────────────────────────────────────────────

    /** Container listing all menu item cards */
    @FindBy(css = ".menu-items, .food-grid, .menu-grid, [class*='menu-list']")
    private WebElement menuContainer;

    /** All individual menu item cards */
    @FindBy(css = ".menu-item, .food-card, .item-card, [class*='menu-card']")
    private List<WebElement> menuItems;

    /** "Add to Cart" buttons on menu item cards */
    @FindBy(css = ".add-to-cart-btn, button[class*='add-cart'], button[aria-label*='add to cart' i]")
    private List<WebElement> addToCartButtons;

    // ─── Feedback Messages ────────────────────────────────────────────────────

    @FindBy(css = ".toast, .snackbar, .alert, [class*='notification']")
    private WebElement notification;

    // ─── Constructor ──────────────────────────────────────────────────────────

    public HomePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WaitHelper(driver);
        PageFactory.initElements(driver, this);
        logger.info("HomePage initialised");
    }

    // ─── Page Actions ─────────────────────────────────────────────────────────

    /** Wait for the menu to finish loading */
    public void waitForPageLoad() {
        wait.waitForVisible(By.cssSelector(
                ".menu-items, .food-grid, .menu-grid, [class*='menu']"));
        logger.info("HomePage loaded — menu container visible");
    }

    /** Search for a menu item by name */
    public HomePage searchForItem(String searchTerm) {
        try {
            wait.waitForClickable(searchInput);
            searchInput.clear();
            searchInput.sendKeys(searchTerm);
            // Try clicking search button; some apps search as-you-type
            try {
                searchButton.click();
            } catch (Exception e) {
                // No explicit button — search triggered by input change (OK)
            }
            logger.info("Searched for: {}", searchTerm);
        } catch (Exception e) {
            logger.warn("Search field not found: {}", e.getMessage());
        }
        return this;
    }

    /**
     * Filter menu by a specific category name.
     * Iterates over category buttons and clicks the one matching the given name.
     */
    public HomePage filterByCategory(String categoryName) {
        try {
            wait.waitForAllVisible(By.cssSelector(".category-btn, .filter-btn, [class*='category']"));
            for (WebElement cat : categoryFilters) {
                if (cat.getText().trim().equalsIgnoreCase(categoryName)) {
                    wait.waitForClickable(cat);
                    cat.click();
                    logger.info("Filtered by category: {}", categoryName);
                    return this;
                }
            }
            logger.warn("Category '{}' not found in filter list", categoryName);
        } catch (Exception e) {
            logger.warn("Category filters not found: {}", e.getMessage());
        }
        return this;
    }

    /**
     * Add the Nth menu item to cart (0-indexed).
     * INTERVIEW TIP: "By parameterising the item index, one method handles
     * 'add first item' and 'add third item' tests."
     */
    public HomePage addItemToCart(int itemIndex) {
        try {
            wait.waitForAllVisible(By.cssSelector(".add-to-cart-btn, button[class*='add-cart']"));
            if (itemIndex < addToCartButtons.size()) {
                WebElement btn = addToCartButtons.get(itemIndex);
                wait.waitForClickable(btn);
                btn.click();
                logger.info("Added item at index {} to cart", itemIndex);
                // Wait for notification to appear then disappear (if any)
                try {
                    Thread.sleep(500);
                } catch (InterruptedException ignored) {
                }
            } else {
                logger.warn("Item index {} exceeds available items ({})",
                        itemIndex, addToCartButtons.size());
            }
        } catch (Exception e) {
            logger.error("Failed to add item to cart: {}", e.getMessage());
        }
        return this;
    }

    /** Add the first available item to cart */
    public HomePage addFirstItemToCart() {
        return addItemToCart(0);
    }

    /** Navigate to cart page */
    public CartPage goToCart() {
        wait.waitForClickable(cartIcon);
        cartIcon.click();
        logger.info("Navigated to Cart");
        return new CartPage(driver);
    }

    /** Navigate to order history */
    public OrderHistoryPage goToOrderHistory() {
        try {
            userMenu.click(); // Open dropdown if present
            Thread.sleep(300);
        } catch (Exception ignored) {
        }
        wait.waitForClickable(orderHistoryLink);
        orderHistoryLink.click();
        logger.info("Navigated to Order History");
        return new OrderHistoryPage(driver);
    }

    /** Logout current user */
    public LoginPage logout() {
        try {
            // Try opening user menu dropdown first
            userMenu.click();
            Thread.sleep(300);
        } catch (Exception ignored) {
        }

        wait.waitForClickable(logoutButton);
        logoutButton.click();
        logger.info("User logged out");
        return new LoginPage(driver);
    }

    // ─── Verification Methods ─────────────────────────────────────────────────

    public boolean isHomePageDisplayed() {
        try {
            waitForPageLoad();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /** Get total count of menu items currently displayed */
    public int getMenuItemCount() {
        try {
            wait.waitForAllVisible(By.cssSelector(".menu-item, .food-card, .item-card"));
            int count = menuItems.size();
            logger.info("Menu items displayed: {}", count);
            return count;
        } catch (Exception e) {
            logger.warn("Could not count menu items: {}", e.getMessage());
            return 0;
        }
    }

    /** Get the cart item count from the badge */
    public int getCartItemCount() {
        try {
            wait.waitForVisible(cartCount);
            String countText = cartCount.getText().trim();
            return countText.isEmpty() ? 0 : Integer.parseInt(countText);
        } catch (Exception e) {
            return 0;
        }
    }

    /** Get notification/toast message text */
    public String getNotificationText() {
        try {
            wait.waitForVisible(notification);
            return notification.getText().trim();
        } catch (Exception e) {
            return "";
        }
    }

    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }

    /** Check if the current URL indicates user is logged in (not on login page) */
    public boolean isUserLoggedIn() {
        String url = driver.getCurrentUrl();
        return !url.contains("login") && !url.contains("register");
    }
}
