module.exports = class Other {

   constructor (data) {
 
      this.data = data;

   }

   track (player) {
      
      player.bot.logger.log(`Trwa śledzenie gracza o id ${ this.data.id }`);

   }

   kill (player) {

   	player.bot.logger.log(`Trwa atakowanie gracza o id ${ this.data.id }`);

   }

}