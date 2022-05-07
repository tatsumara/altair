const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'messageCreate',
	async execute(message, client) {
		if (!message.content.toLowerCase().startsWith(process.env.PREFIX) || message.author.bot) return;
		const embed = new MessageEmbed()
			.setDescription('**Thanks to porta, altair uses exclusively slash commands now! Try it out with `/help`!**')
			.setColor(client.colors.yellow);
		message.reply({ embeds: [embed] });
	},
};