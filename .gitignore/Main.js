

/* VARIABLES */

const Discord = require("discord.js");
const fs = require("fs");

const auth = require("./Bot_Modules/Auth.json");
const Preferences = require("./Bot_Modules/Settings.json");
const Details = require("./Bot_Modules/Bots_Details.json");
var GuildsData = JSON.parse(fs.readFileSync("./Guild_Save/Settings.json", "utf8"));
var prefix = Preferences.Prefix;
var footer = Preferences.Footer_Embed;
var IntervalMode = 1;

var bot = new Discord.Client();

/* EVENEMENT */

bot.on('ready', ()=> {
    var GuildTable = bot.guilds.array();
    var TotalUser = 0;
    var AvailableGuild = 0;
    console.log("]----[UNAVAILABLE SERVER LIST]----[")
    for (i=0; i < GuildTable.length; i++) {
        if (GuildTable[i].available) {
            AvailableGuild = AvailableGuild + 1;
            TotalUser = TotalUser + GuildTable[i].memberCount;
        }else{
            console("Unavailable guild detected: " + GuildTable[i].name );
        };
    };
    console.log("]----[STATS]----[")
    console.log("Total guilds: " + bot.guilds.array().length);
    console.log("Available guilds: " + AvailableGuild);
    console.log("Total user: " + TotalUser );
    console.log("]----[END]----[")
    console.log("Bot ready to be use!");
    bot.user.setPresence({game:{name: prefix + "help", url: "https://www.twitch.tv/fabuss255", type: 1}}).catch(console.error);
    bot.setInterval(OnInterval, 10000, TotalUser, AvailableGuild);
});

bot.login(auth.token);
console.log("Login succesfully!");

bot.on("guildDelete", LeavedGuild => {
    if (GuildsData[CreatedGuild.id]) {
        GuildsData[CreatedGuild.id] = null
    };
});

bot.on('message', message => {
    if (message.author.bot) return;
    var Mes = true
    if (Preferences.Debug){
        if (!message.author.id === 178131193768706048){
            message.channel.send("Le bot est actuellement en debug mode, Merci de bien vouloir patienter avant de pouvoir l'utiliser!");
            Mes = false
        };
    };
    if (Mes === true){
    if (message.content.startsWith(prefix)){
        if (message.content === prefix + "help"){
            var help_embed = new Discord.RichEmbed();
            help_embed.setColor("#00FE2A");
            help_embed.addField("Commandes du bot:",prefix + "help - Afficher les commandes");
            help_embed.setFooter(footer);
            message.channel.send(help_embed);
            console.log("Discord user has used the command: help");
        };

        var args = message.content.substring(prefix.length).split(" ");
        switch(args[0].toLowerCase()){

            case "id":
                message.channel.send("ID: " + message.author.id);
                break;

            case "botinfo":
                var bot_embed = new Discord.RichEmbed()
                .setColor("#06FAB2")
                .addField(
                    "Info sur le bot:", "Le bot est sur: " +
                    bot.guilds.array().length + 
                    " Serveurs\nNom du bot: " + 
                    bot.user.tag +
                    "\nMarche depuis: " +
                    getuptime() +
                    "\nBot creer par: " +
                    Details.author
                )
                .setFooter(footer);
                message.channel.send(bot_embed);
                break;

            case "config":
                if (!args[1]){
                    var bot_embed = new Discord.RichEmbed()
                    .setColor("#06FAB2")
                    .addField(
                        "Configurateurs:",
                         "SetLogChannel: Regler le channel de log sur le channel actuelle" +
                         "\nGetLogChannel: Avoir le channel de log pour ce serveur"
                    )
                    .setFooter(footer);
                    message.channel.send(bot_embed);
                }else{
                    switch(args[1].toLowerCase()){
                        case "setlogchannel":
                            /** 
                            GuildsData[message.guild.id].LogChannel = message.channel

                            fs.writeFile("./Guild_Save/Settings.json", JSON.stringify(GuildsData), (err) => {
                                if (err) console.error(err)
                            });

                            message.channel.send("Channel de log regler a " + message.channel)
                            **/
                            break;
                            
                        case "getlogchannel":
                            if (!GuildsData[message.guild.id] || !GuildsData[message.guild.id].LogChannel){
                                message.channel.send("Il n'y a pas de channel de log pour ce serveur")
                            }else{
                                message.channel.send("Channel de log pour ce serveur: " + GuildsData[message.guild.id].LogChannel)
                            }

                            break;
                    };
                };
                break;

        };
    };
};
});



/* FUNCTIONS */

function getuptime(){
    var Time = Math.floor(bot.uptime/1000)
    if (Time < 60){
        return Time + "s"
    }
    if(Time > 60 | Time < 3600){
        var min = Math.floor(Time/60)
        var second = Time - (min * 60)
        return min + "m " + second + "s"
    }
    if (Time > 3600){
        var hours = Math.floor(Time/3600)
        var min = Math.floor(Time/60) - (hours * 60)
        var second = Time - ((min * 60)+(hours*3600))
        return hours + "h " + min + "m " + second + "s"
    }
}

function OnInterval(TotalUser2, TotalGuild2){
    if (IntervalMode === 1){
        bot.user.setPresence({game:{name: "Total d'utilisateurs: " + TotalUser2, url: "https://www.twitch.tv/fabuss255", type: 1}}).then(IntervalMode = 2).catch(console.error);
    }
    else if (IntervalMode === 2){
        bot.user.setPresence({game:{name: "Total de serveur: " + TotalGuild2, url: "https://www.twitch.tv/fabuss255", type: 1}}).then(IntervalMode = 3).catch(console.error);
    }
    else if (IntervalMode === 3){
        bot.user.setPresence({game:{name: prefix + "help", url: "https://www.twitch.tv/fabuss255", type: 1}}).then(IntervalMode = 1).catch(console.error);
    };
}
/**
function MakeNewConfig(ID){
    GuildsData[ID] = {
        LogChannel = null
    }

    fs.writeFile("./Guild_Save/Settings.json", JSON.stringify(GuildsData), (err) => {
        if (err) console.error(err)
    });
}
**/