const DiscordJS = require('discord.js')
const WOKCommands = require('wokcommands')
require('dotenv').config()

const client = new DiscordJS.Client({
    partials: ['MESSAGE', 'REACTION'],
})

client.on('ready', async () => {
    console.log('ready')
    client.user.setPresence({
        activity: {
            name: '!zgaDUEL, wyzwij przeciwnika na rankingowe zgadywanie!, !zgaduj, !zgaduj [min] [max] [ilość prób], !topka, !topka [zwyciestwa]',
            type: 0,
        }
    })
    new WOKCommands(client, {
        commandsDir: 'commands',
    })
        .setMongoPath(process.env.MONGO_URI)
    
})

client.login(process.env.TOKEN)