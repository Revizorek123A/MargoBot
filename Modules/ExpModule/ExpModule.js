const helpers  = require('../../helpers.js');
const expsList = require('../ExpModule/ExpsList.js');

module.exports = class ExpModule {
  
  constructor (player) {

    this.player = player;
    
    this.bools = {

      isOn: false,
      
      isGoToExp: false,
      
      isGoToNextExpMap: false,
      
      isGoToPreviousExpMap: false

    };

    this.selectedExp = expsList.filter(exp => { return exp.name == 'cycek xd' })[0] || {};

    this.currentTarget = null;

    this.targets = [];

    this.config = {

         sleepAfterBattle: 1

    }

    this.data = {

      previousMode: false,
      currentExpMapIndex: 0

    }

  }

  stop () {

    this.bools.isOn = false;

    this.player.emit('message', 'Moduł został wyłączony');

  }

  async tpToExp () {

    const tp = this.selectedExp.tpToExp;

    if(!tp) {

      return this.player.bot.logger('Tp to exp is not selected.', 'warning');
    }

    try {

      const item = this.player.bot.getItemByName(tp);

      console.log(item)
    
      await this.player.bot.useItem(item);

    } catch (e) {

      this.player.bot.logger.log(e, 'warning');

    }

  }

  // @param npcToDelete {object} - Npc object
  removeFromTargets (npcToDelete) {

    console.log(npcToDelete)

    this.player.bot.logger.log(`[EXP MODULE] remove from targets ${ npcToDelete.data.id }`);


    console.log('cipeeeeczka = ' + this.targets.length)

    this.targets = this.targets.filter(target => {

      if(target.data.grp > 0) {
         
         return target.data.grp != npcToDelete.data.grp;

      }

      else {
         
        return target.data.id != npcToDelete.data.id;

      }


    });

    console.log('cipeeeeczka = ' + this.targets.length)

    
  }

  async goToExp () {

    this.bools.isGoToExp = true;
      
    let currentIndex = this.selectedExp.goToExpMaps.indexOf(this.player.map.data.id),
        
        nextIndex = currentIndex+1,

        nextMap = this.selectedExp.goToExpMaps[nextIndex];
    
    // to update 
    const gw = (nextMap < 0) ? this.player.map.npcManager.getById(nextMap) : this.player.map.getGWByID(nextMap);

    console.log(gw);

    return;

    if(!gw) {

      this.player.bot.logger.log('[EXP MODULE] Cannot find GW', 'error');

      return;

    }

    this.player.bot.logger.log('[EXP MODULE] Idę na expowisko');

    this.currentTarget = { x: gw[0], y: gw[1]  }

    await this.player.movementManager.goTo(gw[0], gw[1], {

      isGoToGW: true

    });

  }

  incrementExpMapIndex () {

    this.data.currentExpMapIndex = this.getNextExpMapIndex();

  }

  decrementExpMapIndex () {

    this.data.currentExpMapIndex = this.getPreviousExpMapIndex();
   
    if(this.getPreviousExpMapIndex() === 0 && this.data.previousMode) {
      
      this.data.previousMode = false;
      
    }

  }

  getCurrentExpMapIndex () {
   
   return this.data.currentExpMapIndex;

  }

  getNextExpMapIndex () {
    
    let current = this.getCurrentExpMapIndex();

    return current += 1;

  }

  getPreviousExpMapIndex () {
    
    let current = this.getCurrentExpMapIndex();

    console.log(current)

    return current -= 1;

  }

  getNextExpMapID () {

    if(!this.selectedExp) return;

    let nextExpMapIndex = this.getNextExpMapIndex(),

        nextExpMapID = helpers.getValueFromArrayByIndex(nextExpMapIndex, this.selectedExp.expMaps);

    return nextExpMapID;

  }

  getPreviousExpMapID () {

    let previousExpMapIndex = this.getPreviousExpMapIndex(),

        previousExpMapID = helpers.getValueFromArrayByIndex(previousExpMapIndex, this.selectedExp.expMaps);

    return previousExpMapID;

  }
  
  setPreviousExpMode () {
   
   this.data.previousMode = false;

  }

  async noTargets () {

    this.player.bot.logger.log('[EXP MODULE] Brak przeciwników');

    if(this.selectedExp.expMaps.length === 1) {
       
      console.log('odczekaj jakis czas ;dddd');

      await this.player.bot.sleep(60 * 2 * 1000);

      this.setNewTarget();

    }

    else if(this.getCurrentExpMapIndex() === this.selectedExp.expMaps.length-1) {
     
     this.setPreviousExpMode();

     this.goToPreviousExpMap();

    }

    else if(this.data.previousMode) {

      this.goToPreviousExpMap();

    }

    else {

      this.goToNextExpMap();

    }

  }
  
  async targetKilled () {

    this.removeFromTargets(this.currentTarget);

    this.currentTarget = null;

    this.bools.isGoToMob = false;

    await this.player.bot.sleep(this.config.sleepAfterBattle * 1000);

    this.setNewTarget();

  }
  
  // Ustawia nowy cel do zabicia
  async setNewTarget () {

   const target = await this.getTarget();

   if(!target) return this.noTargets();

   this.currentTarget = target;

   this.bools.isGoToMob = true;

   await this.currentTarget.kill(this.player);

   this.targetKilled();
  
  }

  getTarget () {
   
   this.player.bot.logger.log('[EXP MODULE] Trwa zdobywanie nowego celu ');

   console.log('pipka = ' + this.targets.length)

   if(this.targets.length === 0) return false;

   let target = this.player.map.npcManager.getNearestNpcFromTargets(this.targets);  

   if(!target) return null;

   this.player.bot.logger.log(`[EXP MODULE] Znaleziono nowy cel: ${ JSON.stringify(target.data) }`)


   console.log('pipka = ' + this.targets.length)

   return target;

 } 

  async goToNextExpMap () {

    this.player.bot.logger.log('[EXP MODULE] idę na następne expowisko');

    this.bools.isGoToNextExpMap = true;

    let nextExpMapID = this.getNextExpMapID(),

        gw = this.player.map.getGWByID(nextExpMapID);

        console.log(nextExpMapID)

        if(!nextExpMapID || !gw) {

          this.player.bot.logger.log('[EXP MODULE] Cannot go to next exp map. Map is not found', 'warning');

          return;

        }

        this.currentTarget = { x: gw[0], y: gw[1] }

        await this.player.movementManager.goTo(this.currentTarget.x, this.currentTarget.y, {

          isGoToGW: true

        });

  }

  async goToPreviousExpMap () {

    this.player.bot.logger.log('[EXP MODULE] idę na poprzednie expowisko');

    this.bools.isGoToPreviousExpMap = true;

    const previousExpMapID = this.getPreviousExpMapID();

    const gw = this.player.map.getGWByID(previousExpMapID);

    if(!gw) return this.player.bot.logger.log(`[EXP MODULE] Cannot find gw!`, 'error');

    if(!previousExpMapID) return this.player.bot.logger.log('[EXP MODULE] Cannot go to previous exp map. Map is not found', 'error');


    this.currentTarget = { x: gw[0], y: gw[1] }

    await this.player.movementManager.goTo(gw[0], gw[1], {

         isGoToGW: true

    });

  }

  stop () {

    this.bools.isOn = false;

    this.player.bot.logger.log('[EXP MODULE] Moduł został zatrzymany!', 'warning');

  }

  start () {
  
    this.bools.isOn = true;

    if(!this.selectedExp) {
 
      this.player.bot.logger.log('Brak wybranego expa', 'warning');

      return;

    }

    if(this.selectedExp.expMaps.includes(this.player.map.data.id)) {

      this.setNewTarget();

    }

    else if(this.selectedExp.tpMaps.includes(this.player.map.data.id)) {
     
      this.tpToExp();

    }

    else if(this.selectedExp.goToExpMaps.includes(this.player.map.data.id) ) {

      this.goToExp();

    }

    else {

      this.bools.isOn = false;

      console.log('[EXP MODULE] start err');

    }


  }

}
