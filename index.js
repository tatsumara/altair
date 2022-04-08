const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const intents = [
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MEMBERS,
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	Intents.FLAGS.DIRECT_MESSAGES,
];
const client = new Client({
	retryLimit: 3,
	intents: intents,
	partials: ['CHANNEL'],
	presence: {
		activities: [{
			type: 'WATCHING',
			name: 'the quadrant.',
		}],
	},
});
client.log = require('consola');
// cooldown collection must be defined this early or message.js wouldn't have access to it
client.cooldowns = new Collection();

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
client.log.info(`Registered ${eventFiles.length} event listeners.`);

// builds the command collection to be used in ./events/message.js
client.commands = new Collection();

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		command.category = folder;
		client.commands.set(command.name, command);
	}
}
client.log.info(`Loaded ${client.commands.size} commands.`);

process.on('unhandledRejection', error => {
	client.log.error('Unhandled promise rejection:');
	client.log.error(error);
});

process.on('uncaughtException', error => {
	client.log.error('Uncaught exception:');
	client.log.error(error.stack);
});

client.login();