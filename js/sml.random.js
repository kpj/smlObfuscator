(function(){
SML.addRandomComments = function(code){
	return SML.stringOptimizeE(code, function(chunk){
		return chunk.replace(/[\n]/g, function(m){
				if(Math.random() < 0.2){
					return "(* "+generateRubbish()+" *)\n";
				} else {
					return "\n";		
				}
			
		});
	});
};

/*
 * Random Replacer
 */
SML.dicGenerator.random = function(words){
	var replacements = [];
	var newWords = {};
	
	for(var i=0; i<words.length;i++){
		var key = words[i];
		var repl = getRandName(randomNumber(10, 20)); //random length
		while(replacements.indexOf(repl) != -1){
			repl = getRandName(randomNumber(10, 20));
		}
		replacements.push(repl);
		newWords[key] = repl;
	}
	return newWords;
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
};


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
};



/* a bunch of random comments. Feel free to add more. */
var randomComments = [

	/* a bunch of random stuff I just had in my mind. */
	"2 am in the IRC Quiet Study Area",
	"The GIGO Principle: Garbage In, Garbage Out ",
	"Applets, Not Craplets",
	"This is a nice comment. ",
	"Do not delete this comment. ",
	"I forgot to delete this comment. ",
	"This is an epic comment. ",
	"Nothing here. ",
	"I'm just a random comment. ",
	"I support " + navigator.userAgent,
	"I got to stare at the slides more. ",
	"It works!",
	"Causes a kernel panic. ",
	"Follow the train, CJ!",
	"Turing complete. ",
	"42. ",
	"Ihr seid doch alle wahnsinnig! ",
	"Removed herobrine. ",
	"from The Book of Mozilla. ",
	"smaller on the outside. ",
	"cookies are delicious delicacies. ",
	"Everything besides " + navigator.platform + " sucks!",
	(navigator.javaEnabled()) ? "No risk no fun!" : "I care about my data.", // probably only funny if one sees the code..
	"BASPINGO! ",
	"When does the narwhal bacon?",
	"There were 11 people in GenCS this Tuesday. New record!", 


	/* jokes */

	"Why do computer programmers confuse Halloween and Christmas?\n"+
	"Because OCT 31 = DEC 25.",
	"An SQL query walks up to two tables and asks, \"May I join you?\"",
	"Helium walks into a bar and orders a beer, the bartender says, \"Sorry, we don\'t serve noble gases here.\" He doesn\'t react.",
	"A TCP packet walks into a bar and says, \"I\'d like a beer.\" The bartender replies, \"You want a beer?\" The TCP packet replies, \"Yes, I\'d like a beer.\"",
	"Freud believed that only one thing came between fear and sex. He called it fünf.",
	"Mathematician: Pi is the ratio of the circumference of a circle to its diameter. \n"+
	"Engineer: Pi is about 22/7. \n"+
	"Physicist: Pi is 3.14159 plus or minus 0.000005 \n"+
	"Computer Programmer: Pi is 3.141592653589 in double precision. \n"+
	"Nutritionist: You one track math-minded fellows, Pie is a healthy and delicious dessert!",

	"\"A mathematician is a device for turning coffee into theorems\" (P. Erdos) \n"+
	"Addendum: American coffee is good for lemmas. ",

	"A mathematician believes nothing until it is proven, \n"+
	"a physicist believes everything until it is proven wrong, \n"+
	"a chemist doesn't care and \n"+
	"a biologist doesn't understand the question. ",

	"This is a one line proof...if we start sufficiently far to the left.",

	"The problems for the exam will be similar to the discussed in the class. Of course, the numbers will be different. But not all of them. Pi will still be 3.14159... ",

	"Q: Why do Computer Scientists get Halloween and Christmas mixed up? \n"+
	"A: Because Oct. 31 = Dec. 25",

	"Math problems? Call 1-800-[(10x)(13i)2]-[sin(xy)/2.362x]. ",

	'A man flying in a hot air balloon suddenly realizes he\'s lost. He reduces height and spots a man down below. He lowers the balloon further and shouts to get directions, "Excuse me, can you tell me where I am?" \n'+
	'The man below says: "Yes. You\'re in a hot air balloon, hovering 30 feet above this field." \n'+
	'"You must work in Information Technology," says the balloonist. \n'+
	'"I do" replies the man. "How did you know?" \n'+
	'"Well," says the balloonist, "everything you have told me is technically correct, but It\'s of no use to anyone." \n'+
	'The man below replies, "You must work in management." \n'+
	'"I do," replies the balloonist, "But how\'d you know?" \n'+
	'"Well", says the man, "you don\'t know where you are or where you’re going, but you expect me to be able to help. You\'re in the same position you were before we met, but now it\'s my fault." \n'

];
})();
