const { MessageEmbed } = require('discord.js');
const got = require('got');

module.exports = {
	name: 'dad_joke',
	description: 'Says a dad joke.',
	usage: 'dad_joke',
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
				.setTitle(`Joke (id ${id})`)
				.setColor('#0073E6')
				.setDescription(joke);
			return message.channel.send({ embeds: [embed] });
		});
	},
};

module.exports.execute();
