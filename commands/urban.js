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
        if (args.length > 1) {
            return message.channel.send(functions.simpleEmbed('Please only run this command with one word.', '', '0xFFFF00'))
        }
		got(`http://api.urbandictionary.com/v0/define?term=${args[0]}`).then(res =>{
            const result = JSON.parse(res.body);
            const embed = new Discord.MessageEmbed()
				.setTitle(`UrbanDictionary: "${args[0]}"`)
				.setColor('0x0000FF')
				.setDescription(result.list[0].definition)
            message.channel.send(embed)
        })
	},
};