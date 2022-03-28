const Town = require('./Town/Town.js');

module.exports = class MargoServerEventHandler {
  
  constructor (bot) {

    this.bot = bot;

  }

  async handleResponse (player, res) {

   // console.log(res);

    player.emit('response', res);

    if(res.hasOwnProperty('browser_token')) {

      console.log(res.browser_token)

      player.browser_token = res.browser_token;

      player.data = res.h;

    }

    if(res.hasOwnProperty('item')) {

      player.itemManager.handlePacketFromServer(res.item);

    }

    if(res.hasOwnProperty('ev')) {

      player.ev = res.ev;
    
    }

    if(res.hasOwnProperty('dead')) {
    
      

    }

    if(res.hasOwnProperty('t')) {

      if(res.t === 'stop') this.on_stop();

      if(res.t === 'reload') { console.log(res); this.on_reload(player); }

    }

    if(res.hasOwnProperty('emo')) {

      //this.on_emo(res.emo);

    }
    
    if(res.hasOwnProperty('npc')) {

      this.on_newNpc(player, res.npc);

    }

    if(res.hasOwnProperty('other')) {

      this.on_other(player, res.other);

    }

    if(res.hasOwnProperty('town')) {

      this.on_town(player, res.town);

    }

    if(res.hasOwnProperty('townname')) {

      this.on_townname(player, res.townname);

    }

    if(res.hasOwnProperty('cl')) {

      this.on_cols(player, res.cl);

    }

    if(res.hasOwnProperty('t')) {

      this.on_stop(res.t);

    }

    if(res.hasOwnProperty('captcha')) {

       this.on_captcha();

    }

    if(res.hasOwnProperty('f')) {
    
      this.on_f(player, res.f);

    }

    if(res.hasOwnProperty('gw2')) {

      this.on_gw2(player, res.gw2);

    }

    if(res.hasOwnProperty('dead')) {

      this.onDeadEvent(player, res.dead);

    }

    if(res.hasOwnProperty('worldname')) {

      player.worldname = res.worldname;
      
    }

    if(res.hasOwnProperty('msg')) {
     
     this.on_message(res.msg);

    }

    if(res.hasOwnProperty('town')) {

return;

      if(margoBot.storage.get('exp.previousMode') && res.town.id === this.getSelectedModule().getPreviousExpMapID()) {

        this.player.selectedModule.decrementExpMapIndex();

        return;

      }


      if(res.town.id === this.getSelectedModule().getNextExpMapID() ) {

        this.player.selectedModule.incrementExpMapIndex();

      }

    }

    if(res.hasOwnProperty('h')) {

    

    }


   }

  on_other (player, other) {

    player.map.otherManager.handlePacketFromServer(other);

  }

  async on_warning (input) {

 
  }

  on_emo (emo) {


    
  }

  on_gw2 (player, data) {
 
    player.map.newGetaway(data);

  }

  on_townname (player, data) {

    player.map.getaways = data;

  }

  on_cols (player, c) {

    player.map.parseCols(c);

  }

  on_town (player, data) {
  
   player.map = new Town(data, player);

  }

  on_error (data) {


  }

  async on_newNpc (player, data) {

    player.map.npcManager.handlePacketFromServer(player, data);

  }

  on_captcha_close () {
    

  }

  on_captcha () {


  }

  async on_awake () {


  }

  onDeadEvent (player, data) {

     player.onDeadEvent(data);
 
  }

  on_message (input) {

  

  }

  on_reload (player) {


    console.log('HANDLE RELOAD XD')

   player.reload();

  }

  async on_stop () {


  }

  async on_f (player, data) {
   
     player.battle.handlePacketFromServer(data);

  }

}

