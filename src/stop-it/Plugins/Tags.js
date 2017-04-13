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
	}
	
	// override
	onEnable() {
		message('Enabling Tags...');
		// perform db checks, etc. here
		message('Tags enabled!');
	}
}
module.exports = Tags;

function message(msg) {
	logger.info(`[Tags] ${msg}`);
}
