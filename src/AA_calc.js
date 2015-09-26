var fs = require('fs');
var _si = require('../asset/slotitems.json'),
    _sh = require('../asset/ships.json');

var convertRoute = function(points){
		var newPoints = [];
		for(var i in points)
			newPoints[i] = convertPoint(points[i]);
		return newPoints;
	},
	convertPoint = function(point){
		var newPoint = [];
		for(var i in point.fleets){
			newPoint[i] = convertFleet(point.fleets[i]);
		}
		return newPoint;
	},
	convertFleet = function(fleet){
		var newFleet = [
			null,
			cal_fleetAA(fleet.ships, fleet.formation)
		];
		for(var i in fleet.ships)
			newFleet.push(cal_AA(fleet.ships[i]));
	};
	
var	cal_fleetAA = function(ships, formation){
		for(var i in ships){
			cal_soloFleetAA
		}
	}

var dir = fs.readdirSync('../asset/enemy_maps');

var result = [];
for (var i in dir){
	var title = dir[i],
	    desc = title.replace('json',''),
		content = fs.readFileSync('../asset/enemy_maps/' + title, 'utf-8');
	result.push({
		"formation":convertRoute(JSON.parse(content)),
		"desc":desc
	})
}