/*
	Plugin definition
	
	Copyright Hayden Andreyka 2017 All rights reserved.
	
	Usage: Base definition for plugins
	       All methods must return a promise
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
		logger.debug(`Constructing base for ${pluginInfo.name} (v${pluginInfo.version})`);
		this.PluginInfo = pluginInfo;
		this.FileName = __filename;
		
		this.intName = null;
		
		this.on('loaded', () => {
			this.status = PluginManager.LOADED;
		});
		this.on('enabled', () => {
			this.status = PluginManager.ENABLED;
		});
		this.on('starting', () => {
			this.status = PluginManager.STARTING;
		});
		this.on('stopping', () => {
			this.status = PluginManager.STOPPING;
		});
		
		logger.debug(`Constructed base for ${this.PluginInfo.name}`);
	}
	
	// Entry point
	onEnable() {
		return notImplementedStub();
	}
	
	// Call for plugin to gracefully stop it's operations
	onDisable() {
		return notImplementedStub();
	}
}
module.exports = Plugin;

// stub for non-implemented item
const notImplementedStub = () => {
		new Promise((resolve, reject) => {
			throw new Error('Not implemented.');
		});
};
