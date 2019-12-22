//const puppeteer = require('puppeteer');
const chromium = require('chrome-aws-lambda');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function vote() {
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  try {
    const page = await browser.newPage();
    page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36')
    await page.goto('http://www.samyukta.ca/votes/photo-booth.php');
  
  
    await page.click('#PDI_answer48410852');
    await page.click('#pd-vote-button10476976');
  
    await sleep(1000);
  
    // Take screenshot
    //await page.screenshot({path: `screenshots/screenshot-${new Date()}.png`, fullPage: true});
  
    // Fetch vote status line
    const re = /<div\sclass="pds-question-top">(.*?)<\/div>/;
    console.log(re.exec(await page.content())[0]);
  } catch (error) {
    console.log(error);
  } finally {
    await browser.close();
  }
}

module.exports = {
  vote,
}
