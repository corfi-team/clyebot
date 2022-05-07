const { MessageEmbed } = require("discord.js")
module.exports = {
    name: "botinfo",
    aliases: ["bot"],
    run: async ({ msg }) => {
        const embed = new MessageEmbed()
        .setTitle(`Informacje o Bocie!`)
        .setColor(`#8138ff`)
        .addField(`> **\ Nazwa:\**`, `${client.user.tag}`, true)
        .addField(`> **\ Developerzy:\**`, `**<@548536308079788033>, <@472663010733719563>**`, true)
        .addField(`> **\ Domyślny Prefix:\**`, `.`, true)
        .addField(`> **\ Liczba serwerów:\**`, `${client.guilds.cache.size}`, true)
        .addField(`> **\ Użytkownicy:\**`, `${client.users.cache.size}`, true)
        .addField(`> **\ Liczba kanałów:\**`, `${client.channels.cache.size}`, true)
        .addField(`> **\ Wersja Discord.js:\**`, `12.5.3`, true)
        .addField(`> **\ Wersja Node.js:\**`, `15.12.0`, true)
        .addField(`> **\ Zużycie ramu:\**`, `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB/4GB`, true)
        .setFooter(`${msg.author.tag} (${msg.author.id})`, msg.author.displayAvatarURL({ dynamic: true }))
    msg.channel.send(embed);
    }
}