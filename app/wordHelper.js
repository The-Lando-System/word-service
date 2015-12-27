var fs = require('fs');

var words = fs.readFileSync('./resources/dictionary.txt', 'utf-8').split('\n');
words = words.filter(function(n){ return n != "" });

var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m',
	        	'n','o','p','q','r','s','t','u','v','w','x','y','z'];

var getLetters = function(word,index,direction){
	var lettersBefore = '';
	var lettersAfter = '';
	for (var i=0; i<word.length; i++){
		if (i<index){
			lettersBefore += word[i];
		} else if (i>index){
			lettersAfter += word[i];
		}
	}
	return direction === 'before' ? lettersBefore : lettersAfter;
};

var clone = function(obj) {
	if (null == obj || "object" != typeof obj) return obj;
	var copy = obj.constructor();
	for (var attr in obj) {
		if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
	}
	return copy;
};

var findAnagrams = function(testWord,dictionary){

	dictionaryHash = {};

	for (var i=0; i<dictionary.length; i++){
		dictionaryHash[dictionary[i]] = 1;
	}

	var isWord = function(checkWord){
		return dictionaryHash.hasOwnProperty(checkWord) ? true : false;
	};

	var wordCombos = {};
	var getAnagrams = function(anagram,word){
		if (!word && isWord(anagram)) { wordCombos[anagram] = 1 };
		for (var i=0; i<word.length; i++){
			getAnagrams(anagram + word[i], getLetters(word,i,'before') + getLetters(word,i,'after'));
		}
	};

	getAnagrams('',testWord);
	return Object.keys(wordCombos);
};

var getLongestChain = function(chains){

	var longestChains = [];

	for (var word in chains){

		var longestChain = {words:[word],chainLength:1};

		var testChain = {words:[word],chainLength:1};

		for (var i=0; i<chains[word].length; i++){

			var j = testChain.words.length-1;

			if (testChain.words[j].length<chains[word][i].length){
				testChain.words.push(chains[word][i]);
				testChain.chainLength++;
			} else {
				if (testChain.chainLength>longestChain.chainLength){
					longestChain = {};
					longestChain = clone(testChain);
				}
				testChain = {words:[word],chainLength:1};
				testChain.words.push(chains[word][i]);
				testChain.chainLength++;
			}
		}

		if (testChain.chainLength>longestChain.chainLength){
			longestChain = {};
			longestChain = clone(testChain);
		}

		longestChains.push(longestChain);
	}

	var chain = {words:[],chainLength:0};

	for(var i=0; i<longestChains.length; i++){
		if (chain.chainLength<longestChains[i].chainLength){
			chain = longestChains[i];
		}
	}

	return chain;
};

var findChains = function(dict){

	var dictionaryHash = {};

	for (var i=0; i<dict.length; i++){
		dictionaryHash[dict[i]] = 1;
	}

	var isWord = function(checkWord){
		return dictionaryHash.hasOwnProperty(checkWord) ? true : false;
	};

	var getWordCombos = function(testWord){

		var wordCombos = {};

		var getAnagrams = function(anagram,word){
			if (!word && isWord(anagram)) { wordCombos[anagram] = 1 };
			for (var i=0; i<word.length; i++){
				getAnagrams(anagram + word[i], getLetters(word,i,'before') + getLetters(word,i,'after'));
			}
		};

		getAnagrams('',testWord);
		return Object.keys(wordCombos);
	};

	chains = {};

	for (var i=0; i<dict.length; i++){

		var chain = [];
		var baseWord = dict[i];

		var lookForChains = function(chain,word){
			for (var j=0; j<alphabet.length; j++){
				var testWord = word + alphabet[j];

				var combos = getWordCombos(testWord);


				for (var k=0; k<combos.length; k++){
					chain.push(combos[k]);
					lookForChains(chain,combos[k]);
				}
			}
		}

		lookForChains(chain,baseWord);
		chains[baseWord] = chain;
	}
	
	return chains;
};

var getChain = function(dictionary){
	var startTime = new Date().getTime();
	var chain = getLongestChain(findChains(dictionary));
	var endTime = new Date().getTime();
	return {chain:chain,time:(endTime-startTime)};
};

module.exports.getChain = getChain;
module.exports.findAnagrams = findAnagrams;
module.exports.words = words;