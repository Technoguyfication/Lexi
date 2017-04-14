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
class Tags extends Plugin {
	constructor() {
		super(pluginInfo);
		return this;
	}
	
	// override
	onEnable() {
		return new Promise((resolve, reject) => {
			message('Enabled!');
			// perform db checks, etc. here
			message('Enabled!');
		});
	}
}
module.exports = Tags;

function message(msg) {
	logger.info(`[${this.intName}] ${msg}`);
}
