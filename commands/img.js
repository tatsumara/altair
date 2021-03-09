const gis = require('g-i-s');

module.exports = {
	name: 'img',
	description: 'Searches on Google Images.',
    aliases: ['im', 'image'],
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
                return message.channel.send(functions.ezEmbed('Nothing found!', ''));
            }
            message.channel.send(functions.ezEmbed(`Search results for '${query}':`, '', '', results[0].url));
        }
        message.channel.stopTyping();
	},
};