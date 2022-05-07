const { MessageEmbed } = require("discord.js")
module.exports = {
    name: "serwer",
    aliases: ["serwerinfo"],
    run: async ({ msg }) => {
  
 const serwer = new MessageEmbed()
                .setTitle(`Informacje o Serwerze!`)
            .setColor(`#8138ff`)
            .addField('ID', `${msg.guild.id}`, true)
            .addField('Region', region[msg.guild.region], true)
            .addField(`Owner ${owner}`, msg.guild.owner, true)
            .addField('Created On', `\`${moment(msg.guild.createdAt).format('MMM DD YYYY')}\``, true)
              .setFooter(`${msg.author.tag} (${msg.author.id})`, msg.author.displayAvatarURL({ dynamic: true }))
          msg.channel.send(serwer)
    
        }
           
      
        
        };