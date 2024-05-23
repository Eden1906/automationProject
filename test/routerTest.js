const assert = require("assert");

async function testHomePage(driver) {
  await driver.get("http://localhost:3000/");
  const title = await driver.getTitle();
  console.log(title);
  assert.strictEqual(title, "Shop");
  console.log("Home page test passed");
}

async function testProductsPage(driver) {
  await driver.get("http://localhost:3000/products");
  const title = await driver.getTitle();
  assert.strictEqual(title, "Your Products Page Title");
  console.log("Products page test passed");
}

async function testCartPage(driver) {
  await driver.get("http://localhost:3000/cart");
  const title = await driver.getTitle();
  assert.strictEqual(title, "Your Cart Page Title");
  console.log("Cart page test passed");
}

async function testOrdersPage(driver) {
  await driver.get("http://localhost:3000/orders");
  const title = await driver.getTitle();
  assert.strictEqual(title, "Your Orders Page Title");
  console.log("Orders page test passed");
}

async function testAddProductPage(driver) {
  await driver.get("http://localhost:3000/admin/add-product");
  const title = await driver.getTitle();
  assert.strictEqual(title, "Add Product");
  console.log("Add Product page test passed");
}

async function testAdminProductsPage(driver) {
  await driver.get("http://localhost:3000/admin/products");
  const title = await driver.getTitle();
  assert.strictEqual(title, "Admin Products");
  console.log("Admin Products page test passed");
}

async function testLoginPage(driver) {
  await driver.get("http://localhost:3000/login");
  const title = await driver.getTitle();
  assert.strictEqual(title, "Login");
  console.log("Login page test passed");
}

async function testSignupPage(driver) {
  await driver.get("http://localhost:3000/signup");
  const title = await driver.getTitle();
  assert.strictEqual(title, "Signup");
  console.log("Signup page test passed");
}

module.exports = {
  testHomePage,
  testProductsPage,
  testCartPage,
  testOrdersPage,
  testAddProductPage,
  testAdminProductsPage,
  testLoginPage,
  testSignupPage,
};
