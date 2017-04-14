// main module for bot-related activities.

global.BotClient = new Discord.Client(Config.Discord.ClientOptions);

require('./Events.js');	// bot events established before client login
global.PluginManager = require('./PluginManager.js');

// start bot by logging in etc.
function botStart() {
	return new Promise((resolve, reject) => {
		BotClient.login(Config.Discord.Token).then(token => {
			logger.verbose('Client login complete');
			logger.debug(`Token: ${token}`);
			PluginManager.Start().then(() => {
				// plugin manager done
			});
		}).catch(err => {
			logger.error(`Failed to login to Discord: ${err.stack}`);
			exit(1);
		});
	});
}
module.exports.botStart = botStart;
