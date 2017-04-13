/*
	Plugin definition
	
	Copyright Hayden Andreyka 2017 All rights reserved.
	
	Usage: Base definition for plugins
	       All methods must return a promise
*/

class Plugin {
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
		logger.debug(`Loading ${pluginInfo.name} (v${pluginInfo.version})...`);
		this.PluginInfo = pluginInfo;
		this.FileName = __filename;
		logger.debug(`Loaded ${PluginInfo.name}!`);
	}
	
	// Entry point
	onEnable() {
		return notImplementedStub;
	}
	
	// Call for plugin to gracefully stop it's operations
	onDisable() {
		return notImplementedStub;
	}
}

// stub for non-implemented item
const notImplementedStub =
	new Promise((resolve, reject) => {
		throw new Error('Not implemented.');
	});
