var getRandName = function() {
	var pool = ["0", "O"];
	var name = "";

	//var length = Math.floor(Math.random() * 20) + 5;
	var length = 10;
	for (var i = 0 ; i < length ; i++) {
		name += pool[Math.floor(Math.random() * pool.length)];
	}

	return name;
}


var getKeys = function(myDict) {
	res = [];
	for(i in myDict) {
		res.push(myDict[i][0]);
	}
}

var populateDictionary = function(toSubst, dict) {
	for(i in toSubst) {
		do {
			var name = getRandName();
		} while(jQuery.inArray(name, getKeys(dict)) >= 0)
		dict.push(name);
	}
	return dict;
}


var obfuscate = function() {
	var raw = $("#raw").val();

	substitutionDict = [];

	raw = raw.toUpperCase();

	$("#obfuscated").val(raw);
}
