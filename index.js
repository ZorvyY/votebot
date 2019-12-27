const bot = require('./bot.js');
const fs = require('fs')

async function getBrowser(proxy) {
  if (process.env.LAMBDA) {
    const chromium = require('chrome-aws-lambda');
    return chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });
  } else {
    require('console-stamp')(console, 'HH:MM:ss');
    const puppeteer = require('puppeteer');

    if (proxy) {
      return puppeteer.launch({
        args: [
          `--proxy-server=${proxy}`,
        ]
      });
    } else return puppeteer.launch();
  }
}


// local only code
function getProxies() {
  const proxies = fs.readFileSync('savedProxies.txt', { encoding: 'utf8' }).split('\n')
  return proxies;
}

const saveProxy = (() => {
  let proxies = []
  return (proxy => {
    proxies.push(proxy);
    if (proxies.length == 1) {
      fs.appendFileSync('savedProxies.txt', proxies.join('\n') + '\n')
      proxies.length = 0;
    }
  })
})()


async function main() {
  const pLimit = require('p-limit');
 
  const limit = pLimit(9);

  let votes = /* getProxies() */[].concat(null).map(proxy => limit(async proxy => {
    let browser = await getBrowser(proxy);
    let result = {
      proxy: proxy,
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
      console.log(result);
      //if (result.error == null) saveProxy(proxy)
      return result;
    }
  }, proxy) );
  
  //console.log(votes)
  //console.log(getProxies())
  //console.log(await Promise.all(votes))

}
main()

/*
exports.handler =  async function(event, context) {



  let browser = await getBrowser();
  try {
    return await bot.vote(browser);
  }
  catch (error) {
    console.log(error);
  } finally {
    await browser.close();
  }

}

if (!process.env.LAMBDA) {
  exports.handler({}, {})
}
*/


