var fs = require('fs');

var words = fs.readFileSync('./resources/dictionary.txt', 'utf-8').split('\n');
words = words.filter(function(n){ return n != "" });

dictionaryHash = {};

for (var i=0; i<words.length; i++){
	dictionaryHash[words[i]] = 1;
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

	//var startTime = new Date().getTime();

	var wordCombos = {};

	var getAnagrams = function(anagram,word){
		if (!word && isWord(anagram)) { wordCombos[anagram] = 1 };
		//if (!word) { wordCombos[anagram] = 1 };
		for (var i=0; i<word.length; i++){
			getAnagrams(anagram + word[i], getLetters(word,i,'before') + getLetters(word,i,'after'));
		}
	};

	getAnagrams('',testWord);

	//var endTime = new Date().getTime();

	//console.log("Anagrams for " + testWord + " took " + (endTime-startTime) + " millis");
	//console.log(wordCombos);
	return Object.keys(wordCombos);
};


module.exports.getWordCombos = getWordCombos;
module.exports.words = words;