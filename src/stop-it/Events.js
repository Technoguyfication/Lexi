// event catcher and manager and stuff

// on message received
BotClient.on('message', msg => {
	Commands.isValidCommand(msg).then(isCommand => {
		console.log(isCommand);
	}).catch(er => {
		logger.warn(`Error checking command: ${er.stack}`);
	});
});
