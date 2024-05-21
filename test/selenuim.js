const { Builder, By, Key, until } = require("selenium-webdriver");

async function runECommerceTests() {
  // Set up Selenium WebDriver
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    // Navigate to the e-commerce website
    await driver.get("http://localhost:3000");

    // Test scenario 1: Search for a product
    await driver.findElement(By.name("search")).sendKeys("laptop", Key.RETURN);
    await driver.wait(until.titleContains("Search Results"), 5000);
    console.log("Test scenario 1: Search for a product - Passed");

    // Test scenario 2: Add a product to the cart
    const productLink = await driver.findElement(By.css(".product-link"));
    await productLink.click();
    await driver.findElement(By.css(".add-to-cart")).click();
    console.log("Test scenario 2: Add a product to the cart - Passed");

    // Test scenario 3: View the shopping cart
    await driver.findElement(By.linkText("Cart")).click();
    await driver.wait(until.titleContains("Shopping Cart"), 5000);
    console.log("Test scenario 3: View the shopping cart - Passed");

    // Test scenario 4: Proceed to checkout
    await driver.findElement(By.css(".checkout-button")).click();
    await driver.wait(until.titleContains("Checkout"), 5000);
    console.log("Test scenario 4: Proceed to checkout - Passed");

    // Test scenario 5: Fill in checkout form
    await driver.findElement(By.name("name")).sendKeys("John Doe");
    await driver.findElement(By.name("email")).sendKeys("john@example.com");
    await driver.findElement(By.name("address")).sendKeys("123 Main St");
    await driver.findElement(By.name("city")).sendKeys("Anytown");
    await driver.findElement(By.name("zipcode")).sendKeys("12345");
    await driver.findElement(By.name("submit")).click();
    console.log("Test scenario 5: Fill in checkout form - Passed");

    // Wait for the confirmation page to load
    await driver.wait(until.titleContains("Order Confirmation"), 5000);
    console.log("Test scenario 6: Order Confirmation - Passed");
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    // Close the browser
    await driver.quit();
  }
}

runECommerceTests();
