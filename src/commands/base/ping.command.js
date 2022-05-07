module.exports = {
	name: 'ping',
	run: async () => {
		return {
			text: `Pong! 🏓 ${client.ws.ping}ms`
		}
	}
}