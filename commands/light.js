const Discord = require('discord.js');
const mqtt = require('mqtt');
const mclient = mqtt.connect('mqtt://192.168.0.8');

module.exports = {
	name: 'light',
	description: 'Controls my lights.',
	usage: 'light [on/off]\nlight color [hex color]',
	execute(client, message, args) {
		if (args[0] === 'on') {
			mclient.publish('cmnd/yami/Power0', 'ON');
			return;
		}
		if (args[0] === 'off') {
			mclient.publish('cmnd/yami/Power0', 'OFF');
			return;
		}
		if (args[0] === 'color') {
			mclient.publish('cmnd/yami/Color1', args[1]);
			return;
		}
	},
};