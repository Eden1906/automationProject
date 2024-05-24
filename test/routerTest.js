const { Builder, By, until } = require("selenium-webdriver");

const assert = require("assert");

async function testHomePage(driver) {
  await driver.get("http://localhost:3000/");
  const title = await driver.getTitle();
  assert.strictEqual(title, "Shop");
  console.log("Home page test passed");
  await delay(2000);
}

async function testProductsPage(driver) {
  await driver.get("http://localhost:3000");
  await driver.findElement(By.css('a[href="/products"]')).click();
  await driver.wait(until.urlContains("/products"), 1000);
  const title = await driver.getTitle();
  assert.strictEqual(title, "All Products");
  console.log("Products page test passed");
  await delay(2000);
}

async function testCartPage(driver) {
  await driver.get("http://localhost:3000");
  await driver.findElement(By.css('a[href="/cart"]')).click();
  await driver.wait(until.urlContains("/cart"), 1000);
  const title = await driver.getTitle();
  assert.strictEqual(title, "Your Cart");
  console.log("Cart page test passed");
  await delay(2000);
}

async function testOrdersPage(driver) {
  await driver.get("http://localhost:3000");
  await driver.findElement(By.css('a[href="/orders"]')).click();
  await driver.wait(until.urlContains("/orders"), 1000);
  const title = await driver.getTitle();
  assert.strictEqual(title, "Your Orders");
  console.log("Orders page test passed");
  await delay(2000);
}

async function testAddProductPage(driver) {
  await driver.get("http://localhost:3000");
  await driver.findElement(By.css('a[href="/admin/add-product"]')).click();
  await driver.wait(until.urlContains("/admin/add-product"), 1000);
  const title = await driver.getTitle();
  assert.strictEqual(title, "Add Product");
  console.log("Add product page test passed");
  await delay(2000);
}

async function testAdminProductsPage(driver) {
  await driver.get("http://localhost:3000");
  await driver.findElement(By.css('a[href="/admin/products"]')).click();
  await driver.wait(until.urlContains("/admin/products"), 1000);
  const title = await driver.getTitle();
  assert.strictEqual(title, "Admin Products");
  console.log("Admin products page test passed");
  await delay(2000);
}

module.exports = {
  testHomePage,
  testProductsPage,
  testCartPage,
  testOrdersPage,
  testAddProductPage,
  testAdminProductsPage,
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
