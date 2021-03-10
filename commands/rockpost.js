module.exports = {
	name: 'rockpost',
	description: 'Rockpost command cuz liam wouldnt stop complaining',
    aliases: ['aliases'],
	execute(client, message, args, functions) {
        if (args[0] > 6) {
            return message.channel.send(functions.simpleEmbed('Maximum of 6 rockposts allowed at once.', '', '0xFF0000'));
        }
        const rocks = ['https://media.discordapp.net/attachments/708816464911532032/819269670048759860/rocks_-_Copy_-_Copy_2.gif', 'https://media.discordapp.net/attachments/708816464911532032/819269677217480734/rocks_2_-_Copy_-_Copy.gif', 'https://media.discordapp.net/attachments/708816464911532032/819269731432529990/rocks_10_-_Copy_-_Copy.gif'];
        for (i = 0; i<args[0]; i++) {
            message.channel.send(rocks[Math.floor(Math.random() * rocks.length)]);
        }
    },
};