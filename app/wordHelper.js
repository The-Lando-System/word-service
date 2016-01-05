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

module.exports.findAnagrams = findAnagrams;
module.exports.words = words;