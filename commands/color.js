module.exports = {
	name: 'color',
	description: 'Changes your specific color role.',
	cooldown: '60',
	args: true,
    aliases: ['col'],
	execute(client, message, args, functions) {
        if (!message.guild.me.hasPermission('MANAGE_ROLES' )) return message.channel.send(functions.simpleEmbed(`I don't have the Manage Roles permission.`, '', '#FFFF00'));
        const role = message.member.roles.color;
        if (message.guild.me.roles.highest.comparePositionTo(role) < 0) return message.channel.send(functions.simpleEmbed('Your highest role is above mine!', `I'm not able to change your role if it is higher than my highest.`, '#FFFF00'))
        if (!args[0].startsWith('#')) return message.channel.send(functions.simpleEmbed('Not a valid hex color!', '', '#FFFF00'));
        if (role.members.size !== 1) return message.channel.send(functions.simpleEmbed(`Please make sure you're the only member with this role.`, '', '#FFFF00'));
        role.setColor(args[0]);
        message.channel.send(functions.simpleEmbed('Changed your role color!', '', args[0]))
	},
};