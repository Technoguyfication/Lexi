// event catcher and manager and stuff

// on message received
BotClient.on('message', msg => {
	logger.info(`msg: ${msg}`);
});
