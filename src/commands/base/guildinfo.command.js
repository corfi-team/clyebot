const { MessageEmbed } = require("discord.js")
module.exports = {
    name: "user",
    aliases: ["userinfo"],
    run: async ({ msg }) => {
        const user = msg.mentions.users.first();
        if (!user) return {
			type: 'error',
			text: 'Oznacz osobe o której chcesz zobaczyć informacje!'
		}
        
       
        
        const userrr = new MessageEmbed()
                .setTitle(`Informacje o Użytkowniku!`)
            .setColor(`#8138ff`)
              .addField("Nazwa uzytkownika", `${user.tag}`)
              .addField("ID", user.id, true)
              .addField("Status", `${user.presence.status}`, true)
              .addField("Dołączył na discord", user.createdAt)
              .setFooter(`${msg.author.tag} (${msg.author.id})`, msg.author.displayAvatarURL({ dynamic: true }))
          msg.channel.send(userrr)
    
        }
           
      
        
        };