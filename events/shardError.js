module.exports = {
	name: 'shardError',
	execute(error, client) {
		client.log.error('Websocket connection error:');
		client.log.error(error);
	},
};