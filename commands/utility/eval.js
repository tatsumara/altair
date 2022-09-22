module.exports = {
	name: 'eval',
	owner: true,
	async execute(client, message, args, functions) {
		try {
			let evaled = eval(args.join(' '));
			if (typeof evaled !== 'string') {
				// actually didn't know you could use require like this but it makes sense and is pretty cool if you only use something once
				evaled = require('util').inspect(await evaled);
			}
			// i don't understand how the code is actually executed
			message.reply({ files: [{
				attachment: Buffer.from(evaled.replace(process.env.DISCORD_TOKEN, '<token went poof>')),
				name: 'evaled.yml',
			}] });
		} catch (err) {
			return await message.reply(functions.simpleEmbed('', err.toString(), client.colors.red));
		}
	},
};