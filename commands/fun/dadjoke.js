const { MessageEmbed } = require('discord.js');
const got = require('got');

module.exports = {
	name: 'dadjoke',
	description: 'Tells a dad joke.',
	usage: 'dadjoke',
	args: false,
	aliases: ['joke', 'dad'],
	execute(client, message) {
		// make the request
		const headers = {
			'Accept': 'application/json',
		};
		got('https://icanhazdadjoke.com/', { headers }).then(res => {
			const { id, joke } = JSON.parse(res.body);
			// send the response
			const embed = new MessageEmbed()
				.setTitle(joke)
				.setColor('#0073E6')
				.setFooter({ text: `ID: ${id}` });
			return message.reply({ embeds: [embed] });
		});
	},
};
