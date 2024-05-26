const {
  testHomePage,
  testProductsPage,
  testCartPage,
  testOrdersPage,
  testAddProductPage,
  testAdminProductsPage,
} = require("./routerTest.js");

const mongoose = require("mongoose");
const firefox = require("selenium-webdriver/firefox");

async function initDriver(browser) {
  let driver;

  try {
    if (browser === "chrome") {
      driver = await new Builder()
        .usingServer("http://localhost:4444")
        .forBrowser("chrome")
        .build();
    } else if (browser === "firefox") {
      driver = await new Builder()
        .usingServer("http://localhost:4444")
        .forBrowser("firefox")
        .setFirefoxOptions(
          new firefox.Options().setBinary(
            "C:\\Program Files\\Mozilla Firefox\\firefox.exe"
          )
        )
        .build();
    } else {
      throw new Error("Unsupported browser type");
    }

    return driver;
  } catch (err) {
    console.error("Error initializing driver: ", err);
    throw err;
  }
}

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

const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const User = require("../models/user.js");
const Order = require("../models/order.js");

// check if all router work in the site
async function routerTests(browser) {
  let driver;
  try {
    driver = await initDriver(browser);

    // Step 1: Navigate to the login page
    await driver.get("http://localhost:3000/login");

    // Step 2: Perform login
    await driver.findElement(By.name("email")).sendKeys("test@test.com");
    await driver.findElement(By.name("password")).sendKeys("123");
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Step 3: Wait for redirection after login
    await driver.wait(until.urlContains("/"), 10000);

    await testHomePage(driver);
    await testProductsPage(driver);
    await testCartPage(driver);
    await testOrdersPage(driver);
    await testAddProductPage(driver);
    await testAdminProductsPage(driver);

    console.log("All tests passed.");
  } catch (err) {
    console.log("Test failed: ", err);
  } finally {
    await driver.quit();
  }
}

// add product to the cart
async function addToCartTest(browser) {
  // Connect to the DataBase
  await connectDB();

  // save the last cart of user
  let user = await User.findOne({ email: "test@test.com" });
  const userBeforeUpdatedCart = await user.cart.items;

  let driver;
  try {
    driver = await initDriver(browser);
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
    await mongoose.connection.close();
    await driver.quit();
  }
}

// add product to the cart and delete the product
async function deleteCartTest(browser) {
  let driver;
  try {
    driver = await initDriver(browser);
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
    driver.quit();
  }
}

// add product to cart and order it.
async function makeOrderTest(browser) {
  // Connect to the Selenium Grid hub
  let driver;
  try {
    driver = await initDriver(browser);
    // Connect to the DataBase
    await connectDB();
    let lastLengthOfOrders;
    await Order.find().then((order) => (lastLengthOfOrders = order.length));

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
    await Order.find().then((order) => (afterOrderLength = order.length));

    await assert(
      afterOrderLength > lastLengthOfOrders,
      "Order was not added successfully"
    );

    console.log("Order added successfully!");
  } catch (error) {
    console.log("Error occurred:", error);
  } finally {
    await mongoose.connection.close();
    await driver.quit();
  }
}
// add product test
async function addProductTest(browser) {
  let driver;
  try {
    driver = await initDriver(browser);
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
      .sendKeys(
        "https://t3.ftcdn.net/jpg/00/06/45/56/360_F_6455661_Ptvg5iAO0DpUlt0ItlO8YewZpvU3IxwX.jpg"
      );
    await driver.findElement(By.name("price")).sendKeys("9.99");
    await driver
      .findElement(By.name("description"))
      .sendKeys("This is a test product.");
    await driver
      .findElement(By.xpath('//button[contains(text(), "Add Product")]'))
      .click();

    // Step 6: Wait for redirection to the admin products page
    await driver.wait(until.urlContains("/admin/products"), 5000);

    const products = await driver.findElements(By.css(".product-item"));
    let addedProductTitle;

    for (const product of products) {
      const titleElement = await product.findElement(By.css(".product__title"));
      const title = await titleElement.getText();

      if (title.trim() === productTitle) {
        addedProductTitle = title;
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
    driver.quit();
  }
}

// add product and then edit the product
async function editProductTest(browser) {
  let driver;
  try {
    driver = await initDriver(browser);
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
      .sendKeys(
        "https://t3.ftcdn.net/jpg/00/06/45/56/360_F_6455661_Ptvg5iAO0DpUlt0ItlO8YewZpvU3IxwX.jpg"
      );
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
      .sendKeys(
        "https://grandvision-media.imgix.net/m/69a9dca2679aed3f/original_png-8719154674457_00001.png"
      );
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
    console.log("Product updated successfully!");
  } catch (err) {
    console.error("Test failed: ", err);
  } finally {
    driver.quit();
  }
}

// add product and then delete the product
async function deleteProductTest(browser) {
  let driver;
  try {
    driver = await initDriver(browser);
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
      .sendKeys(
        "https://grandvision-media.imgix.net/m/69a9dca2679aed3f/original_png-8719154674457_00001.png"
      );
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
    await driver.quit();
  }
}

// check the details about the product when I am not connected to the website
async function detailOfProductTest(browser) {
  let driver;
  try {
    driver = await initDriver(browser);

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
    driver.quit();
  }
}
// check the details on the product while I'm already connected to the website
async function detailOfProductTestloggedin(browser) {
  let driver;
  try {
    driver = await initDriver(browser);

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
    driver.quit();
  }
}

// signup and then login to the site
async function signupTest(browser) {
  let driver;
  try {
    driver = await initDriver(browser);
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
    driver.quit();
  }
}

(async function runAllTest() {
  try {
    await console.log(
      "----------------Running Test with chrome--------------------"
    );

    await routerTests("chrome");
    await addToCartTest("chrome");
    await deleteCartTest("chrome");
    await makeOrderTest("chrome");
    await addProductTest("chrome");
    await editProductTest("chrome");
    await deleteProductTest("chrome");
    await detailOfProductTest("chrome");
    await detailOfProductTestloggedin("chrome");
    await signupTest("chrome");

    await console.log("------------------------------------------------------");

    await console.log(
      "----------------Running Test with firefox--------------------"
    );

    await routerTests("firefox");
    await addToCartTest("firefox");
    await deleteCartTest("firefox");
    await makeOrderTest("firefox");
    await addProductTest("firefox");
    await editProductTest("firefox");
    await deleteProductTest("firefox");
    await detailOfProductTest("firefox");
    await detailOfProductTestloggedin("firefox");
    await signupTest("firefox");

    await console.log("------------------------------------------------------");
  } catch (err) {
    console.error("failed run all test", err);
  } finally {
    process.exit(0);
  }
})();
