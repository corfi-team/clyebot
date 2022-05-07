module.exports = {
	name: 'premium',
	ownerOnly: true,
	run: async ({ args }) => {

		if (!args[0]) return {
			type: 'error',
			text: 'Podaj ID serwera'
		}

		const guild = client.guilds.cache.get(args[0]);

		if (!guild) return {
			type: 'error',
			text: 'Bota nie ma na takim serwerze'
		}

		const guildData = await client.getGuild(guild.id);

		if (!guildData) return {
			type: 'error',
			text: 'Serwer nie jest wpisany do bazy danych'
		}

		if (guildData.premium) {
			client.updateGuild(guild.id, { premium: false });
			return {
				text: 'Premium zostało zabrane'
			}
		} else {
			client.updateGuild(guild.id, { premium: true });
			return {
				text: 'Premium zostało nadane'
			}
		}

	}
}