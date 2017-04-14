// ultra simple object that caches stuff

const Cache = {
	Add: (name, data, timeout = 3000 * 1000) => {
		Cache[name] = data;

		logger.silly(`Added ${name} to cache: ${data}`);

		setTimeout(() => {
			if (Cache[name])
				delete Cache[name];
		}, timeout);
	},
	Delete: (name) => {
		logger.silly(`Deleting ${name} from cache.`);
		delete Cache[name];
	}
};
module.exports = Cache;
