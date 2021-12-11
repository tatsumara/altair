const wiki = require('wikijs').default;

module.exports = {
	name: 'wikipedia',
	description: 'Fetches an article from Wikipedia.',
	usage: 'wikipedia <search term>',
	aliases: ['wiki', 'wp'],
	async execute(client, message, args, functions) {
		const search = await wiki().search(args.join(' '));
		if (!search.results[0]) return message.channel.send(functions.simpleEmbed('Nothing found!'));
		const page = await wiki().page(search.results[0]);
		const contents = new Array();
		const unwantedSections = [
			'See also',
			'Further reading',
			'Notes',
			'References',
			'External links',
		];
		(await page.content()).forEach(section => {
			if (!unwantedSections.includes(section.title)) {
				contents.push(section.title);
			}
		});
		const embed = {
			title: search.results[0],
			url: page.url(),
			description: (await page.summary()).split(' ').splice(0, 64).join(' ') + '...',
			image: {
				url: await page.mainImage(),
			},
			fields: [
				{ name: 'Contents', value: contents.join(', ') },
			],
		};
		message.reply({ embeds: [embed] });
	},
};