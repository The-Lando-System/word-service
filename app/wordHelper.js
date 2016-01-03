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
			//if (Object.keys(wordCombos).length === 0){
				if (!word && isWord(anagram)) { wordCombos[anagram] = 1 };
				for (var i=0; i<word.length; i++){
					getAnagrams(anagram + word[i], getLetters(word,i,'before') + getLetters(word,i,'after'));
				}
			//} else {
				//return;
			//}
		};

		getAnagrams('',testWord);
		return Object.keys(wordCombos);
	};

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
				// for (var k=0; k<combos.length; k++){
				// 	chain.push(combos[k]);
				// 	lookForChains(chain,combos[k]);
				// }
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


// ===========================================================================

var findChains2 = function(dictionary){

  // 1. Read in dictionary
  // 2. Create a word object, where keys are the length of the words and the values 
  //    are words whose characters are alphabetically sorted and unique
  // 3. Get list of starting words (e.g. a, if, be, ...)
  // 4. Loop through starting words and build chains using following functions:

  //testDictionary = ['a','ab','bad','dab','bald','of','foe','foes','sofie','oaf','sofa','sofas','balds','abs','slab','slabs'];

  // testWordObj = {
  //   1:['a'],
  //   2:['ab','fo'],
  //   3:['abd','abs','afo','efo',],
  //   4:['abdl','abls','afos','efos'],
  //   5:['afoss','abdls','ablss','efios']
  // };

  // testWordObj2 = {
  //   1:['a'],
  //   2:['ab','of'],
  //   3:['bad','abs','oaf','foe','oft'],
  //   4:['bald','labs','oafs','foes','soft'],
  //   5:['sofas','sofie','forts'],
  //   6:['frosts']
  // };

  var testBaseWords = ['a'];

  //dictionary = testDictionary;
 // var wordObj = testWordObj2;
  var baseWords = testBaseWords;

  var wordObjStartTime = new Date().getTime();
  var wordObj = {};
  for (var i=0; i<dictionary.length; i++){
    var key = dictionary[i].length;
    if (!wordObj.hasOwnProperty(key)){
      wordObj[key] = [];
    }
    wordObj[key].push(dictionary[i]);
  }
  var wordObjEndTime = new Date().getTime();
  console.log('Time to build word obj: ' + (wordObjEndTime-wordObjStartTime) + 'ms');

  //console.log('hey');

  var containsLetters = function(str1, str2){
    var letters1 = str1.split("");
    for (var i=0; i<str2.length; i++){
      if (letters1.indexOf(str2[i]) === -1){
        return false;
      }
    }
    return true;
  };

  var containsLetters2 = function(str1, str2){
  	str1 = str1.split("").sort().join("");
  	str2 = str2.split("").sort().join("");
  	return (str1.indexOf(str2) > -1);
  };
  

  var checkForWords = function(word,wordList){
    nextWords = [];
    for (var i=0; i<wordList.length; i++) {
      if (containsLetters(wordList[i],word)) {
        nextWords.push(wordList[i]);
      }
    }
    return nextWords;
  };

  
  // Loop through starting words here:
  var getChainsForWord = function(word){
    var chainsForWord = [];
    var getNextWords = function(word,lengthKey){
      if (wordObj.hasOwnProperty(lengthKey+1)){
        var nextWords = checkForWords(word,wordObj[lengthKey+1]);
        // for (var j=0; j<nextWords.length; j++){
        //   chainsForWord.push(nextWords[j]);
        //   getNextWords(nextWords[j],lengthKey+1);
        // }
        for (var j=0; j<nextWords.length; j++) {
	        if (j<2){
	          chainsForWord.push(nextWords[j]);
	          getNextWords(nextWords[j],lengthKey+1);
	        }
      	}
      }
    }
    getNextWords(word,word.length);
    return {word:word,chains:chainsForWord};
  };

  var chains = {};
  for (var i=0; i<baseWords.length; i++) {
    chains[i] = getChainsForWord(baseWords[i]);
  }

  return chains;
}

var getLongestChain2 = function(chains){

	debugger;

  var longestChainStartTime = new Date().getTime();
  var longestChains = [];

  for (var key in chains){

    var word = chains[key].word;
    var wordChain = chains[key].chains;

    var longestChain = {words:[word],chainLength:1};

    var testChain = {words:[word],chainLength:1};

    for (var i=0; i<wordChain.length; i++){

      var j = testChain.words.length-1;

      if (testChain.words[j].length<wordChain[i].length){
        testChain.words.push(wordChain[i]);
        testChain.chainLength++;
      } else {
        if (testChain.chainLength>longestChain.chainLength){
          longestChain = {};
          longestChain = clone(testChain);
        }
        testChain = {words:[word],chainLength:1};
        testChain.words.push(wordChain[i]);
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

  var longestChainEndTime = new Date().getTime();
  console.log('Time to find longest chain: ' + (longestChainEndTime-longestChainStartTime) + 'ms');

  return chain;
};

var getChain2 = function(dictionary){
  var startTime = new Date().getTime();
  var chainResults = getLongestChain2(findChains2(dictionary));
  var endTime = new Date().getTime();
  var chains = {chain:chainResults,time:(endTime-startTime)};
  return chains;
};

module.exports.getChain2 = getChain2;