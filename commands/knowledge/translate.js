const { MessageEmbed } = require('discord.js');
const got = require('got');
const chalk = require('chalk');

var token = '';

function getToken() {
	// is this even legal
	return new Promise((resolve, reject) => {
		const headers = {
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:96.0) Gecko/20100101 Firefox/96.0'
		}
		got('https://duckduckgo.com/?t=ffab&q=translation+api&ia=translations', { headers }).then(({ body }) => {
			// yoink the token
			const rest = body.slice(body.search("vqd='") + 5);
			const token = rest.slice(0, rest.search("'"));
			resolve(token);
		}).catch(err => reject(err));
	});
}

module.exports = {
	name: 'translate',
	description: 'Translates a string of text into English.',
	usage: 'translate <text>',
	args: true,
	aliases: ['tr'],
	execute(client, message, args, functions, retries=3) {
		if(retries <= 0)
			throw new Error('reached retry limit');
		// make the request
		const body = args.join(' ');
		const query = `https://duckduckgo.com/translation.js?to=en&query=translation%20api&vqd=${token}`;
		got.default.post(query, { body }).then(res => {
			const { detected_language: lang, translated: response } = JSON.parse(res.body);
			// send the response
			const embed = new MessageEmbed()
				.setTitle(`Translated from ${lang}`)
				.setColor('#0073E6')
				.setDescription(response);
			return message.channel.send({ embeds: [embed] });
		}).catch(err => {
			// get a new token and retry on error
			console.log(chalk.blue(`[trns] retrying: ${retries} attempts left`));
			getToken().then(tok => {
				token = tok;
				return this.execute(client, message, args, functions, retries - 1);
			});
		});
	},
};
