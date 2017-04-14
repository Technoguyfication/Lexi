/*
	Tags
*/

const pluginInfo = {
	name: 'Tags',
	author: 'Hayden Andreyka <haydenandreyka@gmail.com>',
	version: '1.0.0',
	commands: ['tag', 'tags', 'createtag', 'addtag', 'deletetag', 'deltag', 'removetag']
};

// formal entry for plugin
class Tags extends PluginManager.Plugin {
	constructor() {
		super(pluginInfo);
		return this;
	}
	
	// override
	onEnable() {
		return new Promise((resolve, reject) => {
			// perform db checks, etc. here
			this.message('Startup complete!');
			return resolve();
		});
	}
	
	message(msg) {
		logger.info(`[${this.intName}] ${msg}`);
	}
}
module.exports = Tags;
