const AStar = require('../Algorithms/AStartAlgorithm.js');

module.exports = class MovementManager {

  constructor (player) {

    this.player = player;

    this.bools = {

      roadGeneratedWithoutNpcsCols: false,
  
      isMoving: false,

      isGoToGW: false

    };

    this.road = [];

    this.speed = 1.5; 

    this.target = {};

  }

  sendStepRequest (step) {

    return new Promise( async (resolve, reject) => {

          try {

            let mtsTS = Date.now() / 1000 + 0.3;

            console.log(mtsTS - this.player.ev)

            const res = await this.player.bot.requestManager.sendRequest({

              payload: `_&ml=${ step.x },${ step.y }&mts=${ mtsTS } `

            }, this.player);

//            console.log(res)

            if(res.back == 1) return reject();
            
            else if(res.h.x != step.x && res.h.y != step.y) return reject();
            
            this.player.data.x = res.h.x;

            this.player.data.y = res.h.y;

            resolve(true);


          } catch(e) { }

        });

  }
  
  async walkProcess (road) {

    return new Promise( async (resolve, reject) => {

        try {

          for(const step of road) {
            
            await this.sendStepRequest(step);

            await this.player.bot.sleep(this.speed * 100);

          }

          resolve();

        } catch(e) {

          reject(e);

        }


    });

  }
  
  // temp
  emitRoadToClient () {

    let road = [];

    for(const step of this.road) {

      road.push({x: step.x, y: step.y });

    }

    this.player.emit('road', road);

  }

  async goTo (x, y, options = {}) {

     this.road = this.getRoad(x, y).reverse() || null;
    
     // temp
     this.emitRoadToClient();

     if(options.hasOwnProperty('isGoToGW')) {

         this.bools.isGoToGW = options.isGoToGW;

     }

     if(options.hasOwnProperty('target')) {

         this.target = options.target;

     }

     return new Promise( async (resolve, reject) => {
     
          try {

            this.bools.isMoving = true;
            
            const stepResponse = await this.walkProcess(this.road);  

            this.bools.isMoving = false;    
           
            // Jeżeli idzie do przejscia
            if(this.bools.isGoToGW) {
   
              await this.player.bot.requestManager.sendRequest({

                payload: 'walk'

              }, this.player);


            }
            

            resolve();

          } catch(e) {

            console.log(e)

              console.log('PONUW!!!!!!!!!!!!!! XDD')

          }
    
     });

  }


  getRoad (x, y, fromX = this.player.data.x, fromY = this.player.data.y) {

    this.bools.roadGeneratedWithoutNpcsCols = false;


    return new AStar(this.player.map.cols, this.player.map.data.x, this.player.map.data.y, {x: fromX, y: fromY}, {x: x, y: y}, this.player.map.npcManager.cols).anotherFindPath();

  }

  getRoadWithoutNpcCols (x, y) {

    this.bools.roadGeneratedWithoutNpcsCols = true;

    return new AStar(margoBot.map.cols, margoBot.map.data.x, margoBot.map.data.y, {x: hero.x, y: hero.y}, {x: x, y: y}, [] ).anotherFindPath();

  }

}

