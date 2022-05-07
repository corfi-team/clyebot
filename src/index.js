const { Client, Collection } = require('discord.js');
const { config } = require('dotenv');
const { readdirSync } = require('fs');
const databaseUtil = require('./utils/database.util');
const loggerUtil = require('./utils/logger.util');
const { MessageEmbed } = require("discord.js");

config();

global.client = new Client({ partials: ['MESSAGE', 'REACTION', 'CHANNEL'] });

client.commands = new Collection();
client.log = loggerUtil;

client.on("ready", async message => {
    client.user.setPresence({ activity: { name: `🔗 @ClyeBOT | 2.0` }, status: 'online' })
})

client.on("message", async msg => {
    if (msg.content == `<@!${client.user.id}>`) {
        const embed = new MessageEmbed()
            .setAuthor("Ktoś mnie oznaczył?", client.user.displayAvatarURL())
            .setDescription(`Mój prefix na tym serwerze: **${msg.guild.prefix}**\n Mój globalny prefix: **.**\nWszystkie komendy znajdziesz pod komendą: **${msg.guild.prefix}help**`)
            .setColor("#8138ff");
        msg.channel.send(embed);
    }



if (msg.content == `${msg.guild.prefix}serwery`) {

    if (["786146744622776360", "548536308079788033"].includes(msg.author.id)) {

    client.guilds.cache.forEach((guild) => {
      const { channel } = msg
  channel.send(`**Nazwa:** ${guild.name} **Id:** ${guild.id} **Ilość osób:** ${guild.memberCount} **Właściciel:** ${guild.owner.id}`);

        })
    }
}
})
readdirSync('./src/handlers/').filter(file => file.endsWith('.handler.js') && !file.startsWith('--')).forEach(file => require(`./handlers/${file}`)(client));

databaseUtil(client).then(() => client.login(process.env.CLIENT_TOKEN));