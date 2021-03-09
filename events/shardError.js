const chalk = require('chalk');

module.exports = {
    name: 'shardError',
    execute(error) {
        console.log(chalk.redBright('[main] Websocket connection error:'));
        console.log(chalk.red(error));
    }
}