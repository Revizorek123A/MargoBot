const Item = require('./Item.js');

module.exports = class ItemManager {

    constructor (player) {

    	  this.player = player;
    
        this.items = [];

    }

    getById (id) {

    	
    }

    getByName (names) {
   
      return this.items.filter(item => {

      	return names.includes(item.data.name) ? item : ''

      });

    }

    async handlePacketFromServer (data) {

       for(var i in data) {

       	const item = data[i];

        item.id = i;

   //    	if(item.del === '1') return this.removeItemById(i); 

       	let __item = new Item(item, this.player);

       	this.items.push(__item);

       }


    }

}