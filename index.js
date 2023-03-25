const puppeteer = require("puppeteer");
const fs = require("fs");

const link = "https://github.com/trending";

console.log("Before");

async function scrape(url) {
  // Start the browser using launch()
  const browser = await puppeteer.launch({
    headless: false, // for visibility
    args: ["--start-maximized"], // Maximize the browser screen
    defaultViewport: null,
  });

  // Open new tab in the browser
  const page = await browser.newPage();

  // Open the url og Github Tranding page
  await page.goto(url);

  var users = await page.evaluate(() => {
    var titlesList = document.querySelectorAll(".h3.lh-condensed");
    var userArr = [];

    for (var i = 0; i < titlesList.length; i++) {
      userArr[i] = {
        title: titlesList[i].innerText.trim(),
        description: titlesList[i].nextElementSibling.innerText.trim(),
        url: titlesList[i].getAttribute('href="/nsarrazin/serge"'),
        starts: titlesList[i].getAttribute(
          'class="d-inline-block.float-sm-right"'
        ),
        forks: titlesList[i].getAttribute('data-view-component="true"'),
        language: titlesList[i].getAttribute('itemprop="programmingLanguage"'),
      };
    }
    return userArr;
  });

  fs.writeFile("./data.json", JSON.stringify(users, null, 3), (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Great Success");
  });
}

scrape(link);
