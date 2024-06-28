/*
Run this using:

node test/run-web-kit.js

*/

// import { webkit } from "playwright";
// const browser = await webkit.launch({ headless: false });
// const context = await browser.newContext();
// const page = await context.newPage();
// await page.goto("https://patter001.github.io/surfsquares/");

const { webkit } = require('playwright');
(async () => {
    // Launch WebKit browser
    const browser = await webkit.launch({ headless: false }); // Set to 'true' if you want to run in headless mode
    
    // Open a new browser context
    const context = await browser.newContext();
    
    // Create a new page in the context
    const page = await context.newPage();
    
    // Navigate to the desired URL
    await page.goto('http://127.0.0.1:1234');
    
    // Close the browser after some time
    // await browser.close();
})();