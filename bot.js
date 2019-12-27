const UserAgent = require('user-agents');

const userAgent = new UserAgent()

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function vote(browser) {
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(15000); 
  page.setUserAgent(userAgent().toString());
  await page.goto('http://www.samyukta.ca/votes/photo-booth.php', {waitUntil: 'networkidle2'});

  try {
    await page.click('#PDI_answer48410852');
  } catch (error) {
    await page.screenshot({path: `screenshots/failed-select-${new Date()}.png`, fullPage: true});
    throw error;
  }

  try {
    await page.click('#pd-vote-button10476976');
  } catch (error) {
    await page.screenshot({path: `screenshots/failed-vote-click-${new Date()}.png`, fullPage: true});
    throw error;
  }

  await sleep(1000);


  await sleep(1000);

  // Take screenshot
  //await page.screenshot({path: `screenshots/screenshot-${new Date()}.png`, fullPage: true});

  // Fetch vote status line
  const re = /<div\sclass="pds-question-top">(.*?)<\/div>/;
  return re.exec(await page.content())[0];
}

module.exports = {
  vote,
}
