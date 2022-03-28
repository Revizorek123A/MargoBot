


<h1>KONFIGURACJA EXPOWISKA</h1>
  
  <span>
   Aby dodać nowy expowisko, lub zedytować wchodzimy w folder Modules/ExpModules/ExpsList.js
    

       	'name': 'Nazwa expowiska', 
       	'targets': ['Potworek 1', Potworek 2'], 
       	'goToExpMaps': [ID_MAPY, ID_MAPY], // Droga na expowisko 
       	'expMaps': [ID_MAPY, ID_MAPY],  // ID map do expienia
       	'tpMaps': [ID_MAPY] // Mapa teleportacji // nie dostępne
  
       W pliku Modules/ExpModule/ExpModule.js zmieniamy kod na taki
  
       this.selectedExp = expsList.filter(exp => { return exp.name == 'NAZWA_EXPOWISKA' })[0] || {};
  
  </span>




<h1>JAK URUCHOMIĆ BOTA</h1>
  
  <span>
   Plik o nazwie client.js dodajemy do tampermonkey. Naciskamy guzik "połącz z botem" 
  </span>

Kod jest na bardzo wczesnym etapie tworzenia
