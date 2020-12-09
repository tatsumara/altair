const mqtt = require('mqtt');
const mclient = mqtt.connect('mqtt://192.168.0.8');

module.exports = {
	name: 'light',
	description: 'Controls my lights.',
	usage: 'light [on/off]\nlight color [hex color]',
	execute(client, message, args, functions) {
		if (args[0] === 'on') {
			mclient.publish('cmnd/yami/Power0', 'ON');
			message.channel.send(functions.ezEmbed('Light toggled on!', '', '0xffff00'));
			return;
		}
		if (args[0] === 'off') {
			mclient.publish('cmnd/yami/Power0', 'OFF');
			message.channel.send(functions.ezEmbed('Light toggled off!', '', '0x808080'));
			return;
		}
		if (args[0] === 'color') {
			mclient.publish('cmnd/yami/Color1', args[1]);
			message.channel.send(functions.ezEmbed('Color changed!', '', args[1]));
			return;
		}
	},
};