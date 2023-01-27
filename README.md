# altair discord bot
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/tatsumara/altair/graphs/commit-activity)
[![Author](https://img.shields.io/badge/Author-tatsumara-purple.svg)](https://shields.io/)

altair is your personal search engine for just about everything, inside of discord!

## Add to your server
https://discord.com/oauth2/authorize?client_id=713237659064991805&scope=bot&permissions=294208924736

## Usage example
Simply clone this repository, install dependencies with ``npm install`` then either create a ``.env`` file with the following content or set your environment variables as follows:
```
DISCORD_TOKEN = <your bot token>
OWNER_ID = <id of your discord account>
PREFIX = a!
<service>_API_KEY = <token/key>
```
Valid services are `SAUCENAO`, `WOLFRAM`, `GENIUS`, `DEEPL`, `NASA`, `TMDB`, and `LASTFM`. You don't need to supply all of these keys, if a command requires one that's not supplied it will simply silently fail.
## TODO
* Server specifig config/database implementation
* Standardize responses, embeds and buttons
* Paginate anime and manga commands
* Make a message interaction for saucenao in addition to the slash command
## Meta
mara#8977 on Discord

Distributed under the MIT license. See ``LICENSE`` for more information.
