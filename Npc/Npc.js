const Battle  = require('../BattleManager.js');

module.exports = class Npc {

    constructor (npc) {
       
       this.data = npc;

       this.toKill = false;

    }

    canKill () {

       return this.data.type === 2 || this.data.type === 3 ? true : false;

    }

    async startDialog (player) {

       return new Promise( async (resolve, reject) => {

       	player.bot.logger.log(`Rozpoczynam rozmowę z ${ this.data.nick }`);

       	_g(`talk&id=${ this.data.id }`, res => {
           
             if(!res.hasOwnProperty('d')) return reject(res);

             resolve();

       	})


       });

    }

    async comeTo (player) {

       return new Promise( async (resolve, reject) => {
           
            try {

            	await player.movementManager.goTo(this.data.x, this.data.y);

            	resolve();

            } catch(e) {

            	player.bot.logger.log(e, 'warning');

            }

       })

    }
    
    // to do 
    async kill (player) {

       if(!this.canKill()) return player.bot.logger.log('Cannot kill this npc! ERR TYPE', 'warning');

       return new Promise( async (resolve, reject) => {

           try {

            player.bot.logger.log(`Cel do zabicia: ${ JSON.stringify(this.data)} `);

            this.toKill = true;

            await player.movementManager.goTo(this.data.x, this.data.y, {

              target: this

            });

            player.battle = new Battle(this.player, this);

            await player.battle.initFight(this, player); 

            resolve();
           
           } catch(e) {

             reject(e);

           }

       });
    
    }

}