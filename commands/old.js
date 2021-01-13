const DiscordJS = require('discord.js')
const mongo = require('../mongo')
const winratioSchema = require('../schemas/winratioSchema')

module.exports = {
    minArgs: 0,
    maxArgs: 2,
    callback: async ({message, args}) => {
        const guildId = message.guild.id

        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        let randomNumber
        let minNumber
        let maxNumber
        let rankedMode

        if (args.length === 0) {
            rankedMode = true
            randomNumber = getRandomInt(0, 100)
            minNumber = 0
            maxNumber = 100
            message.channel.send('Podaj liczbę pomiędzy 0 i 100!')

        } else if (args.length === 1) {
            message.reply('Wybierz dwie liczby (zakres) lub nie podawaj argumentów.')
            return
        } else {
            if (!isNaN(Number(args[0])) && !isNaN(Number(args[1]))) {
                minNumber = Number(args[0])
                maxNumber = Number(args[1])
                if (minNumber > maxNumber) {
                    message.reply('Druga liczba nie może być mniejsza od pierwszej!')
                    return
                }
                if (minNumber === maxNumber) {
                    message.reply('Druga liczba nie może być taka sama!')
                    return
                }
                randomNumber = getRandomInt(minNumber, maxNumber)
                message.channel.send(`Podaj liczbę pomiędzy ${minNumber} i ${maxNumber}!`)
            } else {
                message.reply('Spróbuj użyć liczb.')
                return
            }
        }
        

        let attemptsAmount = 7
        let collected = 0
        const filter = (m) => m.author.id === message.author.id
        const collector = new DiscordJS.MessageCollector(message.channel, filter, {
            max: attemptsAmount,
            time: 1000 * 120 //120s
        })


        
        collector.on('collect', (m) => {
            collected++
            let collectedNumber = Number(m.content)
            if (collectedNumber === randomNumber || collected >= attemptsAmount) {
                collector.stop()
                return
            }

            if (m.content === 'π' || m.content === 'pi') {
                console.log(m.content)
                collectedNumber = 3.1415
            } else if (m.content === 'e') {
                collectedNumber = 2.7182
            }
            console.log(collectedNumber)

            if (!isNaN(collectedNumber)) {
                if (collectedNumber >= minNumber && collectedNumber <= maxNumber) {
                    if (collectedNumber > randomNumber) {
                        if (collected > 3) {
                            message.reply(`Twoja liczba jest za duża! Pozostało ${attemptsAmount-collected} prób. Odpisz 'Poddaje się' aby się poddać.`)
                        } else {
                            message.reply(`Twoja liczba jest za duża! Pozostało ${attemptsAmount-collected} prób.`)
                        }
                        return
                    } else {
                        if (collected > 3) {
                            message.reply(`Twoja liczba jest za mała! Pozostało ${attemptsAmount-collected} prób. Odpisz 'Poddaje się' aby się poddać.`)
                        } else {
                            message.reply(`Twoja liczba jest za mała! Pozostało ${attemptsAmount-collected} prób.`)
                        }
                        return
                    }
                } else {
                    message.reply(`Twoja liczba nie należy do podanego przedziału! Użyj liczb od ${minNumber} do ${maxNumber}. Pozostało ${attemptsAmount-collected} prób.`)
                    return
                }

            } else {
                if (collected === attemptsAmount+1) {
                    collector.stop()
                } else if (m.content === 'Poddaje się') {
                    collector.stop()
                } else {
                    message.reply(`Użyj liczb! Pozostało ${attemptsAmount-collected} prób.`)
                }
            }
        })

        collector.on('end', async (collected) => {
            console.log(`Collected ${collected.size} messages`)

            let answered = false
            collected.forEach(async (value) => {
                if (Number(value.content) === randomNumber) {
                    answered = true
                    await mongo().then(async mongoose => {
                        try {
                            if (rankedMode === true) {
                                const result = await winratioSchema.findOneAndUpdate({
                                    guildId
                                }, {
                                    guildId,
                                    $inc: {
                                        wins: 1
                                    },
                                }, {
                                    upsert: true,
                                    new: true //return the updated database in our document
                                })
                                message.reply(`Trafione, szacun byku! Za ${collected.size} razem! Wygrane: ${result.wins}, Przegrane: ${result.loses}`)
                            } else {
                                message.reply(`Trafione, szacun byku! Za ${collected.size} razem! Gry z własnym zakresem liczb nie są liczone do statystyk.`)
                            }
                            

                        } finally {
                            mongoose.connection.close()
                        }
                    })

                }
            })
            if (answered === false) {
                await mongo().then(async mongoose => {
                    try {
                        if (rankedMode === true) {
                            const result = await winratioSchema.findOneAndUpdate({
                                guildId
                            }, {
                                guildId,
                                $inc: {
                                    loses: 1
                                },
                            }, {
                                upsert: true,
                                new: true //return the updated database in our document
                            })
                            message.reply(`Nie udało ci się trafić, szukaną liczbą była ${randomNumber}. Spróbuj jeszcze raz. Wygrane: ${result.wins}, Przegrane: ${result.loses}`)
                        } else {
                            message.reply(`Nie udało ci się trafić, szukaną liczbą była ${randomNumber}. Spróbuj jeszcze raz. Gry z własnym zakresem liczb nie są liczone do statystyk.`)
                        }
                       
                        

                    } finally {
                        mongoose.connection.close()
                    }
                })
            }
        })
    }
}