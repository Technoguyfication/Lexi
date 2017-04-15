/*
	Plugin definition
	
	Copyright Hayden Andreyka 2017 All rights reserved.
	
	Usage: Base definition for plugins
	       All methods except ctor must return a promise
*/

class Plugin extends EventEmitter {
	///
	// Ctor requires an object containing plugin data.
	//
	/*
		e.g.
		{
			name: 'My Plugin',
			version: '1.2.3',
			author: 'John Doe <jdoe@example.com>',
			commands: ['top', 'kek']
		}
	*/
	///
	constructor(pluginInfo) {
		logger.silly(`Constructing base for ${pluginInfo.name} (v${pluginInfo.version})`);
		super();
		this.PluginInfo = pluginInfo;
		this.FileName = __filename;
		
		this.intName = null;
		this.status = null;
		
		this.on('disabled', () => {
			this.status = PluginManager.PluginStatus.LOADED;
		});
		this.on('enabled', () => {
			this.status = PluginManager.PluginStatus.ENABLED;
		});
		this.on('starting', () => {
			this.status = PluginManager.PluginStatus.STARTING;
		});
		this.on('stopping', () => {
			this.status = PluginManager.PluginStatus.STOPPING;
		});
		
		logger.silly(`Constructed base for ${this.PluginInfo.name}`);
	}
	
	// Entry point
	onEnable() {
		return new Promise((resolve, reject) => {
			logger.warn(`onEnable not implemented for ${this.intName}`);
			return resolve();
		});
	}
	
	// Call for plugin to gracefully stop it's operations
	onDisable() {
		return new Promise((resolve, reject) => {
			logger.warn(`onDisable not implemented for ${this.intName}`);
			return resolve();
		});
	}

	// command has been ran
	onCommand(command, args, msg) {
		return new Promise((resolve, reject) => {
			logger.warn(`onCommand not implemented for ${this.intName}`);
			return resolve();
		});
	}
}
module.exports = Plugin;
