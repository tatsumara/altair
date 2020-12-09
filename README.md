# Altair Discord Bot
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/tatsumara/altair/graphs/commit-activity)
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
I recommend orienting yourself after ``ping.js``, as it demonstrates how a module is usually structured. (I may add a template with other options later.)

## Release History

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
