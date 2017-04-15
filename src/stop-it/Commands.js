// command manager that has everything to do with commands

const builtinCommands = [
	'help',
	'plugins', 'plugin', 'pl',
	'database', 'db',
	'stats', 'stat',
	'eval', 'exec', 'update',
	'stop'
];
module.exports.builtinCommands = builtinCommands;

function isValidCommand(msg) {
	return new Promise((resolve, reject) => {
		Utility.getCommandPrefixes(msg).then(prefixes => {
			for (var i = 0; i < prefixes.length; i++) {
				if (msg.content.startsWith(prefixes[i]))
					return resolve({ isCommand: true, prefix: prefixes[i] });	// return prefix aswell so we don't have to find it twice
			}

			return resolve(false, null);
		}, reject);
	});
}
module.exports.isValidCommand = isValidCommand;

function runCommand(msg, prefix) {
	return new Promise((resolve, reject) => {
		var command = parseCommand(msg.content, prefix);
		var executor = PluginManager.getCommandExecutor(command.cmd);

		if (!executor) return;	// command does not exist

		executor(command.cmd, command.args, msg).then(() => {
			logger.silly(`finished running command ${command.cmd}`);
			return resolve();
		}).catch(er => {
			logger.warn(`Unhandled exception running command ${command.cmd} ${command.args.join(' ')}\n${er.stack}`);
			msg.channel.send(`Unhandled exception occured processing your command.`);
			return resolve();
		});
	});
}
module.exports.runCommand = runCommand;

function internalCommandHandler(cmd, args, msg) {
	return new Promise((resolve, reject) => {
		switch (cmd) {
			case 'eval':
				var output;
				let startTime = Date.now();
				try {
					output = eval(args.join(' '));	// jshint ignore: line
					console.log(output);
				} catch (er) {
					msg.channel.sendEmbed(new Discord.RichEmbed({
						//color: [255, 0, 0],
						title: `Unhandled Exception`,
						description: er.stack
					})).catch(Utility.messageCatch);
					return resolve();
				}
				let elapsedTime = Date.now() - startTime;

				msg.channel.sendEmbed(new Discord.RichEmbed({
					//color: [28, 206, 108],
					title: `Evaluation Complete | ${elapsedTime}ms`,
					description: `${output}`
				})).catch(Utility.messageCatch);
				return resolve();
		}
	});
}
module.exports.internalCommandHandler = internalCommandHandler;

function parseCommand(text, prefix) {
	let cmdStr = text.substr(prefix.length, text.length);
	let splitCmd = cmdStr.split(" ");

	let command = splitCmd[0].toLowerCase();
	let args = splitCmd.splice(1);

	return { cmd: command, args: args };
}
