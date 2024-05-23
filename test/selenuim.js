const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

(async function loginTest() {
  // Connect to the Selenium Grid hub
  driver = await new Builder().forBrowser("chrome");
  //let driver = await new Builder()
    //.usingServer("http://localhost:4444/wd/hub") // URL of the Selenium Grid hub
    //.forBrowser("chrome") // Specify the browser (chrome)
    //.build();

  try {
    // Step 1: Navigate to the home page
    await driver.get("http://localhost:3000");

    // Step 2: Navigate to the login page
    await driver.findElement(By.linkText("Login")).click(); // Adjust the selector as needed

    // Step 3: Wait for the login page to load
    await driver.wait(until.urlContains("/login"), 10000);

    // Step 4: Perform login
    await driver.findElement(By.name("email")).sendKeys("test@test.com");
    await driver.findElement(By.name("password")).sendKeys("123");
    await driver.findElement(By.css('button[type="submit"]')).click();

    // // Step 5: Wait for redirection after login
    // await driver.wait(until.urlContains("/"), 10000);

    // Step 6: Verify that the login was successful
    // You can check for the presence of a specific element that indicates a successful login
    // For example, check if the user is redirected to a dashboard or a welcome message is displayed

    const loggedInIndicator = await driver.wait(
      until.elementLocated(By.css(".logout-button")), // Update with your actual selector
      20000
    );
    const isLoggedIn = await loggedInIndicator.isDisplayed();
    assert(isLoggedIn, "Login failed!");

    console.log("Chrome - Login test passed!");
  } catch (err) {
    console.error("Chrome - Test failed: ", err);
  } finally {
    await driver.quit();
  }
})();

(async function addToCartTest() {
  // Connect to the Selenium Grid hub
  let driver = await new Builder()
    .usingServer("http://localhost:4444") // URL of the Selenium Grid hub
    .forBrowser("chrome") // Specify the browser you want to use
    .build();

  try {
    // Step 1: Navigate to the login page
    await driver.get("http://localhost:3000/login"); // Adjust the URL to your login page

    // Step 2: Perform login
    await driver.findElement(By.name("email")).sendKeys("test@test.com");
    await driver.findElement(By.name("password")).sendKeys("123");
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Step 3: Wait for redirection after login
    await driver.wait(until.urlContains("/"), 10000);

    // Step 4: Navigate to the shop page where products are listed
    await driver.get("http://localhost:3000/"); // Adjust the URL if needed

    // Step 5: Find the first product's 'Add to Cart' button and click it
    await driver.wait(
      until.elementLocated(By.css(".product-item .card__actions form button")),
      10000
    );
    const addToCartButton = await driver.findElement(
      By.css(".product-item .card__actions form button")
    );
    await addToCartButton.click();

    // Step 6: Wait for redirection to the cart page
    await driver.wait(until.urlContains("/cart"), 10000);

    // Step 7: Verify that the product is in the cart
    await driver.wait(until.elementLocated(By.css(".cart-item")), 10000);
    const cartItem = await driver.findElement(
      By.css(".cart-item .product__title")
    );
    const cartItemText = await cartItem.getText();

    // Assert that the product title in the cart matches the expected title
    assert.strictEqual(cartItemText, "Expected Product Title"); // Replace with your actual product title

    console.log("Product successfully added to cart!");
  } catch (err) {
    console.error("Test failed: ", err);
  } finally {
    await driver.quit();
  }
});
