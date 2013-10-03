var pow = function(a, b){
	if ( a < .25){
		return a
	}
	return(pow(a/2,b) * pow(a/2,b));
}


public static double pow(double a, int b) {
    if (b < 0)
        return 1 / pow(a, -b);
    if (b == 0)
        return 1;
    double halfPow = pow(a, b/2);
    if (b % 2 == 0)
        return halfPow * halfPow;
    else
        return halfPow * halfPow * a;
}


var pow = function (a , b){
	if (b < 0){
		return 1 / pow(a, -b);
	}
	if (b === 0){
		return 1;
	}
	

}