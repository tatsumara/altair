const { MessageEmbed } = require('discord.js');
const { GOOGLE_IMG_SCRAP } = require('google-img-scrap');
const paginate = require('../../modules/paginate.js');

module.exports = {
	name: 'image',
	description: 'Searches on Google Images.',
	usage: 'image <search query>',
	cooldown: '10',
	args: true,
	aliases: ['im', 'img'],
	async execute(client, message, args, functions) {
		const query = args.join(' ');
		const { result } = await GOOGLE_IMG_SCRAP({
			search: query,
			safeSearch: !message.channel.nsfw,
			execute(i) {
				if (!i.url.includes('gstatic.com')) return i.url;
			},
		});
		if (!result[0]) {
			return message.reply(functions.simpleEmbed('Nothing found!'));
		}
		const pages = [];
		result.forEach((res, i) => {
			const embed = new MessageEmbed()
				.setTitle('Image Search Results:')
				.setDescription(`"${query}"`)
				.setColor(client.colors.blue)
				.setImage(res)
				.setFooter({ text: `${i + 1}/${result.length} - using Google Images` });
			pages.push(embed);
		});
		paginate(message, pages);
	},
};
