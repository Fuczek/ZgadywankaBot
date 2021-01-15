const mongo = require('../mongo')
const duelplayersSchema = require('../schemas/duelplayersSchema')

module.exports = {
    maxArgs: 0,
    callback: async ({message, args}) => {
        const guildId = message.guild.id        
        let players

        if (args.length === 0) {
                players = await mongo().then(async mongoose => {
                    try {
                        return await duelplayersSchema.find({guildId}).sort({playerElo:-1})
                    } finally {
                        mongoose.connection.close()
                    }
                })
                let text = 'Najlepsi dueliści:\nNick | Elo | Wygrane\n'
                for (let i=0; i<players.length; i++) {
                    text += `${i+1}. ${players[i].playerName}, ${players[i].playerElo}pts, ${players[i].wins} wygrane\n`
                }
                message.reply(text)
        }
    }
}