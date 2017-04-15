/*
	plugin manager copyright blah blah blah
*/

const Plugin = require('./Types/Plugin.js');
module.exports.Plugin = Plugin;

const pluginDir = './Plugins/';
// this is required because fs is relative to the main module, and require() is relative to this module
const fullPluginDir = `${__dirname}/${pluginDir}`;

const pluginExtension = '.js';

const PluginStatus = {
	DISABLED: 1,
	ENABLED: 2,
	
	STARTING: 3,
	STOPPING: 4
};
module.exports.PluginStatus = PluginStatus;

var pluginList = {};		// { 'Plugin_1.0.2': instanceof(Plugin) }
module.exports.pluginList = pluginList;

var pluginFileList = [];	// ['Plugin.js', 'Plugin2.js']

// starts loading stuff
function Start() {
	return new Promise((resolve, reject) => {
		logger.info(`Loading plugins..`);
		refreshPluginFiles().then(() => {
			logger.debug(`Loaded ${pluginFileList.length} plugin file entries.`);
			return loadAllPlugins();
		}).then(() => {
			logger.verbose(`Loaded ${Object.entries(pluginList).length} plugins into memory.`);
			return enableAllPlugins();
		}).then(() => {
			logger.info(`All plugins enabled.`);
		}).catch(er => {
			logger.error(`Error occured loading and enabling plugins:\n${er.stack}`);
		});
	});
}
module.exports.Start = Start;

function disablePlugin(plugin) {
	return new Promise((resolve, reject) => {
		logger.info(`Disabling ${plugin.intName}`);
		switch (plugin.status) {
			case PluginStatus.DISABLED:
				throw new Error('Plugin already disabled/loaded.');
			case PluginStatus.ENABLED:
				// timeout so if something goes wrong it doesn't hang endlessly.
				var disableTimout = setTimeout(() => {
					let pName = plugin.intName;
					unloadPlugin(plugin);
					return reject(`${pName} took too long to disable, unloading.`);
				}, 30*1000);	// 30s
				
				plugin.emit('stopping');
				plugin.onDisable().then(() => {
					clearTimeout(disableTimout);
					plugin.emit('disabled');
					Cache.Delete('commandList');
					logger.info(`${plugin.intName} disabled.`);
					return resolve();
				}).catch(er => {
					let pName = plugin.intName;
					unloadPlugin(plugin);
					return reject(`Error disabling ${pName}:\n${er.stack}`);
				});
				break;
			case PluginStatus.STARTING:
				plugin.once('enabled', () => {
					disablePlugin(plugin).then(resolve).catch(er => {
						logger.warn(`Failed to disable previous starting plugin`);
						return;
					});
				});
				break;
			case PluginStatus.STOPPING:
				throw new Error('Plugin already being disabled.');
			default:
				throw new Error(`Unaccounted for value: ${plugin.status}`);
		}
	});
}
module.exports.disablePlugin = disablePlugin;

function enablePlugin(plugin) {
	return new Promise((resolve, reject) => {
		logger.info(`Enabling ${plugin.intName}`);
		switch (plugin.status) {
			case PluginStatus.DISABLED:	// ready to enable
				plugin.emit('starting');
				plugin.onEnable().then(() => {
					plugin.emit('enabled');
					Cache.Delete('commandList');
					logger.info(`${plugin.intName} enabled.`);
					return resolve();
				}).catch(er => {
					let pName = plugin.intName;
					unloadPlugin(plugin);
					return reject(`Uncaught exception enabling ${pName}:\n${er.stack}`);
				});
				break;
			case PluginStatus.ENABLED:	// already enabled
				throw new Error('Plugin already enabled.');
			case PluginStatus.STARTING:	// already enabling
				throw new Error('Plugin already being enabled.');
			case PluginStatus.STOPPING:	// disabling, wait and then reenable it
				plugin.once('disabled', () => {
					enablePlugin(plugin).then(resolve).catch(er => {
						logger.warn('Failed to enable previous stopping plugin.');
						return;
					});
				});
				break;
			default:
				throw new Error(`Unaccounted for value: ${plugin.status}`);
		}
	});
}
module.exports.enablePlugin = enablePlugin;

function loadPlugin(plugin) {
	return new Promise((resolve, reject) => {
		logger.debug(`Loading plugin file ${plugin}..`);
		
		var _p = new (require(pluginDir + plugin))();
		
		_p.intName = internalPluginName(_p);		// give plugin int name
		_p.status = PluginStatus.DISABLED;			// set status to loaded
		
		if (pluginList[_p.intName])
			throw new Error('Plugin already loaded.');
		
		pluginList[_p.intName] = _p;				// add to list of loaded plugins
		logger.verbose(`Loaded plugin ${_p.intName}`);
		return resolve();
	});
}
module.exports.loadPlugin = loadPlugin;

function disableAllPlugins() {
	return new Promise((resolve, reject) => {
		logger.info('Disabling all plugins...');
		var disableQueue = [];
		for (var plugin in pluginList) {
			if (pluginList[plugin].status != PluginStatus.DISABLED)
				disableQueue.push(unrejectable(disablePlugin(pluginList[plugin])));
		}
		Promise.all(disableQueue).then(resolve).catch(er => {
			logger.warn(`Failed disabling all plugins:\n${er.stack}`);
			return resolve();
		});
	});
}
module.exports.disableAllPlugins = disableAllPlugins;

function enableAllPlugins() {
	return new Promise((resolve, reject) => {
		logger.verbose('Enabling all plugins..');
		var enableQueue = [];
		for (var plugin in pluginList) {
			if (pluginList[plugin].status != PluginStatus.ENABLED)
				enableQueue.push(unrejectable(enablePlugin(pluginList[plugin])));
		}
		Promise.all(enableQueue).then(resolve).catch(er => {
			logger.warn(`Failed enabling all plugins:\n${er.stack}`);
			return resolve();
		});
	});
}
module.exports.enableAllPlugins = enableAllPlugins;

function loadAllPlugins() {
	return new Promise((resolve, reject) => {
		logger.verbose('Loading all plugins...');
		var pluginLoadedList = [];
		for (var plugin in pluginList) {
			pluginLoadedList.push(pluginList[plugin].FileName);
		}
		
		var loadQueue = [];
		
		pluginFileList.forEach((plugin, index, arr) => {
			if (pluginLoadedList.includes(plugin)) {
				logger.debug(`${plugin} already loaded when trying to load all.`);
				return;
			}
			loadQueue.push(unrejectable(loadPlugin(plugin)));
		});
		
		Promise.all(loadQueue).then(resolve).catch(er => {
			logger.warn(`Error loading all plugins?\n${er.stack}`);
			return resolve();
		});
	});
}
module.exports.loadPlugin = loadPlugin;

// gets list of loadable plugin files
function refreshPluginFiles() {
	return new Promise((resolve, reject) => {
		var entries = fs.readdirSync(fullPluginDir, 'utf8');
		for (var i = 0; i < entries.length; i++) {
			logger.silly(`plugin file candidate found: ${entries[i]}`);
			
			// prune anything not ending with the extension
			if (!entries[i].endsWith(pluginExtension)) {
				entries.splice(i, 1);
				break;
			}
			
			// prune folders out
			if (!fs.statSync(fullPluginDir + entries[i]).isFile()) {
				entries.splice(i, 1);
				break;
			}
		}
		pluginFileList = entries;
		return resolve();
	});
}
module.exports.refreshPluginFiles = refreshPluginFiles;

function getPlugin(name) {
	for (var plugin in pluginList) {
		if (pluginList[plugin].name == name)
			return pluginList[plugin];
	}
	throw new Error(`Could not find plugin by name ${name}`);
}
module.exports.getPlugin = getPlugin;

function unloadPlugin(plugin) {
	logger.info(`Unloading plugin ${plugin.intName}`);
	delete(pluginList[plugin.intName]);
}
module.exports.unloadPlugin = unloadPlugin;

function internalPluginName(pl) {
	if (!(pl instanceof Plugin)) {
		logger.warn(`"Plugin" that does not extend instance of Plugin!`);
		logger.silly(pl);
	}
	
	if (!(pl.PluginInfo.name && pl.PluginInfo.version))
		throw new Error('Plugin does not contain name/version.');
	
	// "Plugin", "1.2.3" -> "Plugin_1.2.3"
	return `${pl.PluginInfo.name}_${pl.PluginInfo.version}`;
}

// retreives a command executor for the command string if possible
function getCommandExecutor(command) {
	if (Cache.commandList)
		return Cache.commandList;

	var commandRefs = {};

	// build internal command list first
	Commands.builtinCommands.forEach(cmd => {
		addExecutor(cmd, Commands.internalCommandHandler);
	});

	for (var plugin in pluginList) {
		addPluginExecutor(plugin);
	}

	Cache.Add('commandList', commandRefs, 900 * 1000);	// 15mins timeout
	return commandRefs;

	function addPluginExecutor(plugin) {
		pluginList[plugin].PluginInfo.commands.forEach(cmd => {
			addExecutor(cmd, pluginList[plugin].onCommand);
		});
	}

	function addExecutor(cmd, exec) {
		if (commandRefs[cmd])
			logger.warn(`Command executor for ${cmd} already exists!`);

		commandRefs[cmd] = exec;
	}
}
module.exports.getCommandExecutor = getCommandExecutor;

function unrejectable(_promise) {
	return new Promise((resolve, reject) => {
		_promise.then(() => {
			return resolve();
		}).catch(er => {
			logger.warn(`Rejected item:\n${er?er.stack:'--Stacktrace Unavailable--\n'+er}`);
			return resolve();
		});
	});
}
