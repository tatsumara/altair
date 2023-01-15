const { MessageEmbed, MessageActionRow, MessageButton, Guild, GuildChannel, Channel, Message } = require('discord.js');
const got = require('got');
function humanFileSize(size) {
	let i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
	return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}
module.exports = {
	name: 'arch',
	description: 'Queries Arch Linux / Arch User Repository Packages.',
	usage: 'arch <query> [result source (arch/aur)]',
	cooldown: '10',
	args: true,
	aliases: ['aur', 'pacman', 'yay'],
	async execute(client, message, args, functions) {
		const pkgName = args.at(0);
		let repo = args.at(1);
		if (!['aur', 'arch'].includes(repo)) {
			repo = 'arch';
		}
		if (repo === 'aur') {
			const searchUrl = await got(`https://aur.archlinux.org/rpc/?v=5&type=search&by=name-desc&arg=${pkgName}`).json();
			const searchResults = searchUrl.results;
			let x = 0;
			let firstSub = new Date(searchResults.at(x).FirstSubmitted * 1000);
			let lastMod = new Date(searchResults.at(x).LastModified * 1000);
			const embed = new MessageEmbed()
				.setAuthor({ iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Archlinux-icon-crystal-64.svg/2048px-Archlinux-icon-crystal-64.svg.png', name: 'Search Results' })
				.setTitle(`${searchResults.at(x).Name}`)
				.setURL(`https://aur.archlinux.org/packages/${searchResults.at(x).name}`)
				.setDescription(`${searchResults.at(x).Description}`)
				.addFields({ name: 'Maintainer', value: `${searchResults.at(x).Maintainer}` }, { name: 'First Submitted', value: `${firstSub.toLocaleString()} (UTC)` }, { name: 'Last Modified', value: `${lastMod.toLocaleString()} (UTC)` })
				.setColor(client.colors.blue)
				.setFooter({ text: `${x + 1}/${searchUrl.resultcount} - Version ${searchResults.at(x).Version}, ${searchResults.at(x).NumVotes} Votes` });
			const buttons = new MessageActionRow()
				.addComponents(
					new MessageButton({ label: '◀', customId: 'previous', style: 'SECONDARY' }),
					new MessageButton({ label: '▶', customId: 'next', style: 'SECONDARY' }),
					new MessageButton({ label: '✕', customId: 'close', style: 'DANGER' }),
				);
			const imageMessage = await message.reply({ embeds: [embed], components: [buttons] });
			const filter = i => {
				i.deferUpdate();
				return i.user.id === message.author.id;
			};

			const collector = imageMessage.createMessageComponentCollector({ filter, idle: 60000 });
			collector.on('collect', i => {
				switch (i.customId) {
				case 'close':
					collector.stop();
					return;
				case 'next':
					if (x < searchUrl.resultcount) x++;
					firstSub = new Date(searchResults.at(x).FirstSubmitted * 1000);
					lastMod = new Date(searchResults.at(x).LastModified * 1000);
					break;
				case 'previous':
					if (x > 0) x--;
					firstSub = new Date(searchResults.at(x).FirstSubmitted * 1000);
					lastMod = new Date(searchResults.at(x).LastModified * 1000);
					break;
				default:
					return;
				}
				imageMessage.edit({ embeds: [
					embed.setTitle(`${searchResults.at(x).Name}`)
						.setURL(`https://aur.archlinux.org/packages/${searchResults.at(x).name}`)
						.setDescription(`${searchResults.at(x).Description}`)
						.setFields({ name: 'Maintainer', value: `${searchResults.at(x).Maintainer}` }, { name: 'First Submitted', value: `${firstSub.toLocaleString()} (UTC)` }, { name: 'Last Modified', value: `${lastMod.toLocaleString()} (UTC)` })
						.setFooter({ text: `${x + 1}/${searchUrl.resultcount} - Version ${searchResults.at(x).Version}, ${searchResults.at(x).NumVotes} Votes` }),
				] });
			});
			collector.on('end', (collected, reason) => {
				if (reason === 'idle') imageMessage.edit({ components: [] });
				if (reason === 'user') {
					imageMessage.edit({ embeds: [embed.setImage().setDescription('Search closed.')] });
					imageMessage.edit({ components: [] });
				}
			});
		}
		if (repo === 'arch') {
			const searchUrl = await got(`https://archlinux.org/packages/search/json/?q=${pkgName}`).json();
			const searchResults = searchUrl.results;
			let x = 0;
			let maintainers = '';
			let date = searchResults.at(x).last_update;
			date = date.replace('T', ', ');
			date = date.replace(/-/g, '/');
			date = date.substring(0, 20);
			for (let i = 0; i < searchResults.at(x).maintainers.length; i++) {
				maintainers += searchResults.at(x).maintainers[i] + '; ';
			}
			if (searchResults.length === 0) {
				return message.reply(functions.simpleEmbed('No Results!'));
			}
			const embed = new MessageEmbed()
				.setAuthor({ iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Archlinux-icon-crystal-64.svg/2048px-Archlinux-icon-crystal-64.svg.png', name: 'Search Results' })
				.setTitle(`${searchResults.at(x).pkgname}`)
				.setURL(`https://archlinux.org/packages/${searchResults.at(x).repo}/${searchResults.at(x).arch}/${searchResults.at(x).pkgname}`)
				.setDescription(`${searchResults.at(x).pkgdesc}`)
				.addFields({ name: 'Maintainer', value: `${maintainers}` }, { name: 'Size', value: `${humanFileSize(searchResults.at(x).compressed_size)} Compressed, ${humanFileSize(searchResults.at(x).installed_size)} Installed` }, { name: 'Last Modified', value: `${date}` })
				.setColor(client.colors.blue)
				.setFooter({ text: `${x + 1}/${searchResults.length} - Version ${searchResults.at(x).pkgver}` });
			const buttons = new MessageActionRow()
				.addComponents(
					new MessageButton({ label: '◀', customId: 'previous', style: 'SECONDARY' }),
					new MessageButton({ label: '▶', customId: 'next', style: 'SECONDARY' }),
				);
			const imageMessage = await message.reply({ embeds: [embed], components: [buttons] });
			const filter = i => {
				i.deferUpdate();
				return i.user.id === message.author.id;
			};

			const collector = imageMessage.createMessageComponentCollector({ filter, idle: 60000 });
			collector.on('collect', i => {
				switch (i.customId) {
				case 'next':
					if (x < searchResults.length) x++;
					date = searchResults.at(x).last_update;
					date = date.replace('T', ', ');
					date = date.replace(/-/g, '/');
					date = date.substring(0, 20);
					break;
				case 'previous':
					if (x > 0) x--;
					date = searchResults.at(x).last_update;
					date = date.replace('T', ', ');
					date = date.replace(/-/g, '/');
					date = date.substring(0, 20);
					break;
				default:
					return;
				}
				imageMessage.edit({ embeds: [
					embed.setTitle(`${searchResults.at(x).pkgname}`)
						.setURL(`https://archlinux.org/packages/${searchResults.at(x).repo}/${searchResults.at(x).arch}/${searchResults.at(x).name}`)
						.setDescription(`${searchResults.at(x).pkgdesc}`)
						.setFields({ name: 'Maintainer', value: `${maintainers}` }, { name: 'Size', value: `${humanFileSize(searchResults.at(x).compressed_size)} Compressed, ${humanFileSize(searchResults.at(x).installed_size)} Installed` }, { name: 'Last Modified', value: `${date}` })
						.setFooter({ text: `${x + 1}/${searchResults.length} - Version ${searchResults.at(x).pkgver}` }),
				] });
			});
		}
	},
};
