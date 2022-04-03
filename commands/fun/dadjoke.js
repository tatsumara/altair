const got = require('got');

module.exports = {
	name: 'dadjoke',
	description: 'Tells a dad joke.',
	usage: 'dadjoke',
	args: false,
	aliases: ['joke', 'dad'],
	execute(client, message) {
		// make the request
		const headers = {
			'Accept': 'application/json',
		};
		got('https://icanhazdadjoke.com/', { headers }).then(res => {
			const { joke } = JSON.parse(res.body);
			return message.reply(joke);
		});
	},
};
