var enemy_aa = require('../asset/enemy_aa.json');
var enemy = enemy_aa[0].formation[3][0],
sdPercent = function (gridSz, wAA){
	return Math.floor(gridSz* Math.floor(wAA * 0.9) / 360);
},
sdNumeric = function (wAA, fleetAA){
	return Math.floor((fleetAA + wAA) * 0.1);
};

for(var gridSz = 1; gridSz <= 46; gridSz ++){
	for(var i = 2; i < enemy.length; ++i){
		var sd_p = sdPercent(gridSz, enemy[i]),
			sd_n = sdNumeric(enemy[i], enemy[1]);
			
		console.log(gridSz+': ' + sd_n + ' ' + sd_p + ' ' + (sd_n+sd_p));
	}
}
