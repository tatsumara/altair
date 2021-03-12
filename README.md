# Altair Discord Bot
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-barely-yellow.svg)](https://github.com/tatsumara/altair/graphs/commit-activity)
[![Author](https://img.shields.io/badge/Author-mara-purple.svg)](https://shields.io/)

This is just a repository to store and track development of my personal discord bot. You can do with this code what you want, but if you're gonna publish something based off of it (which is understandably very unlikely), please be sure to credit me! (:

## Usage example

Simply clone this repository into an easily accessable folder and create a file named ``config.json`` in the root of the repository.
```json
{
    "token": "your token here",
    "ownerId": "id of your account here",
    "prefix": "a!"
}
```
Now you can add your own commands in the respective folder.
I recommend orienting yourself after ``template.js_temp``, as it demonstrates how a module is usually structured.

## Release History
* 0.1.0
    * Added and improved image command
    * Added definition and urban dictionary commands
    * Crudely implemented cooldown system, needs to be improved/cleaned up
    * Rockpost will be removed if I ever make this bot "official"
* 0.0.4
    * Completely reworked event handler (implementation is kinda messy right now but I will work on it in the future)
    * Added an avatar command
    * Multiple small quality-of-life improvements
* 0.0.2
    * Implementation of image search, needs to be improved
    * Working help command
    * Improvements to error handling
    * Totally unnecessary coordinated color change, just because I can.
* 0.0.1
    * Initial release, should serve as an alright base.

## Meta
mara#8977 on Discord

Distributed under the MIT license. See ``LICENSE`` for more information.
