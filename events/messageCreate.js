const functions = require('../modules/functions.js');

module.exports = {
	name: 'messageCreate',
	async execute(message) {
		if (!message.content.toLowerCase().startsWith(process.env.PREFIX) || message.author.bot) return;
		message.reply(functions.simpleEmbed('Legacy commands have been removed!', 'From now on altair only uses slash commands.'));
	},
};