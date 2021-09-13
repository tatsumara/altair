# Altair Discord Bot
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/tatsumara/altair/graphs/commit-activity)
[![Author](https://img.shields.io/badge/Author-tatsumara-purple.svg)](https://shields.io/)

## Add the main version hosted by me to your server (at your own risk)
https://discord.com/oauth2/authorize?client_id=713237659064991805&scope=bot&permissions=8

This is just a repository to store and track development of my personal discord bot. You can do with this code what you want, but if you're gonna publish something based off of it (which is understandably very unlikely), please be sure to credit me! (:

## Usage example
Simply clone this repository, install dependencies with ``npm install`` then either create a ``.env`` file or set your environment variables as follows:
```
TOKEN = <your bot token>
OWNER_ID = <id of your discord account>
PREFIX = a!
SAUCENAO_API_KEY = <>
WOLFRAM_API_KEY = <>
```
## TODO
* Server specifig config
* ~~Command categories~~ make command categories visible in help command
* Voice support/music player
* Getting the additional discord.js packages to work
## Issues
* Typing status is a bit wonky, after commands that execute very quickly Altair doesn't stop typing for about 5 seconds, this is probably related to rate-limits.
## Meta
mara#8977 on Discord

Distributed under the MIT license. See ``LICENSE`` for more information.
