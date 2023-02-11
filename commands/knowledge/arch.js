const { MessageEmbed } = require('discord.js');
const got = require('got');

const paginate = require('../../modules/paginate.js');

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

module.exports = {
	name: 'arch',
	description: 'Queries Arch Linux Packages',
	usage: 'arch <query> [--only=repo|aur]',
	args: true,
	disabled: false,
	aliases: ['pacman', 'yay'],
	slashOptions: [
		{
			name: 'query',
			description: 'The query to search for',
			type: 'STRING',
			required: true,
		},
		{
			name: 'only',
			description: 'The type of packages to search for. Defaults to both.',
			type: 'STRING',
			choices: [
				{
					name: 'Repo',
					value: 'repo',
				},
				{
					name: 'AUR',
					value: 'aur',
				},
			],
		},
	],
	async execute(client, interaction) {
		const query = interaction.options.getString('query');
		const only = interaction.options.getString('only');

		const repo = {
			url: {
				api: `https://www.archlinux.org/packages/search/json/?q=${encodeURIComponent(query)}`,
				web: `https://www.archlinux.org/packages/search/?q=${encodeURIComponent(query)}`,
			},
			packages: [],
		};

		const aur = {
			url: {
				api: `https://aur.archlinux.org/rpc/?v=5&type=search&arg=${encodeURIComponent(query)}`,
				web: `https://aur.archlinux.org/packages/?O=0&K=${encodeURIComponent(query)}`,
			},
			packages: [],
		};

		if (only !== 'aur') {
			const { results } = await got(repo.url.api).json();
			repo.packages = results;
		}

		if (only !== 'repo') {
			const { results } = await got(aur.url.api).json();
			aur.packages = results.sort((a, b) => b.NumVotes - a.NumVotes);
		}

		const embed = {
			title: `Arch Linux Packages - ${query}`,
			color: client.colors.blue,
			description: [
				only !== 'aur' && `[Repo](${repo.url.web})`,
				only !== 'repo' && `[AUR](${aur.url.web})`,
			]
				.filter(Boolean)
				.join(' | '),
			footer: {
				text: [
					only !== 'aur' && `${repo.packages.length} repo packages`,
					only !== 'repo' && `${aur.packages.length} AUR packages`,
				]
					.filter(Boolean)
					.join(' | '),
			},
		};

		const embeds = [
			...repo.packages.map(pkg => ({
				url: `https://www.archlinux.org/packages/${pkg.repo}/${pkg.arch}/${pkg.pkgname}/`,
				info: formatRepoPackage(pkg),
				description: pkg.pkgdesc,
			})),
			...aur.packages.map(pkg => ({
				url: `https://aur.archlinux.org/packages/${pkg.Name}/`,
				info: formatAURPackage(pkg),
				description: pkg.Description,
			})),
		]
			.reduce((acc, val, i) => {
				const idx = Math.floor(i / 5);
				acc[idx] ??= [];
				acc[idx].push(val);
				return acc;
			}, [])
			.map((packages, pageIdx, pages) =>
				new MessageEmbed(embed)
					.addFields(
						packages.map(({ url, info, description }, idx) => ({
							name: `${idx + 1 + pageIdx * 5}. ${info}`,
							value: `${description}\n${url}`,
						})),
					)
					.setFooter({ text: `${pageIdx + 1}/${pages.length} | ${embed.footer.text}` }),
			);

		paginate(interaction, embeds);
	},
};
