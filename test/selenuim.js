const {
  testHomePage,
  testProductsPage,
  testCartPage,
  testOrdersPage,
  testAddProductPage,
  testAdminProductsPage,
  testLoginPage,
  testSignupPage,
} = require("./routerTest.js");

const mongoose = require("mongoose");

const MONGODB_URI =
  "mongodb+srv://shopProject:Maccabi@cluster0.rjis4tp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

const login = async (driver) => {
  await driver.get("http://localhost:3000/login");
  await driver.findElement(By.name("email")).sendKeys("test@test.com");
  await driver.findElement(By.name("password")).sendKeys("123");
  await driver.findElement(By.css('button[type="submit"]')).click();
  await driver.wait(until.urlContains("/"), 10000);
  const cookies = await driver.manage().getCookies();
  return cookies;
};

const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const User = require("../models/user");

(async function routerTests() {
  try {
    let driver = await new Builder()
      .usingServer("http://localhost:4444") // URL of the Selenium Grid hub
      .forBrowser("chrome") // Specify the browser you want to use
      .build();

    // First login to the page:
    const cookies = await login(driver);

    const reuseSession = async (testFunction) => {
      await driver.get("http://localhost:3000");
      for (let cookie of cookies) {
        await driver.manage().addCookie(cookie);
      }
      await driver.navigate().refresh();
      await testFunction(driver);
    };

    // Run your tests with the session cookies
    await reuseSession(testHomePage);
    // await reuseSession(testProductsPage);
    // await reuseSession(testCartPage);
    // await reuseSession(testOrdersPage);
    // await reuseSession(testAddProductPage);
    // await reuseSession(testAdminProductsPage);
    // await reuseSession(testLoginPage);
    // await reuseSession(testSignupPage);
  } catch (err) {
    console.log("Test failed: ", err);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
})();

(async function addToCartTest() {
  // Connect to the Selenium Grid hub
  let driver = await new Builder()
    .usingServer("http://localhost:4444") // URL of the Selenium Grid hub
    .forBrowser("chrome") // Specify the browser you want to use
    .build();

  // Connect to the DataBase
  connectDB();

  // save the last cart of user
  let user = await User.findOne({ email: "test@test.com" });
  const userBeforeUpdatedCart = await user.cart.items;

  // await console.log(cartQuantity.cart.items === cartQuantity.cart.items);
  try {
    // Step 1: Navigate to the login page
    await driver.get("http://localhost:3000/login"); // Adjust the URL to your login page

    // Step 2: Perform login
    await driver.findElement(By.name("email")).sendKeys("test@test.com");
    await driver.findElement(By.name("password")).sendKeys("123");
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Step 3: Wait for redirection after login
    await driver.wait(until.urlContains("/"), 10000);

    // Step 4: Find the first product's 'Add to Cart' button and click it
    await driver.wait(
      until.elementLocated(By.css(".product-item .card__actions form button")),
      10000
    );
    const addToCartButton = await driver.findElement(
      By.css(".product-item .card__actions form button")
    );
    await addToCartButton.click();

    // Step 5: Wait for redirection to the cart page
    await driver.wait(until.urlContains("/cart"), 10000);
    let user = await User.findOne({ email: "test@test.com" });
    const userAfterUpdatedCart = await user.cart.items;
    // Assert that the cart items have changed
    assert.notDeepStrictEqual(
      userAfterUpdatedCart,
      userBeforeUpdatedCart,
      "Product was not added to the cart"
    );

    console.log("Product successfully added to cart!");
  } catch (err) {
    console.error("Test failed: ", err);
  } finally {
    await driver.quit();
    await mongoose.connection.close();
    process.exit(0);
  }
});
