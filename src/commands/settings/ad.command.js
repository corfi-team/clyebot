const { MessageEmbed } = require('discord.js');
const config = require('../../config');
const checkChannel = require('../../utils/checkChannel');

const invites = ['discord.gg/', 'discord.com/invite', 'discordapp.com/invite', 'sparfy.eu', 'sparfy.pl', 'marketbot.ml', 'sparfy.net', 'versy.eu', 'versy.xyz', 'nadsc.pl'];

module.exports = {
	name: 'ad',
	aliases: ['reklama'],
	permissions: ['MANAGE_GUILD'],
	run: async ({ msg, args }) => {
		const adCheckingData = await client.getAdCheckingByGuildID(msg.guild.id);

		if (adCheckingData) return {
			type: 'error',
			text: 'Reklama jest aktualnie sprawdzana'
		}

		const guildData = await client.getGuild(msg.guild.id);

		const channel = msg.guild.channels.cache.get(guildData.channelID);

		if (!channel) return {
			type: 'error',
			text: 'Kanał reklam został prawdopodobnie skasowany lub nie został ustawiony!'
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

		if (!args[0]) return {
			type: 'error',
			text: 'Podaj treść reklamy'
		}

		if (args.length < 10) return {
			type: 'error',
			text: 'Reklama musi miec minimalnie 10 słów'
		}

		const content = args.join(' ');

		if (content.length > 2000) return {
			type: 'error',
			text: 'Treść reklamy może mieć maksymalnie 2000 znaków'
		}

		if (invites.some(word => content.includes(word))) return {
			type: 'error',
			text: 'Reklama nie może zawierać zaproszeń'
		}

		const verifyEmbed = new MessageEmbed()
			.setColor(config.main)
			.setAuthor('Nowa reklama do sprawdzenia', 'https://cdn.discordapp.com/emojis/832646504308932709.gif?v=1')
			.addFields(
				{
					name: '> Serwer',
					value: `\`${msg.guild.name} ${msg.guild.id}\``
				},
				{
					name: '> Osoba',
					value: `\`${msg.author.tag} ${msg.author.id}\``
				},
				{
					name: '> Kanał reklam',
					value: `\`${channel.name} ${channel.id}\` <#${channel.id}>`
				},
				{
					name: '> Zaproszenie',
					value: `[\`discord.gg/${guildData.inviteCode}\`](https://discord.gg/${guildData.inviteCode})`
				},
				{
					name: '> Treść reklamy',
					value: content
				}
			)
			.setThumbnail(msg.guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL())

		const verifyMessage = await client.channels.cache.get(config.verifyChannelID).send(verifyEmbed).catch(e => e);

		if (verifyMessage instanceof Error) return {
			type: 'error',
			text: 'Nie udało mi się wysłać reklamy do weryfikacji\n **Reklama może zawierać link do serwera, zbyt dużo linków, obraźliwe słowa, spam**\n Jeżeli twoja reklama nie zawiera nic z tego napisz do `! Maciex#5605`'
		}

		verifyMessage.react('<:clyebotxyztak:840212341806596097>');
		verifyMessage.react('<:clyebotxyznie:840212367421603901>');
		verifyMessage.react('<:mlotek:832646504849473606>');

		client.insertAdChecking({
			guildID: msg.guild.id,
			timestamp: Date.now(),
			content,
			userID: msg.author.id,
			messageID: verifyMessage.id,
			embed: JSON.stringify(verifyEmbed.toJSON())
		});

		return {
			text: 'Reklama została wysłana do weryfikacji'
		}
	}
}