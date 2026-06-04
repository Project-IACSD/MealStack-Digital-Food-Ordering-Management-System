package com.mealstack.utils;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * ConfigReader — Singleton utility for reading test configuration.
 *
 * INTERVIEW TIP:
 * "I used the Singleton pattern to load config.properties only ONCE per JVM
 * run.
 * The Properties object is shared read-only, so no synchronisation is needed."
 */
public class ConfigReader {

    private static final Logger logger = LogManager.getLogger(ConfigReader.class);
    private static final Properties properties = new Properties();
    private static final String CONFIG_FILE = "config.properties";

    // Static initialiser: loads properties when class is first loaded
    static {
        try (InputStream inputStream = ConfigReader.class
                .getClassLoader()
                .getResourceAsStream(CONFIG_FILE)) {

            if (inputStream == null) {
                throw new FileNotFoundException(
                        "Configuration file '" + CONFIG_FILE + "' not found in classpath");
            }
            properties.load(inputStream);
            logger.info("Configuration loaded from: {}", CONFIG_FILE);

        } catch (IOException e) {
            logger.fatal("CRITICAL: Could not load {}. Tests cannot run.", CONFIG_FILE, e);
            throw new RuntimeException("Failed to load test configuration", e);
        }
    }

    // Private constructor prevents instantiation
    private ConfigReader() {
    }

    /**
     * Get a property value by key.
     *
     * @param key The property key (e.g. "base.url")
     * @return The property value, or null if not found
     */
    public static String getProperty(String key) {
        String value = properties.getProperty(key);
        if (value == null) {
            logger.warn("Property not found for key: '{}'", key);
        }
        return value;
    }

    /**
     * Get a property with a fallback default value.
     *
     * @param key          The property key
     * @param defaultValue Value to return if key not found
     */
    public static String getProperty(String key, String defaultValue) {
        return properties.getProperty(key, defaultValue);
    }

    /**
     * Get an integer property value.
     *
     * @param key The property key
     * @return Integer value
     */
    public static int getIntProperty(String key) {
        String value = getProperty(key);
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            logger.error("Property '{}' has non-integer value: '{}'", key, value);
            throw new RuntimeException("Invalid integer property: " + key, e);
        }
    }
}
