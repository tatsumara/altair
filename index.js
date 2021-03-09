const fs = require('fs');
const chalk = require('chalk');
const Discord = require('discord.js');
const functions = require('./functions.js');
const token = require('./config.json').token;

const client = new Discord.Client();
console.log(chalk.grey('[main] Initialized client.'));

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}
console.log(chalk.grey(`[cmnd] Loaded ${eventFiles.length} event listeners.`));

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
console.log(chalk.grey(`[cmnd] Loaded ${commandFiles.length} commands.`));

process.on('unhandledRejection', error => {
	console.log(chalk.redBright('[main] Unhandled promise rejection:'));
	console.log(chalk.red(error));
});

client.login(token);