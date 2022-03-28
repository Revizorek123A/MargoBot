const helpers = require('./Helpers.js');

module.exports = class Logger {

  constructor (bot) {

    this.bot = bot;

    this.logs = [];

    this.logsMaxSize = 10;

  }

  log (msg, type) {

    if(this.logs.length > this.logsMaxSize) this.logs = [];

    console.log(this.logs.length)

    if(!margoBot.bools.dev) return;

    let color;

    switch(type) {

      case 'info':    color = 'lightblue';    break;

      case 'success': color = 'lime';         break;

      case 'warning': color = 'orange';       break;

      case 'error':   color = 'red';          break;

    }

    const log = {

      ts: Math.floor(new Date().getTime() / 1000),
      msg: msg,
      type: type
      
    };

    this.logs.push(log);

    this.bot.io.sockets.emit('log', log);

    console.log(`%c [${ helpers.getCurrentTime() }] - ${ msg }`, `color: ${ color }`);

  }

}

