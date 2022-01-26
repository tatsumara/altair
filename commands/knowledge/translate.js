const { MessageEmbed } = require('discord.js');
const translate = require('deepl');
const got = require('got');
const sift3 = require('sift3');
const chalk = require('chalk');
const bottom = require('bottomify');

const textLenLimit = 200;

function langToFlag(lang) {
	lang = lang.toLowerCase();
	if (lang === 'btm') return ':pleading_face:';
	if (lang === 'ja') return ':flag_jp:';
	if (lang === 'en') return ':flag_gb:';
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
queryLangs().then(l => {
	langs = l;
	// mara please don't beat me to death
	langs.push({ language: 'BTM', name: 'Bottom' });
});

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

function getTranslation(text, lang) {
	if (lang === 'BTM') {
		const translation = bottom.encode(text);
		return new Promise((resolve) => resolve({
			data: { translations: [{ text: translation }] },
		}));
	}
	if (isBottom(text)) text = bottom.decode(text);
	if (text.length > textLenLimit) {
		return new Promise((res, rej) => rej('Size limit exceeded'));
	}
	return translate({
		text,
		target_lang: lang,
		auth_key: process.env.DEEPL_API_KEY,
		free_api: true,
	});
}

function isBottom(text) {
	return /^[ 💖,👉👈✨🥺🫂]+$/u.test(text);
}

module.exports = {
	name: 'translate',
	description: 'Translates a string of text (into English by default).',
	usage: 'translate {<target language>} <text>',
	examples: [
		'translate {german} I like berries and cream',
		'translate Dies ist ein Beispiel.',
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
		if (args[0].startsWith('{') && args[0].endsWith('}')) {
			const name = args[0].substr(1, args[0].length - 2);
			target = findLang(name);
			if (target === '') {
				return message.channel.send(functions.simpleEmbed('I don\'t know this language.'));
			}
			args.shift();
		}

		// query the API
		const text = args.join(' ');
		getTranslation(text, target).then(({ data }) => {
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
			const msg = `Couldn't reach translation service. Text length may have exceeded ${textLenLimit} characters`;
			return message.channel.send(functions.simpleEmbed(msg));
		});
	},
};
