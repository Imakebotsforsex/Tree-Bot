const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('im online i think')
});

app.listen(3000, () => {
  console.log('Online')
});




//cock
 const { Client, Collection, DiscordAPIError } = require("discord.js");
 const { readdirSync } = require("fs");
 const { join } = require("path");
 const { TOKEN, PREFIX } = require("./util/Util");
 const Discord = require('discord.js');
const { info } = require('console');
 
 const client = new Client({ disableMentions: "everyone" });
 
 client.login(TOKEN);
 client.commands = new Collection();
 client.prefix = PREFIX;
 const cooldowns = new Collection();
 const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

 //suckon
 client.on("ready", () => {
   console.log(`${client.user.username} ready!`);
   client.user.setActivity(`pp`, { type: "PLAYING" });
 });
 client.on("warn", info => console.log(info));
 client.on("error", console.error);
 
// this dick
 const commandFiles = readdirSync(join(__dirname, "commands")).filter(file =>
   file.endsWith(".js")
 );
 for (const file of commandFiles) {
   const command = require(join(__dirname, "commands", `${file}`));
   client.commands.set(command.name, command);
 }
 
 client.on("message", async message => {
   if (message.author.bot) return;
   if (!message.guild) return;

   let afkEmbed = new Discord.MessageEmbed()
   .setDescription(`Your Afk status has been set, talking will remove it.\nStatus: **${info}**`)
   .setColor("RED")
   .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic : true }))

   if(db.has(`afk-${message.author.id}+${message.guild.id}`)) {
    const info = db.get(`afk-${message.author.id}+${message.guild.id}`)
    await db.delete(`afk-${message.author.id}+${message.guild.id}`)
    message.reply(afkEmbed)
}
//checking for mentions
if(message.mentions.members.first()) {
    if(db.has(`afk-${message.mentions.members.first().id}+${message.guild.id}`)) {
        message.channel.send(message.mentions.members.first().user.tag + ":" + db.get(`afk-${message.mentions.members.first().id}+${message.guild.id}`))
    }else return;
}else;
 
   const prefixRegex = new RegExp(
     `^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`
   );
   if (!prefixRegex.test(message.content)) return;
 
   const [, matchedPrefix] = message.content.match(prefixRegex);
 
   const args = message.content
     .slice(matchedPrefix.length)
     .trim()
     .split(/ +/);
   const commandName = args.shift().toLowerCase();
 
   const command =
     client.commands.get(commandName) ||
     client.commands.find(
       cmd => cmd.aliases && cmd.aliases.includes(commandName)
     );
 
   if (!command) return;
 
   if (!cooldowns.has(command.name)) {
     cooldowns.set(command.name, new Collection());
   }
 
   const now = Date.now();
   const timestamps = cooldowns.get(command.name);
   const cooldownAmount = (command.cooldown || 1) * 1000;
 
   if (timestamps.has(message.author.id)) {
     const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
 
     if (now < expirationTime) {
       const timeLeft = (expirationTime - now) / 1000;
       return message.reply(
         `please wait ${timeLeft.toFixed(
           1
         )} more second(s) before reusing the \`${command.name}\` command.`
       );
     }
   }
 
   timestamps.set(message.author.id, now);
   setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
 
   try {
     command.execute(message, args);
   } catch (error) {
     console.error(error);
     message
       .reply("There was an error executing that command.")
       .catch(console.error);
   }
 });