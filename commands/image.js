const gis = require('g-i-s');

module.exports = {
	name: 'image',
	description: 'Searches on Google Images.',
    aliases: ['im', 'img'],
	execute(client, message, args, functions) {
        message.channel.startTyping();
        const query = args.join(' ');
        const options = {
            searchTerm: query,
            queryStringAddition: '&safe=active'
        }
        gis(options, logResults); 
        function logResults(error, results) {
            if (!results[0]) {
                return message.channel.send(functions.simpleEmbed('Nothing found!', ''));
            }
            message.channel.send(functions.simpleEmbed(`Search results for '${query}':`, '', '0x0000FF', results[0].url));
        }
        message.channel.stopTyping();
	},
};