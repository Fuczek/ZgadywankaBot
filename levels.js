const mongo = require('./mongo')
const profileSchema = require('./schemas/profileSchema')
let messagesCache = {}

module.exports = (client) => {
    setInterval(addToDatabase, 1000*300)

    client.on('message', message => {
        const { guild, member } = message
        if (guild && member) {
            countMessages(guild.id, member.id)
        }
/*         addXP(guild.id, member.id, 23) */
    })
}

const addToDatabase = async () => {
/*     console.log(messagesCache, 'interval') */

    await mongo().then(async mongoose => {
        try {
            for (const [userId, messagesAmount] of Object.entries(messagesCache)) {
/*                 console.log(`${userId}: ${messagesAmount}`) */
                const result = await profileSchema.findOneAndUpdate({
                    userId
                }, {
                    userId,
                    $inc: {
                        messages: messagesAmount
                    }
                }, {
                    upsert: true,
                })
            }
            messagesCache = {}

        }   finally {
            mongoose.connection.close()
        }
    })
}

const countMessages = async (guildId, userId) => {
    if (!messagesCache[userId]) {
        messagesCache[userId] = 1
    } else {
        messagesCache[userId] += 1
    }

    console.log(messagesCache)
}


const addXP = async (guildId, userId, xpToAdd) => {
    await mongo().then(async mongoose => {
        try {
            const result = await profileSchema.findOneAndUpdate({
                guildId, 
                userId
            }, {
                guildId,
                userId,
                $inc: {
                    xp: xpToAdd
                }
            }, {
                upsert: true,
                new: true
            })
            console.log(result, 'result')

        }   finally {
            mongoose.connection.close()
        }
    })
}

module.exports.addXP = addXP