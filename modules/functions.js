// this module just stores a bunch of client.functions i use often

const Discord = require('discord.js');
module.exports = {
	simpleEmbed(title, desc, color, image) {
		const embed = new Discord.MessageEmbed()
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
	},
	convertMS(milliseconds) {
		let day, hour, minute, seconds;
		seconds = Math.floor(milliseconds / 1000);
		minute = Math.floor(seconds / 60);
		seconds = seconds % 60;
		hour = Math.floor(minute / 60);
		minute = minute % 60;
		day = Math.floor(hour / 24);
		hour = hour % 24;
		const duration = `${day}:${hour.toLocaleString('en-US', {minimumIntegerDigits: 2})}:${minute.toLocaleString('en-US', {minimumIntegerDigits: 2})}:${seconds.toLocaleString('en-US', {minimumIntegerDigits: 2})}`
		return duration;
	}
};
