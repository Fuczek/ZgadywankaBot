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
            name: '!zgaduj, !zgaduj liczba1 liczba2, !topka, !topka zwyciestwa',
            type: 0,
        }
    })
    new WOKCommands(client, {
        commandsDir: 'commands',
    })
        .setMongoPath(process.env.MONGO_URI)
    
})

client.login(process.env.TOKEN)