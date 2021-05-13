const chalk = require('chalk');

module.exports = {
	name: 'disconnect',
	execute() {
		console.log(chalk.redBright('[altr] Disconnected!'));
	},
};