package com.mealstack.pages;

import com.mealstack.utils.WaitHelper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

/**
 * RegisterPage — Page Object for user registration screen.
 *
 * INTERVIEW TIP:
 * "Each page has its own class. RegisterPage ONLY contains elements and
 * methods related to registration — Single Responsibility Principle.
 * I never put login elements inside RegisterPage."
 */
public class RegisterPage {

    private static final Logger logger = LogManager.getLogger(RegisterPage.class);
    private final WebDriver driver;
    private final WaitHelper wait;

    // ─── Element Locators ─────────────────────────────────────────────────────

    @FindBy(css = "input[name='name'], input[placeholder*='Name' i], input[id*='name']")
    private WebElement nameInput;

    @FindBy(css = "input[type='email'], input[name='email']")
    private WebElement emailInput;

    @FindBy(css = "input[type='password']:first-of-type, input[name='password']")
    private WebElement passwordInput;

    @FindBy(css = "input[name='confirmPassword'], input[placeholder*='confirm' i]")
    private WebElement confirmPasswordInput;

    @FindBy(css = "input[type='tel'], input[name='phone'], input[placeholder*='Phone' i]")
    private WebElement phoneInput;

    @FindBy(css = "button[type='submit'], .register-btn, button.btn-primary")
    private WebElement registerButton;

    @FindBy(css = "a[href*='login'], .login-link")
    private WebElement loginLink;

    @FindBy(css = ".error-message, .alert-danger, [class*='error']")
    private WebElement errorMessage;

    @FindBy(css = ".success-message, .alert-success, [class*='success']")
    private WebElement successMessage;

    // ─── Constructor ──────────────────────────────────────────────────────────

    public RegisterPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WaitHelper(driver);
        PageFactory.initElements(driver, this);
        logger.info("RegisterPage initialised");
    }

    // ─── Page Actions ─────────────────────────────────────────────────────────

    public RegisterPage enterName(String name) {
        wait.waitForVisible(nameInput);
        nameInput.clear();
        nameInput.sendKeys(name);
        logger.info("Entered name: {}", name);
        return this;
    }

    public RegisterPage enterEmail(String email) {
        wait.waitForVisible(emailInput);
        emailInput.clear();
        emailInput.sendKeys(email);
        return this;
    }

    public RegisterPage enterPassword(String password) {
        wait.waitForVisible(passwordInput);
        passwordInput.clear();
        passwordInput.sendKeys(password);
        return this;
    }

    public RegisterPage enterConfirmPassword(String password) {
        try {
            if (confirmPasswordInput.isDisplayed()) {
                confirmPasswordInput.clear();
                confirmPasswordInput.sendKeys(password);
            }
        } catch (Exception e) {
            logger.debug("Confirm password field not found — skipping");
        }
        return this;
    }

    public RegisterPage enterPhone(String phone) {
        try {
            if (phoneInput.isDisplayed()) {
                phoneInput.clear();
                phoneInput.sendKeys(phone);
            }
        } catch (Exception e) {
            logger.debug("Phone field not found — skipping");
        }
        return this;
    }

    public LoginPage clickRegister() {
        wait.waitForClickable(registerButton);
        registerButton.click();
        logger.info("Register button clicked");
        return new LoginPage(driver); // After successful registration, redirects to login
    }

    /**
     * High-level: fill all registration fields and submit.
     *
     * @param name     Full name
     * @param email    Email address
     * @param password Password (used for both fields)
     * @param phone    (Optional) Phone number
     */
    public LoginPage registerUser(String name, String email, String password, String phone) {
        enterName(name);
        enterEmail(email);
        enterPassword(password);
        enterConfirmPassword(password);
        enterPhone(phone);
        logger.info("Submitting registration for: {}", email);
        return clickRegister();
    }

    /**
     * Register using a Map of field values (from TestDataProvider.getNewUserData())
     */
    public void registerUserFromMap(java.util.Map<String, String> userData) {
        enterName(userData.get("name"));
        enterEmail(userData.get("email"));
        enterPassword(userData.get("password"));
        enterConfirmPassword(userData.get("password"));
        enterPhone(userData.getOrDefault("phone", "9876543210"));
        wait.waitForClickable(registerButton);
        registerButton.click();
        logger.info("Registration submitted for: {}", userData.get("email"));
    }

    /** Click 'Already have an account? Login' link */
    public LoginPage clickLoginLink() {
        wait.waitForClickable(loginLink);
        loginLink.click();
        return new LoginPage(driver);
    }

    // ─── Verification Methods ─────────────────────────────────────────────────

    public boolean isRegistrationPageDisplayed() {
        try {
            wait.waitForVisible(nameInput);
            return nameInput.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isErrorMessageDisplayed() {
        try {
            return errorMessage.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public String getErrorMessage() {
        wait.waitForVisible(errorMessage);
        return errorMessage.getText();
    }

    public boolean isSuccessMessageDisplayed() {
        try {
            wait.waitForVisible(successMessage);
            return successMessage.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }
}
