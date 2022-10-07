const puppeteer = require("puppeteer");

function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function main() {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    executablePath: process.env.PUPPETEER_EXEC_PATH, // set by docker container
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto("https://ithelp.ithome.com.tw/users/20107239/articles");

  let index = 0;
  while (true) {
    const links = await page.$$(".qa-list .qa-list__title a");

    const link = links[index];

    if (!link) break;

    await Promise.all([
      page.waitForNavigation(),
      link.click(),
      //
    ]);

    await wait(600);

    await page.goBack();

    index += 1;
  }

  const counts = await page.$$(
    ".qa-list .qa-condition--change .qa-condition__count"
  );
  for (const count of counts) {
    console.log(await count.evaluate((el) => el.textContent));
  }

  await browser.close();

  console.log("automation process complete");
}

main();
