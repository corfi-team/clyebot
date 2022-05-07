const { MessageEmbed } = require('discord.js');
const { exec } = require('child_process');
const config = require('../../config');

module.exports = {
	name: 'shell',
	aliases: ['sh', 'cmd'],
	run: async ({ msg, args }) => {
		if (!config.owners.includes(msg.author.id)) return;

		const cmd = args.join(' ');
		if (cmd === '') return {
			type: 'error',
			text: 'Musisz podać komendę do wykonania'
		}
		const embed = new MessageEmbed()
			.setAuthor('Shell', 'https://cdn.discordapp.com/emojis/832311241749954592.png?v=1')
			.setColor(config.main);

		exec(cmd, async (error, data, getter) => {
			if (error) {
				if (error.length > 1012) error = error.substring(0, 1012) + '...';
				embed.setDescription(`\`\`\`\n${error.message}\`\`\``).setColor(config.error);
				msg.channel.send(embed);
				return;
			}
			if (getter) {
				if (data.length > 1012) data = data.substring(0, 1012) + '...';
				embed.setDescription(`\`\`\`\n${data}\`\`\``);
				msg.channel.send(embed);
				return;
			}
			if (data) {
				if (data.length > 1012) data = data.substring(0, 1012) + '...';
				embed.setDescription(`\`\`\`\n${data}\`\`\``);
				msg.channel.send(embed);
			}
		});
	},
};
