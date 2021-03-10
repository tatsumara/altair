const Discord = require('discord.js');
const chalk = require('chalk');
const functions = require('../functions.js');
const { prefix, ownerID } = require('../config.json');

module.exports = {
    name: 'message',
    execute(message, client) {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return;

        if (command.disabled) {
            message.channel.send(functions.simpleEmbed('This command is currently disabled.', '', '0xFF0000'));
            return;
        }

        if (!client.cooldowns.has(command.name)) {
            client.cooldowns.set(command.name, new Discord.Collection());
        }

        const timestamps = client.cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 0) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            if (Date.now() < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000; 
                return message.channel.send(functions.simpleEmbed(`Cooldown: ${timeLeft.toFixed(1)}s left.`, '', '0xFF0000'));
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        console.log(chalk.yellow(`[cmnd] ${message.author.tag} executed '${command.name + ' ' + args.join(' ')}'.`));
        try {
            command.execute(client, message, args, functions);
        }
        catch (error) {
            console.log(chalk.red('[main] An error has occured.'));
            console.log(chalk.redBright(error));
            message.channel.send(functions.simpleEmbed('', `I'm sorry, something went wrong. Please contact <@${ownerID}> if this issue persists!`, '0xFF0000'));
        }
    }
}