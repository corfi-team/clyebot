const { readdirSync } = require('fs');

module.exports = (client) => {
	readdirSync('./src/events/').filter(file => file.endsWith('.event.js') && !file.startsWith('--')).forEach(file => {

		client.on(file.split('.')[0], (...args) => require(`../events/${file}`)(...args));

		client.log.info(`${file} loaded successfully as ${file.split('.')[0]}`);
		
	});
}