module.exports = {
	name: 'warn',
	execute(warn, client) {
		client.log.info(warn);
	},
};