var fs = require('fs');

function gridSdCalc(gridRange, enemy){
	var S1SdRate = [
			[7,15],
			[20,45],
			[30,75],
			[45,105],
			[65,150]
		],
		clone = function(obj){
			var newObj = new Array(obj.length);
			for(var i in obj){
				newObj[i] = obj[i].slice(0);
			}
			return newObj;
		},
		sdPercent = function (gridSz, wAA){
			return Math.floor(gridSz * wAA / 400);
		},
		sdNumeric = function (wAA, fleetAA){
			return Math.floor((fleetAA + wAA) * 0.1);
		},
		reducer = function(array){
			var range = array.length;
			var answer = array.reduce(function(prev,next){
				for(var i in prev){
					prev[i][0] += next[i][0];
					prev[i][1] += next[i][1];
				}
				return prev;
			});
			for(var i in answer){
				if(answer[i][0] != 0)
					answer[i][0] /= range;
				if(answer[i][1] != 0)
					answer[i][1] /= range;
			}
			return answer;
		},
		S0Calc = function(battleId, gridSz){
			if(memoryS0[battleId][gridSz] !== undefined)
				return clone(memoryS0[battleId][gridSz]);
			
			var sum = [];
			for(var i = 0; i < enemy[battleId].length; i++)
				sum.push(S1Calc(battleId, i, gridSz));
			var answer = reducer(sum);
			
			memoryS0[battleId][gridSz] = clone(answer);
			return answer;
		},
		S1Calc = function(battleId, formatId, gridSz){
			if(memoryS1[battleId][formatId][gridSz] !== undefined)
				return clone(memoryS1[battleId][formatId][gridSz]);
			
			var airDomain = enemy[battleId][formatId][0],
			    dRange = S1SdRate[airDomain][0],
				uRange = S1SdRate[airDomain][1],
				sum = [];
			for(var i = uRange; i >= dRange; --i)
				sum.push(S2Calc(battleId, formatId, gridSz - Math.floor(i * gridSz / 256)));
			var answer = reducer(sum);
			
			memoryS1[battleId][formatId][gridSz] = clone(answer);
			return answer;
		},
		S2Calc = function(battleId, formatId, gridSz){
			if(memoryS2[battleId][formatId][gridSz] !== undefined)
				return clone(memoryS2[battleId][formatId][gridSz]);
			
			var sum = [];
			for(var i = 2; i < enemy[battleId][formatId].length; ++i){
				var sd_p = sdPercent(gridSz, enemy[battleId][formatId][i]),
					sd_n = sdNumeric(enemy[battleId][formatId][i], enemy[battleId][formatId][1]);
				sum.push(S3Calc(battleId, gridSz));
				sum.push(S3Calc(battleId, gridSz - sd_p));
				sum.push(S3Calc(battleId, gridSz - sd_n));
				sum.push(S3Calc(battleId, gridSz - sd_p - sd_n));
			}
			var answer = reducer(sum);
			
			memoryS2[battleId][formatId][gridSz] = clone(answer);
			return answer;
		},
		S3Calc = function(battleId, gridSz){
			var answer, battleN = enemy.length;
			if(gridSz > 0 && battleId + 1 < battleN){
				answer = S0Calc(battleId + 1, gridSz);
			}
			else{
				answer = new Array(battleN);
				for(var i = 0; i < battleN; i++){
					answer[i] = [0,0].slice(0);
				}
			}
			answer[battleId] = gridSz > 0 ? [1, Math.sqrt(gridSz)] : [0, 0];
			return answer;//,,,[1,3],[2,4],[0,0],[0,0]
		};
		
	var BATTLE_N = 10,
		FORMA_N = 10,
		GRID_N = 100,
		memoryS0 = new Array(BATTLE_N),
		memoryS1 = new Array(BATTLE_N),
		memoryS2 = new Array(BATTLE_N);
	for(var i = 0; i < BATTLE_N; i++){
		memoryS0[i] = new Array(GRID_N);
		memoryS1[i] = new Array(FORMA_N);
		memoryS2[i] = new Array(FORMA_N);
		for(var j = 0; j < FORMA_N; j++){
			memoryS1[i][j] = new Array(GRID_N);
			memoryS2[i][j] = new Array(GRID_N);
		}
	}
	
	var answer = new Array(50);
	for(var i = 0; i <= gridRange; i++)
		answer[i] = S0Calc(0,i);
	return answer;
}

var enemy_aa = require('../asset/enemy_aa.json');
enemy_aa.forEach(function(route){
	var answer = gridSdCalc(50, route.formation.map(function(point){
		return point.map(function(format){
			format[0] = 4;
			return format;
		});
	}
	));
	
	console.log(answer);
	
	fs.writeFile('../output/'+route.desc+'.csv',
		'extincted_chance,expect_damage\n'.concat( 
			answer.map(function(row){
				return row.map(function(tuple){
					return tuple.join(',');
				}).join(',');
			}).join('\n')
		)
	);
});


						
// var enemy = [ //route
// 	[            	//mappoint_1
//		[       		//format_1
//			airDomain, 0: 丧 1:劣 2:均 3:优 4:确 
// 			fleetAA,
// 			wAA1,
// 			wAA2,
// 			wAA3,
// 			...
//		],
//		[],     	 	//format_2
//		[]				//format_3
// 	],
// 	[],				//mappoint_2
// 	[]				//mappoint_3
// ];