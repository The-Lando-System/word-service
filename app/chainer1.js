var chainerHelper = require('./chainerHelper');

var findChains = function(dict){

	var dictionaryHash = {};

	for (var i=0; i<dict.length; i++){
		dictionaryHash[dict[i]] = 1;
	}

	var isWord = function(checkWord){
		return dictionaryHash.hasOwnProperty(checkWord) ? true : false;
	};

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

	var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m',
	        		'n','o','p','q','r','s','t','u','v','w','x','y','z'];

	var chains = {};

	for (var i=0; i<1; i++){

		var chain = [];
		var baseWord = dict[i];

		var lookForChains = function(chain,word){
			for (var j=0; j<alphabet.length; j++){
				var testWord = word + alphabet[j];

				var combos = getWordCombos(testWord);
				if (combos.length>0){
					chain.push(combos[0]);
					lookForChains(chain,combos[0]);
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
	var chain = chainerHelper.getLongestChain(findChains(dictionary));
	var endTime = new Date().getTime();
	return {chain:chain,time:(endTime-startTime)};
};

module.exports.getChain = getChain;