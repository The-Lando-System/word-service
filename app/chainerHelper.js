var clone = function(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
};

var getLongestChain = function(chains){

  var chain = {words:[],chainLength:0};

  for (var word in chains){

    var longestChain = [word];
    var testChain = [word];
    var chainArray = chains[word];

    for (var i=0; i<chainArray.length; i++){
      if (chainArray[i].length>testChain[testChain.length-1].length){
        testChain.push(chainArray[i]);
      } else {
        if (testChain.length>longestChain.length){
          longestChain = clone(testChain);
        }
        var elemsToSplice = (testChain[testChain.length-1].length-chainArray[i].length)+1;
        testChain.splice(testChain.length-elemsToSplice,elemsToSplice);
        testChain.push(chainArray[i]);
      }
    }

    if (testChain.length>longestChain.length){
      longestChain = clone(testChain);
    }

    if (longestChain.length>chain.chainLength){
      chain.words = longestChain;
      chain.chainLength = longestChain.length;
    }

  }

  return chain;
};

module.exports.getLongestChain = getLongestChain;