Object.filter = (obj, predicate) => 
    Object.keys(obj)
          .filter( key => predicate(obj[key]) )
          .reduce( (res, key) => (res[key] = obj[key], res), {} );

Math.decimal = function(a, b) {

  const c = Math.pow(10, b);
  const d = Math.round(a * c) / c;

  return d;
}



module.exports = class Helpers {
   
   static getCurrentTime () {

    const date = new Date;

    var seconds = date.getSeconds()

    var minutes = date.getMinutes()

    var hour = date.getHours()

    var miliseconds = date.getMilliseconds();

    return `${hour}:${minutes}:${seconds}:${miliseconds}`;

   }

   static removeURLParameter(url, parameter) {

    var urlparts = url.split('?');   
    
    if (urlparts.length >= 2) {

        var prefix = encodeURIComponent(parameter) + '=';
        var pars = urlparts[1].split(/[&;]/g);

        for (var i = pars.length; i-- > 0;) {    

            if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
                pars.splice(i, 1);
            }
        }

        return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
    }

    return url;
}

   static getValueFromArrayByIndex (index, data) {

    return data[index];

   }

  static dateAdd (date, interval, units) {

    if(!(date instanceof Date)) return undefined;

    var ret = new Date(date);

    var checkRollover = function() { if(ret.getDate() != date.getDate()) ret.setDate(0);};

    switch(String(interval).toLowerCase()) {

      case 'year'   :  ret.setFullYear(ret.getFullYear() + units); checkRollover();  break;
      case 'quarter':  ret.setMonth(ret.getMonth() + 3*units); checkRollover();  break;
      case 'month'  :  ret.setMonth(ret.getMonth() + units); checkRollover();  break;
      case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
      case 'day'    :  ret.setDate(ret.getDate() + units);  break;
      case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
      case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
      case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;

      default       :  ret = undefined;  break;

    }

    return new Date(ret).getTime();

  }

   static getNumberFromString (string) {
  

    if(!string) return 0;

    var numb = string.match(/\d/g);

    if(!numb) return 0;

    numb = numb.join("");

    return parseInt(numb);
    

   }

   static isJsonString (str) {

      try {

        JSON.parse(str);

      } catch (e) {

        return false;

      }

      return true;
    }

   static getTS () {
     
     return new Date().getTime();

   }

   static generateRandomNumberMinMax (array) {

    return Math.floor(Math.random() * (array[1] - array[0] + 1)) + array[0];

   }
   
   // TEMP!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   static timeTo (future) {

    var delta = Math.abs(future - this.getTS() ) / 1000;

    if(delta <= 0) return [0, 0, 0];

    var days = Math.floor(delta / 86400);

    delta -= days * 86400;

    var hours = Math.floor(delta / 3600) % 24;

    delta -= hours * 3600;

    var minutes = Math.floor(delta / 60) % 60;

    delta -= minutes * 60;

    var seconds = Math.abs(delta % 60); 

    return [ hours, minutes, seconds ]; 

   }

   static getElapsedTime (time) {

    return Math.abs(time - this.getTS());

   }

   static getTS () {
    
    return Math.floor(new Date().getTime() / 1000)

   }

}
