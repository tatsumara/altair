const Discord = require('discord.js');
const chalk = require('chalk');
const functions = require('../functions.js');
const { prefix, ownerID } = require('../config.json');

// this is pretty much the meat of this entire bot. complete command handler, cooldowns, aliases, toggles, error handler, you name it.

module.exports = {
    name: 'message',
    async execute(message, client) {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        // this removes the prefix, seperates the command and declares the arguments
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // searches command in collection, includes aliases
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return;

        if (command.disabled) {
            message.channel.send(functions.simpleEmbed('This command is currently disabled.', '', '0xFF0000'));
            return;
        }

        // a collection inside of a collection??? i know i know, i don't know
        if (!client.cooldowns.has(command.name)) {
            client.cooldowns.set(command.name, new Discord.Collection());
        }

        // bit wasteful declarations in here, but it makes everything readable
        const timestamps = client.cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 0) * 1000;

        // just checks if message author has executed command before cooldown runs out and acts accordingly
        if (timestamps.has(message.author.id) && message.author.id !== ownerID) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            if (Date.now() < expirationTime) {
                return message.react('⏱️')
            }
        }

        timestamps.set(message.author.id, Date.now());
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        // this is the main bit that actually executes the command and catches any errors (i might add more info to the console.log())
        console.log(chalk.yellow(`[cmnd] ${message.author.tag} ran '${command.name} ${args.join(' ')}'`));
        try {
            await command.execute(client, message, args, functions);
        }
        catch (error) {
            console.log(chalk.red(`[main] An error has occured in '${command.name} ${args.join(' ')}'!`));
            console.log(chalk.redBright(error.stack));
            message.channel.send(functions.simpleEmbed('', `I'm sorry, something went wrong. Please contact <@${ownerID}> if this issue persists!`, '0xFF0000'));
        }
    }
}