const Discord = require('discord.js');
const gis = require('g-i-s');

module.exports = {
	name: 'image',
	description: 'Searches on Google Images.',
    cooldown: '10',
    aliases: ['im', 'img'],
	execute(client, message, args, functions) {
        message.channel.startTyping();
        const query = args.join(' ');
        let safe = '';
        if (!message.channel.nsfw) {
            safe = '&safe=active'
        }
        gis({ searchTerm: query, queryStringAddition: safe}, logResults); 

        async function logResults(error, results) {
            if (!results[0]) {
                return message.channel.send(functions.simpleEmbed('Nothing found!', ''));
            }

            let x = 0;
            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL())
                .setTitle(`Image Search Results:`,)
                .setDescription(`*"${query}"*`)
                .setColor('0x0000FF')
                .setImage(results[x].url)
                .setFooter(`Page ${x+1}`)
            const imageMessage = await message.channel.send(embed);
            const expiration = Date.now() + 60000;
            const filter = m => m.author.id === message.author.id;

            while (Date.now() < expiration) {
                const collected = await imageMessage.channel.awaitMessages(filter, { max: 1, time: 60000, error: 'time' });
                if (error || collected.array().length === 0) return;
                if (collected.array()[0].content.toLowerCase() === 'n') x++
                else if (collected.array()[0].content.toLowerCase() === 'b' && x > 0) x--
                else continue;
                collected.array()[0].delete();
                imageMessage.edit(embed.setImage(results[x].url).setFooter(`Page ${x+1}`))
            }
        }
        message.channel.stopTyping();
	},
};
