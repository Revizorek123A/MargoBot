
const MovementManager = require('../Player/MovementManager.js');

const ItemManager     = require('../Item/ItemManager.js');

class Player {

     constructor (bot, cookiesString, world, socket) {
       
         this.cookiesString = cookiesString;

         this.socketConnections = [socket]; 

         this.worldName = world; // temp

         this.bot = bot;

         this.lastSynchroTS = 0;

         this.ev = 0;

         this.browser_token = null;

         this.battle = null;

         this.initlvl = 0;

         this.data = {};

         this.x = 0; // todo

         this.y = 0; // todo

         this.map = null;
 
         this.movementManager = new MovementManager(this);

         this.itemManager = new ItemManager(this);

         this.selectedModuleName = 'exp'; // temp xd
         
         // Wybrany moduł np exp, szukanie herosuf itp xddddddd
         this.selectedModule  = new this.bot.__modules['exp'].class(this);

     }

     emit (eventName, data) {
   
        for(const socket of this.socketConnections) {

          this.bot.io.to(socket).emit(eventName, data);

        }

     }

     async onDeadEvent (time) {

      this.selectedModule.stop();

      if(time <= 0) {

        await this.bot.sleep(1000);

        this.selectedModule.start();

      }

     }

     async reload () {

       this.selectedModule.stop();

       this.initlvl = 0;

       this.lastSynchroTS = 0;

       this.data = {};

       this.ev = 0;

       await this.enterToGame();

     }
     
     async sendSynchroRequest () {
        
        return new Promise( async (resolve, reject) => {
          
            this.lastSynchroTS = Math.floor(new Date().getTime() / 1000);
          
            let response = await this.bot.requestManager.sendRequest({

              payload: '_'
              
            }, this);


           // if(response.e != 'ok') return reject(response);

            resolve(response);

        });

     }

     sendInitPacket (initlvl) {

      return new Promise( async (resolve, reject) => {

        this.bot.logger.log(`Sending init packet to server initlvl = ${ initlvl }`)

        let response = await this.bot.requestManager.sendRequest({
               
            payload: `init&initlvl=${ initlvl }&mucka=${ Math.random() }&clientTs=${ Date.now() / 1000  }`

        }, this);

        if(response.e != 'ok' || response.t === 'stop') return reject(response);

        resolve(response);

      });

    }

     async enterToGame () {

      this.bot.logger.log(`Trwa inicjalizacja postaci`);

      return new Promise( async (resolve, reject) => {
          
          try {

            for (const initlvl of [1, 2, 3, 4] ) {

              let init = await this.sendInitPacket(initlvl);

              this.initlvl++;

            }

            this.initlvl = 5;

            this.lastSynchroTS = Math.floor(new Date().getTime() / 1000);

            this.emit('connected', true); // temp xd

            if(!this.selectedModule.bools.isOn) this.selectedModule.start('10lvl'); // temp x


            resolve();

          } 

          catch(e) {

            reject(e);

          }

        });

     }


}


module.exports = Player;