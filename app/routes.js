var wordHelper = require('./wordHelper');
var chainer1 = require('./chainer1');
var chainer2 = require('./chainer2');

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
	app.get('/chainer1/:dictionarySize', function(req,res){
		if (req.params.dictionarySize && req.params.dictionarySize >= 1 && req.params.dictionarySize < 28){
			var newWords = [];
			for (var i=0; i<wordHelper.words.length; i++){
				if (wordHelper.words[i].length <= req.params.dictionarySize){
					newWords.push(wordHelper.words[i]);
				}
			}
			//console.log(newWords.length);
			var longestChain = chainer1.getChain(newWords);
			res.send(longestChain);
		} else {
			var longestChain = chainer1.getChain(wordHelper.words);
			res.send(longestChain);
		}
	});
	app.get('/chainer2/:dictionarySize', function(req,res){
		if (req.params.dictionarySize && req.params.dictionarySize >= 1 && req.params.dictionarySize < 28){
			var newWords = [];
			for (var i=0; i<wordHelper.words.length; i++){
				if (wordHelper.words[i].length <= req.params.dictionarySize){
					newWords.push(wordHelper.words[i]);
				}
			}
			//console.log(newWords.length);
			var longestChain = chainer2.getChain(newWords);
			res.send(longestChain);
		} else {
			var longestChain = chainer2.getChain(wordHelper.words);
			res.send(longestChain);
		}
	});
	app.get('/random-word', function(req,res){
		var index = Math.floor(Math.random() * wordHelper.words.length);
		res.send({ 'word': wordHelper.words[index] });
	});
};