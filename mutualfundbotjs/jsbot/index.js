const request = require('request');
const http = require('https');
const util = require('util');

module.exports = function (context, myTimer, inputDocument) {
  var timeStamp = new Date().toISOString();
  const telegram_chatid = process.env["Telegram_Chat_ID"];
  const telegram_bot_token = process.env["Telegram_Bot_Token"];  ;
  const bing_endpoint = process.env["Bing_Endpoint"];
  const subscription_key = process.env["Bing_Subscription_Key"];

  const telegram_url_template = 'https://api.telegram.org/bot{token}/sendMessage?chat_id={chat_id}&text={message};'
  context.log(telegram_chatid);
  context.log(telegram_bot_token);
  context.log(bing_endpoint);
  context.log(subscription_key);
  if (myTimer.isPastDue) {
    context.log('JavaScript is running late!');
  }
 
  inputDocument.forEach(data => {
    let query = data.searchquery.replace(" ", "+");
    const options = {
      url: bing_endpoint + query,
      headers: {
        'Ocp-Apim-Subscription-Key': subscription_key
      }
    }

    request(options, function (err, response, msg) {
      context.log('inside request method......');
      const value = JSON.parse(response.body)["webPages"]["value"][0].name.split('[')[1].split(']')[0];
      let message = data.fundname + ' : ' + value;
      let telegramUrl = telegram_url_template.replace('{token}',telegram_bot_token ).replace('{chat_id}',telegram_chatid).replace('{message}',message);
      request.post(telegramUrl)
      .on('response', function(response) {
        context.done();
      })
      .on('error', function(err) {
        context.log('telegram message failed : ' + err)
        context.done();
      })
    })
  });
};