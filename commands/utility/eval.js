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
			message.channel.send({ files: [{
				attachment: Buffer.from(evaled),
				name: 'evaled.rb',
			}] });
		} catch (err) {
			message.channel.send(err, { code: 'js' });
		}
	},
};