const got = require('got');

module.exports = {
	name: 'dadjoke',
	description: 'Tells a dad joke.',
	slashOptions: [],
	async execute(_client, interaction) {
		// make the request
		const headers = {
			'Accept': 'application/json',
		};
		got('https://icanhazdadjoke.com/', { headers }).then(res => {
			const { joke } = JSON.parse(res.body);
			interaction.editReply(joke);
		});
	},
};
