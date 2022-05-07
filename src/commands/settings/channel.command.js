const checkChannel = require('../../utils/checkChannel');

module.exports = {
	name: 'channel',
	aliases: ['kanal', 'kanał'],
	permissions: ['MANAGE_GUILD'],
	run: async ({ msg, args }) => {
		if (!args[0]) return {
			type: 'error',
			text: 'Oznacz kanał lub podaj jego ID'
		}

		args[0] = args[0].replace(/[<#>]/g, '');

		const channel = msg.guild.channels.cache.get(args[0]);

		if (!channel) return {
			type: 'error',
			text: 'Ten kanał nie istnieje na tym serwerze'
		}

		if (channel.type !== 'text') return {
			type: 'error',
			text: 'Podany kanał nie jest tekstowy'
		}

		if (channel.nsfw) return {
			type: 'error',
			text: 'Kanał reklam nie może być nsfw'
		}

		if (!checkChannel(channel)) return {
			type: 'error',
			text: 'Kanał reklam nie jest widoczny dla wszystkich (Kanał musi mieć permisje dla everyone: wyświetlanie kanału oraz czytanie histroii czatu)'
		}

		const clientPermissions = ['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'CREATE_INSTANT_INVITE'];

		if (!channel.permissionsFor(msg.guild.me)?.has(clientPermissions)) return {
			type: 'error',
			text: `Bot musi posiadać permisje ${permissions.map(perm => require('../../../permissions.json')[perm]).join(', ')}`
		}

		const guildData = await client.getGuild(msg.guild.id);

		if (guildData.channelID === channel.id) return {
			type: 'error',
			text: 'Ten kanał jest aktualnie ustawiony'
		}

		const invite = await channel.createInvite({ maxAge: 0 }).catch(e => e);

		if (invite instanceof Error) return {
			type: 'error',
			text: 'Nie udało się utworzyć zaproszenia'
		}

		client.updateGuild(msg.guild.id, {
			channelID: channel.id,
			inviteCode: invite.code
		});

		return {
			text: `Kanał reklam został ustawiony na <#${channel.id}>`
		}
	}
}