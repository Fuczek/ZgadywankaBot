const mongo = require('../mongo')
const playersSchema = require('../schemas/playersSchema')

module.exports = {
    maxArgs: 1,
    callback: async ({message, args}) => {
        const guildId = message.guild.id        
        let players

        if (args.length > 0) {
                players = await mongo().then(async mongoose => {
                    try {
                        return await playersSchema.find({guildId}).sort({wins:-1})
                    } finally {
                        mongoose.connection.close()
                    }
                })
                let text = 'Najbardziej zaangażowane zgadule:\n'
                for (let i=0; i<players.length; i++) {
                    text += `${i+1}. ${players[i].playerName} wygrał/a ${players[i].wins} razy!\n`
                }
                message.reply(text)
        } else {
            players = await mongo().then(async mongoose => {
                try {
                    return await playersSchema.find({guildId}).sort({fastestgame:1})
                } finally {
                    mongoose.connection.close()
                }
            })

            const reducer = (accumulator, currentValue) => accumulator + currentValue

            let text = 'Najszybsze zgadule:\n'
            for (let i=0; i<players.length; i++) {
                const array = players[i].games
                if (array.length >= 1) {
                    const new2 = array.reduce(reducer)
                    const median = (new2/array.length).toFixed(2)
                    text += `${i+1}. ${players[i].playerName} za ${players[i].fastestgame} razem!
    Średnio za ${median} razem
    (Łącznie ${players[i].wins} zwycięstw)\n`
                    } else {
                        text += `${i+1}. ${players[i].playerName} za ${players[i].fastestgame} razem!
    Nie ma średniej :( Za wcześnie grał.
    (Łącznie ${players[i].wins} zwycięstw)\n`
                    }
                }
                message.reply(text)
            }
    }
}