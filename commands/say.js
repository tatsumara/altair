module.exports = {
	name: 'say',
	aliases: ['speak', 'echo'],
	description: 'Repeats anything you say.',
	usage: 'say [message]',
	disabled: false,
	execute(client, message, args, functions) {
		if (!args[0]) {
			message.channel.send(functions.simpleEmbed('What do you want me to say?', ''))
			return;
		}
		message.channel.send(args.join(' '));
		message.delete();
	},
};