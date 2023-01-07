const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const got = require('got');

/**
 * Converts a number of bytes to a human-readable string.
 * @param {number} bytes The number of bytes.
 * @param {number} [decimals=2] The number of decimal places to use.
 * @returns {string} The human-readable string.
 * @example
 * bytesToSize(1024); // 1 KiB
 */
function bytesToSize(bytes, decimals = 2) {
	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Modiefies the embed to display a certain number of packages.
 * @param {MessageEmbed} embed The embed to modify.
 * @param {Array} results The results to display.
 * @param {number} page The page to display.
 * @param {number} [n=5] The number of packages to display.
 * @returns {MessageEmbed} The modified embed.
 * @example
 * const embed = new MessageEmbed();
 *
 * modifyEmbed(embed, results, 0); // Display the first 5 packages
 */
function modifyEmbed(embed, results, page, n = 5) {
	const pages = Math.ceil(results.length / n);
	const index = page * n;

	embed.spliceFields(0, embed.fields.length);

	for (let i = index; i < Math.min(index + n, results.length); i++) {
		const {
			arch,
			compressed_size,
			installed_size,
			pkgdesc,
			pkgname,
			pkgver,
			repo,
		} = results[i];

		const url = `https://www.archlinux.org/packages/${repo}/${arch}/${pkgname}/`;
		const info = `${repo}/${pkgname} ${pkgver} (${bytesToSize(compressed_size)} ${bytesToSize(installed_size)})`;

		const name = `${i + 1}. ${info}`;
		const value = `${pkgdesc}\n${url}`;

		embed.addField(name, value);
	}

	embed.setFooter({ text: `Page ${page + 1} of ${pages} | ${results.length} results` });

	return embed;
}


// TODO: aur support
module.exports = {
	name: 'arch',
	description: 'Queries Arch Linux Packages.',
	usage: 'arch <query>',
	args: true,
	disabled: false,
	aliases: ['pacman', 'yay'],
	async execute(client, message, args, functions) {
		const query = args.join(' ');

		if (!query) {
			return message.reply(functions.simpleEmbed('Please provide a query!'));
		}

		const { results } = await got(`https://www.archlinux.org/packages/search/json/?q=${encodeURIComponent(query)}`).json();

		if (results.length === 0) {
			return message.reply(functions.simpleEmbed('Nothing found!'));
		}

		let page = 0;

		const embed = new MessageEmbed()
			.setTitle(`Arch Linux Packages - "${query}"`)
			.setColor(client.colors.blue)
			.setURL(`https://www.archlinux.org/packages/search/?q=${encodeURIComponent(query)}`);

		modifyEmbed(embed, results, page);

		const buttons = new MessageActionRow()
			.addComponents(
				new MessageButton({ label: '◀', customId: 'previous', style: 'SECONDARY' }),
				new MessageButton({ label: '▶', customId: 'next', style: 'SECONDARY' }),
			);


		const resultMessage = await message.reply({ embeds: [embed], components: [buttons] });

		const filter = (i) => {
			i.deferUpdate();
			return i.user.id === message.author.id;
		};

		const collector = resultMessage.createMessageComponentCollector({ filter, time: 60000 });

		collector.on('collect', async (i) => {
			switch (i.customId) {
			case 'next':
				if (page < results.length) page++;
				break;
			case 'previous':
				if (page > 0) page--;
				break;
			default:
				return;
			}

			modifyEmbed(embed, results, page);

			resultMessage.edit({ embeds: [embed] });
		});

		collector.on('end', () => {
			resultMessage.edit({ components: [] });
		});
	},
};
