function gridSdCalc(answer, gridRange, enemy){
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
			console.log(array);
			var range = array.length;
			if(range == 0)
				return [];
			var answer = array.reduce(function(prev,next){
				for(var i in prev){
					prev[i][0] += next[i][0];
					prev[i][1] += next[i][1];
				}
				return prev;
			});
			for(var i in answer){
				if(answer[i][0] != 0){
					answer[i][0] /= range;
				}
				if(answer[i][1] != 0){
					answer[i][1] /= range;
				}
			}
			console.log(answer);
			return clone(answer);
		},
		S0Calc = function(battleId, gridSz){
			console.log('s0->' + battleId + ' ' + gridSz);	
			if(memoryS0[battleId][gridSz] !== undefined){
				console.log('s0<- m');
				return clone(memoryS0[battleId][gridSz]);
			}
			
			var sum = [];
			for(var i = 0; i < enemy[battleId].length; i++){
				sum.push(S1Calc(battleId, i, gridSz));
			}
			var answer = reducer(sum);
			memoryS0[battleId][gridSz] = clone(answer);
			console.log('s0<-');
			return answer;
		},
		S1Calc = function(battleId, formatId, gridSz){
			console.log('s1->' + battleId + ' ' + formatId + ' ' + gridSz);	
			if(memoryS1[battleId][formatId][gridSz] !== undefined){
				console.log('s1<- m');
				return clone(memoryS1[battleId][formatId][gridSz]);
			}
			
			var airDomain = enemy[battleId][formatId][0];
			var dRange = S1SdRate[airDomain][0],
				uRange = S1SdRate[airDomain][1];
			
			var sum = [];
			for(var i = uRange; i >= dRange; --i){
				sum.push(S2Calc(battleId, formatId, gridSz - Math.floor(i * gridSz / 256)));
			}
			var answer = reducer(sum);
			memoryS1[battleId][formatId][gridSz] = clone(answer);
			console.log('s1<-');
			return answer;
		},
		S2Calc = function(battleId, formatId, gridSz){
			console.log('s2->' + battleId + ' ' + formatId + ' ' + gridSz);	
			if(memoryS2[battleId][formatId][gridSz] !== undefined){
				console.log('s2<- m');
				return clone(memoryS2[battleId][formatId][gridSz]);
			}
			
			var enemyIdx = enemy[battleId][formatId].length,
				sum = [];
			for(var i = 2; i < enemyIdx; ++i){
				var sd_p = sdPercent(gridSz, enemy[battleId][formatId][i]),
					sd_n = sdNumeric(enemy[battleId][formatId][i], enemy[battleId][formatId][1]);
				
				sum.push(S3Calc(battleId, gridSz));
				sum.push(S3Calc(battleId, gridSz - sd_p));
				sum.push(S3Calc(battleId, gridSz - sd_n));
				sum.push(S3Calc(battleId, gridSz - sd_p - sd_n));
			}
			var answer = reducer(sum);
			memoryS2[battleId][formatId][gridSz] = clone(answer);
			console.log('s2<-');
			return answer;
		},
		S3Calc = function(battleId, gridSz){
			console.log('s3->' + battleId + ' ' + gridSz);	
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
			console.log('battle:'+battleId)
			console.log(answer);
			console.log('s3<-');
			return answer;//,,,[1,3],[2,4],[0,0],[0,0]
		},
		BATTLE_N = 10,
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
	
	for(var i = 0; i <= gridRange; i++){
		answer[i] = S0Calc(0,i);
	}
}

var enemy_aa = require('../asset/enemy_aa/6-2下路B-I-K(超索敌F拐下).json');
var answer = [];
gridSdCalc(answer, 50, enemy_aa.formation.map(function(point){
	return point.map(function(format){
		format[0] = 0;
		return format;
	});
}
));//>100 4-5
console.log(answer);
						
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