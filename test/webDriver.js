const { Builder, By, until } = require("selenium-webdriver");

const assert = require("assert");
const User = require("../models/user"); // Adjust the path to your User model
const mongoose = require("mongoose");
const Order = require("../models/order");

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

async function addToCartTest() {
  // Connect to the local WebDriver
  let driver;
  // Connect to the Database
  await connectDB();

  // Save the last cart of the user
  let user = await User.findOne({ email: "test@test.com" });
  const userBeforeUpdatedCart = user.cart.items;

  try {
    driver = await new Builder().forBrowser("chrome").build();

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
  }
}

async function deleteCartTest() {
  let driver;
  try {
    driver = await new Builder().forBrowser("chrome").build();
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

    // Step 6: Delete the product from the cart
    const deleteButton = await driver.findElement(By.css(".cart__item .btn"));
    await deleteButton.click();

    // Step 7: Check if the cart is empty by verifying the presence of "No Products in Cart!" message

    const emptyCartMessage = await driver.findElement(
      By.css("main .emptyCart")
    );
    const isCartEmpty = await emptyCartMessage.isDisplayed();

    // Assert that the cart is empty
    assert.strictEqual(
      isCartEmpty,
      true,
      "Test Failed: The cart is not empty."
    );
    console.log("Test Passed: The cart is empty.");
  } catch (err) {
    console.error(err);
  } finally {
    await driver.quit();
  }
}

async function makeOrderTest() {
  // Create a local instance of the Chrome WebDriver
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    // Connect to the DataBase
    await connectDB();

    let lastLengthOfOrders;
    await Order.find().then((orders) => (lastLengthOfOrders = orders.length));

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

    // Step 6: Click on Order Now!
    const orderNowButton = await driver.findElement(
      By.css('form[action="/create-order"] button[type="submit"]')
    );
    await orderNowButton.click();

    let afterOrderLength;
    await Order.find().then((orders) => (afterOrderLength = orders.length));

    assert(
      afterOrderLength > lastLengthOfOrders,
      "Order was not added successfully"
    );

    console.log("Order added successfully!");
  } catch (error) {
    console.log("Error occurred:", error);
  } finally {
    if (driver) {
      await driver.quit();
    }
    // Close the database connection
    await mongoose.connection.close();
  }
}

//makeOrderTest()

async function addProductTest() {
  let driver;
  try {
    driver = await new Builder().forBrowser("chrome").build();

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
}

async function signupTest() {
  let driver;

  try {
    driver = await new Builder().forBrowser("chrome").build();

    // Step 1: navigate to the website
    await driver.get("http://localhost:3000");

    // Step 2: find and click on the signup link
    const signupLink = await driver.findElement(By.css('a[href="/signup"]'));
    await signupLink.click();

    // Step 3: fill in the signup form and submit
    const randomEmail = `signuptest${Math.random()
      .toString(36)
      .substring(7)}@test.com`;

    const password = "123";
    await driver.findElement(By.name("email")).sendKeys(randomEmail);
    await driver.findElement(By.name("password")).sendKeys(password);
    await driver.findElement(By.name("confirmPassword")).sendKeys(password);
    await driver.findElement(By.css('button[type="submit"')).click();
    await driver.wait(until.urlContains("/login"), 10000);

    // Step 4: login to the website
    await driver.findElement(By.name("email")).sendKeys(randomEmail);
    await driver.findElement(By.name("password")).sendKeys(password);
    await driver.findElement(By.css('button[type="submit"')).click();
    await driver.wait(until.urlContains("/"), 10000);

    // Step 5: Check if logout form is present
    const logoutForm = await driver.findElement(
      By.css('form[action="/logout"]')
    );
    const isLogoutFormDisplayed = await logoutForm.isDisplayed();

    // Assert that the logout form is displayed
    assert.strictEqual(
      isLogoutFormDisplayed,
      true,
      "signup failed: Logout form is not displayed"
    );

    console.log("Signup successful.");
  } catch (err) {
    console.error("Test failed: ", err);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

async function detailOfProductTest() {
  let driver;
  try {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get("http://localhost:3000/");
    // Step 1: Find the first product and extract its ID
    const firstProductLink = await driver.findElement(
      By.css(".product-item:first-child a")
    );
    const productId = (await firstProductLink.getAttribute("href"))
      .split("/")
      .pop();

    // Step 2: Click on the details link of the first product
    await firstProductLink.click();

    // Step 3: Verify that you are on the detail page of the correct product
    await driver.wait(
      until.urlMatches(new RegExp(`/products/${productId}`)),
      10000
    );
    console.log(
      `Successfully navigated to the detail page of the product with ID ${productId}.`
    );
  } catch (err) {
    console.error("Test failed: ", err);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

async function detailOfProductTestloggedin() {
  let driver;
  try {
    driver = await new Builder().forBrowser("chrome").build();
    // Step 1: Navigate to the login page
    await driver.get("http://localhost:3000/login");

    // Step 2: Perform login
    await driver.findElement(By.name("email")).sendKeys("test@test.com");
    await driver.findElement(By.name("password")).sendKeys("123");
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Step 3: Wait for redirection after login
    await driver.wait(until.urlContains("/"), 10000);

    // Step 4: Navigate to the main products list page
    await driver.get("http://localhost:3000/");

    // Step 5: Find the first product and extract its ID
    const firstProductLink = await driver.findElement(
      By.css(".product-item:first-child a")
    );
    const productId = (await firstProductLink.getAttribute("href"))
      .split("/")
      .pop();

    // Step 6: Click on the details link of the first product
    await firstProductLink.click();

    // Step 7: Verify that you are on the detail page of the correct product
    await driver.wait(
      until.urlMatches(new RegExp(`/products/${productId}`)),
      10000
    );
    console.log(
      `Successfully navigated to the detail page of the product with ID ${productId}.`
    );
  } catch (err) {
    console.error("Test failed: ", err);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

async function deleteProductTest() {
  let driver;
  try {
    driver = await new Builder().forBrowser("chrome").build();
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
    const productTitle = "delete Product Test";
    await driver.findElement(By.name("title")).sendKeys(productTitle);
    await driver
      .findElement(By.name("imageUrl"))
      .sendKeys("http://example.com/image.jpg");
    await driver.findElement(By.name("price")).sendKeys("9.99");
    await driver
      .findElement(By.name("description"))
      .sendKeys("This is a delete product test.");
    await driver
      .findElement(By.xpath('//button[contains(text(), "Add Product")]'))
      .click();

    // Step 6: Wait for redirection to the admin products page
    await driver.wait(until.urlContains("/admin/products"), 5000);

    // Step 7: Find the product that added and extract the detail about him
    const products = await driver.findElements(By.css(".product-item"));
    let targetProduct;
    for (const product of products) {
      const titleElement = await product.findElement(By.css(".product__title"));
      const title = await titleElement.getText();

      if (title.trim() === productTitle) {
        targetProduct = product;
        break;
      }
    }

    if (targetProduct) {
      // Step 8: Click on the Delete button
      const deleteButton = await targetProduct.findElement(
        By.css('.card__actions form button[type="submit"]')
      );
      await deleteButton.click();

      // Step 9: Check if the product is deleted by trying to locate it again
      const productsAfterDeletion = await driver.findElements(
        By.css(".product-item")
      );
      let productFound = false;
      for (const product of productsAfterDeletion) {
        const titleElement = await product.findElement(
          By.css(".product__title")
        );
        const title = await titleElement.getText();

        if (title.trim() === productTitle) {
          productFound = true;
          break;
        }
      }

      if (!productFound) {
        console.log(
          `Product with title "${productTitle}" has been successfully deleted.`
        );
      } else {
        throw new Error(
          `Product with title "${productTitle}" was not deleted.`
        );
      }
    } else {
      throw new Error(`Product with title "${productTitle}" not found.`);
    }
  } catch (err) {
    console.error("Test failed: ", err);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

async function editProductTest() {
  let driver;
  try {
    driver = await new Builder().forBrowser("chrome").build();
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
    const productTitle = "edit Product Test";
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

    // Step 7: Find the product that added and extract the detail about him
    const products = await driver.findElements(By.css(".product-item"));
    let targetProduct;
    for (const product of products) {
      const titleElement = await product.findElement(By.css(".product__title"));
      const title = await titleElement.getText();

      if (title.trim() === productTitle) {
        targetProduct = product;
        break;
      }
    }
    // extract the current details
    const titleElement = await targetProduct.findElement(
      By.css(".product__title")
    );
    const oldTitle = await titleElement.getText();
    const imageElement = await targetProduct.findElement(
      By.css(".card__image img")
    );
    const oldImageUrl = await imageElement.getAttribute("src");
    const priceElement = await targetProduct.findElement(
      By.css(".product__price")
    );
    const oldPrice = await priceElement.getText();
    const descriptionElement = await targetProduct.findElement(
      By.css(".product__description")
    );
    const oldDescription = await descriptionElement.getText();

    // Step 8: Click on the Edit button
    const editButton = await targetProduct.findElement(
      By.css(".card__actions a.btn")
    );
    await editButton.click();
    await driver.wait(until.urlContains("/admin/edit-product"), 10000);

    // Step 9: Clear the existing input fields
    await driver.findElement(By.name("title")).clear();
    await driver.findElement(By.name("imageUrl")).clear();
    await driver.findElement(By.name("price")).clear();
    await driver.findElement(By.name("description")).clear();

    // Step 10: Fill in the new product details
    const newProductTitle = "edited title";

    await driver.findElement(By.name("title")).sendKeys(newProductTitle);
    await driver
      .findElement(By.name("imageUrl"))
      .sendKeys("http://editedurl.com/image.jpg");
    await driver.findElement(By.name("price")).sendKeys("10.99");
    await driver
      .findElement(By.name("description"))
      .sendKeys("This is edited product.");
    await driver
      .findElement(By.xpath('//button[contains(text(), "Update Product")]'))
      .click();

    // Step 11: Find the product that added and extract the detail about him
    const updatedProducts = await driver.findElements(By.css(".product-item"));
    let updatedProduct;
    for (const product of updatedProducts) {
      const titleElement = await product.findElement(By.css(".product__title"));
      const title = await titleElement.getText();

      if (title.trim() === newProductTitle) {
        updatedProduct = product;
        break;
      }
    }
    const updatedTitleElement = await updatedProduct.findElement(
      By.css(".product__title")
    );
    const updatedTitle = await updatedTitleElement.getText();
    const updatedImageElement = await updatedProduct.findElement(
      By.css(".card__image img")
    );
    const updatedImageUrl = await updatedImageElement.getAttribute("src");
    const updatedPriceElement = await updatedProduct.findElement(
      By.css(".product__price")
    );
    const updatedPrice = await updatedPriceElement.getText();
    const updatedDescriptionElement = await updatedProduct.findElement(
      By.css(".product__description")
    );
    const updatedDescription = await updatedDescriptionElement.getText();

    // Assertions to check the differences
    assert.notStrictEqual(
      updatedTitle,
      oldTitle,
      "Title was not updated correctly."
    );
    assert.notStrictEqual(
      updatedImageUrl,
      oldImageUrl,
      "Image URL was not updated correctly."
    );
    assert.notStrictEqual(
      updatedPrice,
      oldPrice,
      "Price was not updated correctly."
    );
    assert.notStrictEqual(
      updatedDescription,
      oldDescription,
      "Description was not updated correctly."
    );
    // // Print new values for confirmation
    // console.log(`Old Title: ${oldTitle}`);
    // console.log(`New Title: ${newProductTitle}`);
    // console.log(`Old Image URL: ${oldImageUrl}`);
    // console.log(`New Image URL: ${updatedImageUrl}`);
    // console.log(`Old Price: ${oldPrice}`);
    // console.log(`New Price: ${updatedPrice}`);
    // console.log(`Old Description: ${oldDescription}`);
    // console.log(`New Description: ${updatedDescription}`);
    // console.log("Product updated successfully!");
  } catch (err) {
    console.error("Test failed: ", err);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

(async function runAllTest() {
  try {
    await addToCartTest();
    await deleteCartTest();
    await makeOrderTest();
    await addProductTest();
    await editProductTest();
    await deleteProductTest();
    await detailOfProductTest();
    await detailOfProductTestloggedin();
    await signupTest();
  } catch (err) {
    console.error("failed run all test", err);
  } finally {
    // process.exit(0);
  }
})();
