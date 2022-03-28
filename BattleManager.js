module.exports = class Battle {

	   constructor (player, opponent) {

      this.start = false;

      this.player = player;

      this.opponent = opponent;

	   }

     checkIsEnd () {

         return new Promise((resolve, reject) => {

             const feta = setInterval(() => {

                  if(this.start === false && this.opponent === null) {

                     clearInterval(feta);

                     resolve();

                  }

             }, 1000);

         });

     }

     async onCloseEvent () {

      console.log('INDEX!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!=!' + this.opponent.data.index)

      this.player.map.npcManager.removeNpcByIndex(this.opponent.data.index);
     
      this.start = false;
      
      this.opponent = null;

      this.player.battle = null;

     }

     autoFight () {

       return new Promise( async (resolve, reject) => {

           const res = await this.player.bot.requestManager.sendRequest({

            payload: `fight&a=f`

           }, this.player);

           resolve();

       });

     }

     closeFight () {

       return new Promise( async (resolve, reject) => {

           const res = await this.player.bot.requestManager.sendRequest({

            payload: `fight&a=quit`

           }, this.player);

           resolve();

       });

     }

     initFight (opponent, player) {

       this.player = player;

       this.opponent = opponent;

       this.player.bot.logger.log(`[BATTE MANAGER] Gracz o id ${ this.player.data.id } rozpoczyna walkę z  ${ this.opponent.data.id } npc'tem`)

       return new Promise( async (resolve, reject) => {

           const res = await this.player.bot.requestManager.sendRequest({

            payload: `fight&a=attack&ff=1&id=${ -this.opponent.data.id }`

           }, this.player);

           await this.checkIsEnd();

           resolve();

       });

     }

     async handlePacketFromServer (data) {

      if(data.init === '1') {

        this.start = true;

        await this.player.bot.sleep(200);

        await this.autoFight();

      }

      if(data.move === -1 && this.start) {

        this.start = false;

        console.log('zamknij!')

        await this.player.bot.sleep(1000);

        this.closeFight();

      }

      if(data.close === 1) {

        this.onCloseEvent();

      }

    }


}