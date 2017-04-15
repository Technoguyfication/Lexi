// command manager that has everything to do with commands

const builtinCommands = [
	'help',
	'plugins', 'plugin', 'pl',
	'database', 'db',
	'stats', 'stat',
	'eval', 'exec', 'update'
];

function isValidCommand(msg) {
	return new Promise((resolve, reject) => {
		Utility.getCommandPrefixes(msg).then(prefixes => {
			for (var i = 0; i < prefixes.length; i++) {
				if (msg.content.startsWith(prefixes[i]))
					return resolve(true);
			}

			return resolve(false);
		}, reject);
	});
}
module.exports.isValidCommand = isValidCommand;
