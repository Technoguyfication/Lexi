// stop-it bot for discord
// copyright 2017 hayden andreyka - technoguyfication(.com) <haydenandreyka@gmail.com>
// all rights are implied under the absence of a formal open source software license

try {
	global.fs = require('fs');
	global.util = require('util');
	global.path = require('path');
	
	global.winston = require('winston');
	global.wdrf = require('winston-daily-rotate-file');
} catch(er) {
	console.error(`Fatal error loading dependencies:\n\n${er.stack}`);
	process.exit(1);
}
require('./stop-it/init.js');
