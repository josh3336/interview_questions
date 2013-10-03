Write a function to convert that to <ul> <li> 4 </li> <li> 1 </li> <ul> <ul> <li> 7 </li> <li> 5 </li> </ul> <ul> <li> 3 </li> </ul> In other words, write a function to break the sorted list apart into different sub-lists with a maximum of 'x' items each, 'x' being a parameter you pass in. 

Consider the following: <ul> <li> 4 </li> <li> 1 </li> <li> 7 </li> <li> 5 </li> <li> 3 </li> 



var convertList = function(element){
	var listofli = $(element).find('li');
	var liSplit = [];
	var newElement = ''
	for (var i = 0; i < listofli.length; i=i+2){
		liSplit.push([listofli[i],listofli[i+1]]);
	}
	for (var i = 0; i < liSplit.length; i++){
		if(liSplit[i][1]){
			newElement+='<ul>'+liSplit[i][0].outerHTML+liSplit[i][1].outerHTML+'</ul>'
		}
		else{
			newElement+='<ul>'+liSplit[i][0].outerHTML+'</ul>'
		}
	}
	return newElement;
}



convertList('<ul> <li> 4 </li> <li> 1 </li> <li> 7 </li> <li> 5 </li> <li> 3 </li> </ul>')