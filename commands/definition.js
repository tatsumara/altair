const got = require('got');
const Discord = require('discord.js')

module.exports = {
	name: 'definition',
	description: 'Queries definition of a word.',
    aliases: ['def', 'define'],
	execute(client, message, args, functions) {
        if (!args[0]) {
            return message.channel.send(functions.simpleEmbed('Please run this command with the word you want to look up.', '', '0xFFFF00'))
        }
        if (args.length > 1) {
            return message.channel.send(functions.simpleEmbed('Please only run this command with one word.', '', '0xFFFF00'))
        }
        got(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${args[0]}`).then(res =>{
            const result = JSON.parse(res.body)[0];
            const embed = new Discord.MessageEmbed().setTitle(`Definition for '${args[0]}':`).setColor('0x0000FF');
            result.meanings[0].definitions.forEach(definition => {
                embed.addFields(
                    { name: definition.definition, value: `*${definition.example || 'No example.'}*` }
                )
            });
            message.channel.send(embed)
        })
	},
};