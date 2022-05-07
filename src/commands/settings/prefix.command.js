module.exports = {
	name: 'prefix',
	permissions: ['MANAGE_GUILD'],
	run: async ({ msg, args }) => {
		if (!args[0] || args[0] === msg.guild.prefix) return {
			type: 'error',
			text: 'Podaj nowy prefix'
		}
 
		if (args[0].length > 5) return {
			type: 'error',
			text: 'Prefix może mieć maksymalnie 5 znaków'
		}

		client.updateGuild(msg.guild.id, {
			prefix: args[0]
		});

		msg.guild.prefix = args[0];

		return {
			text: 'Nowy prefix został ustawiony'
		}
	}
}