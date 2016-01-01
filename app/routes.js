var wordHelper = require('./wordHelper');

module.exports = function(app) {
	app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
	});
	app.get('/dictionary', function(req,res){
		res.send({ 'words': wordHelper.words });
	});
	app.get('/dictionary/:size', function(req,res){
		if (req.params.size >= 1 && req.params.size < 28){
			var newWords = [];
			for (var i=0; i<wordHelper.words.length; i++){
				if (wordHelper.words[i].length <= req.params.size){
					newWords.push(wordHelper.words[i]);
				}
			}
			res.send({ 'words': newWords });
		} else {
			res.send({ 'words': wordHelper.words });
		}
	});
	app.get('/anagrams/:word', function(req,res){
		res.send({ 'anagrams': wordHelper.findAnagrams(req.params.word,wordHelper.words) });
	});
	app.get('/longest-chain/:dictionarySize', function(req,res){
		if (req.params.dictionarySize && req.params.dictionarySize >= 1 && req.params.dictionarySize < 28){
			var newWords = [];
			for (var i=0; i<wordHelper.words.length; i++){
				if (wordHelper.words[i].length <= req.params.dictionarySize){
					newWords.push(wordHelper.words[i]);
				}
			}
			//console.log(newWords.length);
			var longestChain = wordHelper.getChain(newWords);
			res.send(longestChain);
		} else {
			res.send({msg:'Incorrect parameters given!'});
		}
	});
	app.get('/longest-chain2/:dictionarySize', function(req,res){
		if (req.params.dictionarySize && req.params.dictionarySize >= 1 && req.params.dictionarySize < 28){
			var newWords = [];
			for (var i=0; i<wordHelper.words.length; i++){
				if (wordHelper.words[i].length <= req.params.dictionarySize){
					newWords.push(wordHelper.words[i]);
				}
			}
			//console.log(newWords.length);
			var longestChain = wordHelper.getChain2(newWords);
			res.send(longestChain);
		} else {
			res.send({msg:'Incorrect parameters given!'});
		}
	});
	app.get('/random-word', function(req,res){
		var index = Math.floor(Math.random() * wordHelper.words.length);
		res.send({ 'word': wordHelper.words[index] });
	});
};