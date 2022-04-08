module.exports = {
	name: 'error',
	execute(error, client) {
		client.log.error(error);
	},
};