function findChains(data){

	//var fs = require('fs');

	//var words = fs.readFileSync('./resources/dictionary.txt', 'utf-8').split('\n');
	//words = words.filter(function(n){ return n != "" });
	//console.log('In the findChains call');
	var dictionary = data.words;

	var dictionaryHash = {};

	var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m',
	        	'n','o','p','q','r','s','t','u','v','w','x','y','z'];

	for (var i=0; i<dictionary.length; i++){
		dictionaryHash[dictionary[i]] = 1;
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
			//console.log('In the getAnagrams call');
			if (!word && isWord(anagram)) { wordCombos[anagram] = 1 };
			for (var i=0; i<word.length; i++){
				getAnagrams(anagram + word[i], getLetters(word,i,'before') + getLetters(word,i,'after'));
			}
		};

		//console.log('In the findAnagrams call: ' + testWord);
		getAnagrams('',testWord);
		//console.log('Finished getAnagrams');
		return Object.keys(wordCombos);
	};

	chains = {};
	//console.log('About to enter for loop');
	for (var i=0; i<dictionary.length; i++){

		var chain = [];
		var baseWord = dictionary[i];

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
		//console.log('About to enter look for chains with word: ' + baseWord);
		lookForChains(chain,baseWord);
		//console.log('Leaving look for chains with word: ' + baseWord);
		chains[baseWord] = chain;
	}
	//console.log('Returning chains');
	return chains;
}

this.onmessage = function (event) {
	//console.log('In the onmessage call: ' + event.data);
	postMessage(findChains(event.data));
}