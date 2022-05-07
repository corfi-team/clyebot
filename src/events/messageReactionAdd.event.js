const temp = new Map();

const config = require('../config');
const checkChannel = require('../utils/checkChannel');
const { MessageEmbed } = require('discord.js');

const approve = async ({ guild, msg, user, embed, time, userID, channel, number }) => {
	
	client.deleteAdCheckingByGuildID(guild?.id);

	const verifyOldEmbed = new MessageEmbed(embed).setColor('GREEN')
		.addField('> Kto zaakceptował', `\`${user.tag} ${user.id}\``)
		.addField('> Numer pod który została dodana reklama', `\`${number}\``)
	await msg.edit(verifyOldEmbed);

	await msg.reactions.removeAll();

	const notflicationEmbed = new MessageEmbed()
		.setAuthor('Reklama została ZAAKCEPTOWANA', client.user.displayAvatarURL())
		.setColor(config.main)
		.addField('> Serwer', `\`${guild ? `${guild.name} ${guild.id}` : 'Nie można określić'}\``)
		.addField('> Czas oczekiwania', `\`${time.hours}H ${time.minutes}m\``)
		.addField('> Numer pod który została dodana reklama', `\`${number}\``)
		.addField('> Weryfikator', `\`${user.tag} ${user.id}\``)

	await channel?.send(notflicationEmbed).catch(e => e);
	await client.users.cache.get(userID)?.send(notflicationEmbed).catch(e => e);
	const m = await client.guilds.cache.get(config.supportID).channels.cache.get(config.notflicationsChannel)?.send(notflicationEmbed).catch(e => e);

	if (!m instanceof Error) m.crosspost();
}

const reject = async ({ guild, msg, user, reason, embed, time, userID, channel }) => {
	
	client.deleteAdCheckingByGuildID(guild?.id);

	const verifyOldEmbed = new MessageEmbed(embed).setColor(config.error)
		.addField('> Kto odrzucił', `\`${user.tag} ${user.id}\``)
		.addField('> Powód odrzucenia', `\`yaml\n${reason}\``)
	await msg.edit(verifyOldEmbed);

	await msg.reactions.removeAll();

	const notflicationEmbed = new MessageEmbed()
		.setAuthor('Reklama została ODRZUCONA', client.user.displayAvatarURL())
		.setColor(config.error)
		.addField('> Serwer', `\`${guild ? `${guild.name} ${guild.id}` : 'Nie można określić'}\``)
		.addField('> Czas oczekiwania', `\`${time.hours}H ${time.minutes}m\``)
		.addField('> Powód odrzucenia', `\`${reason}\``)
		.addField('> Weryfikator', `\`${user.tag} ${user.id}\``)

	await channel?.send(notflicationEmbed).catch(e => e);
	await client.users.cache.get(userID)?.send(notflicationEmbed).catch(e => e);
	const m = await client.guilds.cache.get(config.supportID).channels.cache.get(config.notflicationsChannel)?.send(notflicationEmbed).catch(e => e);

	if (!m instanceof Error) m.crosspost();
}

module.exports = async (reaction, user) => {

	if (user.bot) return;
	const msg = reaction.message;

	if (!msg.guild) return;

	if (msg.guild.id !== config.supportID) return;

	if (msg.channel.id !== config.verifyChannelID) return;

	const verifyData = await client.getAdCheckingByMessageID(msg.id);

	if (!verifyData) return;

	if (temp.has(`${user.id}_u`) || temp.has(`${msg.id}_m`)) return reaction.users.remove(user.id);

	const embed = JSON.parse(verifyData.embed);

	let totalSeconds = ((Date.now() - verifyData.timestamp) / 1000);
	totalSeconds %= 86400;
	const hours = Math.floor(totalSeconds / 3600);
	totalSeconds %= 3600;
	const minutes = Math.floor(totalSeconds / 60);

	const time = {
		hours,
		minutes
	}

	const guild = client.guilds.cache.get(verifyData.guildID);

	if (!guild) return await reject({ msg, user: client.user, embed, time, userID: verifyData.userID, reason: 'Brak bota na serwerze' });

	const guildData = await client.getGuild(guild.id);

	if (!guildData) return await reject({ guild, msg, user: client.user, embed, time, userID: verifyData.userID, reason: 'Brak ustawionego kanału reklam' });

	const channel = guild.channels.cache.get(guildData.channelID);

	if (!channel || !checkChannel(channel)) return await reject({ guild, channel, msg, user: client.user, embed, time, userID: verifyData.userID, reason: 'Skasowany lub ukryty kanał reklam' });

	if (channel.nsfw) return await reject({ guild, channel, msg, user: client.user, embed, time, userID: verifyData.userID, reason: 'Kanał reklam jest nsfw' });

	temp.set(`${msg.id}_m`, true);
	temp.set(`${user.id}_u`, true);

	switch (reaction._emoji.id) {
		case '840212341806596097': {
			const adData = await client.getAdByGuildID(guild.id);

			const number = adData ? adData.number : (await client.getAdsCount()) + 1;

			if (adData) {
				client.updateAdByGuildID(guild.id, {
					content: verifyData.content
				});
			} else {
				client.insertAd({
					guildID: guild.id,
					queue: 0,
					content: verifyData.content,
					number
				});
			}

			await approve({ guild, msg, user, embed, time, userID: verifyData.userID, channel, number });
			temp.delete(`${msg.id}_m`);
			temp.delete(`${user.id}_u`);
			break;
		}

		case '840212367421603901': {
			const filter = m => m.author.id === user.id;

			const message = await msg.channel.send('> `Podaj powód odrzucenia reklamy`');

			const collector = msg.channel.createMessageCollector(filter, { time: 40000 });

			const reason = await new Promise(async resolve => {
				let r;
				collector.on('collect', async m => {
					m.delete({ timeout: 250 });
					if (!m.content) {
						const mm = await m.channel.send('> `Ale podaj powód odrzucenia reklamy a nie załącznik :<`');

						return mm.delete({ timeout: 3000 });
					}

					r = m.content.slice(0, 150);
					collector.stop();
				});

				collector.on('end', () => {
					resolve(r);
					message.delete();
				});
			});
			if (!reason) {
				message.delete();
				return reaction.users.remove(user.id);
			}
			await reject({ guild, msg, user, reason, embed, time, userID: verifyData.userID, channel });
			temp.delete(`${msg.id}_m`);
			temp.delete(`${user.id}_u`);
			break;
		}

		case '832646504849473606': {
			const filter = m => m.author.id === user.id;

			const message = await msg.channel.send('> `Podaj numer pod który mam dodać reklamę`');

			const collector = msg.channel.createMessageCollector(filter, { time: 40000 });

			const number = await new Promise(async resolve => {
				let rr;
				collector.on('collect', async m => {
					m.delete({ timeout: 250 });
					if (!m.content) {
						const mm = await m.channel.send('> `Ale podaj numer a nie załącznik :<`');

						return mm.delete({ timeout: 3000 });
					}

					if (isNaN(m.content)) {
						const mm = await m.channel.send('> `Ale podaj poprawny numer :<`');

						return mm.delete({ timeout: 3000 });
					}

					const data = await client.getAdByNumber(Number(m.content));

					if (!data) {
						const mm = await m.channel.send('> `Pod tym numerem nie ma żadnej reklamy :<`');

						return mm.delete({ timeout: 3000 });
					}

					rr = Number(m.content);
					collector.stop();
				});

				collector.on('end', () => {
					resolve(rr);
					message.delete();
				});
			});

			if (!number) {
				message.delete();
				return reaction.users.remove(user.id);
			}
			const adData = await client.getAdByGuildID(guild.id);

			if (adData) {
				client.updateAdByGuildID(guild.id, {
					content: verifyData.content
				});
			} else {
				client.insertAd({
					guildID: guild.id,
					queue: 0,
					content: verifyData.content,
					number
				});
			}

			await approve({ guild, msg, user, number, embed, time, userID: verifyData.userID, channel });
			temp.delete(`${msg.id}_m`);
			temp.delete(`${user.id}_u`);
			break;
		}

		default: return reaction.users.remove(user.id);
	}
}