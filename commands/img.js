const gis = require('g-i-s');

module.exports = {
	name: 'img',
	description: 'Searches on Google Images.',
    aliases: ['im', 'image'],
	execute(client, message, args, functions) {
        const query = args.join(' ');
        const options = {
            searchTerm: query,
            queryStringAddition: '&safe=active'
        }
        gis(options, logResults); 
        function logResults(error, results) {
            if (error) {
            console.log(error);
            }
            else {
            message.channel.send(results[0].url);
            }
        }
	},
};