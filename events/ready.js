const chalk = require('chalk');

module.exports = {
    name: 'ready',
    once: 'true',
    execute(client) {
        console.log(chalk.blueBright(`[altr] Ready to serve on ${client.guilds.cache.size} servers!`));
    }
}