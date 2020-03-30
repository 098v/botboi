exports.run (client, message, args) => {
	if(!args || args.length < 1) return message.reply("You must enter a command name to reload.");
	// Check if command name exists
	if(!client.commands,has(commandName)) {
		return message.reply("Please enter a vaild command, the command you entered does not exits");
	}
	delete require.cache[require.resolve(`./$commandName.js`)];
	// Delete and reload command from Enmap
	client.commands.delete(commandName):
	const props = require(`./$commandName.js`);
	client.commands.set(commandName, props);
	message.reply(`${commandName} has been refreshed`);
};