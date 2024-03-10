const {By, Builder} = require('selenium-webdriver');
const assert = require("assert");

(async function firstTest() {
  let driver;
  try {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.get('http://127.0.0.1:3000');
  
    let title = await driver.getTitle();
    assert.equal("React App", title);
  
    await driver.manage().setTimeouts({implicit: 500});
  
    let cart_button = await driver.findElement(By.name('cart-button'));
    await cart_button.click();

    let coupon_texbox = await driver.findElement(By.name('coupon-textbox'));
    await coupon_texbox.sendKeys('SCE2024');

    let coupon_button = await driver.findElement(By.name('coupon-button'));
    await coupon_button.click();
    // Switch to the alert
    let alert = await driver.switchTo().alert();

    // Get the text of the alert
    let alertText = await alert.getText();
    assert.equal('Cart is empty',alertText);

  } catch (e) {
    console.log(e)
  } finally {
    await driver.quit();
  }
}())