const { MessageEmbed } = require('discord.js');
const translate = require('deepl');
const got = require('got');
const sift3 = require('sift3');
const bottom = require('bottomify');

const textLenLimit = 200;

const nonConforming = {
	'cz': 'cs', // czech
	'jp': 'ja', // japanese
	'dk': 'da', // danish
	'gr': 'el', // greek
	'cn': 'zh', // chinese
	'se': 'sv', // swedish
	'si': 'sl', // slovenian
	'ee': 'et', // estonian
};
const nonConformingReverse = Object.fromEntries(Object.entries(nonConforming).map(([k, v]) => [v, k]));
function conformingToDeepL(lang) {
	return nonConforming[lang] ?? lang;
}
function deepLtoConforming(lang) {
	return nonConformingReverse[lang] ?? lang;
}

function langToFlag(lang) {
	lang = deepLtoConforming(lang.toLowerCase());
	if (lang === 'btm') return ':pleading_face:';
	if (lang === 'en') return ':flag_gb:';
	if (lang.includes('-')) return `:flag_${lang.slice(lang.search('-') + 1)}:`;
	return `:flag_${lang}:`;
}

let langs = [];
function queryLangs() {
	return new Promise((resolve, reject) => {
		if (!process.env.DEEPL_API_KEY) reject('no DEEPL_API_KEY env var');
		const headers = {
			'Authorization': 'DeepL-Auth-Key ' + process.env.DEEPL_API_KEY,
		};
		got('https://api-free.deepl.com/v2/languages', { headers }).then(({ body }) => {
			resolve(JSON.parse(body));
		}).catch(e => reject(e));
	});
}
queryLangs().then(l => {
	langs = l;
	// mara please don't beat me to death
	langs.push({ language: 'BTM', name: 'Bottom' });
}).catch(e => {
	console.error('failed to retrieve languages:', e);
});

function findLang(target) {
	let best = null;
	let bestDist = 100;
	target = target.toLowerCase();
	target = conformingToDeepL(target);
	for (const { language, name } of langs) {
		const includes = target.length >= 5 && name.toLowerCase().includes(target);
		if (includes || target.toUpperCase() === language) {
			return language;
		}
		const dist = sift3(target, name);
		if (dist <= bestDist) {
			best = language;
			bestDist = dist;
		}
	}
	if (bestDist >= 4) return null;
	return best;
}

function getTranslation(text, source, target) {
	// encode bottom
	if (target === 'BTM') {
		const translation = bottom.encode(text);
		return new Promise((resolve) => resolve({
			data: { translations: [{ text: translation }] },
		}));
	}

	// decode bottom
	if (/^[🫂✨👉👈💖🥺, ]+$/u.test(text) || source === 'BTM') {
		source = '';
		text = bottom.decode(text);
	}

	// check length
	if (text.length > textLenLimit) {
		return new Promise((_, rej) => rej('Size limit exceeded'));
	}

	// call DeepL
	return translate({
		text,
		source_lang: source === '' ? undefined : source,
		target_lang: target,
		auth_key: process.env.DEEPL_API_KEY,
		free_api: true,
	});
}

module.exports = {
	name: 'translate',
	description: 'Translates a string of text (into English by default).',
	usage: 'translate <[ or {>[source language->]<target language><matching closing brace> <text>',
	examples: [
		'translate Dies ist ein Beispiel.',
		'translate {german} I like berries and cream',
		'translate [german] I like writing bots',
		'translate Privyet, mir! [russian->german]',
		'translate [list] <- will list all languages',
	],
	cooldown: '10',
	args: true,
	aliases: ['tr'],
	execute(client, message, args, functions) {
		// check DEEPL_API_KEY
		if (!process.env.DEEPL_API_KEY) {
			return client.log.error('Please input your DeepL API key in the config.');
		}

		// find language specifier in args
		let [origSource, origTarget] = ['', 'EN'];
		const regex = /[{[](?:([a-z]+)->)?([a-z]+)[}\]]/i;
		const match = regex.exec(args.join(' '));
		if (match) {
			origSource = match[1] ?? '';
			origTarget = match[2];
			args = args.filter(a => !regex.test(a));
		}

		// if the target language is "list", return an embed with all languages
		if (origTarget.toLowerCase() === 'list') {
			const embed = new MessageEmbed();
			embed.setTitle('Languages');
			for (const { language, name } of langs) {
				const conformingName = deepLtoConforming(language.toLowerCase());
				embed.addField(langToFlag(language) + ' ' + name, conformingName, true);
			}
			return message.channel.send({ embeds: [embed] });
		}

		// try to find the languages user specified
		const [source, target] = [origSource, origTarget].map(findLang);
		if (!source && origSource) {
			return message.channel.send(functions.simpleEmbed(`I don't know this source language (${origSource})`));
		}
		if (!target) {
			return message.channel.send(functions.simpleEmbed(`I don't know this target language (${origTarget})`));
		}

		// query the API
		const text = args.join(' ');
		getTranslation(text, source, target).then(({ data }) => {
			const { text: translated } = data.translations[0];
			// send response
			const embed = new MessageEmbed()
				.setTitle(`Translated into ${langToFlag(target)}:`)
				.setColor(client.colors.blue)
				.setDescription(translated);
			return message.reply({ embeds: [embed] });
		}).catch(err => {
			// send error message
			client.log.info(`Failed to translate string '${text}': ${err}'`);
			return message.channel.send(functions.simpleEmbed(`Couldn't reach translation service. Text length may have exceeded ${textLenLimit} characters.`));
		});
	},
};
