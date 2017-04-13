/*
	Tags
	
	Author: technoguyfication <haydenandreyka@gmail.com>
*/

const pluginInfo = {
	name: 'Tags',
	author: 'Technoguyfication',
	version: '1.0.0',
	commands: ['tag', 'tags', 'createtag', 'addtag', 'deletetag', 'deltag', 'removetag']
};

class Tags extends Plugin {
	constructor() {
		super(pluginInfo);
	}
}
module.exports = Tags;

