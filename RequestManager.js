const helpers = require('./helpers.js');
const MargoServerEventHandler = require('./MargoServerEventHandler.js');


module.exports = class RequestManager {

   constructor (bot) {

   	this.bot = bot;

    this.margoServerEventHandler = new MargoServerEventHandler(bot);

   }

   async onRejectedEvent (data) {

   	this.bot.logger.log(`[RequestManager] Request has been rejected!`);

    await this.bot.sleep(500);

    // removing old ev xd temp xdddddd
    data.payload = helpers.removeURLParameter(data.url, 'ev');
    
    data.payload = helpers.removeURLParameter(data.payload, 'browser_token').split('?').pop().replace('t=', '').replace(/\s/g, '');

    this.sendRequest(data);

   }

   sendRequest (data, player) {
 
      return new Promise( async (resolve, reject) => {

   		data.payload += `&browser_token=${ player.browser_token }&ev=${ player.ev }`;

      const url = `https://${ player.worldName }.margonem.pl/engine?t=${ data.payload }`;

//      console.log('request = ' + data.payload)

   		const request = {

   			json: true,

   			headers: {

   				'Cookie': player.cookiesString,
   				'Host': `${ player.worldName }.margonem.pl`,
   				'Origin': `https://${ player.worldName }.margonem.pl`,
   				'Referer': `https://${ player.worldName }.margonem.pl/`,
   				'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36 OPR/76.0.4017.177'
   			},

   			url: url,

        method: 'POST'

      } 
        var bot = this.bot; // temp xd

        this.bot.request(request, async function (err, res, output) {

        	if(err) return reject(err);

          
        	bot.requestManager.margoServerEventHandler.handleResponse(player, output);

        	resolve(output);

        });

      });

   }

}



