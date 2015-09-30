var fs = require('fs');
	
var abysmalAAx = 0.25,
abysmalFleetAAx = 0.5,
itemType3_AAx = [ // *1
	0,
	0,//1 小口径主炮
	0,//2 中
	0,//3 大
	0,//4 副炮
	0,0,0,0,0,0,
	3,//11 电探
	0,//12 340
	0,0,
	6,//15 对空机枪
	4,//16 高脚炮
	0,0,0,0,0,0,0,0,0,0,0,0,0,
	4,//30 高射装置
	0,0,0,0,0
],
itemType3_Spec_AAx = [
	0
],
itemType3_FleetAAx = [ // should / 20
	0,
	4,//1 小口径主炮
	4,//2 中
	4,//3 大
	4,//4 副炮
	4,4,4,4,4,4,
	8,//11 电探
	4,//12 340
	4,4,
	4,//15 对空机枪
	7,//16 高脚炮
	4,4,4,4,4,4,4,4,4,4,4,4,4,
	4,//30 高射装置
	4,4,4,4,4
],
itemType3_Spec_FleetAAx = [
	4
],
formation_FleetAAx = [ // should / 5
	0,
	5,
	6,
	8,
	5,
	5
];

var convertRoute = function(route){
	return route.map(function(point){
		return point.fleets.map(function(fleet){
			return [
				(point.ad || fleet.ad || 4),
				cal_fleetAA(fleet.ships, fleet.formation)
			].concat(
				fleet.ships.map(function(ship){
					return cal_AA(ship);
				})
			);
		});
	});
};
	
var	cal_fleetAA = function(ships, formation){
	return Math.floor(ships.reduce(function(shipFleetAA_sum, shipId){
		return shipFleetAA_sum += itemsSum(itemType3_FleetAAx, itemType3_Spec_FleetAAx, shipId)/20;
	},0)/20)* formation_FleetAAx[formation] * 2 / 5;
},
cal_AA = function(shipId){
	if(!verifySID(shipId))return 0;
	var aa = parseInt(_sh[shipId][9]);
	if(aa === 0 && _sh[shipId][1].match('潜水')===null && _sh[shipId][1].match('輸送')===null){
		if(_saa[shipId] === undefined){
	 	    console.log('WARN|datalost AA: shipId == '+ shipId + ' , shipName == '+ _sh[shipId][1]);
		    return 0;
		}
		else aa = _saa[shipId];
	}
	return Math.floor(Math.sqrt(aa)*2) + itemsSum(itemType3_AAx, itemType3_Spec_AAx, shipId);
},
itemsSum = function(X, X2, shipId){
	if(!verifySID(shipId))return 0;
	return _sh[shipId].slice(24,28).reduce(function(prev, itemId){
		if(itemId == -1)
			return prev;
			
		var item = _si[itemId], X_val;
		if(item.api_type[3] == 16 && item.api_name.match('単装') !== null)
			X_val = X2[0];
		else X_val = X[item.api_type[3]];
		
		return prev += item.api_tyku * X_val;
	},0);
},
verifySID = function(shipId){
	if(shipId == -1)
		return false;
	if(_sh[shipId] == undefined){
		console.log('WARN:datalost: shipId == ' + shipId);
		return false;
	}
	return true;
}

var dir = fs.readdirSync('../asset/enemy_maps'),
	_si = require('../asset/slotitems.json'),
	_saa = require('../asset/shipAA_append.json'),
    _sh = new Array(1000);
	
	fs.readFileSync('../asset/ShipParameterRecord.csv','utf-8').split('\n')
	.forEach(function(ship){
		var row = ship.split(',');
		_sh[row[0]] = row;
	});

var res = [];
for (var i in dir){
	var title = dir[i],
	    desc = title.replace('.json',''),
		content = fs.readFileSync('../asset/enemy_maps/' + title, 'utf-8');
	res.push({
		"formation":convertRoute(JSON.parse(content)),
		"desc":desc
	});
}
fs.writeFileSync('../asset/enemy_aa.json', JSON.stringify(res));


