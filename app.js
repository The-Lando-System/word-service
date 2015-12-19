// Set Up =============================
var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// Configuration ======================
var devConfig = false;
try {
	devConfig = require('./config/config');
	console.log('Found development config file; using development environment variables')
} catch(err) {
	console.log('No config file detected, assuming production environment variables')
}

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ 'extended':'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type:'application/vnd.api+json' }));
app.use(methodOverride('X-HTTP-Method-Override'));

// Routes ==============================
require('./app/routes')(app);

// Export the app ======================
exports = module.exports = app;

console.log('=================================');
console.log('=            Ready!             =');
console.log('=================================');