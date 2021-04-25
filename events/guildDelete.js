const chalk = require('chalk');

module.exports = {
    name: 'guildDelete',
    execute(guild) {
        console.log(chalk.yellowBright(`[gild] Left guild '${guild.name}'.`));
    }
}