module.exports = {
	name: 'guildDelete',
	execute(guild, client) {
		client.log.success(`Left guild '${guild.name}'.`);
	},
};