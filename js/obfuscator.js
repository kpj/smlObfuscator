/*
	A bunch of keywords in SML. 
	These should not be changed. 
	
	May be incomplete. 
*/
var SMLKeyWords = 
[
	/* Functions, datatypes, etc */
	"fun",
	"fn",
	"datatype",
	"functor",
	"infix",
	"infixr",
	"nonfix",
	"open",


	"LESS",
	"EQUAL",
	"GREATER",

	"o",
	"and",

	/* branching & scoping */
	
	"local",
	"in",
	"end",

	"let",
	"if",
	"then",
	"else",

	"case",

	"andalso",
	"orelse",
	

	/* Variables */
	"val",
	"type",
	"structure",
	"struct",
	"STRUCT",
	
	"_",
	"signature",
	"SIG",
	"sig",
	
	/* types */
	"bool",
	"true",
	"false", 

	"int",

	"real",

	"list",
	"nil",

	"string",
	
	"char",

	"word",
	
	"ref",

	"exception",
	"raise",
	"handle",

	"option",
	"SOME",
	"NONE",

	"unit",

	"array",
	"vector",

	"order",
	
	/* exceptions */
	
	"Bind",
	"Chr",
	"Div",
	"Domain", 
	"Empty",
	"Fail",
	"Match",
	"Option",
	"Overflow", 
	"Size",
	"Span",
	"Subscript",

	/* misc */
	"op",
	"of",
	"rec",

	/* builtin functions */
	"div",
	"mod",
	
	"length",
	"map",
	"foldl", 
	"foldr",
	
	"implode", 
	"explode",
	
	"print",
	"substring",
	"revserse",
	"exn",


	"app",
	"abs",
	"before",
	"ceil",
	"chr",
	"concat",
	"exnMessage",
	"exnName",
	"floor",
	"getOpt",
	"hd",
	"ignore",
	"implode",
	"isSome",
	"not",
	"null",
	"o",
	"ord",
	"print",
	"rev",
	"round",
	"size",
	"str",
	"substring",
	"tl",
	"trunc",
	"use",
	"valOf",
	"vector"
];

/*
	@param code	A bunch of SML Code

	turns code from SML into the following form: 
	
	[
		CODE
		STUFF_IN_QUTATION_MARKS_WE_SHOULD_NOT_TOUCH
		CODE
		STUFF_IN_QUTATION_MARKS_WE_SHOULD_NOT_TOUCH
		...
	]

	Also removes comments from the code.  
	
*/
var parseCode = function(code){
	var bracket_open = 0;
	var quotation_open = false;

	var res = [""];
	
	for(var i=0;i<code.length;i++){
		if(quotation_open){
			if(code[i] == "\\" && code[i+1] == "\""){ // \" are ignored
				res[res.length-1] += "\\\"";
				i++;
			} else if(code[i] == "\""){ //closing quoattion mark
				res[res.length-1] += "\"";
				res.push("");
				quotation_open = false;
			} else { //nothign special
				res[res.length-1] += code[i];
			}
		} else {
			if(code[i] == "\"" && bracket_open == 0){ //openinf a quotation amrk while not in comment
				res.push("\"");
				quotation_open = true;
			} else if(code[i] == "(" && code[i+1] == "*"){ //open comment
				bracket_open++;	
				i++;	
			} else if (code[i] == "*" && code[i+1] == ")" && bracket_open > 0){ //close bracket
				bracket_open--;	
				i++;	
			} else if (bracket_open == 0){ //add some stuff
				res[res.length-1] += code[i];	
			}
		}
			
	}
	return res;
}

/*
	Takes parseCode output and turns it back into a code string. 
	@param parsedCode some parsed code. 
*/
var buildCode = function(parsedCode){
	return parsedCode.join(""); 
};

/*
	Gets all the key words from the SML code. 
	@param  parsedCode some parsed code. 
	@exceptions an array of keywords to ignore. 
*/
var getWords = function(parsedCode, exceptions){
	var res = [];
	for(var i=0;i<parsedCode.length;i=i+2){
		
		var tmp = parsedCode[i].match(/[a-zA-Z0-9_]+/g);
		if(tmp == null || typeof tmp == "undefined"){
			tmp = [];		
		}
		for(var j=0;j<tmp.length;j++){
			var matched = tmp[j];
			if(!(parseInt(matched).toString() == matched) && res.indexOf(matched) == -1 && exceptions.indexOf(matched) == -1 && SMLKeyWords.indexOf(matched) == -1){/* IE <= 8 not supported! */
				/* no integer && we have not already matched we are also no keywords*/
				res.push(matched);
			}		
		}	
	}
	return res;
}

/*
	Parses structures [Structure].[Object] used in the code and ignores them. 
	@param parsedCode parsed code. 
	
	Returns new parsed code object. 
*/
var parseStructures = function(parsedCode){
	for(var i=0;i<parsedCode.length;i=i+2){
		var tmp = parsedCode[i].match(/[a-zA-Z0-9_]+[.][a-zA-Z0-9_]+/g);
		if(tmp == null || typeof tmp == "undefined"){
			tmp = [];		
		}
		for(var j=0;j<tmp.length;j++){
			parsedCode = IgnoreWords(parsedCode, tmp[j]);
			
		}	
	}

	return parsedCode;
}


/*
	Replaces all the keywords with all the new keywords
	@param parsedCode A bunch of parsed code. 
	@param dic A dictionary containing keyWord => replacement pairs. 
*/
var replaceWords = function(parsedCode, dic){
	for(var i=0;i<parsedCode.length;i=i+2){
		parsedCode[i] = parsedCode[i].replace(/[a-zA-Z0-9_]+/g, function(old){
			if(dic.hasOwnProperty(old)){
				return dic[old];
			} else {
				return old;

			}	
		});
			
	}
	return parsedCode;
}

/*
	This function creates a random string consisting out of "O" and "0".
	Input:	length	- length of output string (int)
		forbidden - array of string that is forbidden
	Output:	name	- random string (string)
*/
var getRandName = function(length, forbidden) {

	var pool = ["0", "O"];
	var name = "O";

	length--;

	for (var i = 0 ; i < length ; i++) {
		name += pool[Math.floor(Math.random() * pool.length)];
	}

	return name;
}

var randomNumber = function(a, b){
	return a+Math.floor(Math.random() * (b-a));
}

/*
	forces to ignore text in parsedCode. 
	@param parsedCode The parsed code. 
	@param text The text to ignore.  
*/
var IgnoreWords = function(parsedCode, text){
	var res = [];
	var state = false;
	for(var i=0;i<parsedCode.length;i++){
		if(state == false){
			var chunk = parsedCode[i];
			var chunks = chunk.split(text);
			for(var j=0;j<chunks.length-1;j++){
				res.push(chunks[j]);
				res.push(text);			
			}
			res.push(chunks[chunks.length-1]);
			state = true;
		} else {
			res.push(parsedCode[i]);
			state = false;		
		}	
	}

	return res;
}

/* generate random stuff that does nothing. */
var generateRubbish = function(){
	if(Math.random() < 0.8){
		//put in a random quote
		return randomComments[Math.floor(Math.random() * randomComments.length)];
	} else {
		var j = Math.floor(Math.random() * 20);
		var stuff = function(){
			return getRandName(randomNumber(j, 42), []);
		}

		var args = function(){
			var stack = [];
			for(var i=0;i<j;i++){
				stack.push(stuff());
			}	
			return stack.join(", ");
		}

		var myname = stuff();
		var res = "\nfun "+myname+"("+args()+") = nil\n";
		for(var i=0;i<j;i++){
			if(Math.random() < 0.2){
				res += "| "+myname+"("+args()+") = "+stuff()+"("+args()+")\n";
			} else if(Math.random() < 0.2){
				res += "| "+myname+"("+args()+") = raise "+stuff()+"("+args()+")\n";
			}
			
		}
		return res;
	}
}

/*
	This function is the wrapper for the obfuscation
	Input:	-
	Output:	-
*/
var obfuscate = function() {
	var raw = $("#raw").val();

	substitutionDict = [];

	var parsedCode = parseStructures(parseCode(raw)); //parse code and structures

	
	var exceptions = $("#ignore_funcs").val().split(" ").join("").split(","); //get the exceptions. 

	var words = getWords(parsedCode, exceptions); //get words. 
	var replacements = [];
	var newWords = {};


	//generate random new ones
	for(var i=0; i<words.length;i++){
		var key = words[i];
		var repl = getRandName(randomNumber(10, 20)); //random length
		while(replacements.indexOf(repl) != -1){
			repl = getRandName(randomNumber(10, 20));
		}
		replacements.push(repl);
		newWords[key] = repl;
	}

	var replacedCode = buildCode(replaceWords(parsedCode, newWords))+";";
	
	if($("#add_garbage").is(":checked")){
		replacedCode = replacedCode.replace(/[\n]/g, function(m){
			if(Math.random() < 0.2){
				return "(* "+generateRubbish()+" *)\n";
			} else {
				return "\n";		
			}
		
		});
	}

	

	$("#obfuscated").val(replacedCode); // put it back. 
}
