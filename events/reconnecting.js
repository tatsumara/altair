const chalk = require('chalk');

module.exports = {
	name: 'reconnecting',
	execute() {
		console.log(chalk.yellowBright('[altr] Reconnecting...'));
	},
};