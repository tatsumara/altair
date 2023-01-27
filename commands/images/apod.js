const { MessageEmbed } = require('discord.js');
const got = require('got');

module.exports = {
	name: 'apod',
	description: 'Displays NASA\'s Astronomy Picture of the Day.',
	slashOptions: [],

	async execute(client, interaction) {
		if (!process.env.NASA_API_KEY) return client.log.error('Please input your NASA API key in the config.');
		got(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`).then(res => {
			res = JSON.parse(res.body);
			const embed = new MessageEmbed()
				.setTitle(res.title)
				.setDescription(res.explanation)
				.setColor(client.colors.blue)
				.setImage(res.hdurl)
				.setFooter({ text: `${res.copyright} - ${res.date}` });
			interaction.editReply({ embeds: [embed] });
		});
	},
};