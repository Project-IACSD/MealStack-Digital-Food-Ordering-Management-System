package com.mealstack.utils;

import com.github.javafaker.Faker;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.HashMap;
import java.util.Map;

/**
 * TestDataProvider — Generates and provides test data.
 *
 * INTERVIEW TIP:
 * "I centralised all test data in one place. If business rules change
 * (e.g., password must now be 12 characters), I fix it in ONE file
 * instead of hunting through every test class. I also used JavaFaker
 * to generate unique random emails for registration tests, ensuring
 * each test run creates a fresh user and tests remain independent."
 *
 * DATA-DRIVEN TESTING:
 * "@DataProvider methods (see below) allow TestNG to run the SAME test
 * with MULTIPLE data sets. This avoids writing separate methods for each
 * variation of a scenario."
 */
public class TestDataProvider {

    private static final Logger logger = LogManager.getLogger(TestDataProvider.class);

    // JavaFaker generates realistic random data that looks authentic
    private static final Faker faker = new Faker();

    // ─────────────────────────────────────────────────────────────────────────
    // STATIC CREDENTIALS (read from config)
    // ─────────────────────────────────────────────────────────────────────────

    public static String getValidUserEmail() {
        return ConfigReader.getProperty("user.email");
    }

    public static String getValidUserPassword() {
        return ConfigReader.getProperty("user.password");
    }

    public static String getAdminEmail() {
        return ConfigReader.getProperty("admin.email");
    }

    public static String getAdminPassword() {
        return ConfigReader.getProperty("admin.password");
    }

    public static String getInvalidEmail() {
        return ConfigReader.getProperty("invalid.email");
    }

    public static String getInvalidPassword() {
        return ConfigReader.getProperty("invalid.password");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DYNAMIC TEST DATA (unique per test run)
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Generate a unique email address for registration tests.
     * Appending System.currentTimeMillis() ensures uniqueness across test runs.
     *
     * INTERVIEW TIP: "I add a timestamp to usernames to prevent 'User already
     * exists'
     * errors when the same test runs multiple times against the same environment."
     */
    public static String generateUniqueEmail() {
        String email = "testuser_" + System.currentTimeMillis() + "@mealstack.com";
        logger.debug("Generated unique email: {}", email);
        return email;
    }

    public static String generateUniqueName() {
        return faker.name().firstName() + " " + faker.name().lastName();
    }

    public static String getDefaultTestPassword() {
        return "Test@2024"; // Meets typical password complexity requirements
    }

    // ─────────────────────────────────────────────────────────────────────────
    // NEW USER REGISTRATION DATA
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Returns a map of all fields needed for user registration.
     * Using Map makes it easy to add fields without changing method signatures.
     */
    public static Map<String, String> getNewUserData() {
        Map<String, String> userData = new HashMap<>();
        userData.put("name", generateUniqueName());
        userData.put("email", generateUniqueEmail());
        userData.put("password", getDefaultTestPassword());
        userData.put("phone", faker.numerify("98########")); // 10-digit Indian format
        logger.debug("Generated new user data: {}", userData.get("email"));
        return userData;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // MENU ITEM DATA (for admin tests)
    // ─────────────────────────────────────────────────────────────────────────

    public static Map<String, String> getNewMenuItemData() {
        Map<String, String> item = new HashMap<>();
        item.put("name", "Test Item " + System.currentTimeMillis());
        item.put("description", faker.food().dish() + " — automated test item");
        item.put("price", String.valueOf(faker.number().numberBetween(50, 500)));
        item.put("category", "Main Course");
        item.put("quantity", "100");
        logger.debug("Generated new menu item: {}", item.get("name"));
        return item;
    }

    public static Map<String, String> getUpdatedMenuItemData() {
        Map<String, String> item = new HashMap<>();
        item.put("name", "Updated Item " + System.currentTimeMillis());
        item.put("description", "Updated description by automation");
        item.put("price", "299");
        item.put("category", "Snacks");
        item.put("quantity", "50");
        return item;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // TESTNG DATA PROVIDERS (for data-driven tests)
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * TestNG @DataProvider for invalid login credential combinations.
     * The @Test method receives each row as parameters on each invocation.
     *
     * INTERVIEW TIP:
     * "@DataProvider is TestNG's data-driven testing mechanism. One test method
     * runs N times with N different data sets — far cleaner than N separate
     * methods."
     *
     * @return 2D Object array [row][column]: each row = one test run
     */
    @org.testng.annotations.DataProvider(name = "invalidLoginCredentials")
    public static Object[][] getInvalidLoginCredentials() {
        return new Object[][] {
                // { email, password, expectedError }
                { "wrong@email.com", "WrongPass@1", "Invalid credentials" },
                { getValidUserEmail(), "WrongPass@1", "Invalid credentials" },
                { "wrong@email.com", getValidUserPassword(), "Invalid credentials" },
                { "", "", "Email is required" },
                { "notanemail", "Test@123", "Invalid email format" },
        };
    }

    /**
     * TestNG @DataProvider for registration field validation tests.
     */
    @org.testng.annotations.DataProvider(name = "registrationValidation")
    public static Object[][] getRegistrationValidationData() {
        return new Object[][] {
                // { name, email, password, expectedError }
                { "", "test@test.com", "Pass@1234", "Name is required" },
                { "John", "", "Pass@1234", "Email is required" },
                { "John", "test@test.com", "", "Password is required" },
                { "John", "invalidemail", "Pass@1234", "Invalid email" },
        };
    }
}
