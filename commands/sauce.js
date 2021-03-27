const sagiri = require('sagiri');
const { saucenaoAPIKey } = require('../config.json');
// saucenao is really cool but holy shit its api sucks (thankfully this npm module is good)
module.exports = {
	name: 'source',
	description: 'Finds the source of an image (anime/artworks/manga)',
    cooldown: '30',
    aliases: ['sauce', 'saucenao'],
	async execute(client, message, args, functions) {
        let image = '';
        // with v13.0 of discord.js i'll also implement message reply handling
        if (message.attachments.first()) {
            image = message.attachments.first().url;
        } else if (args[0] && args[0].startsWith('http')) {
            image = args[0];
        } else {
            return message.channel.send(functions.simpleEmbed('Please include an image with your message.', '', '0xFFFF00'))
        }

        message.channel.startTyping();
        const sagiriClient = sagiri(saucenaoAPIKey);
        const resultList = await sagiriClient(image)
        const results = resultList.filter(result => {
            if (result.similarity > 50.0 && result.authorName !== null) return true;
            return false; 
        })
        if (!results[0]) {
            message.channel.stopTyping();
            return message.channel.send(functions.simpleEmbed('Nothing found!', ''))
        }
        const embed = {
            color: 0x0000FF,
            title: 'Source found!',
            url: results[0].url,
            thumbnail: {
                url: results[0].thumbnail
            },
            description: `Author: ${results[0].authorName}\nSite: ${results[0].site}`,
            footer: {
                text: `Confidence: ${results[0].similarity}%`
            }
        }
        message.channel.send({ embed: embed});
        message.channel.stopTyping();
	},
};