const { MessageEmbed } = require('discord.js');
const translate = require('deepl');
const got = require('got');
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
function deepLtoConforming(lang) {
	return nonConformingReverse[lang] ?? lang;
}

function langToUnicodeEmoji(lang) {
	lang = deepLtoConforming(lang.toLowerCase());
	if (lang === 'btm') return '🥺';
	if (lang === 'en') return '🇬🇧';
	if (lang.includes('-')) lang = lang.slice(lang.search('-') + 1);

	// REGIONAL INDICATOR SYMBOL LETTER A: 0x1F1E6
	// LATIN SMALL LETTER A: 0x61
	const result = String.fromCodePoint(...[...lang].map(x => x.codePointAt(0) + 0x1F1E6 - 0x61));
	return result;
}

function fetchLangs() {
	return new Promise((resolve, reject) => {
		if (!process.env.DEEPL_API_KEY) reject('no DEEPL_API_KEY env var');
		const headers = {
			'Authorization': 'DeepL-Auth-Key ' + process.env.DEEPL_API_KEY,
		};
		got('https://api-free.deepl.com/v2/languages', { headers }).then(({ body }) => {
			resolve([...JSON.parse(body), { language: 'BTM', name: 'Bottom' }]);
		}).catch(e => reject(e));
	});
}
const langFetchPromise = fetchLangs();

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
	examples: [
		'/translate text:Dies ist ein Beispiel.',
		'/translate target:de text:I like berries and cream',
		'/translate target:de text:I like writing bots',
		'/translate source:ru target:de Privyet, mir!',
	],
	slashOptions: langFetchPromise.then((langs) => {
		const lang_choices = langs.map(x => ({
			name: `${langToUnicodeEmoji(x.language)} ${x.name}`,
			value: x.language,
		}));
		return [
			{ name: 'text', description: 'text to translate', type: 3, required: true },
			{ name: 'source', description: 'source language', type: 3, required: false, choices: lang_choices },
			{ name: 'target', description: 'target language', type: 3, required: false, choices: lang_choices },
		];
	}),
	cooldown: 10,

	async execute(client, interaction, functions) {
		// check DEEPL_API_KEY
		if (!process.env.DEEPL_API_KEY) {
			throw Error('Please input your DeepL API key in the config.');
		}

		// query the API
		const text = interaction.options.getString('text');
		const source = interaction.options.getString('source');
		const target = interaction.options.getString('target') || 'EN';

		getTranslation(text, source, target).then(({ data }) => {
			const { text: translated } = data.translations[0];
			// send response
			const embed = new MessageEmbed()
				.setTitle(`Translated into ${langToUnicodeEmoji(target)}:`)
				.setColor(client.colors.blue)
				.setDescription(translated);
			return interaction.editReply({ embeds: [embed] });
		}).catch(err => {
			// send error message
			client.log.info(`Failed to translate string '${text}': ${err}'`);
			return interaction.editReply(functions.simpleEmbed(
				`Couldn't reach translation service. Text length may have exceeded ${textLenLimit} characters.`));
		});
	},
};
