const chalk = require('chalk');

module.exports = {
    name: 'ready',
    once: 'true',
    execute() {
        console.log(chalk.blueBright('[altr] Ready!'));
    }
}