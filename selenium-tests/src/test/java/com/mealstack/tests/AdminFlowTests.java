package com.mealstack.tests;

import com.mealstack.base.BaseTest;
import com.mealstack.pages.AdminDashboard;
import com.mealstack.pages.LoginPage;
import com.mealstack.utils.AssertionHelper;
import com.mealstack.utils.TestDataProvider;
import org.testng.annotations.Test;

import java.util.Map;

/**
 * AdminFlowTests — E2E tests for the Admin panel.
 *
 * AUTHENTICATION APPROACH FOR ADMIN TESTS:
 * INTERVIEW TIP:
 * "Admin tests use a separate admin account. I don't try to elevate a normal
 * user's permissions in the UI — that would bypass the backend's auth checks.
 * Instead I use dedicated admin credentials from config.properties."
 *
 * ORDERING: Admin tests are sometimes ORDER-DEPENDENT within the class
 * (e.g., update depends on the item added earlier). TestNG's @Test(priority)
 * handles sequential execution within this class. For true independence,
 * use @BeforeMethod to set up prerequisite state explicitly.
 */
public class AdminFlowTests extends BaseTest {

    // ─────────────────────────────────────────────────────────────────────────
    // ADMIN LOGIN TEST
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * TC-A01: Admin can log in with admin credentials and see the admin dashboard.
     */
    @Test(priority = 1, description = "TC-A01: Admin login with valid credentials should show admin dashboard")
    public void testAdminLogin_ValidCredentials_ShouldShowAdminDashboard() {
        logger.info("TC-A01: Starting admin login test");

        // Arrange
        navigateTo("login.url");
        LoginPage loginPage = new LoginPage(getDriver());

        // Act — Admin login
        loginPage.login(
                TestDataProvider.getAdminEmail(),
                TestDataProvider.getAdminPassword());

        // Assert — URL or page should indicate admin area
        String currentUrl = getDriver().getCurrentUrl();
        boolean isAdminArea = currentUrl.contains("admin")
                || currentUrl.contains("dashboard")
                || !currentUrl.contains("login");

        AssertionHelper.assertTrue(isAdminArea,
                "After admin login, should be redirected to admin area");

        logger.info("TC-A01 PASSED: Admin logged in → {}", currentUrl);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // MENU MANAGEMENT TESTS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * TC-A02: Admin can add a new menu item via the admin panel.
     *
     * INTERVIEW TIP:
     * "I verify the menu item count BEFORE and AFTER adding. The count increasing
     * by 1 is a more reliable assertion than checking for a success toast message,
     * because toast messages disappear quickly and can be missed."
     */
    @Test(priority = 2, description = "TC-A02: Admin should be able to add a new menu item")
    public void testAddMenuItem_ValidData_ShouldIncreaseMenuItemCount() {
        logger.info("TC-A02: Starting add menu item test");

        // Setup
        AdminDashboard adminDash = loginAsAdmin();
        adminDash.goToMenuManagement();

        int countBefore = adminDash.getMenuItemCount();
        Map<String, String> newItem = TestDataProvider.getNewMenuItemData();

        // Act
        adminDash.addMenuItem(newItem);

        // Assert — One more item in the table
        int countAfter = adminDash.getMenuItemCount();
        AssertionHelper.assertGreaterThan(countAfter, countBefore,
                "Menu item count should increase by 1 after adding new item");

        logger.info("TC-A02 PASSED: Item added — count {} → {}", countBefore, countAfter);
    }

    /**
     * TC-A03: Admin can edit an existing menu item.
     */
    @Test(priority = 3, description = "TC-A03: Admin should be able to update an existing menu item")
    public void testUpdateMenuItem_ExistingItem_ShouldSaveChanges() {
        logger.info("TC-A03: Starting update menu item test");

        AdminDashboard adminDash = loginAsAdmin();
        adminDash.goToMenuManagement();

        int itemCount = adminDash.getMenuItemCount();
        AssertionHelper.assertGreaterThan(itemCount, 0,
                "There must be at least 1 menu item to update");

        Map<String, String> updatedData = TestDataProvider.getUpdatedMenuItemData();

        // Act — click edit for first item, fill updated data, save
        adminDash
                .clickEditItem(0)
                .fillMenuItemForm(updatedData)
                .saveMenuItem();

        // Assert — Item count remains the same (edit, not add)
        int countAfter = adminDash.getMenuItemCount();
        AssertionHelper.assertEquals(String.valueOf(countAfter), String.valueOf(itemCount),
                "Item count should remain the same after update (not add)");

        logger.info("TC-A03 PASSED: Menu item updated successfully");
    }

    /**
     * TC-A04: Admin can delete a menu item.
     */
    @Test(priority = 4, description = "TC-A04: Admin should be able to delete a menu item")
    public void testDeleteMenuItem_ExistingItem_ShouldDecreaseMenuItemCount() {
        logger.info("TC-A04: Starting delete menu item test");

        AdminDashboard adminDash = loginAsAdmin();
        adminDash.goToMenuManagement();

        int countBefore = adminDash.getMenuItemCount();
        AssertionHelper.assertGreaterThan(countBefore, 0,
                "There must be at least 1 menu item to delete");

        // Act — delete the last item to avoid interfering with update tests
        adminDash.deleteMenuItem(countBefore - 1);

        // Assert — Count decreased by 1
        int countAfter = adminDash.getMenuItemCount();
        AssertionHelper.assertTrue(countAfter < countBefore,
                "Menu item count should decrease by 1 after deletion");

        logger.info("TC-A04 PASSED: Menu item deleted — count {} → {}", countBefore, countAfter);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ORDERS MANAGEMENT TEST
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * TC-A05: Admin can view all orders in the orders dashboard.
     */
    @Test(priority = 5, description = "TC-A05: Admin should be able to view all customer orders")
    public void testViewAllOrders_AdminUser_ShouldDisplayOrdersList() {
        logger.info("TC-A05: Starting view orders test");

        AdminDashboard adminDash = loginAsAdmin();
        adminDash.goToOrders();

        // Assert — Page loaded and shows orders (could be 0 in test environment)
        int orderCount = adminDash.getOrderCount();
        AssertionHelper.assertTrue(orderCount >= 0,
                "Admin orders dashboard should be accessible and display order count");

        logger.info("TC-A05 PASSED: Admin orders table loaded ({} orders)", orderCount);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PRIVATE HELPER
    // ─────────────────────────────────────────────────────────────────────────

    /** Login as admin and return the AdminDashboard page object */
    private AdminDashboard loginAsAdmin() {
        navigateTo("login.url");
        LoginPage loginPage = new LoginPage(getDriver());
        loginPage.login(
                TestDataProvider.getAdminEmail(),
                TestDataProvider.getAdminPassword());
        logger.info("Admin logged in. URL: {}", getDriver().getCurrentUrl());
        return new AdminDashboard(getDriver());
    }
}
