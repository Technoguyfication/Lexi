// event catcher and manager and stuff

// on message received
BotClient.on('message', msg => {
	Commands.isValidCommand(msg).then((commandStatus) => {
		if (commandStatus.isCommand) {
			Commands.runCommand(msg, commandStatus.prefix).catch(er => {
				logger.warn(`Unhandled command run exception: ${er.stack}`);
			});
		} else
			logMessage(msg);
	}).catch(er => {
		logger.warn(`Error checking command: ${er.stack}`);
	});



	function logMessage(msg) {
		if (msg.author.equals(BotClient.user)) {
			if (msg.guild) {
				logger.info(`BOT: ${msg.guild.name} / ${msg.channel.name}: ${msg.content}${msg.embeds ? "[Embed]" : ""}`);
				logger.silly(`BOT: ${msg.guild.id} / ${msg.guild.name} - ${msg.channel.id} / ${msg.channel.name}: ${msg.content}${msg.embeds ? "[Embed]" : ""}`);
			} else {
				logger.info(`BOT: (Private) ${msg.channel.recipient.username}: ${msg.content}${msg.embeds ? "[Embed]" : ""}`);
				logger.silly(`BOT: (Private) ${msg.channel.recipient.id} / ${msg.channel.recipient.username}: ${msg.content}${msg.embeds ? "[Embed]" : ""}`);
			}
		}
	}
});
