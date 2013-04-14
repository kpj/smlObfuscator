/*
	Parses a bunch of SML code
	@param code	Code to Obfuscate
	@param options	Options. Optional. 
		options.removeComments Remove original comments
		options.simpleOptimize	Simple Optimisation
		options.removeLineBreaks	remove all new lines?
		options.renameWords		rename words?
		options.dicGenerator	A function which build new word dictonaries. 
		options.exceptions	Array of words to ignore during renaming. 
		options.preOptimize	Function to call with code before optimizing. 
 */
var SML = function(code, options){
	var options = (typeof options == 'undefined')?{}:options; //options
	
	var exceptions = (options.hasOwnProperty("exceptions"))?options.exceptions:[];
	var removeComments = (options.hasOwnProperty("removeComments"))?options.removeComments:true;
	var simpleOptimize = (options.hasOwnProperty("simpleOptimize"))?options.simpleOptimize:true;
	var removeLineBreaks = (options.hasOwnProperty("removeLineBreaks"))?options.removeLineBreaks:true;
	var renameWords = (options.hasOwnProperty("renameWords"))?options.renameWords:true;
	var dicGenerator = (options.hasOwnProperty("dicGenerator"))?options.dicGenerator:SML.dicGenerator["static"];
	var preOptimize = (options.hasOwnProperty("preOptimize"))?options.preOptimize:function(x){return x;};


	var parsedCode = SML.parseComplete(code, removeComments); //parse code and structures
	
	var words = SML.getWords(parsedCode, exceptions); //get words
	
	var replacedCode = SML.buildCode(SML.replaceWords(parsedCode, dicGenerator(words)))+";";
	
	replacedCode = preOptimize(replacedCode);
	
	if(removeLineBreaks){
		replacedCode = SML.stringOptimizeE(replacedCode, function(chunk){
			while(chunk.indexOf("\n") >= 0) {
				chunk = chunk.replace(/\n/g, " ");
			}
			return chunk;
		});
	}
	
	var unspace = function(chunk, char){
		var empties = [" ", "\t", "\n"];
		for(var j=0;j<empties.length;j++){
			for(var i=0;i<empties.length;i++){
				empty = empties[i];
				while(chunk.indexOf(char+empty) >= 0) {
					chunk = chunk.replace(char+empty, char);   
				}
				while(chunk.indexOf(empty+char) >= 0) {
					chunk = chunk.replace(empty+char, char);   
				}
			}
		}
		return chunk;
	}
	
	if(simpleOptimize){
		replacedCode = SML.stringOptimizeE(replacedCode, function(chunk){
			var frees = ["|",",", ";", "=", "+", "*", "!", ":", "=>", "/", "^", "[", "(", ")", "]", ".", "@", "::"];
			for(var i=0;i<frees.length;i++){
				chunk = unspace(chunk, frees[i]);
			}
			
			while(chunk.indexOf("\t") >= 0) {
				chunk = chunk.replace(/\t/g, " ");   
			}
			while(chunk.indexOf("  ") >= 0) {
				chunk = chunk.replace(/\ \ /g, " ");   
			}
			while(chunk.indexOf(" \n") >= 0) {
				chunk = chunk.replace(/\ \n/g, "\n");   
			}
			while(chunk.indexOf("\n ") >= 0) {
				chunk = chunk.replace(/\n\ /g, "\n");   
			}
			while(chunk.indexOf(";;") >= 0) {
				chunk = chunk.replace(/;;/g, ";");   
			}
			while(chunk.indexOf("\n\n") >= 0) {
				chunk = chunk.replace(/\n\n/g, "\n");   
			}
			
			return chunk;
		})
	}
		
	return replacedCode;
};

(function(){

/*
	Parses a bunch of SML Code
	
	[
		CODE
		STUFF_TO_IGNORE
		CODE
		STUFF_TO_IGNORE
		...
	]

	Also removes comments from the code.  
	@param code	Code to parse
	@param removeComments	Should we remove comments in the code?
	
*/
SML.parseCode = function(code, removeComments){
	var bracket_open = 0;
	var quotation_open = false;
	var keep_comments = !removeComments;

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
				if(keep_comments){
					if(bracket_open == 1){
						res.push("(*");
					} else {
						res[res.length-1] += "(*";
					}
				}
			} else if (code[i] == "*" && code[i+1] == ")" && bracket_open > 0){ //close bracket
				bracket_open--;	
				i++; 
				if(keep_comments){
					res[res.length-1] += "*)";
					if(bracket_open == 0){
						res.push("");
					}
				}
				
			} else if (bracket_open == 0 || keep_comments){ //add some stuff
				res[res.length-1] += code[i];
			}
		}
			
	}
	return res;
};
/*
 * Completely parses SML code that can be worked on without problems. 
 * @param	code	Code to parse
 * @param	removeComments	Should comments be removed? Optional. 
 */
SML.parseComplete = function(code, removeComments){
	return SML.parseStructures(SML.parseCode(code, (removeComments===true)?true:false));
}

/*
	Takes parseCode output and turns it back into a code string. 
	@param parsedCode some parsed code. 
*/
SML.buildCode = function(parsedCode){
	return parsedCode.join(""); 
};

/*
	Gets the word names to replace from some parsed code. 
	@param	parsedCode	Parsed SML code
	@param	exceptions	An array of words to ignore. 
 */
SML.getWords = function(parsedCode, exceptions){
	var res = [];
	for(var i=0;i<parsedCode.length;i=i+2){
		
		var tmp = parsedCode[i].match(/[a-zA-Z0-9_]+/g);
		if(tmp == null || typeof tmp == "undefined"){
			tmp = [];		
		}
		for(var j=0;j<tmp.length;j++){
			var matched = tmp[j];
			if(!(parseInt(matched).toString() == matched) && res.indexOf(matched) == -1 && exceptions.indexOf(matched) == -1 && SML.keywords.indexOf(matched) == -1){/* IE <= 8 not supported! */
				/* no integer && we have not already matched we are also no keywords*/
				res.push(matched);
			}		
		}	
	}
	return res;
};

/*
	Parses structures [Structure].[Object] used in the code and ignores them. 
	@param parsedCode parsed code. 
	
	Returns new parsed code object. 
*/
SML.parseStructures = function(parsedCode){
	for(var i=0;i<parsedCode.length;i=i+2){
		var tmp = parsedCode[i].match(/[a-zA-Z0-9_]+[.][a-zA-Z0-9_]+/g);
		if(tmp == null || typeof tmp == "undefined"){
			tmp = [];		
		}
		for(var j=0;j<tmp.length;j++){
			parsedCode = SML.ignoreWords(parsedCode, tmp[j]);
		}	
	}

	return parsedCode;
}

/*
	forces to ignore text in parsedCode. 
	@param parsedCode The parsed code. 
	@param text The text to ignore.  
*/
SML.ignoreWords = function(parsedCode, text){
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
};

/*
	Replaces all the keywords with all the new keywords
	@param parsedCode A bunch of parsed code. 
	@param dic A dictionary containing keyWord => replacement pairs. 
*/
SML.replaceWords = function(parsedCode, dic){
	return SML.stringOptimize(parsedCode, function(chunk){
		return chunk.replace(/[a-zA-Z0-9_]+/g, function(old){
			if(dic.hasOwnProperty(old)){
				while(SML.keywords.indexOf(dic[old]) != -1){
					dic[old] = dic[old]+"_";
				}
				return dic[old];
			} else {
				return old;
			}
		});
	});
};

/*
	Optimize code string based. 
	@param parsedCode	parsed code
	@param callback Optimisation
*/
SML.stringOptimize = function(parsedCode, callback){
	for(var i=0;i<parsedCode.length;i=i+2){
		parsedCode[i] = callback(parsedCode[i], i);
	}
	return parsedCode;
}

/*
	Optimize code string based. 
	@param code	unparsed code
	@param callback Optimisation
*/
SML.stringOptimizeE = function(code, callback){
	return SML.buildCode(SML.stringOptimize(SML.parseComplete(code, false), callback));
}


function toRadix(N,radix,alphabet) { //adapted from http://www.javascripter.net/faq/convert3.htm
	var alphabet = (typeof alphabet == 'string')?alphabet:"0123456789abcdefghijklmnopqrstuvwxyz";
 var HexN="", Q=Math.floor(Math.abs(N)), R;
 while (true) {
  R=Q%radix;
  HexN = alphabet.charAt(R)
       + HexN;
  Q=(Q-R)/radix; 
  if (Q==0) break;
 }
 return ((N<0) ? "-"+HexN : HexN);
};

/*
 * renaming functions
 */
SML.dicGenerator = {
	"static": function(keys){
		var res = {};
		for(var i=0;i<keys.length;i++){
			res[keys[i]] = keys[i];
		}
		return res;
	},
	"numerical": function(keys){
		var res = {};
		for(var i=0;i<keys.length;i++){
			res[keys[i]] = "v"+i.toString();
		}
		return res;
	},
	"alphanumerical": function(keys){
		var res = {};
		for(var i=0;i<keys.length;i++){
			res[keys[i]] = toRadix(i, 26, "abcdefghijklmnopqrstuvwxyz");
		}
		return res;
	},
};

/*
	A bunch of keywords in SML. 
	These should not be changed. 
	
*/
SML.keywords = 
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

})();
