const Discord = require('discord.js')
const got = require('got');

module.exports = {
	name: 'urban',
	description: 'Searches a word on urbandictionary.org',
    aliases: ['urb'],
	execute(client, message, args, functions) {
		if (!args[0]) {
            return message.channel.send(functions.simpleEmbed('Please run this command with the word you want to look up.', '', '0xFFFF00'))
        }
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
				.setDescription(result.list[0].definition)
            message.channel.send(embed)
        })
        message.channel.stopTyping();
	},
};