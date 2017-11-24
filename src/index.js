/*
	"Lexi" is a Discord Bot Client that is capable of loading and executing plugins.

	This source code or application should have come with a LICENSE file with the MIT License inside.

	Copyright (c) 2017 Hayden Andreyka
*/

try {
	global.fs = require('fs');
	global.util = require('util');
	global.path = require('path');
	global.child_process = require('child_process');
	global.EventEmitter = require('events');

	global.winston = require('winston');
	global.wdrf = require('winston-daily-rotate-file');
	global.mysql = require('mysql');
	global.Discord = require('discord.js');

	global.Cache = require('./Lexi/Cache.js');
} catch (er) {
	console.error(`Fatal error loading dependencies:\n\n${er.stack}`);
	process.exit(1);
}
require('./Lexi/Init.js');
