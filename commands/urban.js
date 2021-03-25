const Discord = require('discord.js')
const got = require('got');

module.exports = {
	name: 'urban',
	description: 'Searches a word on urbandictionary.org',
    args: true,
    aliases: ['urb'],
	execute(client, message, args, functions) {
        message.channel.startTyping();
        const term = encodeURIComponent(args.join(' '))
		got(`http://api.urbandictionary.com/v0/define?term=${term}`).then(res =>{
            const result = JSON.parse(res.body);
            // thankfully instead of responding with a 404 this api just sends back nothing, meaning i don't have to catch shit
            if (!result.list[0]) {
                return message.channel.send(functions.simpleEmbed('Nothing found!', ''))
            }
            // might add some more elements to the embed later
            const embed = new Discord.MessageEmbed()
				.setTitle(`UrbanDictionary: "${args.join(' ')}"`)
				.setColor('0x0000FF')
				.setDescription(result.list[0].definition.replace(/\[/g, '').replace(/\]/g, ''))
            message.channel.send(embed)
        })
        message.channel.stopTyping();
	},
};