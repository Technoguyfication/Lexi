// command manager that has everything to do with commands

const builtinCommands = [
	'help',
	'plugins', 'plugin', 'pl',
	'database', 'db',
	'stats', 'stat',
	'eval', 'exec', 'update'
];
module.exports.builtinCommands = builtinCommands;

function isValidCommand(msg) {
	return new Promise((resolve, reject) => {
		Utility.getCommandPrefixes(msg).then(prefixes => {
			for (var i = 0; i < prefixes.length; i++) {
				if (msg.content.startsWith(prefixes[i]))
					return resolve(true, prefixes[i]);	// return prefix aswell so we don't have to find it twice
			}

			return resolve(false);
		}, reject);
	});
}
module.exports.isValidCommand = isValidCommand;

function runCommand(msg, prefix) {
	return new Promise((resolve, reject) => {
		var command = parseCommand(msg.content, prefix);
		PluginManager.getCommandExecutor(command.cmd)(command.cmd, command.args, msg).then(() => {

		}, reject);
	});
}

function internalCommandHandler(cmd, args, msg) {
	return new Promise((resolve, reject) => {

	});
}
module.exports.internalCommandHandler = internalCommandHandler;

function parseCommand(text, prefix) {
	let cmdStr = text.substr(prefix.length, text.length);
	let splitCmd = cmdStr.split(" ");

	let command = splitCmd[0];
	let args = splitCmd.splice(1);

	return { cmd: command, args: args };
}
