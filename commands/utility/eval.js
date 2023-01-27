module.exports = {
	name: 'eval',
	description: 'Evaluates a JS expression.',
	owner: true,
	slashOptions: [
		{ name: 'expression', description: 'expression to evaluate', type: 3, required: true },
	],

	async execute(client, interaction, functions) {
		try {
			let evaled = eval(interaction.options.getString('expression'));
			if (typeof evaled !== 'string') {
				// actually didn't know you could use require like this but it makes sense and is pretty cool if you only use something once
				evaled = require('util').inspect(await evaled);
			}
			// i don't understand how the code is actually executed
			await interaction.editReply({ files: [{
				attachment: Buffer.from(evaled.replace(process.env.DISCORD_TOKEN, '<token went poof>')),
				name: 'evaled.yml',
			}] });
		} catch (err) {
			await interaction.editReply(functions.simpleEmbed('', err.toString(), client.colors.red));
		}
	},
};