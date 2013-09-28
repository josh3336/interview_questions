// given a string like '397'
// uglify like below and evalute if  > 10 increment solution
// 3+9+7 true
// 39+7  true
// 3-9+7 false 
// uglify('34',5) ===  4
//  >(3+4)
//  >(4+3)
//  >(43)
//  >(34)

var uglify = function(str,amount){
	var operands = ['+','-','_'];
	var solutions = 0;
	var recurse = function(word,wordleft){
		var wordcopy,wordleftcopy,wordandop;
		for (var i = 0; i < wordleft.length; i++){
			wordcopy = word;
			wordleftcopy = wordleft
			wordcopy += wordleft[i]
			wordleftcopy = wordleftcopy.slice(0,i).concat(wordleftcopy.slice(i+1))
			if(wordleftcopy.length != 0){
				for (var j = 0; j < operands.length; j++){
					wordandop = wordcopy
					wordandop += operands[j]
					if(wordleftcopy.length > 0){
						recurse(wordandop,wordleftcopy)
					}
				}
			}
			else{
				var computed = compute(wordcopy)
				if(computed > amount){
					solutions += 1;
				}
			}
		}

		
	}
	recurse('',str)
	return solutions;
}

var compute = function(str){
	var currentNum;
	str = str.replace('_','');
	currentNum = ''
	total = 0;
	for(var i = 0; i < str.length; i++){
		if (!(str[i] === '+' || str[i] === '-')){
			currentNum += str[i]
		}
		else{
			if(str[i-currentNum.length-1]==='-'){
				total -= parseInt(currentNum)
			}
			else{
				total += parseInt(currentNum)
			}
			currentNum = ''
		}
	}
	if(str[i-currentNum.length-1]==='-'){
		total -= parseInt(currentNum)
	}
	else{
		total += parseInt(currentNum)
	}
	return total
}

uglify('34',5)