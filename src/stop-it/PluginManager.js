/*
	plugin manager copyright blah blah blah
*/

const pluginDir = __dirname + '/Plugins/';
const pluginExtension = '.js';

const PluginStatus = {
	LOADED: 0,
	ACTIVE: 1,
	
	STARTING: 2,
	STOPPING: 3
};
module.exports.PluginStatus = PluginStatus;

var pluginList = {};		// { Plugin_1-0-2: typeof(Plugin) }
var pluginFileList = [];	// ['Plugin.js', 'Plugin2.js']

// starts loading stuff
function Start() {
	return new Promise((resolve, reject) => {
		refreshPluginFiles.then(files => {
			pluginFileList = files;
		}).then();
		// TODO: this stuff
	});
}

function loadPlugin(plugin) {
	return new Promise((resolve, reject) => {
		logger.debug(`Loading plugin ${plugin}..`);
		var _p = new require(pluginDir + plugin)();	// load plugin from file
		
		_p.intName = internalPluginName(_p);		// give plugin int name
		logger.silly(`set name for ${plugin} to ${_p.name}`);
		_p.status = PluginStatus.LOADED;			// set status to loaded
		
		if (pluginList[_p.intName])
			throw new Error('Plugin already loaded.');
		
		pluginList[_p.intName] = _p;				// add to list of loaded plugins
		logger.verbose(`Loaded ${plugin} as ${_p.intName}`);
	});
}

function loadAllPlugins() {
	return new Promise((resolve, reject) => {
		var pluginLoadedList = [];
		for (plugin in pluginList) {
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
		
		Promise.all(loadQueue).then(() => {
			logger.verbose(`All plugins loaded!`);
			return resolve();
		}).catch(er => {
			logger.error(`Error loading all plugins?\n${er.stack}`);
		});
	});
	
	function unrejectable(_promise) {
		return new Promise((resolve, reject) => {
			_promise().then(() => {
				return resolve();
			}).catch(() => {
				logger.warn(`Failed to load ${plugin}\n${er.stack}`);
				return resolve();
			});
		});
	}
}

// gets list of loadable plugin files
function refreshPluginFiles() {
	return new Promise((resolve, reject) => {
		var entries = fs.readdirSync(pluginDir, 'utf8');
		for (var i = 0; i < entries.length; i++) {
			logger.silly(`plugin file candidate found: ${entries[i]}`);
			
			// prune anything not ending with the extension
			if (!entries[i].endsWith(pluginExtension)) {
				entries.splice(i, 1);
				break;
			}
			
			// prune folders out
			if (!fs.statSync(pluginDir + entries[i]).isFile()) {
				entries.splice(i, 1);
				break;
			}
		}
		return resolve(entries);
	});
}

function internalPluginName(pl) {
	if (typeof pl != Plugin)
		logger.warn(`Plugin that does not extend Plugin!`).silly(pl);
	
	if (!(pl.PluginInfo.name && pl.PluginInfo.version))
		throw new Error('Plugin does not contain name/version.');
	
	// "Plugin", "1.2.3" -> "Plugin_1-2-3"
	return `${pl.PluginInfo.name}_${pl.PluginInfo.version.replace('.', '-')}`;
}
