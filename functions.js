// this module just stores a bunch of functions i use often

const { MessageEmbed } = require('discord.js');
module.exports = {
	simpleEmbed(title, desc, color, image) {
		const embed = new MessageEmbed()
			.setTitle(title)
			.setDescription(desc)
			.setColor(color)
			.setImage(image);
		return embed;
	},
	cleanEval(text) {
		// i honestly have no idea what exactly this does
		if (typeof text === 'string') {
			return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
		} else {
			return text;
		}
	}
};