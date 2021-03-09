const fs = require('fs');
const chalk = require('chalk');
const functions = require('../functions.js');
const { prefix, token, ownerId } = require('../config.json');

module.exports = {
    name: 'message',
    execute(message, client) {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return;

        if (command.disabled) {
            const disabledEmbed = {
                color: 0xFF0000,
                description: 'This command is currently disabled.',
            };
            message.channel.send({ embed: disabledEmbed });
            return;
        }

        console.log(chalk.yellow(`[cmnd] ${message.author.tag} executed '${command.name + ' ' + args.join(' ')}'.`));
        try {
            command.execute(client, message, args, functions);
        }
        catch (error) {
            console.log(chalk.redBright('[main] An error has occured.'));
            console.log(chalk.red(error));
            const errorEmbed = {
                color: 0xFF0000,
                description: `I'm sorry, something went wrong. Please contact <@${ownerId}> if this issue persists!`,
            };
            message.channel.send({ embed: errorEmbed });
        }
    }
}