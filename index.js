const bot = require('./bot.js');
const fs = require('fs')
const argv = require('yargs').argv

const execPath = argv.chromepath //|| '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

async function getBrowser() {
  const puppeteer = require('puppeteer-core')
  return puppeteer.launch({
    executablePath: execPath
  })
}

const format = result => {
  return `[${new Date()}] ${result.value ? `Value: ${result.value}` : `Error: ${result.error}`}`
}

async function main() {
  let browser = await getBrowser();
  let result = {
    value: null,
    error: null,
  };
  try {
    result.value = await bot.vote(browser);
  }
  catch (err) {
    result.error = String(err)
  } finally {
    await browser.close();
    fs.appendFileSync('log.txt', format(result));
    return result;
  }
}
main()

