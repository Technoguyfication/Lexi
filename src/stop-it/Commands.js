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
			console.log(prefixes);
		}, reject);
	});
}
module.exports.isValidCommand = isValidCommand;
