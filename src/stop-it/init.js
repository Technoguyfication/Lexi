// inits things like config, modules, and other stuff

var tasks = [
	// config loading
	new Promise((resolve, reject) => {
		var result;
		try {
			result = fs.readFileSync(__dirname + '/../cfg/config.json', 'utf8');
		} catch(er) {
			return reject('Failed to access config file. Please ensure config.json exists and is accessible you fucking idiot.');
		}
			
		global.Config = JSON.parse(result);
		return resolve();
	}),

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
	})
];
	
// run all tasks sequentially
Promise.all(tasks).then(doneInit).catch((err) => {
	// the fucky logic in this next line is equivalent to (err.stack ? err.stack : err)
	console.error(`Init error: ${(err.stack||err)}`);
	process.exit(1);
});

function doneInit() {
	logger.error('Done initializing program!');
}
