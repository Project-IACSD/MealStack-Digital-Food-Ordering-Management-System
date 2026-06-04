package com.mealstack.utils;

import org.apache.commons.io.FileUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * ScreenshotUtil — Captures browser screenshots on test failure.
 *
 * INTERVIEW TIP:
 * "On any test failure, I capture a PNG screenshot and save it with a
 * timestamp + test name. This makes debugging test failures MUCH faster
 * than reading stack traces alone — you can see exactly what the browser
 * showed at the moment of failure."
 *
 * Screenshot naming convention:
 * testMethodName_yyyy-MM-dd_HH-mm-ss.png
 * Example:
 * testUserLogin_2025-01-15_14-30-05.png
 */
public class ScreenshotUtil {

    private static final Logger logger = LogManager.getLogger(ScreenshotUtil.class);
    private static final DateTimeFormatter TIMESTAMP_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss");

    // Private constructor — utility class
    private ScreenshotUtil() {
    }

    /**
     * Capture and save a screenshot on test failure.
     *
     * HOW IT WORKS:
     * 1. WebDriver implements TakesScreenshot interface
     * 2. getScreenshotAs(OutputType.FILE) renders the browser and saves to a temp
     * file
     * 3. We copy the temp file to our configured screenshots directory
     *
     * @param driver   Active WebDriver instance
     * @param testName Name of the failed test (used in filename)
     */
    public static void captureOnFailure(WebDriver driver, String testName) {
        if (driver == null) {
            logger.warn("Cannot capture screenshot: WebDriver is null");
            return;
        }

        try {
            // Cast WebDriver to TakesScreenshot (all major browser drivers support this)
            TakesScreenshot screenshotDriver = (TakesScreenshot) driver;

            // Selenium captures the current browser viewport as a PNG file
            File sourceFile = screenshotDriver.getScreenshotAs(OutputType.FILE);

            // Build destination path with timestamp to avoid overwriting
            String timestamp = LocalDateTime.now().format(TIMESTAMP_FORMAT);
            // Sanitise testName: replace spaces/special characters with underscores
            String safeTestName = testName.replaceAll("[^a-zA-Z0-9_-]", "_");
            String fileName = safeTestName + "_" + timestamp + ".png";

            // Read screenshot directory from config
            String screenshotDir = ConfigReader.getProperty("screenshot.dir",
                    "test-output/screenshots");
            File destFile = new File(screenshotDir + File.separator + fileName);

            // Create directory structure if it doesn't exist
            FileUtils.forceMkdirParent(destFile);

            // Copy from temp to destination
            FileUtils.copyFile(sourceFile, destFile);

            logger.info("FAILURE SCREENSHOT saved: {}", destFile.getAbsolutePath());

        } catch (IOException e) {
            logger.error("Failed to capture screenshot for test '{}': {}", testName, e.getMessage());
        }
    }

    /**
     * Capture a screenshot at any point during a test (not just failures).
     * Useful for creating step-by-step evidence of test execution.
     *
     * @param driver      Active WebDriver instance
     * @param description Short description of this checkpoint (used in filename)
     * @return Path to the saved screenshot file, or null on failure
     */
    public static String captureCheckpoint(WebDriver driver, String description) {
        try {
            TakesScreenshot screenshotDriver = (TakesScreenshot) driver;
            File sourceFile = screenshotDriver.getScreenshotAs(OutputType.FILE);

            String timestamp = LocalDateTime.now().format(TIMESTAMP_FORMAT);
            String safeDesc = description.replaceAll("[^a-zA-Z0-9_-]", "_");
            String fileName = "CHECKPOINT_" + safeDesc + "_" + timestamp + ".png";

            String screenshotDir = ConfigReader.getProperty("screenshot.dir",
                    "test-output/screenshots");
            File destFile = new File(screenshotDir + File.separator + "checkpoints"
                    + File.separator + fileName);

            FileUtils.forceMkdirParent(destFile);
            FileUtils.copyFile(sourceFile, destFile);

            logger.info("Checkpoint screenshot: {}", destFile.getAbsolutePath());
            return destFile.getAbsolutePath();

        } catch (IOException e) {
            logger.error("Failed to capture checkpoint screenshot: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Get screenshot as Base64 string (used for embedding in Extent Reports).
     *
     * @param driver Active WebDriver instance
     * @return Base64 encoded PNG string
     */
    public static String getBase64Screenshot(WebDriver driver) {
        try {
            return ((TakesScreenshot) driver).getScreenshotAs(OutputType.BASE64);
        } catch (Exception e) {
            logger.error("Failed to capture Base64 screenshot: {}", e.getMessage());
            return "";
        }
    }
}
