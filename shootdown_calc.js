// var enemy = [
// 	[
//		airDomain, 0: 丧 1:劣 2: 均 3:优 4:确 
// 		fleetAA,
// 		wAA1,
// 		wAA2,
// 		wAA3,
// 		...
// 	],
// 	[],
// 	[]	
// ];

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
		sdNumeric = function (gridSz, wAA, fleetAA){
			return Math.floor((fleetAA + wAA) * 0.1);
		},
		S1Calc = function(battleId, gridSz){			
			if(gridSz <= 0){
				return 0;
			}
			else if(battleId == enemy.length){
				return 1;
			}
			else if(memoryS1[battleId][gridSz] !== undefined)
				return memoryS1[battleId][gridSz];
			
			var airDomain = enemy[battleId][0];
			var dRange = Math.floor(S1SdRate[airDomain][0] * gridSz / 256),
				uRange = Math.floor(S1SdRate[airDomain][1] * gridSz / 256);
			
			var range = uRange - dRange + 1, sum = 0;
			for(var i = uRange; i >= dRange; --i){
				sum += S2Calc(battleId, gridSz - i);
			}
			var answer = sum / range;
			
			//memorize
			memoryS1[battleId][gridSz] = answer;
			return answer;
		},
		S2Calc = function(battleId, gridSz){
			if(gridSz <= 0){
				return 0;
			}
			else if(memoryS2[battleId][gridSz] !== undefined)
				return memoryS2[battleId][gridSz];
			
			var range = enemy[battleId].length - 2,
				enemyIdx = enemy[battleId].length,
				sum = 0;
			for(var i = 2; i < enemyIdx; ++i){
				var sd_p = sdPercent(gridSz, enemy[battleId][i]),
					sd_n = sdNumeric(gridSz, enemy[battleId][i], enemy[battleId][1]);
				
				sum += S1Calc(battleId+1, gridSz);
				sum += S1Calc(battleId+1, gridSz - sd_p);
				sum += S1Calc(battleId+1, gridSz - sd_n);
				sum += S1Calc(battleId+1, gridSz - sd_p - sd_n);
			}
			var answer = sum / (range * 4);
			
			memoryS2[battleId][gridSz] = answer;
			return answer;
		},
		memoryS1 = [],
		memoryS2 = [];
		
	for(var i = 0; i < enemy.length(); i++){
		memoryS1.push(new Array(gridRange + 1));
	}
	
	for(var i = 0; i <= gridRange; i++){
		answer[i] = S1Calc(0,i);
	}
}

var answer = [];
gridSdCalc(answer, 50, [
							[],
							[],
							[]
						]);