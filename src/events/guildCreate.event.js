const { WebhookClient, MessageEmbed } = require('discord.js');
const config = require('../config');
const dayjs = require('dayjs');

const hook = new WebhookClient(config.webhooks.guildCreate[0], config.webhooks.guildCreate[1]);

module.exports = async (guild) => {
	const randomChannel = guild.channels.cache.filter(chn => chn.type === 'text').random();

	let invite;

	if (!randomChannel.permissionsFor(guild.me).has('CREATE_INSTANT_INVITE')) invite = null;
	else {
		invite = await randomChannel.createInvite({ maxAge: 0 }).catch(e => e);
		if (invite instanceof Error) invite = null;
	}

	let auditLog;

	if (guild.me.hasPermission('VIEW_AUDIT_LOG')) {
		auditLog = await guild.fetchAuditLogs({
			type: 'BOT_ADD',
			limit: 1
		}).catch(e => e);

		if (auditLog instanceof Error) auditLog = null;
	}

	const guildCreateEmbed = new MessageEmbed()
		.setAuthor('Dodano bota na nowy serwer', client.user.displayAvatarURL())
		.setColor(config.main)
		.setThumbnail(guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL())
		.addField('> Serwer', `\`${guild.name} (${guild.id})\``)
		.addField('> Kto dodał', `\`${auditLog ? `${auditLog.entries.first().executor.tag} (${auditLog.entries.first().executor.id})` : 'Nie można określić'}\``)
		.addField('> Zaproszenie', `> ${invite ? `[\`discord.gg/${invite.code}\`](https://discord.gg/${invite.code})` : '\`Nie można określić\`'}`)
		.addField('> Ilość osób', `\`${guild.memberCount}\``)
		.addField('> Data utworzenia', `\`${dayjs(guild.createdTimestamp).format('DD.MM.YYYY HH:mm:ss')}\``)
	hook.send({
		embeds: [guildCreateEmbed],
		avatarURL: client.user.displayAvatarURL(),
		username: 'Dodano bota'
	});
}