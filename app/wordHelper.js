var fs = require('fs');

var words = fs.readFileSync('./resources/dictionary.txt', 'utf-8').split('\n');
words = words.filter(function(n){ return n != "" });

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

var clone = function(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
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


module.exports.getLongestChain = getLongestChain;
module.exports.findAnagrams = findAnagrams;
module.exports.words = words;