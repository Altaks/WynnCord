# WynnCord
Wynncraft Discord Bot that uses WynnCraft public API

## Usages

This bot got created for a friend that needed to check guild activities, how long since player last connected the server to analyse what players were inactive.

Feel free to fork/use the code, you'll just need to add a **config.json** file with 3 things »

* The bot's client ID (the id of your application)
* Your guild ID (the id of the server that you want the bot to be on)
* The token from which the bot can connect to its account

The **config.json** file is structured like this : 
```json
{
  "clientId" : "paste the ID of your application",
  "guildId" : "paste the ID of your server here",
  "token": "paste the token of connection to your bot here." 
}
```

To start the bot you'll need several things :

* NodeJS v16+
* Install dependencies such as :
  * @discordjs/builders
  * @discordjs/rest
  * discord-api-types
  * discord.js
  * eslint
  * node-fetch

But you can install all the dependencies by using the following command into your terminal (when you're in the bot root directory) :
```sh
npm install @discordjs/builders @discordjs/rest discord-api-types discord.js eslint node-fetch
```
And then to start the bot you'll only need to type :
```sh
node index.js
```
