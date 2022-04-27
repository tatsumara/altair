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
		const path = `cat_${message.id}.jpg`;
		const stream = got.stream('https://thiscatdoesnotexist.com/');
		stream.pipe(fs.createWriteStream(path));

		stream.on('end', async () => {
			// send file
			await message.reply({ files: [path] });
			// remove file
			fs.unlinkSync(path);
		});
	},
};