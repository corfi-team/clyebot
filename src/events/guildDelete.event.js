const { WebhookClient, MessageEmbed } = require('discord.js');
const config = require('../config');
const dayjs = require('dayjs');

const hook = new WebhookClient(config.webhooks.guildDelete[0], config.webhooks.guildDelete[1]);

module.exports = async (guild) => {
	let owner = await client.users.fetch(guild.ownerID).catch(e => e);
	if (owner instanceof Error) owner = null;

	const guildDeleteEmbed = new MessageEmbed()
		.setAuthor('Wyrzucono bota z serwera', client.user.displayAvatarURL())
		.setColor(config.error)
		.setThumbnail(guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL())
		.addField('> Serwer', `\`${guild.name} (${guild.id})\``)
		.addField('> Właściciel', `\`${owner ? `${owner.tag} (${guild.ownerID})` : 'Nie można określić'})\``)
		.addField('> Ilość osób', `\`${guild.memberCount}\``)
		.addField('> Data utworzenia', `\`${dayjs(guild.createdTimestamp).format('DD.MM.YYYY HH:mm:ss')}\``)
	hook.send({
		embeds: [guildDeleteEmbed],
		avatarURL: client.user.displayAvatarURL(),
		username: 'Wyrzucono bota'
	});
}