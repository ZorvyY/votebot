const bot = require('./bot.js');

exports.handler =  async function(event, context) {
  return bot.vote();
}