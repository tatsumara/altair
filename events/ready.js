module.exports = {
	name: 'ready',
	once: 'true',
	execute(client) {
		client.log.success(`Ready to serve on ${client.guilds.cache.size} servers!`);
	},
};