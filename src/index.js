// copyright 2017 hayden andreyka - technoguyfication(.com) <haydenandreyka@gmail.com>
// all rights are implied under the absence of a formal open source software license

global.AppInfo = {
	Name: "Lexi",
	Version: "1.0.0",
	Author: "Hayden Andreyka <haydenandreyka@gmail.com>",
	Url: "https://technoguyfication.com/"
};

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
