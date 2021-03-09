const fs = require('fs');
const chalk = require('chalk');
const Discord = require('discord.js');
const functions = require('./functions.js');
const { prefix, token, ownerId } = require('./config.json');

const client = new Discord.Client();
console.log(chalk.grey('[main] Initialized client.'));

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
console.log(chalk.grey(`[cmnd] Loaded ${commandFiles.length} commands.`));

client.once('ready', () => {
	console.log(chalk.blueBright('[altr] Ready!'));
});

client.on('message', message => {
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

	console.log(chalk.yellow(`[cmnd] ${message.author.tag} executed '${command.name + ' ' + args}'.`));
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
});

client.on('shardError', error => {
	console.log(chalk.redBright('[main] Websocket connection error:'));
	console.log(chalk.red(error));
});

process.on('unhandledRejection', error => {
	console.log(chalk.redBright('[main] Unhandled promise rejection:'));
	console.log(chalk.red(error));
});

client.login(token);