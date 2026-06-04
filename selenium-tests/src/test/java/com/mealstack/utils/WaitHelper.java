package com.mealstack.utils;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

/**
 * WaitHelper — Centralised explicit wait strategies.
 *
 * INTERVIEW TIP:
 * "I never use Thread.sleep() because it wastes time even when the element is
 * already available. Explicit waits (WebDriverWait + ExpectedConditions) poll
 * every 500ms and return AS SOON as the condition is met — much more
 * efficient."
 *
 * IMPLICIT vs EXPLICIT WAIT:
 * - Implicit: global setting; polls DOM for element existence for N seconds.
 * - Explicit: per-statement; waits for a SPECIFIC condition (clickable,
 * visible, etc.)
 * - NEVER mix both — can cause unpredictable double-waiting.
 */
public class WaitHelper {

    private static final Logger logger = LogManager.getLogger(WaitHelper.class);

    private final WebDriverWait wait;
    private final WebDriver driver;

    public WaitHelper(WebDriver driver) {
        this.driver = driver;
        int timeout = ConfigReader.getIntProperty("explicit.wait");
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(timeout));
    }

    /** Constructor with custom timeout (overrides config) */
    public WaitHelper(WebDriver driver, int timeoutSeconds) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(timeoutSeconds));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // VISIBILITY WAITS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Wait until element is VISIBLE (present in DOM AND displayed on screen).
     *
     * INTERVIEW TIP: "I use visibilityOf when I need to assert displayed text."
     */
    public WebElement waitForVisible(By locator) {
        logger.debug("Waiting for element to be visible: {}", locator);
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    /** Wait for an already-found WebElement to become visible */
    public WebElement waitForVisible(WebElement element) {
        return wait.until(ExpectedConditions.visibilityOf(element));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CLICKABILITY WAITS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Wait until element is CLICKABLE (visible + enabled).
     *
     * INTERVIEW TIP: "I use elementToBeClickable for buttons and links to avoid
     * ElementClickInterceptedException."
     */
    public WebElement waitForClickable(By locator) {
        logger.debug("Waiting for element to be clickable: {}", locator);
        return wait.until(ExpectedConditions.elementToBeClickable(locator));
    }

    public WebElement waitForClickable(WebElement element) {
        return wait.until(ExpectedConditions.elementToBeClickable(element));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PRESENCE WAITS
    // ─────────────────────────────────────────────────────────────────────────

    /** Wait until element is present in DOM (may not be visible) */
    public WebElement waitForPresence(By locator) {
        return wait.until(ExpectedConditions.presenceOfElementLocated(locator));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // TEXT / ATTRIBUTE WAITS
    // ─────────────────────────────────────────────────────────────────────────

    /** Wait until an element contains specific text */
    public boolean waitForTextPresent(By locator, String text) {
        logger.debug("Waiting for text '{}' in element: {}", text, locator);
        return wait.until(ExpectedConditions.textToBePresentInElementLocated(locator, text));
    }

    /** Wait until element's text value equals the expected string exactly */
    public boolean waitForTextToBe(By locator, String text) {
        return wait.until(ExpectedConditions.textToBe(locator, text));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // URL WAITS
    // ─────────────────────────────────────────────────────────────────────────

    /** Wait until current URL contains a specific substring */
    public boolean waitForUrlContains(String urlFragment) {
        logger.debug("Waiting for URL to contain: {}", urlFragment);
        return wait.until(ExpectedConditions.urlContains(urlFragment));
    }

    /** Wait until current URL exactly matches */
    public boolean waitForUrlToBe(String expectedUrl) {
        return wait.until(ExpectedConditions.urlToBe(expectedUrl));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // INVISIBILITY WAITS
    // ─────────────────────────────────────────────────────────────────────────

    /** Wait until a loading spinner or overlay disappears */
    public boolean waitForInvisibility(By locator) {
        logger.debug("Waiting for element to disappear: {}", locator);
        return wait.until(ExpectedConditions.invisibilityOfElementLocated(locator));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // LIST WAITS
    // ─────────────────────────────────────────────────────────────────────────

    /** Wait until multiple elements are all visible */
    public List<WebElement> waitForAllVisible(By locator) {
        return wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(locator));
    }

    /** Wait until at least N elements matching locator are present */
    public List<WebElement> waitForMinCount(By locator, int minCount) {
        return wait.until(ExpectedConditions.numberOfElementsToBeMoreThan(locator, minCount - 1));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ALERT WAITS
    // ─────────────────────────────────────────────────────────────────────────

    /** Wait for a browser alert dialog to appear */
    public void waitForAlert() {
        wait.until(ExpectedConditions.alertIsPresent());
    }
}
