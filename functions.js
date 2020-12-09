const Discord = require('discord.js');
module.exports = {
	ezEmbed(title, desc, color) {
		const embed = new Discord.MessageEmbed()
			.setTitle(title)
			.setDescription(desc)
			.setColor(color);
		return embed;
	},
};