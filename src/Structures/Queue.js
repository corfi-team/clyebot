const { MessageEmbed } = require('discord.js');
const checkChannel = require('../utils/checkChannel');

exports.Queue = class {
	constructor(time) {

		this.time = time;

	}

	async skipNumber() {
		await client.setNumber();
		this.startNewQueue();
	}

	async startNewQueue() {

		const number = await client.getNumber();

		const adData = await client.getAdByNumber(number);

		if (!adData) {

			await client.setNumber(1);
			return this.startNewQueue();

		}

		client.log.info(`Wysyłam reklame numer ${number}`);

		const guild = client.guilds.cache.get(adData.guildID);

		if (!guild) return this.skipNumber();

		const guildData = await client.getGuild(guild.id);

		if (!guildData) return this.skipNumber();

		const channel = client.channels.cache.get(guildData.channelID);

		if (!channel || !checkChannel(channel)) return this.skipNumber();

		if (!channel.permissionsFor(guild.me)?.has(['SEND_MESSAGES', 'EMBED_FILES', 'ATTACH_FILES', 'CREATE_INSTANT_INVITE'])) return this.skipNumber();

		const checkInvite = await client.fetchInvite(guildData.inviteCode).catch(e => e);

		if (checkInvite instanceof Error) {

			const invite = await channel.createInvite({ maxAge: 0 }).catch(e => e);

			if (invite instanceof Error) return;

			guildData.inviteCode = invite.code;

			client.updateGuild(guild.id, {
				inviteCode: invite.code
			});

		}

		const isPremium = guildData.premium;

		client.updateAdByGuildID(guild.id, {
			queue: adData.queue + 1
		});

		client.guilds.cache.forEach(async g => {

			const gData = await client.getGuild(g.id);

			if (!gData) return;

			const ch = g.channels.cache.get(gData.channelID);

			if (!ch || !ch.permissionsFor(g.me)?.has(['SEND_MESSAGES', 'EMBED_FILES', 'ATTACH_FILES', 'CREATE_INSTANT_INVITE'])) return;

			if (isPremium) {
				ch.send(
					new MessageEmbed()
						.setColor('RANDOM')
						.setAuthor(`Reklama numer ${number}`, client.user.displayAvatarURL())
						.setThumbnail(guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL())
						.setDescription(adData.content)
						.addField(`> Zaproszenie na serwer`, `[\`discord.gg/${guildData.inviteCode}\`](https://discord.gg/${guildData.inviteCode})`)
				)
			} else {
				ch.send(`:link: **Numer: ${number}**\n:test_tube: **ID: ${guild.id}**\n\n${adData.content}\nhttps://discord.gg/${guildData.inviteCode}`);
			}

		});

		setTimeout(async () => {
			await this.skipNumber();
		}, this.time);

	}
}
