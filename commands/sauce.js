const sagiri = require('sagiri');
const config = require('../config.json');
const chalk = require('chalk');
// saucenao is really cool but holy shit its api sucks (thankfully this npm module is good)
module.exports = {
	name: 'source',
	description: 'Finds the source of an image (anime/artworks/manga)',
    cooldown: '30',
    aliases: ['sauce', 'saucenao'],
	async execute(client, message, args, functions) {
        if (!config.saucenaoAPIKey) return console.log(chalk.red('[cmnd] Please input your SauceNAO API key in the config.'))
        let image = '';
        // with v13.0 of discord.js i'll also implement message reply handling
        if (message.attachments.first()) {
            image = message.attachments.first().url;
        } else if (args[0] && args[0].startsWith('http')) {
            image = args[0];
        } else {
            const messages = await message.channel.messages.fetch({ limit: 15 });
            found = messages.find(msg => msg.attachments.first());
            if (found) image = found.attachments.first().url;
            if (!image) return message.channel.send(functions.simpleEmbed('Please include an image with your message.', '', '0xFFFF00'))
        }
        
        const sagiriClient = sagiri(config.saucenaoAPIKey);
        const resultList = await sagiriClient(image)
        const results = resultList.filter(result => {
            if (result.similarity > 50.0 && result.authorName !== null) return true;
            return false; 
        })
        if (!results[0]) {
            const failEmbed = {
                title: 'Nothing found!',
                thumbnail: {
                    url: image,
                }
            }
            return message.channel.send({ embed: failEmbed });
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
        
	},
};