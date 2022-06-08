const puppeteer = require("puppeteer");

async function getVisual() {
  try {
    const URL = "https://github.com/devlucascardoso";
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(URL);

    const random = Math.floor(Math.random() * 65536);

    await page.screenshot({ path: `screenshot-${random}.png` });
    await page.pdf({ path: `page-${random}.pdf` });

    await browser.close();
  } catch (error) {
    console.error(error);
  }
}

getVisual();
