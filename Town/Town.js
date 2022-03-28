const OtherManager = require('../Other/OtherManager.js');

const NpcManager = require('../Npc/NpcManager.js');

module.exports = class Town {

   constructor (data, player) {

    this.player = player;

   	this.data = data;
    
    this.cols = null;

    this.getaways = {};

    this.otherManager = new OtherManager(this);

    this.npcManager   = new NpcManager(this);

    this.gwIds = {};

   }

   getGWByID (id) {
     

     for ( var i in this.gwIds ) {
         
         if(id == i) {

            return this.gwIds[i].split('.');
             
         }

     }

   }

   newGetaway (d2) {

    let gwids = [];

    for (var k = 0; k < d2.length; k += 5) {

      this.gwIds[d2[k]] = d2[k + 1] + '.' + d2[k + 2];

    }

   }

   parseCols (c) {

    let idx = 0,
        tc = [];

    for (let i = 0; i < c.length; i++) {
      
      var a = c.charCodeAt(i);
      
      if (a > 95 && a < 123) for (var j = 95; j < a; j++) {
        for (var k = 0; k < 6; k++) {
          tc[idx++] = '0';
        }
      } else {
        a -= 32;

        for (var j = 0; j < 6; j++) {
          tc[idx++] = a & Math.pow(2, j) ? '1' : '0';
        }
      }
    }

    this.cols = tc.join('');

   }

}