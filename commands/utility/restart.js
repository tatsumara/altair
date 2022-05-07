module.exports = {
	name: 'restart',
	owner: true,
	execute(client) {
		client.log.success('Forcing restart of Altair.');
		client.destroy();
	},
};