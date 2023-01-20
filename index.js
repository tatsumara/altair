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

client.colors = {
	'blue': '#0073E6',
	'yellow': '#E67300',
	'red': '#ff2f2f',
};

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
const slashCommands = [];

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		command.category = folder;
		client.commands.set(command.name, command);

		// keep track of slash commands
		if (command.slashOptions) {
			slashCommands.push({
				name: command.name,
				description: command.description,
				options: command.slashOptions,
			});
		}
	}
}
client.log.info(`Loaded ${client.commands.size} commands.`);

process.on('unhandledRejection', error => {
	client.log.error('Unhandled promise rejection:');
	client.log.error(error);
});

process.on('uncaughtException', error => {
	client.log.error('Uncaught exception:');
	client.log.error(error);
});

async function register_slash_commands(interaction) {
	for (const command of slashCommands) {
		command.options = await command.options;
	}
	client.log.info('Calculated slash options');

	client.application.commands.set(slashCommands).then(async () => {
		client.log.info(`Registered ${slashCommands.length} slash commands.`);
		await interaction.reply(`:white_check_mark: registered ${slashCommands.length} slash commands globally`);
	}).catch(async e => {
		client.log.error('Couldn\'t register slash commands:', e);
		await interaction.reply(':x: couldn\'t register slash commands');
	});
}
client.register_slash_commands = register_slash_commands;

// have to log in and _then_ add the command because `applications`
// only becomes available then
client.login().then(async () => {
	client.application.commands.set([{
		name: 'register_slash',
		description: 'register all slash commands globally',
	}], process.env.ADD_MASTER_CMD_TO).then(() => {
		client.log.info('Registered /register_slash');
	}).catch(e => {
		client.log.error('Couldn\'t register /register_slash:', e);
	});
});
