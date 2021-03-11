const gis = require('g-i-s');

module.exports = {
	name: 'image',
	description: 'Searches on Google Images.',
    cooldown: '10',
    aliases: ['im', 'img'],
	execute(client, message, args, functions) {
        message.channel.startTyping();
        const query = args.join(' ');
        const options = {
            searchTerm: query,
            queryStringAddition: '&safe=active'
        }
        gis(options, logResults); 
        async function logResults(error, results) {
            if (!results[0]) {
                return message.channel.send(functions.simpleEmbed('Nothing found!', ''));
            }
            let x = 0;
            const imageEmbed = await message.channel.send(functions.simpleEmbed(`Image Search Results:`, `"${query}": Page ${x}`, '0x0000FF', results[x].url));
            const expiration = Date.now() + 60000;
            const filter = m => m.author.id === message.author.id;
            while (Date.now() < expiration) {
                const collected = await imageEmbed.channel.awaitMessages(filter, { max: 1, time: 60000 })
                if (collected.array()[0].content.toLowerCase() === 'n') x++
                else if (collected.array()[0].content.toLowerCase() === 'b' && x > 0) x--
                else continue;
                collected.array()[0].delete();
                imageEmbed.edit(functions.simpleEmbed(`Image Search Results:`, `"${query}": Page ${x}`, '0x0000FF', results[x].url))
            }
        }
        message.channel.stopTyping();
	},
};