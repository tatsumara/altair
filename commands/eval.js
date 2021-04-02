module.exports = {
	name: 'eval',
	description: 'Enables the owner to execute commands directly from inside discord.',
    owner: true,
	execute(client, message, args, functions) {
        if (message.author.id !== require('../config.json').ownerID) {
            return message.channel.send(functions.simpleEmbed('You are not permitted to use this command.', '','#FF0000'));
        };
        try {
            let evaled = eval(args.join(' '));
            if (typeof evaled !== 'string') {
                // actually didn't know you could use require like this but it makes sense and is pretty cool if you only use something once
                evaled = require('util').inspect(evaled);
            }
            // i don't understand how the code is actually executed
            message.channel.send(evaled, {code:"js"});
        } catch (err) {
            message.channel.send(err, {code: "js"});
        }
	},
};