const { MessageEmbed } = require('discord.js');
const translate = require('deepl');
const got = require('got');
const sift3 = require('sift3');
const chalk = require('chalk');

function langToFlag(lang) {
	lang = lang.toLowerCase();
	if (lang == 'en') return ':flag_gb:';
	if (lang.includes('-')) return `:flag_${lang.slice(lang.search('-') + 1)}:`;
	return `:flag_${lang}:`;
}

let langs = [];
function queryLangs() {
	return new Promise((resolve, reject) => {
		if (!process.env.DEEPL_API_KEY) reject('no DEEPL_API_KEY env var');
		const form = {
			auth_key: process.env.DEEPL_API_KEY,
			type: 'target',
		};
		got.post('https://api-free.deepl.com/v2/languages', { form }).then(({ body }) => {
			console.log(chalk.blue('[trlt] Loaded available languages'));
			resolve(JSON.parse(body));
		});
	});
}
queryLangs().then(l => langs = l);

function findLang(target) {
	let best = '';
	let bestDist = 100;
	for (const { language, name } of langs) {
		if (name.toLowerCase().includes(target)) {
			return language;
		}
		const dist = sift3(target, name);
		if (dist <= bestDist) {
			best = language;
			bestDist = dist;
		}
	}
	if (bestDist >= 4) return '';
	return best;
}

module.exports = {
	name: 'translate',
	description: 'Translates a string of text into English.',
	usage: 'translate [{<target language>} OR !<target language>] <text>',
	examples: [
		'translate !de i like cookies',
		'translate {German} i like cookies',
	],
	cooldown: '10',
	args: true,
	aliases: ['tr'],
	execute(client, message, args, functions) {
		// check DEEPL_API_KEY
		if (!process.env.DEEPL_API_KEY) {
			return console.log(chalk.red('[cmnd] Please input your DeepL API key in the config.'));
		}

		// choose target language
		let target = 'EN';
		if (args[0].startsWith('!')) {
			target = args[0].slice(1).toUpperCase();
			[_, ...args] = args; // remove first element
		}
		if (args[0].startsWith('{') && args[0].endsWith('}')) {
			const name = args[0].substr(1, args[0].length - 2);
			target = findLang(name);
			if (target === '') {
				return message.channel.send(functions.simpleEmbed('I don\'t know this language.'));
			}
			[_, ...args] = args;
		}

		// check length
		const text = args.join(' ');
		if (text.length >= 120) {
			return message.channel.send(functions.simpleEmbed('Text length exceeds 120 characters.'));
		}

		// query the API
		translate({
			text,
			target_lang: target,
			auth_key: process.env.DEEPL_API_KEY,
			free_api: true,
		}).then(({ data }) => {
			const { text: translated } = data.translations[0];
			// send response
			const embed = new MessageEmbed()
				.setTitle(`Translated into ${langToFlag(target)}:`)
				.setColor('#0073E6')
				.setDescription(translated);
			return message.reply({ embeds: [embed] });
		}).catch(err => {
			// send error message
			console.log(chalk.red(`[trlt] failed to translate string '${text}': ${err}'`));
			return message.channel.send(functions.simpleEmbed('Couldn\'t reach translation service.'));
		});
	},
};
