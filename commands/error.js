// pretty useless module but it can come in handy to test error handlers (if i ever bother to properly catch everything)

module.exports = {
	name: 'error',
	aliases: ['err'],
	description: 'Intionally causes an error.',
	execute(message) {
		if (message.author.id !== require('../config.json').ownerID) {
            return message.channel.send(functions.simpleEmbed('You are not permitted to use this command.', '','0xFF0000'));
        };
		message.lol();
	},
};