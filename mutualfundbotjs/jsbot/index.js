const request = require('request');
const http = require('https');
const util = require('util');

module.exports = async function (context, myTimer, inputDocument) {
  var timeStamp = new Date().toISOString();
  const SUBSCRIPTION_KEY = '054e16cac30b480f8fa0d28f7e327ef6';
  const telegram_chatid = '1596195885';
  const telegram_bot_token = '1634029805:AAH-s3C9vQqOqqPOO-r3ivV9X_OKHY_dR4U';
  const telegram_url_template = 'https://api.telegram.org/bot{token}/sendMessage?chat_id={chat_id}&text={message};'


  if (myTimer.isPastDue) {
    context.log('JavaScript is running late!');
  }
 
  inputDocument.forEach(data => {
    let query = data.searchquery.replace(" ", "+");
    const options = {
      url: 'https://api.bing.microsoft.com//v7.0/search?q=' + query,
      headers: {
        'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY
      }
    }

    request(options, function (err, response, msg) {
      context.log('extraction......');
      const value = JSON.parse(response.body)["webPages"]["value"][0].name.split('[')[1].split(']')[0];
      let message = data.fundname + ' : ' + value;
      let telegramUrl = telegram_url_template.replace('{token}',telegram_bot_token ).replace('{chat_id}',telegram_chatid).replace('{message',message);
      request.post(telegramUrl)
    })
  });
};