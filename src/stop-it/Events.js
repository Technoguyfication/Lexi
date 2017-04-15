// event catcher and manager and stuff

// on message received
BotClient.on('message', msg => {
	Commands.isValidCommand(msg).then((commandStatus) => {
		if (commandStatus.isCommand) {
			Commands.runCommand(msg, commandStatus.prefix).catch(er => {
				logger.warn(`Unhandled command run exception: ${er.stack}`);
			});
		}
	}).catch(er => {
		logger.warn(`Error checking command: ${er.stack}`);
	});

	if (msg.author.equals(BotClient.user)) {
		logger.info(`BOT: ${(msg.guild.name || "Private")} / ${(msg.channel.name || msg.channel.recipient.username)}: ${msg.content}`);
	}
});
