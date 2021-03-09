const Discord = require('discord.js');
module.exports = {
	ezEmbed(title, desc, color, image) {
		const embed = new Discord.MessageEmbed()
			.setTitle(title)
			.setDescription(desc)
			.setColor(color)
			.setImage(image);
		return embed;
	},
	cleanEval(text) {
		if (typeof text === 'string') {
			return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
		} else {
			return text;
		}
	}
};