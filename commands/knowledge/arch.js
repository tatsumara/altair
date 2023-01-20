const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const got = require('got');

/**
 * Pads a number with leading zeros.
 * @param {number} n The number to pad.
 * @param {number} [width] The width of the number.
 * @returns {string} The padded number.
 * @example
 * pad(1, 2); // 01
 */
function pad(n, width) {
	const str = String(n);
	return str.length >= width ? str : new Array(width - str.length + 1).join('0') + str;
}

/**
 * Formats a date into a human-readable string.
 * @param {number} ms The number of milliseconds since the Unix epoch.
 * @returns {string} The human-readable string.
 * @example
 * formatDate(0); // 1970-01-01
 */
function formatDate(ms) {
	const date = new Date(ms);
	return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1, 2)}-${pad(date.getUTCDate(), 2)}`;
}

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
 * Formats a repo package into a human-readable string.
 * @param {object} pkg The package to format.
 * @returns {string} The human-readable string.
 * @example
 * formatRepoPackage({
 * 	repo: 'core',
 * 	pkgname: 'bash',
 * 	pkgver: '5.1.8',
 * 	compressed_size: 123456,
 * 	installed_size: 123456,
 * }); // core/bash 5.1.8 (120.6 KiB 120.6 KiB)
 */
function formatRepoPackage(pkg) {
	return `${pkg.repo}/${pkg.pkgname} ${pkg.pkgver} (${bytesToSize(pkg.compressed_size)} ${bytesToSize(pkg.installed_size)})`;
}

/**
 * Formats an AUR package into a human-readable string.
 * @param {object} pkg The package to format.
 * @returns {string} The human-readable string.
 * @example
 * formatAURPackage({
 * 	Name: 'bash',
 * 	Version: '5.1.8',
 * 	NumVotes: 123,
 * 	Popularity: 0.123,
 * 	OutOfDate: 0,
 * }); // aur/bash 5.1.8 (+123 0.12%) (Out-of-date 1970-01-01)
 */
function formatAURPackage(pkg) {
	const parts = [`aur/${pkg.Name} ${pkg.Version} (+${pkg.NumVotes} ${pkg.Popularity.toFixed(2)}%)`];

	if (pkg.OutOfDate) {
		parts.push(`(Out-of-date ${formatDate(pkg.LastModified * 1000)})`);
	}

	return parts.join(' ');
}

/**
 * Modifies the embed to display a certain number of packages.
 * @param {MessageEmbed} embed The embed to modify.
 * @param {({ repo: object } | { aur: object })[]} results The results to display.
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
		const isRepo = results[i].repo;
		const pkg = isRepo ? results[i].repo : results[i].aur;

		const url = isRepo
			? `https://www.archlinux.org/packages/${pkg.repo}/${pkg.arch}/${pkg.pkgname}/`
			: `https://aur.archlinux.org/packages/${pkg.Name}/`;
		const pkgStr = isRepo ? formatRepoPackage(pkg) : formatAURPackage(pkg);
		const description = isRepo ? pkg.pkgdesc : pkg.Description;

		embed.addField(`${i + 1}. ${pkgStr}`, `${description}\n${url}`);
	}

	const repoCount = results.filter((r) => r.repo).length;
	const aurCount = results.filter((r) => r.aur).length;

	embed.setFooter({ text: `Page ${page + 1} of ${pages} | ${repoCount} repo | ${aurCount} aur | ${results.length} total` });

	return embed;
}

module.exports = {
	name: 'arch',
	description: 'Queries Arch Linux Packages',
	usage: 'arch [--aur] [--repo] <query>',
	args: true,
	disabled: false,
	aliases: ['pacman', 'yay'],
	async execute(client, message, args, functions) {
		const flags = args.filter((arg) => arg.startsWith('--'));
		const query = args.filter((arg) => !arg.startsWith('--')).join(' ');

		const wantsAur = flags.includes('--aur');
		const wantsRepo = flags.includes('--repo');
		const wantsBoth = (wantsAur && wantsRepo) || (!wantsAur && !wantsRepo);

		if (!query) {
			return message.reply(functions.simpleEmbed('Please provide a query!'));
		}

		const packages = [];
		const description = [];

		if (wantsRepo || wantsBoth) {
			const repoResult = await got(`https://www.archlinux.org/packages/search/json/?q=${encodeURIComponent(query)}`).json();
			const repoPackages = repoResult.results;

			for (const repo of repoPackages) {
				packages.push({ repo });
			}

			description.push(`[Repo](https://www.archlinux.org/packages/search/?q=${encodeURIComponent(query)})`);
		}

		if (wantsAur || wantsBoth) {
			const aurResult = await got(`https://aur.archlinux.org/rpc/?v=5&type=search&arg=${encodeURIComponent(query)}`).json();
			const aurPackages = aurResult.results.sort((a, b) => b.NumVotes - a.NumVotes);

			for (const aur of aurPackages) {
				packages.push({ aur });
			}

			description.push(`[AUR](https://aur.archlinux.org/packages/?O=0&K=${encodeURIComponent(query)})`);
		}

		if (packages.length === 0) {
			return message.reply(functions.simpleEmbed('Nothing found!'));
		}

		let page = 0;

		const embed = new MessageEmbed()
			.setTitle(`Arch Linux Packages - "${query}"`)
			.setDescription(description.join(' | '))
			.setColor(client.colors.blue);

		modifyEmbed(embed, packages, page);

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
				if (page < Math.ceil(packages.length / 5) - 1) page++;
				break;
			case 'previous':
				if (page > 0) page--;
				break;
			default:
				return;
			}

			modifyEmbed(embed, packages, page);

			resultMessage.edit({ embeds: [embed] });
		});

		collector.on('end', () => {
			resultMessage.edit({ components: [] });
		});
	},
};
