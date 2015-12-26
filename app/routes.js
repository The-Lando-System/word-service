var express = require('express');
var fs = require('fs');

var words = fs.readFileSync('./resources/dictionary.txt', 'utf-8').split('\n');
words = words.filter(function(n){ return n != "" });

module.exports = function(app) {
	app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
	});
	app.get('/dictionary', function(req,res){
		res.send({ 'words': words });
	});
	app.get('/dictionary/:size', function(req,res){
		if (req.params.size >= 1 && req.params.size < 28){
			var newWords = [];
			for (var i=0; i<words.length; i++){
				if (words[i].length <= req.params.size){
					newWords.push(words[i]);
				}
			}
			res.send({ 'words': newWords });
		} else {
			res.send({ 'words': words });
		}
	});
	app.get('/random-word', function(req,res){
		var index = Math.floor(Math.random() * words.length);
		res.send({ 'word': words[index] });
	});
};