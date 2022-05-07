const { MessageEmbed } = require('discord.js');
const config = require('../config');

const gbans = require('../../gbans.json');

module.exports = async (msg) => {
	if (!msg.guild || msg.author.bot) return;

	if (!msg.guild.prefix) {
		const data = await client.getGuild(msg.guild.id);

		if (!data) {
			client.insertGuild({
				guildID: msg.guild.id,
				prefix: config.prefix
			});
			msg.guild.prefix = config.prefix;
		} else {
			msg.guild.prefix = data.prefix;
		}
	}

	const prefix = msg.content.startsWith(`<@!${client.user.id}>`) ?
		`<@!${client.user.id}>` :
			msg.content.startsWith(`<@${client.user.id}>`) ?
				`<@${client.user.id}>` :
					msg.guild.prefix

	if (!msg.content.startsWith(prefix)) return;

	const args = msg.content.slice(prefix.length).trim().split(/ +/g);
	const cmd = args.shift().toLowerCase();

	if (!cmd.length) return;

	const command = client.commands.find(c => c.name === cmd || (c.aliases && c.aliases.includes(cmd)));

	if (!command) return;

	if (command.ownerOnly && !config.owners.includes(msg.author.id)) return msg.channel.send(
		new MessageEmbed()
			.setColor(config.error)
			.setAuthor('Odmowa dostępu', 'https://cdn.discordapp.com/emojis/843773376602177556.png?v=1')
			.setThumbnail(msg.author.displayAvatarURL({ dynamic: true }))
			.setDescription('> Nie jesteś właścicielem bota')
	);

	if (command.permissions && command.permissions.some(perm => !msg.member.hasPermission(perm) && !config.owners.includes(msg.author.id))) return msg.channel.send(
		new MessageEmbed()
			.setAuthor('Odmowa dostępu', 'https://cdn.discordapp.com/emojis/843773376602177556.png?v=1')
			.setColor(config.error)
			.setThumbnail(msg.author.displayAvatarURL({ dynamic: true }))
			.setDescription(`> Aby użyć tej komendy musisz posiadać permisje ${command.permissions.map(perm => require('../../permissions.json')[perm]).join(', ')}`)
	);

	if (gbans[msg.author.id]) return msg.channel.send(
		new MessageEmbed()
			.setAuthor('Odmowa dostępu', 'https://cdn.discordapp.com/emojis/843773376602177556.png?v=1')
			.setColor(config.error)
			.setThumbnail(msg.author.displayAvatarURL({ dynamic: true }))
			.setDescription(`>  Zostałeś globalnie zbanowany za ${gbans[msg.author.id]}`)
	)

	const res = await command.run({ cmd, args, msg }).catch(e => e);

	if (res instanceof Error) {
		console.log(res);
		return msg.channel.send(
			new MessageEmbed()
				.setAuthor('Błąd bota', 'https://cdn.discordapp.com/emojis/843773376602177556.png?v=1')
				.setColor(config.error)
				.setThumbnail(msg.author.displayAvatarURL({ dynamic: true }))
				.setDescription(`> Podczas wykonywania tej komendy wystąpił błąd ${res}`)
		)
	}

	if (res && res.text) {
		if (!res.type) res.type = 'success';

		msg.channel.send(
			new MessageEmbed()
				.setColor(res.type === 'success' ? config.main : config.error)
				.setAuthor(res.type === 'success' ? 'Sukces!' : 'Błąd', res.type === 'success' ? 'https://cdn.discordapp.com/emojis/840212341806596097.png?v=1' : 'https://cdn.discordapp.com/emojis/843773376602177556.png?v=1')
				.setThumbnail(msg.author.displayAvatarURL({ dynamic: true }))
				.setDescription(`> ${res.text}`)
		);
	}

	if (res && res.embeds) res.embeds.forEach(embed => msg.channel.send(embed));
}