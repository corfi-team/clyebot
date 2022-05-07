const { readdirSync } = require('fs');

module.exports = (client) => {
	readdirSync('./src/commands/').forEach(dir => {
		readdirSync(`./src/commands/${dir}/`).filter(file => file.endsWith('.command.js') && !file.startsWith('--')).forEach(file => {

			const command = require(`../commands/${dir}/${file}`);

			if (!command.name || !command.run) return client.log.warn(`${file} cannot be loaded because name or run is missing`);

			if (client.commands.has(command.name)) return client.log.warn(`${file} cannot be loaded because this name is already taken`);

			client.commands.set(command.name, command);

			client.log.info(`${file} loaded successfully as ${command.name}`);
			
		});
	});
}