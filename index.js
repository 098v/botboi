const fs = require("fs");
const Enmap = require("enmap");
const Discord = require("discord.js");

const client = new Discord.Client({
	disableEveryone: true
});
const queue = new Map();
// const { process.env.prefix, token, GOOGLE_API_KEY } = require('./config.json');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.GOOGLE_API_KEY);
const ytdl = require('ytdl-core');

fs.readdir("./commands/", (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		const comm = require(`./commands/${file}`);
		let commName = file.split(".")[0];
		client.on(commName, comm.bind(null, client));
	});
});

client.commands = new Enmap();

fs.readdir("./commands/", (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		if (!file.endsWith(".js")) return;
		let props = require(`./commands/${file}`);
		let commandName = file.split(".")[0];
		console.log(`Trying to load the command ${commandName}`);
		client.commands.set(commandName, props);
	});
});

client.login(process.env.TOKEN);
client.user.setActivity('BEING OVERHAULED', { type: 'PLAYING' })
	.then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
	.catch(console.error);

module.exports = (client, message) => {
	// Ignore all other bots in server
	if (message.author.bot) return;

	// Ignore all messages not starting with desired prefix
	if (message.content.indexOf(process.env.prefix) !== 0) return;

	// Command name + definition
	const args = message.content.slice(process.env.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	// Grab command info from Enmap
	const cmd = client.commands.get(command);

	// If command does not exist, do nothing
	if (!cmd) return;

	// Run commands
	cmd.run(client, message, args);
};