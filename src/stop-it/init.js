// initialize basic operations such as config, logger, etc.

require('./CoreUtils.js');

// config loading
new Promise((resolve, reject) => {
	var result;
	try {
		result = fs.readFileSync(__dirname + '/../cfg/config.json', 'utf8');
	} catch(er) {
		return reject(new Error('Failed to access config file. Please ensure config.json exists and is accessible you fucking idiot.'));
	}
		
	global.Config = JSON.parse(result);
	console.log(`Loaded config...`);
	return resolve();
}).then(

// winston init
new Promise((resolve, reject) => {
	var logdir = __dirname + '/../' + Config.Logging.Container;
	
	if (!fs.existsSync(logdir))
		fs.mkdirSync(logdir);
	
	global.logger = new winston.Logger({
		level: Config.Logging.Level,
		transports: [
			new (winston.transports.Console)(),
			new wdrf({
				filename: path.join(Config.Logging.Container, Config.Logging.Prefix),
				datePattern: Config.Logging.DatePattern + '.log',
				json: Config.Logging.JSON
			})
		]
	});
	logger.debug('Winston initialized!');
})).catch(err => {	// error doing something
	console.error(`Init error: ${err.stack}`);
	exit(1);
}).then(require('./stop-it.js').botStart);
