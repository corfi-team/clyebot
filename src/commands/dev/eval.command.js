/* eslint-disable no-eval */
const { MessageEmbed } = require("discord.js");
const config = require('../../config');

module.exports = {
	name: "eval",
	aliases: ["js"],
	run: async ({ msg, args }) => {
		if (!config.owners.includes(msg.author.id)) return;

		let toEval = args.join(" ");

		try {
			let evaled = await eval(toEval);

			if (typeof evaled !== "undefined" && evaled.toString().includes(client.token)) {
				const embed = new MessageEmbed()
					.setAuthor("Wykonano pomyślnie!", client.user.displayAvatarURL())
					.addField("Kod", `\`\`\`js\n${(toEval || "<none>")}\`\`\``)
					.addField("Wynik", "```wypierdalaj```")
					.addField("Typ", "```token bota```")
					.setColor(config.main);
				msg.channel.send(embed);
				return;
			}

			const type = evaled ? typeof evaled : "<none>";
			if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
			if (toEval.length > 1012) toEval = `${toEval.substring(0, 1012)}...`;
			if (evaled.length > 1012) evaled = `${evaled.substring(0, 1012)}...`;

			const embed = new MessageEmbed()
				.setAuthor("Wykonano pomyślnie!", client.user.displayAvatarURL())
				.addField("Kod", `\`\`\`js\n${(toEval || "<none>")}\`\`\``)
				.addField("Wynik", `\`\`\`js\n${evaled ? evaled : "<none>"}\`\`\``)
				.addField("Typ", `\`\`\`js\n${type}\`\`\``)
				.setColor(config.main);
			msg.channel.send(embed);
		} catch (error) {
			const errorEmbed = new MessageEmbed()
				.setAuthor("Wystąpił błąd!", client.user.displayAvatarURL())
				.addField("Błąd", `\`\`\`yaml\n${error}\`\`\``)
				.setColor(config.error);
			msg.channel.send(errorEmbed);
		}
	},
};
