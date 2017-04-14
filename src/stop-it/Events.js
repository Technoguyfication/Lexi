// event catcher and manager and stuff

// on message received
BotClient.on('message', msg => {
	Commands.isValidCommand(msg).catch(er => {
		console.log(er.stack);
	});
});
