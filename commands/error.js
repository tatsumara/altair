module.exports = {
	name: 'error',
	aliases: ['err'],
	description: 'Intionally causes an error.',
	execute(message) {
		message.lol();
	},
};