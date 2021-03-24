# Altair Discord Bot
[![Version](https://img.shields.io/github/v/release/tatsumara/altair)](https://github.com/tatsumara/altair/releases/latest)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/tatsumara/altair/graphs/commit-activity)
[![Author](https://img.shields.io/badge/Author-mara-purple.svg)](https://shields.io/)

This is just a repository to store and track development of my personal discord bot. You can do with this code what you want, but if you're gonna publish something based off of it (which is understandably very unlikely), please be sure to credit me! (:

## Usage example
Simply download the latest release (usually named ``altair.zip``), enter your bot token into ``config.js``, make necessary adjustments and you're set!
To use the `sauce.js` command you also need to supply an API key for saucenao.
Now you can add your own commands and events in the respective folders.
I recommend orienting yourself after ``template.js_temp`` in both cases, as it demonstrates how a module is usually structured.

## Issues
* Definition command will throw an error when no definition is found, need to find a way to catch 404's
* Source command currently not working on RPi3b+

## Meta
mara#8977 on Discord

Distributed under the MIT license. See ``LICENSE`` for more information.
