const { MessageEmbed } = require("discord.js")
module.exports = {
    name: "linki",
    aliases: ["link"],
    run: async ({ msg }) => {
        const embed = new MessageEmbed()
        .setAuthor("Linki dotyczące bota!", "https://cdn.discordapp.com/attachments/836916133981585410/839203572009009172/djament.gif")
        .addField('Support Serwer', '> **[Kliknij](https://discord.gg/E9UdexjsBV)**')
        .addField("Dodaj Bota", '**>  [Kliknij](https://discord.com/oauth2/authorize?client_id=832528489986916392&permissions=8&scope=bot)**')
        .addField("Strona Bota", '**>  [Kliknij](https://clyebot.xyz)**')
        .setFooter(`Na życzenie ${msg.author.tag} | ${msg.author.id}`, `${msg.author.displayAvatarURL()}`)
        .setColor(`#7b00ff`)
        msg.channel.send(embed)
    }
}