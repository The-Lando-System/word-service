var chainerHelper = require('./chainerHelper');

var findChains = function(dictionary){

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
      } else {
        letters1.splice(letters1.indexOf(str2[i]),1);
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

  // Keep a running list of words already used in chains
  var usedWords = {};

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
          if (!usedWords.hasOwnProperty(nextWords[j])){
            usedWords[nextWords[j]] = 1;
            chainsForWord.push(nextWords[j]);
            getNextWords(nextWords[j],lengthKey+1);
          }
      	}
      }
    }
    getNextWords(word,word.length);
    return chainsForWord;
  };

  var chains = {};
  for (var i=0; i<baseWords.length; i++) {
    chains[baseWords[i]] = getChainsForWord(baseWords[i]);
  }

  return chains;
};

var getChain = function(dictionary){
  var startTime = new Date().getTime();
  var chainResults = chainerHelper.getLongestChain(findChains(dictionary));
  var endTime = new Date().getTime();
  var chains = {chain:chainResults,time:(endTime-startTime)};
  return chains;
};

module.exports.getChain = getChain;