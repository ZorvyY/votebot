const axios = require('axios')
const jsdom = require('jsdom')
const { JSDOM } = jsdom;
const fs = require('fs')


const main = async () => {
  const html = (await axios.get('https://poll.fm/10476976/results')).data
  console.log(html)
  const dom = new JSDOM(html)  

  const { document } = dom.window
  const labels = Array.from(document.querySelectorAll('.label')).map(el => el.textContent)
  const votes = Array.from(document.querySelectorAll('.votes')).map(el => Number(el.textContent.split(' ')[0].replace(/\,/g,'')))

  const pairs = labels.map((label, idx) => ({label, votes: String(votes[idx])})).sort((a, b) => a.label.localeCompare(b.label))
  pairs.unshift({
    label: "Time",
    votes: String(new Date())
  })

  // const labelStr = pairs.map(({ label }) => label).join(',') + '\n'
  // fs.appendFileSync('monitor.txt', labelStr)

  const logStr = pairs.map(({ votes }) => votes).join(',') + '\n'
  fs.appendFileSync('monitor.txt', logStr)
  
}

main()