// const { MessageAttachment } = require('discord.js');
const got = require('got');
const fs = require('fs');

module.exports = {
	name: 'cat',
	description: 'Sends an image of a cat.',
	guildOnly: false,
	async execute(client, message) {
		// download file locally
		// we can't just send a link to the website because
		// of how discord caching works
		const stream = got.stream('https://thiscatdoesnotexist.com/');
		stream.pipe(fs.createWriteStream('cat.jpg'));

		stream.on('end', async () => {
			// send file
			await message.reply({ files: ['./cat.jpg'] });
			// remove file
			fs.unlinkSync('./cat.jpg');
		});
	},
};