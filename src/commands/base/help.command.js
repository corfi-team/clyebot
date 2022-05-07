const { MessageEmbed } = require("discord.js")
module.exports = {
    name: "help",
    aliases: ["pomoc"],
    run: async ({ msg }) => {
        const embed = new MessageEmbed()
        .setAuthor("Menu pomocy!", "https://cdn.discordapp.com/attachments/836916133981585410/839203572009009172/djament.gif")
        .addField("Konfiguracyjne:", "> `kanal #kanał` - **Komendą którą ustawisz kanał do reklam!**\n> `reklama <treść>` - **Komenda którą ustawisz swoją reklame!**\n> `prefix <nowy prefix>` - **Komenda którą ustawisz prefix wybrany pod ciebie**")
        .addField("Przydatne:", "> `ping` - **Wyświetla ping bota**\n > `help` - **Wyświetla wszystkie komendy bota**\n > `linki` - **Wysyła najważniejsze linki dotyczące bota**\n > `botinfo` - **Wyświetla statystyki bota**")
        .addField("Developerskie:", "> `premium` - **Dodaje reklame premium**\n> `gban` - **Banuje osobe globalnie**\n> `eval` - **Wykonuje kod**")
        .setFooter(`Na życzenie ${msg.author.tag} | ${msg.author.id}`, `${msg.author.displayAvatarURL()}`)
        .setColor(`#7b00ff`)
        msg.channel.send(embed)
    }
}