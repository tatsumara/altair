const chalk = require('chalk');

module.exports = {
	name: 'restart',
    owner: true,
	execute(client, message, args, functions) {
        console.log(chalk.red('[altr] Forcing restart of Altair.'))
        client.destroy();
	},
};