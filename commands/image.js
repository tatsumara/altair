const { MessageEmbed } = require('discord.js');
const gis = require('g-i-s');
// g-i-s is an awesome library!
module.exports = {
	name: 'image',
	description: 'Searches on Google Images.',
	usage: 'image <search query> (You can navigate the results by sending b/n for next and back respectively!)',
	cooldown: '15',
	args: true,
	aliases: ['im', 'img'],
	execute(client, message, args, functions) {

		const query = args.join(' ');
		let safe = '';
		if (!message.channel.nsfw) {
			safe = '&safe=active';
		}
		gis({ searchTerm: query, queryStringAddition: safe }, logResults);

		// i dislike using callback functions but i don't understand enough to js to use the g-i-s library without
		async function logResults(error, results) {
			if (!results[0]) {
				return message.channel.send(functions.simpleEmbed('Nothing found!', ''));
			}

			let x = 0;
			const embed = new MessageEmbed()
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setTitle('Image Search Results:')
				.setDescription(`*"${query}"*`)
				.setColor('#0073E6')
				.setImage(results[x].url)
				.setFooter(`Page ${x + 1} - Navigate with b/n \nConfused? do 'help image'`);
			const imageMessage = await message.channel.send(embed);
			const expiration = Date.now() + 60000;
			const filter = m => m.author.id === message.author.id;

			// async/await is actually super helpful, i should use it more
			while (Date.now() < expiration) {
				const collected = await imageMessage.channel.awaitMessages(filter, { max: 1, time: 60000, error: 'time' });
				if (error || collected.array().length === 0) return;
				if (collected.array()[0].content.toLowerCase() === 'n') x++;
				else if (collected.array()[0].content.toLowerCase() === 'b' && x > 0) x--;
				// ends the collector if user executed another command
				else if (collected.array()[0].content.toLowerCase().startsWith(process.env.prefix)) return;
				else continue;
				collected.array()[0].delete();
				imageMessage.edit(embed.setImage(results[x].url).setFooter(`Page ${x + 1} - Navigate with b/n`));
			}
		}

	},
};
