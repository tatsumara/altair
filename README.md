<img align="right" width="256" src="https://transfer.hstin.de/Br3nzc/altair_icon.png">

[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![GitHub release](https://img.shields.io/github/release/tatsumara/altair.svg)](https://github.com/tatsumara/altair/releases/)

# Who is Altair?
Altair is your personal search engine for just about everything, right inside of discord.

## Add to your server
https://discord.com/oauth2/authorize?client_id=713237659064991805&scope=bot&permissions=294208924736

This version is hosted by me and is the main focus of this repository. Feel free to host Altair yourself though!

## Self-hosting
To host Altair yourself you have multiple options available. The simpler one would be the following:
## Locally
Simply clone or download this repository, make sure your installed Node is version 16.9.0 or higher, install dependencies with ``npm install`` and then create a ``.env`` file with the following content:
```
DISCORD_TOKEN = <your bot token>
OWNER_ID = <id of your discord account>
PREFIX = a!
<service>_API_KEY = <token/key>
```
Valid services are `SAUCENAO`, `WOLFRAM`, `GENIUS`, `DEEPL`, `NASA`, `TMDB`, and `LASTFM`. You don't need to supply all of these keys, if a command requires one that's not supplied it will simply fail and log an error in the console.
## Docker
This option is recommended, as it's what I'm personally using and working on. You can simply pull `ghcr.io/tatsumara/altair:nightly`, set your environment variables as above (or load them from a file) and run it! An example would be the following:
```
docker run --env-file=.env ghcr.io/tatsumara/altair:nightly
```
Images are currently built for every single commit, I will work on adding a `stable` tag another time.

# Developing
Feel free to submit your own ideas, fixes or suggestions as pull requests or issues! Please make sure to check that ESLint has nothing to complain about, but apart from that you're free to do everything as you'd like.
If you just want to add your own commands or events, you should look at `commands/ping.js` or `events/ready.js` to understand how they get loaded and called, but it should all be relatively similar to the [discord.js guide](https://discordjs.guide/).
## Meta
mara#8977 on Discord

Distributed under the MIT license. See `LICENSE` for more information.
