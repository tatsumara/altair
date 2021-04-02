const chalk = require('chalk');

module.exports = {
    name: 'guildCreate',
    execute(guild) {
        console.log(chalk.greenBright(`[gild] Joined guild ${guild.name}.`));
    }
}