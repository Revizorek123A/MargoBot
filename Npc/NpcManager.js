const Npc   = require('./Npc.js');
const AStar = require('../Algorithms/AStartAlgorithm.js');

module.exports = class NpcManager {

   constructor (map) {

       this.map = map;

       this.npcs = {}; 

       this.cols = {};

   }

   getNearestNpcFromTargets (targets) {

    let temp = [];

    if(targets.length === 1) return targets[0];

    targets.forEach((target, index) => {

      const road = this.map.player.movementManager.getRoad(target.data.x, target.data.y); 

      if(!road) return;

      temp.push({

        target: target,
        roadLength: road.length

      });

    });
    
    if(temp.length === 0) return;

    const selected = temp.reduce((res, obj) => {

      return (obj.roadLength < res.roadLength) ? obj : res;

    });

    return selected.target; 

  }

   getByNames (names) {
    
     var o = [];

     for(var i in this.npcs) {

      const obj = this.npcs[i];

      if(this.map.player.movementManager.getRoad(obj.data.x, obj.data.y)) {

        if(names.includes(obj.data.nick)) o.push(obj);

      }

     }

     return o; 

   }

   getById (id) {

    this.npcs = this.npcs.filter(obj => {

      return obj.npc.id == id;

    });

   }
    
   // @param {id} string - Id of margo npc
   checkNpcToKillIsAlive (id) {

      const npcToKill = this.getNpcToKill();


      for(const npc of npcToKill) {

        console.log(id, npc.npc.id)

        if(npc.toKill === true && npc.npc.id == id) {

             console.log('cel został zabity');

             console.log(npc);

             return;

        }

      }
 
   }

   getNpcsByGroupID (grp) {

      return this.npcs.filter(npc => {

         return npc.npc.grp === grp

      });

   }

   removeNpcByMargoID (id) {

    this.npcs = this.npcs.filter(obj => {

      return obj.npc.id != id;

    });

  }

   getNpcToKill () {

    return;

      return this.npcs.filter(npc => { return npc.toKill === true ? npc.npc : false } );

   }

   onDeleteEvent (npcID) {


   }

   handleNpcIsDel (npcID) {

    this.checkNpcToKillIsAlive(npcID);

    this.removeNpcByMargoID(npcID);

   }

   handlePacketFromServer (player, data) {

    var iterator = -1;

    for(var i in data) {

      iterator++;

    	const obj = data[i];

      if(obj.type != 4 && obj.type != 7) this.cols[obj.x + 256 * obj.y] = true;

      if(obj.del) {


        return;

      }

      obj.id = i;

      obj.index = iterator;
        
      let npc = new Npc(obj);

      this.npcs[iterator] = npc;

      switch(player.selectedModuleName) {

        case 'exp':
 
        if(player.selectedModule.selectedExp.targets.includes(npc.data.nick)) {
       
           player.selectedModule.targets.push(npc);

        }

        break;

      }

    }

   }

   removeCol (npc) {
  
     delete this.cols[npc.npc.x + 256 * npc.npc.y];

   }

   removeNpcByIndex (index) {

    delete this.npcs[index];

   }


}