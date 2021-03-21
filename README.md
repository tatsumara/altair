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

## Issues
* Definition command will throw an error when no definition is found, need to find a way to catch 404's
* Image command throws an API error when embed is deleted before collector timer runs out, too lazy to catch it/detect embed deletion
    * Also when the command is triggered multiple times in a short timespan, changing the page will trigger for all embeds
* Source command won't always display author properly, need to improve embed and variables (SauceNAO API SUCKS)
* Urban command still looks bad

## Meta
mara#8977 on Discord

Distributed under the MIT license. See ``LICENSE`` for more information.
