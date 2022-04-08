module.exports = {
	name: 'guildCreate',
	execute(guild, client) {
		client.log.success(`Joined guild '${guild.name}'.`);
	},
};