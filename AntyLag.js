class AntyLag {
   
   constructor () {
      
      this.lastAction = new Object;

      this.threadIntervalHandler = null;

      this.lagMeterData = [];

      this.walkHistory = [];

      this.bools = {

        dontRefreshAfterAwake: false

      }

   }

   setCurrentAction (name) {

    this.lastAction = {

      action: name, 

      time: Helpers.getTS()

    }

   }

   getCurrentAction () {


   }

   getPreviousAction () {


   }

   removeHistory () {
    

   }

   checkLagmeter () {
    
    const ms = Helpers.getNumberFromString($('#lagmeter').attr('tip'));

    //this.lagMeterData.push(msg);


   }

   
   thread () {
    
    this.threadIntervalHandler =  setInterval(() => {
        
      this.checkLastAction();

      this.checkLagmeter();

    }, 1000)

   }

   crash () {

    /*let obstaclesOnRoad = margoBot.getObstaclesOnRoad();

    let nearestNPC = margoBot.getNearestNPCFromTargets(obstaclesOnRoad);

    nearestNPC.target.type = 'kill';

    margoBot.getSelectedModule().setNewTarget(nearestNPC);

    margoBot.getSelectedModule().bools.repeatStartModuleAfterBattle = true;


*/
   // window.location.reload();

   }

   checkLastAction () {
    
     const elapsedTime =  Helpers.getElapsedTime(this.lastAction.time);

     var cs = 5;

     if(g.dead || g.battle || this.bools.dontRefreshAfterAwake || !margoBot.bools.isOn) return; 
     
     margoBot.log(`[ANTY LAG] elapsedTime: ${ elapsedTime }`)

     if(elapsedTime > cs) {
     
       this.crash();

     }

   }

   start () {
    
   // this.thread();

   }

}
