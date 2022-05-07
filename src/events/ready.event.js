const { Queue } = require('../Structures/Queue');

module.exports = () => {
	client.log.ready(`Logged in as ${client.user.tag}`);
	new Queue(4 * 60 * 1000).startNewQueue();
}