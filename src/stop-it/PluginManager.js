/*
	plugin manager copyright blah blah blah
*/

const pluginDir = __dirname + '/Plugins/';
const pluginExtension = '.js';

var pluginList = {};
var pluginFileList = [];

// starts loading stuff
function Start() {
	return new Promise((resolve, reject) => {
		refreshPluginFiles.then(files => {
			pluginFileList = files;
		}).then();
		// TODO: this stuff
	});
}

function loadPlugin() {
	
}

function loadAllPlugins() {
	pluginFileList.forEach((plugin, index, arr) => {
		try {
			let _p = new require(pluginDir + plugin)();
			//if 
		} catch(er) {
			// do some stuff
		}
		
	});
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
