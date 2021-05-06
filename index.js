const Discord = require('discord.js');
const fs = require('fs');
const chalk = require('chalk');
require('dotenv').config();

const client = new Discord.Client();
console.log(chalk.grey('[main] Initialized client.'));

// cooldown collection must be defined this early or message.js wouldn't have access to it
client.cooldowns = new Discord.Collection();

// command counter, because why not
client.commandsRan = 0;

// redirects most used events to the respective files in ./events, for example the message and ready events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	// i don't understand this code either but it works
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}
console.log(chalk.grey(`[evnt] Registered ${eventFiles.length} event listeners.`));

// builds the command collection to be used in ./events/message.js
client.commands = new Discord.Collection();

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}
console.log(chalk.grey(`[cmnd] Loaded ${client.commands.size} commands.`));

process.on('unhandledRejection', error => {
	console.error(chalk.red('[main] Unhandled promise rejection:'));
	console.error(chalk.redBright('[----]', error));
});

process.on('uncaughtException', error => {
	console.error(chalk.red('[main] Uncaught exception:'));
	console.error(chalk.redBright('[----]', error));
});

client.login(process.env.token);