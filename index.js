const pup = require("puppeteer");

//set up your web scraping here
const url = "https://www.mercadolivre.com.br/";
const searchFor = "macbook m1";

let c = 1;
const list = [];

(async () => {
  const browser = await pup.launch({ headless: true });
  const page = await browser.newPage();
  console.log("Start Web Scraping @devlucascardoso");

  await page.goto(url);
  console.log("I went to the URL");

  await page.waitForSelector("#cb1-edit");

  await page.type("#cb1-edit", searchFor);

  await Promise.all([page.waitForNavigation(), page.click(".nav-icon-search")]);

  const links = await page.$$eval(".ui-search-result__image > a", (el) =>
    el.map((link) => link.href)
  );

  console.log("reading the data, please wait!");
  for (const link of links) {
    //page limit
    if (c === 2) continue;
    console.log("page", c);
    await page.goto(link);
    await page.waitForSelector(".ui-pdp-title");

    const title = await page.$eval(
      ".ui-pdp-title",
      (element) => element.innerText
    );

    const price = await page.$eval(
      ".andes-money-amount__fraction",
      (element) => element.innerText
    );

    const seller = await page.evaluate(() => {
      const el = document.querySelector(".ui-pdp-seller__link-trigger");
      if (!el) return null;
      return el.innerText;
    });

    const qntAvailable = await page.evaluate(() => {
      const avl = document.querySelector(".ui-pdp-buybox__quantity__available");
      if (!avl) return "Último disponível!";
      return avl.innerText;
    });

    const obj = {};
    obj.title = title;
    obj.price = price;
    seller ? (obj.seller = seller) : "";
    obj.qntAvailable = qntAvailable;
    obj.link = link;

    list.push(obj);

    c++;
  }

  console.log(list);

  await page.waitForTimeout(3000);
  await browser.close();
})();
