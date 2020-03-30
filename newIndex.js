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
		let commName = file.split
	})
});