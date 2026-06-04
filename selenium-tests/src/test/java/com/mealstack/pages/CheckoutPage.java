package com.mealstack.pages;

import com.mealstack.utils.WaitHelper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.Select;

/**
 * CheckoutPage — Page Object for the order placement / checkout screen.
 */
public class CheckoutPage {

    private static final Logger logger = LogManager.getLogger(CheckoutPage.class);
    private final WebDriver driver;
    private final WaitHelper wait;

    // ─── Delivery Information ──────────────────────────────────────────────────

    @FindBy(css = "input[name='address'], input[placeholder*='address' i], textarea[name='address']")
    private WebElement addressInput;

    @FindBy(css = "input[name='phone'], input[placeholder*='Phone' i]")
    private WebElement phoneInput;

    @FindBy(css = "input[name='city'], input[placeholder*='City' i]")
    private WebElement cityInput;

    @FindBy(css = "input[name='pincode'], input[name='zip'], input[placeholder*='Pincode' i]")
    private WebElement pincodeInput;

    // ─── Order Summary ─────────────────────────────────────────────────────────

    @FindBy(css = ".order-summary, [class*='order-total'], .checkout-summary")
    private WebElement orderSummary;

    @FindBy(css = ".total-price, .grand-total, [class*='total-amount']")
    private WebElement totalPrice;

    // ─── Payment Method ────────────────────────────────────────────────────────

    @FindBy(css = "select[name='paymentMethod'], select[name='payment']")
    private WebElement paymentMethodDropdown;

    @FindBy(css = "input[type='radio'][value='COD'], input[value*='cash' i]")
    private WebElement codRadioButton;

    @FindBy(css = "input[type='radio'][value='ONLINE'], input[value*='online' i]")
    private WebElement onlineRadioButton;

    // ─── Action Buttons ────────────────────────────────────────────────────────

    @FindBy(css = ".place-order-btn, button[class*='place-order'], .submit-order")
    private WebElement placeOrderButton;

    @FindBy(css = ".back-to-cart, a[href*='cart'], button.back-btn")
    private WebElement backToCartButton;

    // ─── Confirmation / Feedback ───────────────────────────────────────────────

    @FindBy(css = ".order-success, .success-message, [class*='order-confirmed']")
    private WebElement orderSuccessMessage;

    @FindBy(css = ".order-id, [class*='order-number'], .confirmation-id")
    private WebElement orderIdText;

    @FindBy(css = ".error-message, .alert-danger")
    private WebElement errorMessage;

    // ─── Constructor ──────────────────────────────────────────────────────────

    public CheckoutPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WaitHelper(driver);
        PageFactory.initElements(driver, this);
        logger.info("CheckoutPage initialised");
    }

    // ─── Page Actions ─────────────────────────────────────────────────────────

    public CheckoutPage enterAddress(String address) {
        wait.waitForVisible(addressInput);
        addressInput.clear();
        addressInput.sendKeys(address);
        logger.info("Entered address");
        return this;
    }

    public CheckoutPage enterPhone(String phone) {
        try {
            phoneInput.clear();
            phoneInput.sendKeys(phone);
        } catch (Exception e) {
            logger.debug("Phone field not present on checkout: {}", e.getMessage());
        }
        return this;
    }

    public CheckoutPage enterCity(String city) {
        try {
            cityInput.clear();
            cityInput.sendKeys(city);
        } catch (Exception ignored) {
        }
        return this;
    }

    public CheckoutPage enterPincode(String pincode) {
        try {
            pincodeInput.clear();
            pincodeInput.sendKeys(pincode);
        } catch (Exception ignored) {
        }
        return this;
    }

    /** Select payment method from dropdown (if present) */
    public CheckoutPage selectPaymentMethod(String method) {
        try {
            wait.waitForVisible(paymentMethodDropdown);
            new Select(paymentMethodDropdown).selectByVisibleText(method);
            logger.info("Selected payment method: {}", method);
        } catch (Exception e) {
            // Try radio buttons
            try {
                if (method.equalsIgnoreCase("COD") || method.equalsIgnoreCase("Cash on Delivery")) {
                    codRadioButton.click();
                } else {
                    onlineRadioButton.click();
                }
                logger.info("Selected payment via radio: {}", method);
            } catch (Exception ex) {
                logger.debug("Payment selection not found: {}", ex.getMessage());
            }
        }
        return this;
    }

    /**
     * High-level: fill delivery address and place order.
     *
     * INTERVIEW TIP:
     * "The checkout test calls this one method. If the checkout form changes,
     * only this method needs updating — tests stay unchanged."
     */
    public CheckoutPage fillDeliveryDetails(String address, String phone, String city, String pincode) {
        enterAddress(address);
        enterPhone(phone);
        enterCity(city);
        enterPincode(pincode);
        return this;
    }

    /** Click 'Place Order' button */
    public CheckoutPage placeOrder() {
        wait.waitForClickable(placeOrderButton);
        placeOrderButton.click();
        logger.info("Place Order button clicked");
        // Wait for order confirmation or error to appear
        try {
            Thread.sleep(2000);
        } catch (InterruptedException ignored) {
        }
        return this;
    }

    // ─── Verification Methods ─────────────────────────────────────────────────

    public boolean isOrderSuccessful() {
        try {
            wait.waitForVisible(orderSuccessMessage);
            boolean success = orderSuccessMessage.isDisplayed();
            logger.info("Order success message displayed: {}", success);
            return success;
        } catch (Exception e) {
            // Also check URL change (some apps redirect to confirmation page)
            return driver.getCurrentUrl().contains("confirmation")
                    || driver.getCurrentUrl().contains("success")
                    || driver.getCurrentUrl().contains("order");
        }
    }

    public String getOrderId() {
        try {
            wait.waitForVisible(orderIdText);
            return orderIdText.getText().trim();
        } catch (Exception e) {
            return "";
        }
    }

    public String getTotalPrice() {
        try {
            wait.waitForVisible(totalPrice);
            return totalPrice.getText().trim();
        } catch (Exception e) {
            return "N/A";
        }
    }

    public boolean isErrorDisplayed() {
        try {
            return errorMessage.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isCheckoutPageDisplayed() {
        try {
            wait.waitForVisible(By.cssSelector(".checkout-summary, .place-order-btn, [class*='checkout']"));
            return true;
        } catch (Exception e) {
            return driver.getCurrentUrl().contains("checkout");
        }
    }

    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }
}
