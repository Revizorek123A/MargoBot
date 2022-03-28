
const setCookie      = require('set-cookie-parser'),
      Player         = require('./Player/Player.js'),
      sha1           = require('sha1'),
      RequestManager = require('./RequestManager.js'),
      Logger         = require('./Logger.js'),
      helpers   = require('./Helpers.js');

class MargoBot {
   
   constructor () {

    this.io = require('socket.io')(8080);

    this.request = require('request');

    this.requestManager = new RequestManager(this);

    this.logger = new Logger(this);

    this.__modules = {
  
      exp: { class: require('./Modules/ExpModule/ExpModule.js') }

    };

    this.bools = {
     
     dev: true

    };

    this.players = {};

   }

   getPlayer (acc_id) {
 
     return this.players[acc_id];

   }
   
   listenSocket () {

    this.io.on('connection', function(socket) {

      console.log(socket.handshake.query.auth)

      socket.on('start module', data => {

           let player = margoBot.getPlayer(data.mchar_id);

           if(player.selectedModule.bools.isOn) 

            return player.selectedModule.stop();

           player.selectedModule.start();


      });

      socket.on('login', async data => {

        console.log(margoBot.players[data.mchar_id])

        if(margoBot.players.hasOwnProperty(data.mchar_id)) {

          socket.emit('message', 'Te konto jest już zalogowane');

          margoBot.players.sockets.push(socket.id);

          return;

        }

        const l = await margoBot.login(data.login, data.pass, data.mchar_id, data.world);

        if(l.success) {

          const player = new Player(margoBot, l.cookiesString, data.world, socket.id);

          await player.enterToGame();

          margoBot.players[data.mchar_id] = player;


        } 

      })

    });

   }

   async thread () {

    let i = 0;

    while (i < Object.keys(this.players).length) {

      const id          = Object.keys(this.players)[i],
            player      = this.players[id],
            lastSynchro = new Date().getTime() / 1000 - player.lastSynchroTS;

      if(lastSynchro >= 1 && player.initlvl === 5) {

        player.sendSynchroRequest();

      }

      i++;

    }

    await this.sleep(50);

    this.thread();

   }

   sleep (t) {

     return new Promise(resolve => {
           
           setTimeout(() => {
               
               resolve();

           }, t );

     })

   }

   randomSleep (x) {

     return new Promise(resolve => {

           let random = helpers.generateRandomNumberMinMax( this.config.randomTimeConfig[x] );

           setTimeout(() => {
               
               resolve()

           }, random * 1000 )

     })

   }


   login (login, pass, mchar_id) {

    this.logger.log(`Trwa logowanie się ${ login} ${ pass }`);

    return new Promise((resolve, reject) => {

      this.request.post('https://www.margonem.pl/ajax/login', {

        form: {
          l: login,
          ph: sha1('mleczko' + pass),
          t: '',
          h2: '',
          security: true

        }

      }, (err, res, body) => {

        console.log(body)

        if(err) return reject(err); 

        var cookies = setCookie.parse(res, {

          decodeValues: true,  

          map: true           

        });

        var cookiesArray = [];

        for(var i = 0; i < Object.keys(cookies).length; i++) {

          var c = cookies[Object.keys(cookies)[i]];

          cookiesArray.push(c.name + '=' + c.value);

        }

        console.log(mchar_id)

        cookiesArray.push('mchar_id=' + mchar_id);

        var data = JSON.parse(body);

        if(data.ok === 1) {

          this.logger.log(`Logowanie ${ login } ${ pass } powiodło się`);

          resolve({

            success: data.ok === 1 ? true : false,

            cookiesString: cookiesArray.join('; '),

            cookies: cookies

          });

        }

      });

    });

  }

   async start () {

    this.logger.log('Trwa uruchamianie serwera...');

    this.listenSocket();

    this.thread();

    return;

    var _login = process.argv[2];

    var _pass  = process.argv[3];

    if(!_login || !_pass) return this.logger.log('Nie podales pasuf');

    try {

      const login = await this.login(_login, _pass);

      if(login.success) {

        this.logger.log('Zalogowano poprawnie', 'success');

        this.player = new Player(this, login.cookiesString);

        await this.player.enterToGame();

        //this.getSelectedModule().start();

      } 

    }

    catch(e) {

      console.log(e);

    }

  }

}


margoBot = new MargoBot();

margoBot.start();



