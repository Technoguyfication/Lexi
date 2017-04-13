// core utilities for "low-level" stuff

global.exit = function(code = 0) {
	console.log(`Exiting with code ${code}`);
	process.exit(code);
};

process.on('SIGTERM', Shutdown);
process.on('SIGINT', Shutdown);
function Shutdown() {
	logger.info('SIGTERM detected, gracefully stopping..');
	new Promise((resolve, reject) => {
		if (BotClient)
			BotClient.destroy().then(resolve);
		else return resolve();
	}).then(() => {
		exit();
	}).catch(err => {
		logger.warn(`Error destroying client: ${err.stack}`);
		exit(1);
	});
}
