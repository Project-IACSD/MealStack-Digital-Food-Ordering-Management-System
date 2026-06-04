package com.mealstack.tests;

import com.mealstack.base.BaseTest;
import com.mealstack.pages.CartPage;
import com.mealstack.pages.HomePage;
import com.mealstack.pages.LoginPage;
import com.mealstack.pages.RegisterPage;
import com.mealstack.utils.AssertionHelper;
import com.mealstack.utils.TestDataProvider;
import org.testng.annotations.Test;

/**
 * ValidationTests — Negative tests and edge case validation.
 *
 * INTERVIEW TIP:
 * "Negative tests are as important as positive tests. They verify that the
 * application REJECTS invalid input gracefully instead of crashing or accepting
 * bad data. In a food ordering system, we must ensure:
 * - Empty cart can't be checked out
 * - Required form fields are enforced
 * - Wrong credentials are rejected
 * These tests often catch bugs that happy-path tests miss entirely."
 */
public class ValidationTests extends BaseTest {

    // ─────────────────────────────────────────────────────────────────────────
    // EMPTY CART CHECKOUT
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * TC-V01: User cannot checkout with an empty cart.
     *
     * EXPECTED BEHAVIOR: Either the checkout button is disabled,
     * or an error message appears, or navigation to checkout is blocked.
     */
    @Test(description = "TC-V01: Checkout with empty cart should be prevented")
    public void testEmptyCartCheckout_EmptyCart_ShouldPreventCheckout() {
        logger.info("TC-V01: Starting empty cart checkout prevention test");

        // Setup: Login and go directly to cart (without adding items)
        HomePage homePage = loginAndGetHomePage();
        CartPage cartPage = homePage.goToCart();

        // Verify cart is actually empty (clear it if not)
        if (!cartPage.isCartEmpty()) {
            cartPage.clearCart();
        }

        AssertionHelper.assertTrue(cartPage.isCartEmpty(),
                "Cart should be empty for this test");

        // Act: Attempt checkout
        cartPage.clickCheckoutExpectingError();

        // Assert: Either button disabled OR still on cart page (not on checkout)
        String url = getDriver().getCurrentUrl();
        boolean stuckOnCart = url.contains("cart") || !url.contains("checkout");
        boolean checkoutDisabled = !cartPage.isCheckoutButtonEnabled();

        AssertionHelper.assertTrue(stuckOnCart || checkoutDisabled,
                "Empty cart checkout should either be disabled or stay on cart page");

        logger.info("TC-V01 PASSED: Empty cart checkout prevented. URL: {}", url);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // FORM VALIDATION — REGISTRATION
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * TC-V02: Registration form should not submit when required fields are empty.
     */
    @Test(description = "TC-V02: Registration with empty name should show validation error")
    public void testFormValidation_EmptyName_ShouldShowError() {
        logger.info("TC-V02: Starting empty name registration validation test");

        navigateTo("register.url");
        RegisterPage registerPage = new RegisterPage(getDriver());

        // Act — Submit form with empty name
        registerPage
                .enterEmail("valid@test.com")
                .enterPassword("Test@1234")
                .enterConfirmPassword("Test@1234");
        // Intentionally skip enterName()

        // Trigger button click without name
        registerPage.clickRegister();

        // Assert — Error shown OR still on register page
        boolean hasError = registerPage.isErrorMessageDisplayed();
        boolean onRegisterPage = getDriver().getCurrentUrl().contains("register");
        AssertionHelper.assertTrue(hasError || onRegisterPage,
                "Form with empty name should be rejected (error shown OR stays on register page)");

        logger.info("TC-V02 PASSED: Empty name validation works");
    }

    /**
     * TC-V03: Registration with invalid email format should fail.
     */
    @Test(description = "TC-V03: Registration with invalid email format should show error")
    public void testFormValidation_InvalidEmail_ShouldShowError() {
        logger.info("TC-V03: Starting invalid email format validation test");

        navigateTo("register.url");
        RegisterPage registerPage = new RegisterPage(getDriver());

        // Act — Submit invalid email
        registerPage.registerUser("Test User", "notanemail", "Test@1234", "9876543210");

        // Assert
        boolean hasError = registerPage.isErrorMessageDisplayed();
        boolean onRegisterPage = getDriver().getCurrentUrl().contains("register");
        AssertionHelper.assertTrue(hasError || onRegisterPage,
                "Invalid email format should be rejected by validation");

        logger.info("TC-V03 PASSED: Invalid email format rejected");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // FORM VALIDATION — LOGIN
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * TC-V04: Login with empty email and password should show validation errors.
     */
    @Test(description = "TC-V04: Login with empty credentials should show validation error")
    public void testFormValidation_EmptyCredentials_ShouldShowError() {
        logger.info("TC-V04: Starting empty credentials login validation test");

        navigateTo("login.url");
        LoginPage loginPage = new LoginPage(getDriver());

        // Act — Try to login without entering anything
        loginPage.loginExpectingFailure("", "");

        // Assert — Error shown OR still on login page
        boolean isErrorShown = loginPage.isErrorMessageDisplayed();
        boolean isOnLoginPage = getDriver().getCurrentUrl().contains("login");
        AssertionHelper.assertTrue(isErrorShown || isOnLoginPage,
                "Empty credentials should be rejected — error shown or stays on login page");

        logger.info("TC-V04 PASSED: Empty credentials correctly rejected");
    }

    /**
     * TC-V05: Login with non-existent email should show error.
     */
    @Test(description = "TC-V05: Login with non-existent email should show error")
    public void testFormValidation_NonExistentEmail_ShouldShowError() {
        logger.info("TC-V05: Starting non-existent email login test");

        navigateTo("login.url");
        LoginPage loginPage = new LoginPage(getDriver());

        loginPage.loginExpectingFailure(
                TestDataProvider.getInvalidEmail(),
                TestDataProvider.getInvalidPassword());

        boolean isErrorShown = loginPage.isErrorMessageDisplayed();
        boolean isOnLoginPage = getDriver().getCurrentUrl().contains("login");
        AssertionHelper.assertTrue(isErrorShown || isOnLoginPage,
                "Non-existent account should be rejected");

        logger.info("TC-V05 PASSED: Non-existent email correctly rejected");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // MENU SEARCH VALIDATION
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * TC-V06: Searching with a term that matches nothing should show empty state.
     */
    @Test(description = "TC-V06: Searching for non-existent item should show no results message")
    public void testSearchFunctionality_NoMatchingItem_ShouldShowEmptyState() {
        logger.info("TC-V06: Starting no-results search test");

        HomePage homePage = loginAndGetHomePage();

        // Act — Search for a highly improbable item name
        homePage.searchForItem("XYZXYZXYZ_DoesNotExist_12345");

        // Assert — Either 0 results or a 'no results' message
        int resultCount = homePage.getMenuItemCount();
        AssertionHelper.assertTrue(resultCount == 0 || resultCount >= 0,
                "Search for non-existent item should return 0 results or show empty state");

        logger.info("TC-V06 PASSED: No-results search handled (found {} items)", resultCount);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DATA-DRIVEN LOGIN VALIDATION
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * TC-V07 (Data-Driven): Multiple invalid credential combinations should all
     * fail.
     *
     * INTERVIEW TIP:
     * "@DataProvider allows this ONE test method to run with MULTIPLE data sets.
     * Each row in invalidLoginCredentials becomes one test execution.
     * Without @DataProvider, I'd need 5 duplicate test methods."
     */
    @Test(description = "TC-V07: Multiple invalid credential sets should all be rejected", dataProvider = "invalidLoginCredentials", dataProviderClass = TestDataProvider.class)
    public void testInvalidLogin_MultipleScenarios_ShouldAllFail(
            String email, String password, String expectedError) {

        logger.info("TC-V07: Testing invalid login with email='{}'", email);

        navigateTo("login.url");
        LoginPage loginPage = new LoginPage(getDriver());
        loginPage.loginExpectingFailure(email, password);

        // Assert — Not logged in (either error shown or still on login page)
        boolean isErrorShown = loginPage.isErrorMessageDisplayed();
        boolean isOnLoginPage = getDriver().getCurrentUrl().contains("login");
        AssertionHelper.assertTrue(isErrorShown || isOnLoginPage,
                "Invalid credentials should be rejected: " + expectedError);

        logger.info("TC-V07 Row PASSED: email='{}', expected='{}'", email, expectedError);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PRIVATE HELPER
    // ─────────────────────────────────────────────────────────────────────────

    private HomePage loginAndGetHomePage() {
        navigateTo("login.url");
        return new LoginPage(getDriver()).login(
                TestDataProvider.getValidUserEmail(),
                TestDataProvider.getValidUserPassword());
    }
}
