package com.mealstack.utils;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testng.Assert;

/**
 * AssertionHelper — Custom assertion wrappers with descriptive logging.
 *
 * INTERVIEW TIP:
 * "Wrapping TestNG Assert with custom helpers gives two advantages:
 * 1. Every assertion logs a PASS/FAIL message with the actual values,
 * making test reports far more readable.
 * 2. Assertions can be enhanced later (e.g., attach screenshots on failure)
 * without touching individual test classes — Open/Closed Principle."
 */
public class AssertionHelper {

    private static final Logger logger = LogManager.getLogger(AssertionHelper.class);

    private AssertionHelper() {
    }

    /**
     * Assert that two strings are equal.
     *
     * @param actual   What the application actually shows
     * @param expected What we expect to see
     * @param message  Descriptive context for the assertion
     */
    public static void assertEquals(String actual, String expected, String message) {
        try {
            Assert.assertEquals(actual, expected, message);
            logger.info("✓ PASS | {} | Expected: '{}' | Got: '{}'", message, expected, actual);
        } catch (AssertionError e) {
            logger.error("✗ FAIL | {} | Expected: '{}' | Got: '{}'", message, expected, actual);
            throw e;
        }
    }

    /**
     * Assert that a condition is true.
     *
     * @param condition Boolean value to check
     * @param message   Descriptive context
     */
    public static void assertTrue(boolean condition, String message) {
        try {
            Assert.assertTrue(condition, message);
            logger.info("✓ PASS | {} | Condition is true", message);
        } catch (AssertionError e) {
            logger.error("✗ FAIL | {} | Condition is false", message);
            throw e;
        }
    }

    /**
     * Assert that a condition is false.
     */
    public static void assertFalse(boolean condition, String message) {
        try {
            Assert.assertFalse(condition, message);
            logger.info("✓ PASS | {} | Condition is false", message);
        } catch (AssertionError e) {
            logger.error("✗ FAIL | {} | Expected false but was true", message);
            throw e;
        }
    }

    /**
     * Assert that an object or string is NOT null/empty.
     */
    public static void assertNotEmpty(String value, String message) {
        try {
            Assert.assertNotNull(value, message + " (was null)");
            Assert.assertFalse(value.trim().isEmpty(), message + " (was empty string)");
            logger.info("✓ PASS | {} | Value: '{}'", message, value);
        } catch (AssertionError e) {
            logger.error("✗ FAIL | {} | Value is null or empty", message);
            throw e;
        }
    }

    /**
     * Assert that actual string CONTAINS the expected substring.
     */
    public static void assertContains(String actual, String expectedSubstring, String message) {
        try {
            Assert.assertTrue(actual != null && actual.contains(expectedSubstring),
                    message + " | Expected to contain: '" + expectedSubstring + "' | Actual: '" + actual + "'");
            logger.info("✓ PASS | {} | '{}' contains '{}'", message, actual, expectedSubstring);
        } catch (AssertionError e) {
            logger.error("✗ FAIL | {} | '{}' does NOT contain '{}'", message, actual, expectedSubstring);
            throw e;
        }
    }

    /**
     * Assert that the current URL contains a specific fragment.
     *
     * INTERVIEW TIP:
     * "After clicking 'Login', I verify the URL changed to the dashboard.
     * This confirms navigation happened — not just a visual check on page text."
     */
    public static void assertUrlContains(String actualUrl, String expectedFragment, String message) {
        assertContains(actualUrl, expectedFragment, message + " [URL check]");
    }

    /**
     * Assert that an integer value is greater than a minimum.
     * Used for: "cart has at least 1 item", "search returned results", etc.
     */
    public static void assertGreaterThan(int actual, int minimum, String message) {
        try {
            Assert.assertTrue(actual > minimum,
                    message + " | Expected > " + minimum + " | Actual: " + actual);
            logger.info("✓ PASS | {} | {} > {}", message, actual, minimum);
        } catch (AssertionError e) {
            logger.error("✗ FAIL | {} | {} is NOT > {}", message, actual, minimum);
            throw e;
        }
    }
}
