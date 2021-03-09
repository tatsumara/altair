const ownerID = require('../config.json').ownerID;

module.exports = {
	name: 'eval',
	description: 'Enables the owner to execute commands directly from inside discord.',
	execute(client, message, args, functions) {
        if (message.author.id !== ownerID) {
            return message.channel.send(functions.ezEmbed('You are not permitted to use this command.', '','0xFF0000'));
        };
        try {
            let evaled = eval(args.join(' '));
            if (typeof evaled !== 'string') {
                evaled = require('util').inspect(evaled);
            }
            message.channel.send(evaled, {code:"js"});
        } catch (err) {
            message.channel.send(err, {code: "xl"});
        }
	},
};