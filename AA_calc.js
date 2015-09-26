var fs = require('fs');

var slotitems = JSON.parse(fs.readFileSync('slotitems.json',{encoding: 'utf8'})),
	ships = JSON.parse(fs.readFileSync('ships.json', {encoding:'utf8'}));
	
