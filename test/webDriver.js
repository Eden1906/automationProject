const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const User = require("../models/user"); // Adjust the path to your User model
const mongoose = require("mongoose");
const Order = require('../models/Order');

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
});



async function makeOrderTest() {
  // Create a local instance of the Chrome WebDriver
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    // Connect to the DataBase
    await connectDB();

    let lastLengthOfOrders;
    await Order.find().then((orders) => (lastLengthOfOrders = orders.length));

    // Step 1: Navigate to the login page
    await driver.get('http://localhost:3000/login'); // Adjust the URL to your login page

    // Step 2: Perform login
    await driver.findElement(By.name('email')).sendKeys('test@test.com');
    await driver.findElement(By.name('password')).sendKeys('123');
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Step 3: Wait for redirection after login
    await driver.wait(until.urlContains('/'), 10000);

    // Step 4: Find the first product's 'Add to Cart' button and click it
    await driver.wait(
      until.elementLocated(By.css('.product-item .card__actions form button')),
      10000
    );
    const addToCartButton = await driver.findElement(
      By.css('.product-item .card__actions form button')
    );
    await addToCartButton.click();

    // Step 5: Wait for redirection to the cart page
    await driver.wait(until.urlContains('/cart'), 10000);

    // Step 6: Click on Order Now!
    const orderNowButton = await driver.findElement(
      By.css('form[action="/create-order"] button[type="submit"]')
    );
    await orderNowButton.click();

    let afterOrderLength;
    await Order.find().then((orders) => (afterOrderLength = orders.length));

    assert(
      afterOrderLength > lastLengthOfOrders,
      'Order was not added successfully'
    );

    console.log('Order added successfully!');
  } catch (error) {
    console.log('Error occurred:', error);
  } finally {
    if (driver) {
      await driver.quit();
    }
    // Close the database connection
    await mongoose.connection.close();
  }
}

//makeOrderTest()


(async function addProductTest() {
  let driver;
  try {
    driver = await new Builder().forBrowser('chrome').build();

    // Step 1: Navigate to the login page
    await driver.get("http://localhost:3000/login");

    // Step 2: Perform login
    await driver.findElement(By.name("email")).sendKeys("test@test.com");
    await driver.findElement(By.name("password")).sendKeys("123");
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Step 3: Wait for redirection after login
    await driver.wait(until.urlContains("/"), 10000);

    // Step 4: Click on add product button
    const addProductButton = await driver.wait(
      until.elementLocated(By.css('a[href="/admin/add-product"]')),
      10000
    );
    await addProductButton.click();

    // Step 5: Fill in the product form
    const productTitle = "Test Product";
    await driver.findElement(By.name("title")).sendKeys(productTitle);
    await driver
      .findElement(By.name("imageUrl"))
      .sendKeys("http://example.com/image.jpg");
    await driver.findElement(By.name("price")).sendKeys("9.99");
    await driver
      .findElement(By.name("description"))
      .sendKeys("This is a test product.");
    await driver
      .findElement(By.xpath('//button[contains(text(), "Add Product")]'))
      .click();

    // Step 6: Wait for redirection to the admin products page
    await driver.wait(until.urlContains("/admin/products"), 5000);

    // Step 7: Verify that the product was added
    const addedProductTitleElement = await driver.wait(
      until.elementLocated(By.css(".product-item")),
      10000
    );

    const products = await driver.findElements(By.css(".product-item"));
    let addedProductTitle;

    for (const product of products) {
      const titleElement = await product.findElement(By.css(".product__title"));
      const title = await titleElement.getText();

      if (title.trim() === productTitle) {
        addedProductTitle = title;
        console.log(title);
        break;
      }
    }

    assert.strictEqual(
      addedProductTitle.trim(), // Trim whitespace from the text
      productTitle,
      "Product was not added successfully"
    );

    console.log("Product added successfully!");
  } catch (err) {
    console.error("Test failed: ", err);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
})();



