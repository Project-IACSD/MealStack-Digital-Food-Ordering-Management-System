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
 * CartPage — Page Object for the Shopping Cart screen.
 *
 * INTERVIEW TIP:
 * "The cart is the most logic-heavy page to test. I verify:
 * 1. Items appear after clicking 'Add to Cart' on HomePage
 * 2. Quantity increment/decrement updates the price in real time
 * 3. Remove button removes the item and reduces cart total
 * 4. Empty cart prevents checkout"
 */
public class CartPage {

    private static final Logger logger = LogManager.getLogger(CartPage.class);
    private final WebDriver driver;
    private final WaitHelper wait;

    // ─── Cart Container ───────────────────────────────────────────────────────

    @FindBy(css = ".cart-container, .cart-items, [class*='cart-content']")
    private WebElement cartContainer;

    /** All individual cart item rows */
    @FindBy(css = ".cart-item, [class*='cart-row'], .cart-product")
    private List<WebElement> cartItems;

    // ─── Quantity Controls ────────────────────────────────────────────────────

    /** '+' buttons to increase quantity */
    @FindBy(css = ".increase-qty, button[aria-label*='increase' i], .qty-plus, button.plus")
    private List<WebElement> increaseButtons;

    /** '-' buttons to decrease quantity */
    @FindBy(css = ".decrease-qty, button[aria-label*='decrease' i], .qty-minus, button.minus")
    private List<WebElement> decreaseButtons;

    /** Remove/delete item buttons */
    @FindBy(css = ".remove-item, .delete-item, button[aria-label*='remove' i]")
    private List<WebElement> removeButtons;

    // ─── Cart Totals ──────────────────────────────────────────────────────────

    @FindBy(css = ".cart-total, .total-amount, [class*='grand-total']")
    private WebElement totalAmount;

    @FindBy(css = ".item-count, .cart-count, [class*='items-count']")
    private WebElement itemCount;

    // ─── Action Buttons ───────────────────────────────────────────────────────

    @FindBy(css = ".checkout-btn, button[class*='checkout'], a[href*='checkout']")
    private WebElement checkoutButton;

    @FindBy(css = ".continue-shopping, a[href*='home'], a[href*='menu']")
    private WebElement continueShoppingLink;

    // ─── Empty Cart State ─────────────────────────────────────────────────────

    @FindBy(css = ".empty-cart, [class*='cart-empty'], .no-items")
    private WebElement emptyCartMessage;

    // ─── Constructor ──────────────────────────────────────────────────────────

    public CartPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WaitHelper(driver);
        PageFactory.initElements(driver, this);
        logger.info("CartPage initialised");
    }

    // ─── Page Actions ─────────────────────────────────────────────────────────

    /** Increase quantity of the Nth cart item */
    public CartPage increaseQuantity(int itemIndex) {
        try {
            wait.waitForAllVisible(By.cssSelector(".increase-qty, .qty-plus, button.plus"));
            WebElement btn = increaseButtons.get(itemIndex);
            wait.waitForClickable(btn);
            btn.click();
            logger.info("Increased quantity for item at index {}", itemIndex);
        } catch (Exception e) {
            logger.error("Could not increase quantity: {}", e.getMessage());
        }
        return this;
    }

    /** Decrease quantity of the Nth cart item */
    public CartPage decreaseQuantity(int itemIndex) {
        try {
            wait.waitForAllVisible(By.cssSelector(".decrease-qty, .qty-minus, button.minus"));
            WebElement btn = decreaseButtons.get(itemIndex);
            wait.waitForClickable(btn);
            btn.click();
            logger.info("Decreased quantity for item at index {}", itemIndex);
        } catch (Exception e) {
            logger.error("Could not decrease quantity: {}", e.getMessage());
        }
        return this;
    }

    /** Remove a specific item from cart */
    public CartPage removeItem(int itemIndex) {
        try {
            wait.waitForAllVisible(By.cssSelector(".remove-item, .delete-item"));
            WebElement btn = removeButtons.get(itemIndex);
            wait.waitForClickable(btn);
            btn.click();
            logger.info("Removed cart item at index {}", itemIndex);
            // Wait for cart to re-render after removal
            Thread.sleep(500);
        } catch (Exception e) {
            logger.error("Could not remove item: {}", e.getMessage());
        }
        return this;
    }

    /** Remove the first item in the cart */
    public CartPage removeFirstItem() {
        return removeItem(0);
    }

    /** Remove ALL items from the cart */
    public CartPage clearCart() {
        int count = getCartItemCount();
        logger.info("Clearing cart ({} items)", count);
        for (int i = 0; i < count; i++) {
            // Always remove index 0 since after removal the list shifts
            removeItem(0);
        }
        return this;
    }

    /** Proceed to checkout */
    public CheckoutPage clickCheckout() {
        wait.waitForClickable(checkoutButton);
        checkoutButton.click();
        logger.info("Checkout button clicked");
        return new CheckoutPage(driver);
    }

    /** Click checkout — used for negative test (expected to stay on cart page) */
    public CartPage clickCheckoutExpectingError() {
        try {
            wait.waitForClickable(checkoutButton);
            checkoutButton.click();
        } catch (Exception e) {
            logger.info("Checkout button not clickable (expected for empty cart): {}",
                    e.getMessage());
        }
        return this;
    }

    /** Go back to menu for more shopping */
    public HomePage continueShopping() {
        wait.waitForClickable(continueShoppingLink);
        continueShoppingLink.click();
        return new HomePage(driver);
    }

    // ─── Verification Methods ─────────────────────────────────────────────────

    /** Get number of items currently in cart */
    public int getCartItemCount() {
        try {
            wait.waitForAllVisible(By.cssSelector(".cart-item, [class*='cart-row']"));
            int count = cartItems.size();
            logger.info("Cart item count: {}", count);
            return count;
        } catch (Exception e) {
            return 0;
        }
    }

    /** Get the displayed total amount as a string (e.g., "₹250") */
    public String getTotalAmountText() {
        try {
            wait.waitForVisible(totalAmount);
            String text = totalAmount.getText().trim();
            logger.info("Cart total: {}", text);
            return text;
        } catch (Exception e) {
            return "0";
        }
    }

    /** Check if cart is empty */
    public boolean isCartEmpty() {
        try {
            return emptyCartMessage.isDisplayed();
        } catch (Exception e) {
            return getCartItemCount() == 0;
        }
    }

    /** Check if checkout button is enabled (should be disabled for empty cart) */
    public boolean isCheckoutButtonEnabled() {
        try {
            wait.waitForVisible(checkoutButton);
            return checkoutButton.isEnabled();
        } catch (Exception e) {
            return false;
        }
    }

    /** Check if cart page is displayed */
    public boolean isCartPageDisplayed() {
        try {
            wait.waitForVisible(cartContainer);
            return cartContainer.isDisplayed();
        } catch (Exception e) {
            return driver.getCurrentUrl().contains("cart");
        }
    }

    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }
}
