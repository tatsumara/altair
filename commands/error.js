// pretty useless module but it can come in handy to test error handlers (if i ever bother to properly catch everything)

module.exports = {
	name: 'error',
	aliases: ['err'],
	description: 'Intionally causes an error.',
	execute(message) {
		message.lol();
	},
};