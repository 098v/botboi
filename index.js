const Discord = require('discord.js');
const client = new Discord.Client({
	disableEveryone: true
});
const queue = new Map();
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.GOOGLE_API_KEY);
const ytdl = require('ytdl-core');


// Check bot
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	// client.user.setGame('Being overhauled');
	client.user.setActivity('BEING OVERHAULED', { type: 'PLAYING' })
		.then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
		.catch(console.error);
});
client.on('error', () => {
	console.log(`Error ${console.error}!`);
});
client.on('warn', () => {
	console.log(`Warning ${console.warn}`);
});
client.on('disconnect', () => {
	console.log(`I've been disconnected to the server!`);
});
client.on('reconnecting', () => {
	console.log(`Reconnecting to the server`);
});

// Login with token
client.login(process.env.TOKEN);

// Read messages to parse into commands
client.on('message', async message => {
	// Ignore own text
	if (message.author.bot) return;
	// Check if message starts with process.env.prefix
	if (!message.content.startsWith(process.env.prefix)) return;
	// Music Queue Const
	const musList = queue.get(message.guild.id);

	// Dumb !ping pong command mainly for testing
	if (message.content === `${process.env.prefix}ping`) {
		message.reply('Pong!');
	}

	// Bruh command
	if (message.content === `${process.env.prefix}bruh`) {
		const attachment = new Discord.Attachment(
			'https://cdn.discordapp.com/attachments/649620218376880152/649627775908577280/Bruh_Sound_Effect_2.mp4'
		);
		message.channel.send(attachment);
	}

	// Why command
	if (message.content === `${process.env.prefix}why`) {
		const attachment = new Discord.Attachment(
			'https://i.imgur.com/89XcQzT.png'
		);
		message.channel.send(attachment);
	}

	// Aw man command
	if (message.content === `${process.env.prefix}awwman`) {
		const attachment = new Discord.Attachment(
			'https://i.imgur.com/A99CLCU.png'
		);
		message.channel.send(attachment);
	}

	// OMEGALUL command
	if (message.content === `${process.env.prefix}omegalul`) {
		const attachment = new Discord.Attachment(
			'https://i.imgur.com/totViOf.png'
		);
		message.channel.send(attachment);
	}

	// POGGERS command
	if (message.content === `${process.env.prefix}poggers`) {
		const attachment = new Discord.Attachment(
			'https://i.imgur.com/w0pkR5k.png'
		);
		message.channel.send(attachment);
	}

	// PEPEGA command
	if (message.content === `${process.env.prefix}pepega`) {
		const attachment = new Discord.Attachment(
			'https://i.imgur.com/oEvmypZ.png'
		);
		message.channel.send(attachment);
	}

	// HYPERS command
	if (message.content === `${process.env.prefix}hypers`) {
		const attachment = new Discord.Attachment(
			'https://i.imgur.com/GFJxx2J.png'
		);
		message.channel.send(attachment);
	}

	// monkaW command
	if (message.content === `${process.env.prefix}monkaw`) {
		const attachment = new Discord.Attachment(
			'https://i.imgur.com/S1ZMhMD.png'
		);
		message.channel.send(attachment);
	}

	// monkaS command
	if (message.content === `${process.env.prefix}monkas`) {
		const attachment = new Discord.Attachment(
			'https://i.imgur.com/lvhaKMW.png'
		);
		message.channel.send(attachment);
	}

	// Uno Reverse command
	if (message.content === `${process.env.prefix}reverse`) {
		const attachment = new Discord.Attachment(
			'https://i.imgur.com/yXEiYQ4.png'
		);
		message.channel.send(attachment);
	}

	// Music commands
	if (message.content.startsWith(`${process.env.prefix}play`)) {
		execute(message, musList);
	} else if (message.content.startsWith(`${process.env.prefix}skip`)) {
		skip(message, musList);
		return;
	} else if (message.content.startsWith(`${process.env.prefix}stop`)) {
		stop(message, musList);
		return;
	} else if (message.content.startsWith(`${process.env.prefix}nowplaying`)) {
		nowplaying(message, musList);
		return;
	} else if (message.content.startsWith(`${process.env.prefix}upnext`)) {
		upnext(message, musList);
		return;
	} else if (message.content.startsWith(`${process.env.prefix}pause`)) {
		pause(message, musList);
		return;
	} else if (message.content.startsWith(`${process.env.prefix}resume`)) {
		resume(message, musList);
		return;
	}
	// FIX THIS
	// else if (message.content.startsWith(`${process.env.prefix}volume`)) {
	//   volume(message, musList);
	//   return;
	// }

	//KEEP AT BOTTOM
	// List all servers that it's connected to
	// Should only be Testing Grounds and Struggle Squad
	// console.log('Servers connected to:');
	client.guilds.forEach(guild => {
		// console.log(' - ' + guild.name);
		// List channels
		guild.channels.forEach(channel => {
			// console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);
		});
	});
});

async function execute(message, musList) {
	const args = message.content.split(' ');
	const searchString = args.slice(1).join(' ');
	const url = args[1].replace(/<(.+)>/g, '$1');

	const voiceChannel = message.member.voiceChannel;
	if (!voiceChannel)
		return message.channel.send(
			'You need to be in a voice channel to play music'
		);

	const permissions = voiceChannel.permissionsFor(message.client.user);
	if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
		return message.channel.send(
			"I don't have the permissions to join and speak or join in the voice channel!"
		);
	}

	try {
		var video = await youtube.getVideo(url);
	} catch (error) {
		try {
			var videos = await youtube.searchVideos(searchString, 1);
			var video = await youtube.getVideoByID(videos[0].id)
		} catch (err) {
			console.error(err)
			return message.channel.send('Video not found');
		}
	}
	// return console.log(video);
	const song = {
		id: video.id,
		title: video.title,
		url: `https://www.youtube.com/watch?v=${video.id}`
	};

	if (!musList) {
		const queueContruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(message.guild.id, queueContruct);
		queueContruct.songs.push(song);
		try {
			var connection = await voiceChannel.join();
			queueContruct.connection = connection;
			play(message.guild, queueContruct.songs[0]);
		} catch (error) {
			console.log(error);
			queue.delete(message.guild.id);
			return message.channel.send(
				`I could not join the voice channel: ${error}`
			);
		}
	} else {
		musList.songs.push(song);
		console.log(musList.songs);
		return message.channel.send(`${song.title} has been added to the queue`);
	}
	return;
}

function skip(message, musList) {
	if (!message.member.voiceChannel)
		return message.reply(
			'you have to be in the voice channel to skip the current track'
		);
	if (!musList) return message.reply('There are no songs to skip');
	musList.connection.dispatcher.end();
	return message.channel.send('The current track has been skipped');
}

function stop(message, musList) {
	if (!message.member.voiceChannel)
		return message.reply(
			'you have to be in the voice channel to stop the music'
		);
	musList.songs = [];
	musList.connection.dispatcher.end();
}

function nowplaying(message, musList) {
	if (!musList) return message.reply('There are no songs playing');
	return message.channel.send(`Now playing: **${musList.songs[0].title}**`);
}

function upnext(message, musList) {
	if (!musList) return message.reply('There are no songs playing');
	return message.channel.send(
		`__**Song Queue**__ ${musList.songs
	  .map(song => `**-** ${song.title}`)
	  .join('\n')}
	  __**Now Playing**__ ${musList.songs[0].title}
	  `
	);
}

function pause(message, musList) {
	if (musList && musList.playing) {
		musList.playing = false;
		musList.connection.dispatcher.pause();
		return message.channel.send('The current track has been paused');
	}
	return message.channel.send('There are no songs playing');
}

function resume(message, musList) {
	if (musList && !musList.playing) {
		musList.playing = true;
		musList.connection.dispatcher.resume();
		return message.channel.send('The current track has resumed');
	}
	return message.channel.send('There are no songs playing');
}

// FIX THIS
function volume(message, musList, args) {
	// if (!message.member.voiceChannel)
	// 	return message.channel.send('You are not in a voice channel!');
	// if (!musList) return message.channel.send('There is nothing playing.');
	// if (!args[1])
	// 	return message.channel.send(`The current volume is: **${musList.volume}**`);
	// musList.volume = args[1];
	// musList.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
	// return message.channel.send(`I set the volume to: **${args[1]}**`);
}

function play(guild, song) {
	const musList = queue.get(guild.id);
	if (!song) {
		musList.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}

	const dispatcher = musList.connection
		.playStream(ytdl(song.url))
		.on('end', () => {
			console.log('Stopped playing music');
			musList.songs.shift();
			play(guild, musList.songs[0]);
		})
		.on('error', error => {
			console.error(error);
		});
	dispatcher.setVolumeLogarithmic(musList.volume / 5);

	// Output song title to channel
	musList.textChannel.send(`Now playing: **${song.title}**`);
}