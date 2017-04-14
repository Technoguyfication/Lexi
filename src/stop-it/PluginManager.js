/*
	plugin manager copyright blah blah blah
*/

global.Plugin = require('./Types/Plugin.js');

const pluginDir = './Plugins/';
const fullPluginDir = `${__dirname}/${pluginDir}`;
const pluginExtension = '.js';

const PluginStatus = {
	LOADED: 1,
	ENABLED: 2,
	
	STARTING: 3,
	STOPPING: 4
};
module.exports.PluginStatus = PluginStatus;

var pluginList = {};		// { Plugin_1-0-2: typeof(Plugin) }
var pluginFileList = [];	// ['Plugin.js', 'Plugin2.js']

// starts loading stuff
function Start() {
	return new Promise((resolve, reject) => {
		logger.info(`Loading plugins..`);
		refreshPluginFiles().then(files => {
			pluginFileList = files;
			logger.debug(`Loaded ${pluginFileList.length} plugin file entries..`);
			return loadAllPlugins();
		}).then(() => {
			logger.info(`Loaded ${Object.entries(pluginList).length} plugins into memory.`);
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
		logger.debug(`Disabling ${plugin.intName}`);
		switch (plugin.status) {
			case PluginStatus.LOADED:
				throw new Error('Plugin already disabled/loaded.');
			case PluginStatus.ENABLED:
				plugin.onDisable().then(() => {
					plugin.emit('disabled');
					return resolve();
				}).catch(er => {
					unloadPlugin(plugin);
					return reject(`Error disabling ${plugin.intName}:\n${er.stack}`);
				});
				break;
			case PluginStatus.STARTING:
				plugin.once('enabled', () => {
					disablePlugin(plugin).then(resolve);
				});
				break;
			case PluginStatus.STOPPING:
				throw new Error('Plugin already being disabled.');
		}
	});
}
module.exports.disablePlugin = disablePlugin;

function enablePlugin(plugin) {
	return new Promise((resolve, reject) => {
		logger.debug(`Enabling ${plugin.intName}`);
		switch (plugin.status) {
			case PluginStatus.LOADED:	// ready to enable
				plugin.onEnable().then(() => {
					plugin.emit('enabled');
					return resolve();
				}).catch(er => {
					unloadPlugin(plugin);
					return reject(`Uncaught exception enabling ${plugin.intName}:\n${er.stack}`);
				});
				break;
			case PluginStatus.ENABLED:	// already enabled
				throw new Error('Plugin already enabled.');
			case PluginStatus.STARTING:	// already enabling
				throw new Error('Plugin already being enabled.');
			case PluginStatus.STOPPING:	// disabling, wait and then reenable it
				plugin.once('disabled', () => {
					enablePlugin(plugin).then(resolve);
				});
				break;
		}
	});
}
module.exports.enablePlugin = enablePlugin;

function loadPlugin(plugin) {
	return new Promise((resolve, reject) => {
		logger.debug(`Loading plugin file ${plugin}..`);
		
		var _p = new (require(pluginDir + plugin))();
		
		_p.intName = internalPluginName(_p);		// give plugin int name
		_p.status = PluginStatus.LOADED;			// set status to loaded
		
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
			if (pluginList[plugin].status != PluginStatus.LOADED)
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
		logger.info('Enabling all plugins..');
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
		return resolve(entries);
	});
}
module.exports.refreshPluginFiles = refreshPluginFiles;

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
