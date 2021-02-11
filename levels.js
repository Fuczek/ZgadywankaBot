const mongo = require('./mongo')
const racersSchema = require('./schemas/racersSchema')
const xpData = require('./xpdata').getxpData()
let messagesCache = {}

module.exports = (client) => {
    setInterval(addToDatabase, 1000*600)
    client.on('message', message => {

        const { guild, member} = message
        if (guild && member) {
            countMessages(guild.id, member.id, member.user.username)
        }

    })
}

const addToDatabase = async () => {
    await mongo().then(async mongoose => {
        try {
            for (const [userId] of Object.entries(messagesCache)) {

                const guildId = messagesCache[userId][0]
                const username = messagesCache[userId][1]
                //simulating a race for each of the players that posted something in the last hour
                const resultInfo = simulateRace()
                /* console.log(resultInfo) */
                const xpGain = resultInfo[0]
                const raceResult = resultInfo[1]


                let result
                if (raceResult === 'win') {
                    result = await racersSchema.findOneAndUpdate({
                        userId,
                        guildId,
                    }, {
                        userId,
                        guildId,
                        username,
                        $inc: {
                            races: 1,
                            wins: 1,
                            xp: xpGain
                        },
                    }, {
                        upsert: true,
                        new: true
                    })

                } else { 
                    result = await racersSchema.findOneAndUpdate({
                        userId,
                        guildId
                    }, {
                        userId,
                        guildId,
                        username,
                        $inc: {
                            races: 1,
                            loses: 1,
                            xp: xpGain,
                        },
                    }, {
                        upsert: true,
                        new: true
                    })
                }

                let {xp, level} = result

                if (xp >= xpData[level]) {
                    ++level
                    await racersSchema.updateOne({
                        userId,
                        guildId,
                    }, {
                        level, 
                    })
                }

                let xpPercent
                if (level === 0) {
                    xpPercent = Math.floor((xp/xpData[level])*10)
                } else {
                    xpPercent = Math.floor(((xp-xpData[level-1])/(xpData[level]-xpData[level-1]))*10)
                }

                /* console.log(xpData[level], xp, xpPercent) */

                let nextLevel = level + 1
                if (level < 10) {
                    level = '0'+(level).toString()
                }
                if (nextLevel < 10) {
                    nextLevel = '0'+(nextLevel).toString()
                }
                
                //showing your exp
               /*  console.log(`${level} │${`█`.repeat(xpPercent)}${` `.repeat(10-xpPercent)}│ ${nextLevel}`) */

            }
            messagesCache = {}

        } finally {
            mongoose.connection.close()
        }
    })
}

const simulateRace = () => {
    let randomNumber = Math.floor(Math.random()*10)
    let expAmount = 0
    let raceResult = null
    if (randomNumber > 4) {
        expAmount = 20
        raceResult = 'win'
    } else {
        expAmount = 10
        raceResult = 'loss'
    }

    return [expAmount, raceResult]
}




const countMessages = async (guildId, userId, username) => {
    if (!messagesCache[userId]) {
        messagesCache[userId] = [guildId, username, 1]
    } else {
        messagesCache[userId][3] += 1
    }

    /* console.log(messagesCache) */
}






/* 
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
} */

/* module.exports.addXP = addXP */