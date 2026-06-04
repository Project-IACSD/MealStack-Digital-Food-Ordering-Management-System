package com.mealstack.utils;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;

/**
 * WebDriverFactory — Creates browser-specific WebDriver instances.
 *
 * DESIGN PATTERN: Factory Method
 * The factory abstracts browser-specific instantiation behind a single method.
 * Adding a new browser (e.g., Safari) only requires changes HERE, not in every
 * test.
 *
 * INTERVIEW TIP:
 * "I used WebDriverManager (by Boni Garcia) to automatically detect the
 * installed
 * browser version and download the matching driver binary. This eliminates the
 * 'chromedriver version mismatch' problem that plagues manual setups."
 */
public class WebDriverFactory {

    private static final Logger logger = LogManager.getLogger(WebDriverFactory.class);

    // Private constructor — this is a utility class, not meant to be instantiated
    private WebDriverFactory() {
    }

    /**
     * Factory method: creates and returns a WebDriver for the specified browser.
     *
     * @param browser  "chrome", "firefox", or "edge" (case-insensitive)
     * @param headless If true, runs without a visible browser window (for CI/CD)
     * @return Configured WebDriver instance
     */
    public static WebDriver createDriver(String browser, boolean headless) {
        logger.info("Creating {} driver (headless={})", browser, headless);

        return switch (browser.toLowerCase().trim()) {
            case "chrome" -> createChromeDriver(headless);
            case "firefox" -> createFirefoxDriver(headless);
            case "edge" -> createEdgeDriver(headless);
            default -> {
                logger.warn("Unknown browser '{}', defaulting to Chrome", browser);
                yield createChromeDriver(headless);
            }
        };
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CHROME
    // ─────────────────────────────────────────────────────────────────────────

    private static WebDriver createChromeDriver(boolean headless) {
        // WebDriverManager automatically sets up chromedriver binary
        WebDriverManager.chromedriver().setup();

        ChromeOptions options = new ChromeOptions();

        if (headless) {
            options.addArguments("--headless=new"); // Use the newer headless mode
        }

        // Standard arguments for stable test execution
        options.addArguments(
                "--no-sandbox", // Required in Linux CI environments
                "--disable-dev-shm-usage", // Prevents memory issues in Docker
                "--disable-extensions", // No browser extensions that might interfere
                "--disable-popup-blocking", // Prevent popup interruptions
                "--disable-notifications", // No notification prompts
                "--window-size=1920,1080", // Consistent viewport for element visibility
                "--remote-allow-origins=*" // Required for some Selenium 4 configurations
        );

        // Disable "Chrome is being controlled by automated software" bar
        options.setExperimentalOption("excludeSwitches",
                new String[] { "enable-automation" });
        options.setExperimentalOption("useAutomationExtension", false);

        logger.info("ChromeDriver initialised with options: {}", options.toString());
        return new ChromeDriver(options);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // FIREFOX
    // ─────────────────────────────────────────────────────────────────────────

    private static WebDriver createFirefoxDriver(boolean headless) {
        WebDriverManager.firefoxdriver().setup();

        FirefoxOptions options = new FirefoxOptions();
        if (headless) {
            options.addArguments("--headless");
        }
        options.addArguments("--width=1920", "--height=1080");

        // Disable automatic Firefox updates during tests
        options.addPreference("app.update.enabled", false);

        logger.info("FirefoxDriver initialised");
        return new FirefoxDriver(options);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // EDGE
    // ─────────────────────────────────────────────────────────────────────────

    private static WebDriver createEdgeDriver(boolean headless) {
        WebDriverManager.edgedriver().setup();

        EdgeOptions options = new EdgeOptions();
        if (headless) {
            options.addArguments("--headless=new");
        }
        options.addArguments("--window-size=1920,1080", "--no-sandbox");

        logger.info("EdgeDriver initialised");
        return new EdgeDriver(options);
    }
}
