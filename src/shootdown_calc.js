function gridSdCalc(answer, gridRange, enemy){
	var S1SdRate = [
			[7,15],
			[20,45],
			[30,75],
			[45,105],
			[65,150]
		],
		sdPercent = function (gridSz, wAA){
			return Math.floor(gridSz * wAA / 400);
		},
		sdNumeric = function (wAA, fleetAA){
			return Math.floor((fleetAA + wAA) * 0.1);
		},
		reducer = function(array, range){
			var answer = array.reduce(function(prev,next){
				prev[0] += next[0];
				prev[1] += next[1];
			},new Array(2));
			answer[0] /= range;
			answer[1] /= range;
			
			return answer;
		},
		S0Calc = function(battleId, gridSz){
			if(memoryS0[battleId][gridSz] !== undefined)
				return memoryS0[battleId][gridSz];
			
			var sum = [];
			for(var i = 0; i < enemy[battleId].length; --i){
				sum.push(S1Calc(battleId, i, gridSz));
			}
			var answer = reducer(sum, enemy[battleId].length);
			memoryS0[battleId][gridSz] = answer;
			return answer;
		},
		S1Calc = function(battleId, formatId, gridSz){			
			if(memoryS1[battleId][gridSz] !== undefined)
				return memoryS1[battleId][gridSz];
			
			var airDomain = enemy[battleId][formatId][0];
			var dRange = S1SdRate[airDomain][0],
				uRange = S1SdRate[airDomain][1];
			
			var range = uRange - dRange + 1, sum = [];
			for(var i = uRange; i >= dRange; --i){
				sum.push(S2Calc(battleId, formatId, gridSz - Math.floor(i * gridSz / 256)));
			}
			var answer = reducer(sum, range);
			memoryS1[battleId][formatId][gridSz] = answer;
			return answer;
		},
		S2Calc = function(battleId, formatId, gridSz){
			if(memoryS2[battleId][formatId][gridSz] !== undefined)
				return memoryS2[battleId][formatId][gridSz];
			
			var range = (enemy[battleId][formatId].length - 2) * 4,
				enemyIdx = enemy[battleId][formatId].length,
				sum = new Array(enemyIdx * 4);
			for(var i = 2; i < enemyIdx; ++i){
				var sd_p = sdPercent(gridSz, enemy[battleId][formatId][i]),
					sd_n = sdNumeric(enemy[battleId][formatId][i], enemy[battleId][formatId][1]);
				
				sum.push(S3Calc(battleId, gridSz));
				sum.push(S3Calc(battleId, gridSz - sd_p));
				sum.push(S3Calc(battleId, gridSz - sd_n));
				sum.push(S3Calc(battleId, gridSz - sd_p - sd_n));
			}
			var answer = reducer(sum, range);
			memoryS2[battleId][formatId][gridSz] = answer;
			return answer;
		},
		S3Calc = function(battleId, gridSz){
			var answer, battleN = enemy.length;
			if(gridSz > 0 && battleId + 1 < battleN){
				answer = S0Calc(battleId + 1, gridSz);
			}
			else{
				answer = new Array(battleN);
				for(var i = battleId + 1; i < battleN; i++){
					answer[i] = [0,0];
				}
			}
			answer[battleId] = gridSz > 0 ? [1, Math.sqrt(gridSz)] : [0, 0];
			return answer;//,,,[1,3],[2,4],[0,0],[0,0]
		},
		memoryS0 = [],
		memoryS1 = [],
		memoryS2 = [];
		
	for(var i = 0; i < enemy.length; i++){
		memoryS1.push(new Array(gridRange + 1));
	}
	
	for(var i = 0; i <= gridRange; i++){
		answer[i] = S0Calc(0,i);
	}
}

var answer = [];
gridSdCalc(answer, 50, getAA([
								[
									[4,],
									[4,],
									[4,]
								],
								[
									[4,],
									[4,],
									[4,],
									[4,]
								],
								[
									[4,],
									[4,]
								],
								[
									[3,],
									[3,],
									[3,],
									[3,]
								]
							]));//>100 4-5
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