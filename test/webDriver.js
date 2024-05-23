const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const User = require("../models/User"); // Adjust the path to your User model
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

(async function addToCartTest() {
  // Connect to the local WebDriver
  let driver = await new Builder().forBrowser("chrome").build();

  // Connect to the Database
  await connectDB();

  // Save the last cart of the user
  let user = await User.findOne({ email: "test@test.com" });
  const userBeforeUpdatedCart = user.cart.items;

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

    // Retrieve the user's cart after adding the product
    user = await User.findOne({ email: "test@test.com" });
    const userAfterUpdatedCart = user.cart.items;

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
})();
