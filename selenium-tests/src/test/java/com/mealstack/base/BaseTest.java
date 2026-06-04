package com.mealstack.base;

import com.mealstack.utils.ConfigReader;
import com.mealstack.utils.ScreenshotUtil;
import com.mealstack.utils.WebDriverFactory;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.WebDriver;
import org.testng.ITestResult;
import org.testng.annotations.*;

import java.time.Duration;

/**
 * BaseTest — Parent class for ALL test classes.
 *
 * INTERVIEW EXPLANATION:
 * "Every test class extends BaseTest. This follows the Template Method pattern
 * —
 * the base class defines the skeleton (setup/teardown lifecycle),
 * and child classes fill in the actual test logic.
 * This avoids copy-pasting WebDriver setup in every test class (DRY
 * principle)."
 *
 * Key responsibilities:
 * 1. Initialise WebDriver before each test method (@BeforeMethod)
 * 2. Capture a screenshot on failure (@AfterMethod)
 * 3. Quit the browser after each test (@AfterMethod)
 * 4. Load configuration from config.properties
 */
public class BaseTest {

    // Logger instance: each subclass gets its own logger name automatically
    protected static final Logger logger = LogManager.getLogger(BaseTest.class);

    /**
     * ThreadLocal ensures each parallel test thread has its OWN WebDriver instance.
     *
     * INTERVIEW TIP:
     * "Without ThreadLocal, parallel tests share the same driver, causing race
     * conditions.
     * ThreadLocal<WebDriver> gives each thread its own isolated browser instance."
     */
    private static final ThreadLocal<WebDriver> driverThreadLocal = new ThreadLocal<>();

    /** Provides access to the current thread's WebDriver */
    public static WebDriver getDriver() {
        return driverThreadLocal.get();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // LIFECYCLE ANNOTATIONS (TestNG)
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @BeforeSuite — Runs ONCE before all tests in the suite.
     *              Used for one-time setup like ExtentReports initialisation.
     */
    @BeforeSuite(alwaysRun = true)
    public void suiteSetup() {
        logger.info("========== MealStack Test Suite Starting ==========");
        logger.info("Base URL: {}", ConfigReader.getProperty("base.url"));
        logger.info("Browser : {}", ConfigReader.getProperty("browser"));
    }

    /**
     * @BeforeMethod — Runs BEFORE EACH @Test method.
     *
     *               INTERVIEW TIP:
     *               "I deliberately chose @BeforeMethod (not @BeforeClass) for
     *               WebDriver setup.
     *               This guarantees every test gets a FRESH browser with no
     *               leftover state.
     *               It makes tests INDEPENDENT — a core principle of good test
     *               design."
     */
    @BeforeMethod(alwaysRun = true)
    public void setUp() {
        logger.info("---------- Setting up browser ----------");

        // 1. Create a new browser instance using the factory
        String browser = ConfigReader.getProperty("browser");
        boolean headless = Boolean.parseBoolean(ConfigReader.getProperty("headless"));
        WebDriver driver = WebDriverFactory.createDriver(browser, headless);

        // 2. Store it in ThreadLocal so getDriver() works in any helper class
        driverThreadLocal.set(driver);

        // 3. Configure timeouts
        int implicitWait = Integer.parseInt(ConfigReader.getProperty("implicit.wait"));
        int pageLoadTimeout = Integer.parseInt(ConfigReader.getProperty("page.load.timeout"));
        int scriptTimeout = Integer.parseInt(ConfigReader.getProperty("script.timeout"));

        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(implicitWait));
        driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(pageLoadTimeout));
        driver.manage().timeouts().scriptTimeout(Duration.ofSeconds(scriptTimeout));

        // 4. Maximise the window for consistent element visibility
        driver.manage().window().maximize();

        logger.info("Browser '{}' launched successfully (headless={})", browser, headless);
    }

    /**
     * @AfterMethod — Runs AFTER EACH @Test method.
     *
     *              INTERVIEW TIP:
     *              "I always capture a screenshot on failure BEFORE quitting the
     *              driver.
     *              If I quit first, there's nothing left to screenshot.
     *              The ITestResult parameter lets me check if the test passed or
     *              failed."
     *
     * @param result TestNG injects this; use result.getStatus() to check outcome.
     */
    @AfterMethod(alwaysRun = true)
    public void tearDown(ITestResult result) {
        WebDriver driver = getDriver();

        try {
            // Capture screenshot on FAILURE or SKIP
            if (result.getStatus() == ITestResult.FAILURE) {
                logger.error("Test FAILED: {}", result.getName());
                ScreenshotUtil.captureOnFailure(driver, result.getName());
            } else if (result.getStatus() == ITestResult.SKIP) {
                logger.warn("Test SKIPPED: {}", result.getName());
            } else {
                logger.info("Test PASSED: {}", result.getName());
            }
        } finally {
            // Always quit the driver, even if screenshot capture fails
            if (driver != null) {
                driver.quit();
                logger.info("Browser closed for test: {}", result.getName());
            }
            // Remove from ThreadLocal to prevent memory leaks in long-running suites
            driverThreadLocal.remove();
        }
    }

    /**
     * @AfterSuite — Runs ONCE after all tests complete.
     */
    @AfterSuite(alwaysRun = true)
    public void suiteTearDown() {
        logger.info("========== MealStack Test Suite Completed ==========");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // HELPER METHODS (available to all subclasses)
    // ─────────────────────────────────────────────────────────────────────────

    /** Navigate to the application's base URL */
    protected void openApplication() {
        String url = ConfigReader.getProperty("base.url");
        getDriver().get(url);
        logger.info("Navigated to: {}", url);
    }

    /** Navigate to a specific URL defined in config.properties */
    protected void navigateTo(String urlKey) {
        String url = ConfigReader.getProperty(urlKey);
        getDriver().get(url);
        logger.info("Navigated to [{}]: {}", urlKey, url);
    }
}
