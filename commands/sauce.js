const got = require('got');
// saucenao is really cool but holy shit its api sucks
module.exports = {
	name: 'sauce',
	description: 'Finds the source of an image (anime/artworks/manga)',
    cooldown: '30',
    aliases: ['source', 'saucenao'],
	execute(client, message, args, functions) {
        const url = 'https://saucenao.com/search.php?api_key=449d9b8b9c82c93d11acdacb7fd225c4a8870df3&db=999&output_type=2&numres=1&url='
        let image = '';
        if (message.attachments.first()) {
            image = encodeURIComponent(message.attachments.first().url);
        } else if (args[0] && args[0].startsWith('http')) {
            image = encodeURIComponent(args[0]);
        } else {
            return message.channel.send(functions.simpleEmbed('Please include an image with your message.', ''))
        }
        message.channel.startTyping();
        got(url + image).then(res => {
            const result = JSON.parse(res.body).results[0];
            if (result.header.similarity < 50) {
                return message.channel.send(functions.simpleEmbed('No confident source found.', ''))
            }
            // if only this api would properly store the values under one unified variable instead of a different one for every different source \:
            const title = result.data.title || 'Source found!';
            const titleURL = result.data.source || result.data.ext_urls[0];
            const thumbURL = result.header.thumbnail;
            const author = result.data.member_name || result.data.creator || result.data.author_name;
            // declaring all these consts is probably unnecessary but i gotta rework this command sometime anyway
            const embed = {
                title: title,
                url: titleURL,
                thumbnail: {
                    url: thumbURL,
                },
                description: `Author: ${author}`
            };
            message.channel.send({ embed: embed })
        })
        message.channel.stopTyping();
	},
};