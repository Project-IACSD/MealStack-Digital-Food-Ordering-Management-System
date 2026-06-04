package com.mealstack.pages;

import com.mealstack.base.BaseTest;
import com.mealstack.utils.WaitHelper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

/**
 * LoginPage — Page Object for the MealStack Login screen.
 *
 * PAGE OBJECT MODEL (POM) PRINCIPLES:
 * 1. All element locators are defined as FIELDS in the POM class (not in
 * tests).
 * 2. Methods represent USER ACTIONS (e.g., enterEmail, clickLogin), not
 * Selenium commands.
 * 3. Tests read like plain English, hiding Selenium complexity.
 *
 * INTERVIEW TIP:
 * "Instead of writing
 * driver.findElement(By.id('email')).sendKeys('test@test.com') in
 * every test, I define the element once in LoginPage and call
 * loginPage.enterEmail().
 * If the input's ID changes, I fix ONE line in LoginPage, not in 10 test
 * methods."
 *
 * @FindBy ANNOTATION:
 *         PageFactory.initElements() reads @FindBy annotations and creates
 *         lazy-loading
 *         WebElement proxies. The element is NOT looked up until the method is
 *         called.
 */
public class LoginPage {

    private static final Logger logger = LogManager.getLogger(LoginPage.class);
    private final WebDriver driver;
    private final WaitHelper wait;

    // ─────────────────────────────────────────────────────────────────────────
    // ELEMENT LOCATORS (using @FindBy with PageFactory)
    // ─────────────────────────────────────────────────────────────────────────

    /** Email input field — React app likely uses name/placeholder attributes */
    @FindBy(css = "input[type='email'], input[name='email'], input[placeholder*='Email' i]")
    private WebElement emailInput;

    /** Password input field */
    @FindBy(css = "input[type='password'], input[name='password']")
    private WebElement passwordInput;

    /** Login submit button */
    @FindBy(css = "button[type='submit'], button.login-btn, .login-button")
    private WebElement loginButton;

    /** Link to navigate to registration page */
    @FindBy(css = "a[href*='register'], a[href*='signup'], .register-link")
    private WebElement registerLink;

    /** Error message shown on invalid login */
    @FindBy(css = ".error-message, .alert-danger, [class*='error'], .toast-error")
    private WebElement errorMessage;

    /** Page heading to confirm we're on login screen */
    @FindBy(css = "h1, h2, .login-title, .page-title")
    private WebElement pageTitle;

    // ─────────────────────────────────────────────────────────────────────────
    // CONSTRUCTOR
    // ─────────────────────────────────────────────────────────────────────────

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WaitHelper(driver);
        // PageFactory reads all @FindBy annotations and initialises proxy elements
        PageFactory.initElements(driver, this);
        logger.info("LoginPage initialised");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PAGE ACTIONS (methods represent what a USER DOES on this page)
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Enter email address in the email field.
     * clear() first to remove any pre-filled value.
     */
    public LoginPage enterEmail(String email) {
        wait.waitForVisible(emailInput);
        emailInput.clear();
        emailInput.sendKeys(email);
        logger.info("Entered email: {}", email);
        return this; // Method chaining (Fluent Interface pattern)
    }

    /** Enter password in the password field */
    public LoginPage enterPassword(String password) {
        wait.waitForVisible(passwordInput);
        passwordInput.clear();
        passwordInput.sendKeys(password);
        logger.info("Entered password: [MASKED]");
        return this;
    }

    /** Click the Login button and return the next page (HomePage) */
    public HomePage clickLogin() {
        wait.waitForClickable(loginButton);
        loginButton.click();
        logger.info("Login button clicked");
        return new HomePage(driver);
    }

    /**
     * High-level composite method: fill form and submit.
     * INTERVIEW TIP: "This composite method improves test readability.
     * The test calls loginPage.login(email, pass) not three separate calls."
     */
    public HomePage login(String email, String password) {
        return enterEmail(email)
                .enterPassword(password)
                .clickLogin();
    }

    /**
     * Attempt login with credentials that are expected to FAIL.
     * Does NOT return a HomePage — stays on LoginPage.
     */
    public LoginPage loginExpectingFailure(String email, String password) {
        enterEmail(email);
        enterPassword(password);
        wait.waitForClickable(loginButton);
        loginButton.click();
        logger.info("Attempted invalid login for: {}", email);
        return this;
    }

    /** Click the 'Register' link to go to the registration page */
    public RegisterPage clickRegisterLink() {
        wait.waitForClickable(registerLink);
        registerLink.click();
        return new RegisterPage(driver);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PAGE VERIFICATION METHODS
    // ─────────────────────────────────────────────────────────────────────────

    /** Check if error message is displayed */
    public boolean isErrorMessageDisplayed() {
        try {
            wait.waitForVisible(By.cssSelector(".error-message, .alert-danger, [class*='error']"));
            return errorMessage.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /** Get the error message text */
    public String getErrorMessage() {
        wait.waitForVisible(errorMessage);
        String text = errorMessage.getText();
        logger.info("Error message text: {}", text);
        return text;
    }

    /** Verify we are on the login page */
    public boolean isLoginPageDisplayed() {
        try {
            wait.waitForVisible(emailInput);
            wait.waitForVisible(passwordInput);
            return emailInput.isDisplayed() && passwordInput.isDisplayed();
        } catch (Exception e) {
            logger.warn("Login page elements not found: {}", e.getMessage());
            return false;
        }
    }

    /** Get current page URL (for URL-based navigation assertion) */
    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }

    /** Get the page title text */
    public String getPageTitle() {
        try {
            return pageTitle.getText();
        } catch (Exception e) {
            return driver.getTitle();
        }
    }
}
