var fs = require('fs');

var list = fs.readdirSync('../output/meta/');

list.forEach(function(fileName){
	var half_down = new Array(100), full_down = new Array(100), onethird_down = new Array(100), median = new Array(100), exps = new Array(100), res = [];
	for(var i = 0;i < 100;i++){
		half_down[i] = 0;
		exps[i] = 0;
		onethird_down[i] = 0;
	}
	var content = fs.readFileSync('../output/meta/'+fileName,'utf-8').split('\n');
	for(var i = 0; i < content.length; i++){
		var row = content[i].split(','), sum = 0, flag = true;
		for(var j = 0;j < row.length; j++){
			var num = parseFloat(row[j]);
			sum += num;
			if(flag && sum >= 0.5){
				median[i] = j;
				flag = false;
			}
			
			if(j*2<=i)
				half_down[i] += num;
				
			if(j*3<=i*2)
				onethird_down[i] += num;
				
			exps[i] += Math.sqrt(j) * num;
		}
		full_down[i] = parseFloat(row[0]);
		
		res.push(full_down[i]+','+half_down[i]+','+onethird_down[i]+','+median[i]+','+exps[i]);
	}
	fs.writeFile('../output/'+fileName,res.join('\n'));
});