const Discord = require('discord.js')
const client = new Discord.Client()
const fs = require('fs');
let config = require('./config.json'); 
let token = config.token; // «Вытаскиваем» из него токен
let prefix = config.prefix; // «Вытаскиваем» из него префикс
let archiveguildid = config.archiveguildid; // ID сервера архива
let archivechannelid = config.archivechannelid; // ID канала архива

client.on("message", (message) => {
   if (message.author.bot)
   return;
})


// СПИСОК КОМАНД

client.on("message", (message) => {
    if (message.content.startsWith(`${prefix}help`)) {
        message.channel.send(`>>> Список команд: \n**${prefix}help** - *помощь по всем командам* \n**${prefix}say (текст)** - *повторяет любое ваше сообщение* \n**${prefix}giverole (пользователь) (роль) (время в мин.) (канал отчёта) (причина)** - *выдача роли наказания на время*`)
    }
})

// ПОВТОРИТЬ СООБЩЕНИЕ

client.on("message", (message) => {
    if (message.content.startsWith(`${prefix}say`)) {
      var text = message.content.split(' ').slice(1).join(' ');
      if(!text) return message.channel.send('Нельзя использовать этот аргумент');
       message.channel.send(`${message.author.username} написал: \n${text}`);
      message.delete();
      message.channel.stopTyping()
    }
})

// ЛОГИ С ОДНОГО СЕРВЕРА НА ДРУГОЙ

client.on("message", async (message) => {
    if (message.channel.id === '976051735170797619') //Канал чтения
    if (message.guild.id != `${archiveguildid}`) { //Сервер архива
      const Channel = client.channels.cache.get(`${archivechannelid}`); //Канал для архива
      if (!Channel) return console.log("No Channel Found To Log!"); //Если этот канал не найден
      let messageAttachment = message.attachments.size > 0 ? message.attachments.array()[0].url : null
      let embed = new Discord.MessageEmbed();  
    embed.setColor('#138808')
	embed.setTitle(`${message.author.username}`)
	embed.setAuthor(`${message.guild.name}`)
	embed.setDescription(`${message.content}`)
    embed.setThumbnail(`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`)
	embed.setTimestamp()
    if (messageAttachment) embed.setImage(messageAttachment);
    return Channel.send(embed)
}
    }
)

// ВЫДАЧА РОЛЕЙ
client.on("message", async (message) => {
    if (message.content.startsWith(`${prefix}giverole`)) {
        if (!message.member.hasPermission("MANAGE_ROLES")) return message.channel.reply("у Вас нет прав использовать эту команду"); 
        if (!message.mentions.members.first()) return message.reply('введите пользователя')
        const member = message.mentions.members.first();
        if (member.hasPermission("ADMINISTRATOR")) if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("Вы не можете выдать роль администратору")
        var text = message.content.split(' ').slice(2, 3).join(' ');
        if (!text) return message.reply("введите роль")
        var newtext = text.replace('<@&', '').replace('>', '')
        var role = message.guild.roles.cache.get(`${newtext}`)
        if (!role) return message.reply("такой роли не существует")
        member.roles.add(role);
        var otchet = message.content.split(' ').slice(4, 5).join(' ')
        var newotchet = otchet.replace('<#', '').replace('>', '')
        const Channel = client.channels.cache.get(`${newotchet}`)
        if (!otchet) return message.reply('укажите канал для отчёта')
        var reason = message.content.split(' ').splice(5, 100).join(' ');
        if (!reason) return message.reply('укажите причину')
        var time = message.content.split(' ').slice(3, 4).join(' ');
        if (!time) return message.reply('укажите время (в минутах)')
        var newtime = (time*60000) // 60000мс = 1мин
        setTimeout(() => {
            member.roles.remove(role); return Channel.send(`${member} больше не имеет роли ${text}, так как прошло ${time} мин.`)
        }, `${newtime}`); 
        return Channel.send(`Пользователю ${member} была выдана роль ${text} на ${time} мин. по причине: \n"${reason}"`)
        }
        
    }
)






client.on("message", async (message) => {
    if (message.content.startsWith(`${prefix}test`)) {
    if (message.guild.roles.get('983709409177915392').hasPermission('SEND_MESSAGES'))
    message.channel.send(`РАБОТАЕТ?`)
    } 
})




client.login(token); // Авторизация бота