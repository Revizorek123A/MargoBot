module.exports = class Item {

	constructor (data, owner) {

		this.data = data;

		this.owner = owner; // player xdddddddddd

	}

	use () {

     return new Promise( async (resolve, reject) => {

        this.owner.bot.logger.log(`Trwa używanie itemku o ID ${ this.data.id }`)

        let res = await this.owner.bot.requestManager.sendRequest({

        	payload: `moveitem&id=${ this.data.id }&st=1`
        
        }, this.owner);
        
        if(!res.hasOwnProperty('item')) return reject(res);

        resolve();

     });

	}

	remove () {

		return new Promise((resolve, reject) => {

        let res = this.owner.bot.requestManager.sendRequest({

        	payload: `moveitem&id=${ this.data.id }&st=1`
        
        }, this.owner);



        resolve();

     });

	}
	
}

