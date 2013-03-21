/*
	This function creates a random string consisting out of "O" and "0".
	Input:	length	- length of output string (int)
	Output:	name		- random string (string)
*/
var getRandName = function(length) {
	var pool = ["0", "O"];
	var name = "";

	for (var i = 0 ; i < length ; i++) {
		name += pool[Math.floor(Math.random() * pool.length)];
	}

	return name;
}

/*
	This function returns the keys of a list of lists which represents a dictionary in the following form: [["key", "value"], ..]
	Input:	myDict	- dictionary from which we want to get the keys
	Output:	res			-	list of keys
*/
var getKeys = function(myDict) {
	res = [];
	for(i in myDict) {
		res.push(myDict[i][0]);
	}
	return res;
}

/*
	This function adds the given substitution variables to the given dictionary
	Input:	toSubst	-	list a strings that should be replaced later on
	Output:	dict		- already existing, older dictionary
*/
var populateDictionary = function(toSubst, dict) {
	for(i in toSubst) {
		do {
			var name = getRandName(10);
		} while(jQuery.inArray(name, getKeys(dict)) >= 0)
		dict.push(name);
	}
	return dict;
}

/*
	This function is the wrapper for the obfuscation
	Input:	-
	Output:	-
*/
var obfuscate = function() {
	var raw = $("#raw").val();

	substitutionDict = [];

	raw = raw.toUpperCase();

	$("#obfuscated").val(raw);
}
