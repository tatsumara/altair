// pretty useless module but it can come in handy to test error handlers (if i ever bother to properly catch everything)

module.exports = {
	name: 'error',
	description: 'Intionally causes an error.',
	owner: true,
	execute(message) {
		if (message.author.id !== require('../config.json').ownerID) {
            return message.channel.send(functions.simpleEmbed('You are not permitted to use this command.', '','#FF0000'));
        };
		message.lol();
	},
};