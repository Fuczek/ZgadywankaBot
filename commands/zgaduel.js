const DiscordJS = require('discord.js')
const mongo = require('../mongo')
const duelplayersSchema = require('../schemas/duelplayersSchema')
const winratioSchema = require('../schemas/winratioSchema')

module.exports = {
    minArgs: 1,
    maxArgs: 1,
    callback: async ({message, args}) => {

        const guildId = message.guild.id
        const playerId = message.author.id
        const playerName = message.author.username
        
        const duelId = args[0].slice(3, -1)
        console.log(duelId, args[0], 'duel id')
        
        const duelPlayer = message.guild.members.cache.get(duelId)
        if (duelPlayer && duelId !== playerId && duelId !== '798890747528085517') {
            console.log(message.guild.members.cache.get(duelId), 'a')
        } else if (duelId === playerId) {
            message.reply('Nie możesz grać sam ze sobą!')
            return
        } else if (duelId === '799379654926401596') {
            message.reply('Bot nie potrafi grać :( Ale ładnie was oceni jak zagracie.')
            return
        } else {
            message.reply('Nie ma takiego gracza!\nSpróbuj !zgaduel @Nick')
            return
        }
        
        const enemyId = duelId
        const enemyName = duelPlayer.user.username

        console.log(enemyName, enemyId, playerId, playerName)


        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        let randomNumber
        let minNumber
        let maxNumber
        let rankedMode
        let attemptsAmount
        let timeouted = false

        rankedMode = true
        randomNumber = getRandomInt(0, 100)
        minNumber = 0
        maxNumber = 100
        attemptsAmount = 7
        message.channel.send('Obydwoje podajcie liczbę pomiędzy 0 i 100! Na swoje odpowiedzi macie 30 sekund!')
        

        const timer = () => {
            timeouted = true
            collector.stop()
        }

        let collected = 0
        const filter = (m) => m.author.id === playerId || m.author.id === enemyId
        const collector = new DiscordJS.MessageCollector(message.channel, filter, {
            time: 1000 * 240
        })
        
        let timing = setTimeout(timer, 30000)


        let guessesArray = []
        let player1guess
        let player2guess
        let winnerId
        let loserId
        let winnerName
        let loserName 
        let gameProgress = []
        console.log(randomNumber)

        collector.on('collect', (m) => {

            if (isNaN(m.content)) {
                if (m.content === 'Poddaje się') {
                    loserId = m.author.id
                    loserName = m.author.username
                    collector.stop()
                    return
                }

                m.reply('Używaj tylko liczb całkowitych!')
                return
            }

            if (m.content > 100 || m.content < 0) {
                m.reply('Użyj liczb z przedziału 0-100!')
                return
            }

            if (m.author.id === playerId && !player1guess) {
                guessesArray.push(Number(m.content))
                player1guess = Number(m.content)

                if (Number(m.content) === randomNumber) {
                    winnerId = m.author.id
                    winnerName = m.author.username
                    if (winnerId === playerId) {
                        loserId = enemyId
                        loserName = enemyName
                    } else {
                        loserId = playerId
                        loserName = playerName
                    }
                    gameProgress.push(player1guess)
                    collector.stop()
                    return
                }

            } else if (m.author.id === enemyId && !player2guess) {
                guessesArray.push(Number(m.content))
                player2guess = Number(m.content)

                if (Number(m.content) === randomNumber) {
                    winnerId = m.author.id
                    winnerName = m.author.username
                    if (winnerId === playerId) {
                        loserId = enemyId
                        loserName = enemyName
                    } else {
                        loserId = playerId
                        loserName = playerName
                    }
                    gameProgress.push(player2guess)
                    collector.stop()
                    return
                }

            } else {
                m.reply('Wybrałeś już liczbę! Poczekaj na drugiego gracza!')
                return
            }
            
            if (guessesArray.length === 2) {
                clearTimeout(timing)
                collected++
                const firstNumber = guessesArray[0] 
                const secondNumber = guessesArray[1]
                const minNumber = Math.min(firstNumber, secondNumber)
                const maxNumber = Math.max(firstNumber, secondNumber)
                console.log(minNumber, maxNumber, randomNumber)

                if (collected == attemptsAmount) {
                    collector.stop()
                    return
                }

                if (minNumber < randomNumber && randomNumber < maxNumber) {
                    message.reply(`Szukana liczba jest pomiędzy waszymi liczbami! Liczba prób: ${attemptsAmount-collected}`)
                } else if (minNumber > randomNumber || randomNumber > maxNumber) {
                    message.reply(`Szukana liczba jest poza waszymi liczbami! Liczba prób: ${attemptsAmount-collected}`)
                }
                
                gameProgress.push(player1guess, player2guess)
                guessesArray = []
                player1guess = null
                player2guess = null
                timing = setTimeout(timer, 30000)
            }
             
            console.log(gameProgress)
        })

        collector.on('end', async (collect) => {
            console.log(`Collected ${collect.size} messages`)
            let answered = false
            console.log(gameProgress)

            if (timeouted) {
                if (!player1guess && !player2guess) {
                } else if (!player1guess) {
                    loserId = playerId
                } else if (!player2guess) {
                    loserId = enemyId
                }
            }

            gameProgress.forEach(async (value) => {
                console.log(value, 'wtf')
                if (Number(value) === randomNumber) {
                    answered = true
                }
            })

            if (answered === true) {
                await mongo().then(async mongoose => {
                    try {
                        let winnerresult = await duelplayersSchema.find({guildId, playerId:winnerId})
                        let loserresult = await duelplayersSchema.find({guildId, playerId:loserId})
                        let winner
                        let loser
                        
                        if (winnerresult.length < 1) {
                            winner = await new duelplayersSchema({
                                guildId,
                                playerId: winnerId,
                                playerName: winnerName,
                                wins: 0,
                                loses: 0,
                                fastestgame: 0,
                                games: 0,
                                playerElo: 1000,
                            }).save()
                        } else {
                            winner = winnerresult[0]
                        }
                    
                        if (loserresult.length < 1) {
                            loser = await new duelplayersSchema({
                                guildId,
                                playerId: loserId,
                                playerName: loserName,
                                wins: 0,
                                loses: 0,
                                fastestgame: 0,
                                games: 0,
                                playerElo: 1000,
                            }).save()
                        } else {
                            loser = loserresult[0]
                        }

                        console.log(winner.playerElo, loser, 'abc')
                        let winnerElo = winner.playerElo
                        let loserElo = loser.playerElo
                        let eloMultiplier = Number((loserElo/winnerElo).toFixed(2))
                        let eloGain = Number((20*eloMultiplier*(attemptsAmount-collected)).toFixed(0))

                        const winnerStats = await duelplayersSchema.findOneAndUpdate({
                            guildId,
                            playerId: winnerId,
                        }, {
                            $inc: {
                                wins: 1,
                                playerElo: eloGain
                            },
                        }, {
                            new: true,
                        })

                        console.log(winnerStats)

                        const loserStats = await duelplayersSchema.findOneAndUpdate({
                            guildId,
                            playerId: loserId,
                        }, {
                            $inc: {
                                loses: 1,
                                playerElo: -eloGain
                            },
                        }, {
                            new: true,
                        })
                        
                        message.reply(`${winner.playerName} trafił!
Zdobył za tę grę ${eloGain} pkt i aktualnie posiada ${winnerStats.playerElo} pkt!`)
                        console.log(loser, winner)
                        
                    } finally {
                        mongoose.connection.close()
                    }
                })
            } else {
                let loser1Id = playerId
                let loser2Id = enemyId
                let loser1Name = playerName
                let loser2Name = enemyName
                
                if (!loserId) {
                    console.log(gameProgress)
                    if (gameProgress.length < 1) {
                        message.reply('Gra anulowana.')
                        return
                    }
                    await mongo().then(async mongoose => {
                        try {
                            let loser1result = await duelplayersSchema.find({guildId, playerId:loser1Id})
                            let loser2result = await duelplayersSchema.find({guildId, playerId:loser2Id})
                            let loser1
                            let loser2

                            if (loser1result.length < 1) {
                                loser1 = await new duelplayersSchema({
                                    guildId,
                                    playerId: loser1Id,
                                    playerName: loser1Name,
                                    wins: 0,
                                    loses: 0,
                                    fastestgame: 0,
                                    games: 0,
                                    playerElo: 1000,
                                }).save()
                            } else {
                                loser1 = loser1result[0]
                            }
                        
                            if (loser2result.length < 1) {
                                loser2 = await new duelplayersSchema({
                                    guildId,
                                    playerId: loser2Id,
                                    playerName: loser2Name,
                                    wins: 0,
                                    loses: 0,
                                    fastestgame: 0,
                                    games: 0,
                                    playerElo: 1000,
                                }).save()
                            } else {
                                loser2 = loser2result[0]
                            }
    
                            await duelplayersSchema.findOneAndUpdate({
                                guildId,
                                playerId: loser1.playerId,
                            }, {
                                $inc: {
                                    loses: 1,
                                    playerElo: -20
                                },
                            }, {
                                new: true,
                            })
    
                            await duelplayersSchema.findOneAndUpdate({
                                guildId,
                                playerId: loser2.playerId,
                            }, {
                                $inc: {
                                    loses: 1,
                                    playerElo: -20
                                },
                            }, {
                                new: true,
                            })
                            if (timeouted) {
                                message.reply(`Obustronny brak odpowiedzi, tracicie po 20 punktów.`)
                            } else {
                                message.reply(`Nikt z was nie zgadł, odpowiedzią było ${randomNumber}. Tracicie po 20 punktów.`)
                            }
                            
        
                        } finally {
                            mongoose.connection.close()
                        }
                    })
                    return
    
                } else {
                    console.log(gameProgress)
                    if (gameProgress.length < 2) {
                        message.reply('Gra anulowana.')
                        return
                    }
                    await mongo().then(async mongoose => {
                        try {
                            let loserresult = await duelplayersSchema.find({guildId, playerId:loserId})
                            let loserB

                            if (loserresult.length < 1) {
                                loserB = await new duelplayersSchema({
                                    guildId,
                                    playerId: loserId,
                                    playerName: loserName,
                                    wins: 0,
                                    loses: 0,
                                    fastestgame: 0,
                                    games: 0,
                                    playerElo: 1000,
                                }).save()
                            } else {
                                loserB = loserresult[0]
                            }

                            await duelplayersSchema.findOneAndUpdate({
                                guildId,
                                playerId: loserId,
                            }, {
                                $inc: {
                                    loses: 1,
                                    playerElo: -40
                                },
                            }, {
                                new: true,
                            })

                            if (timeouted) {
                                message.reply(`Koniec, ${loserB.playerName} nie wpisał liczby! Traci 40 punktów.`)    
                            } else {
                                message.reply(`Porażka przez poddanie się! ${loserB.playerName} traci 40 punktów.`)
                            }
    
                        } finally {
                            mongoose.connection.close()
                        }
                    })
                } 
            }

/*             let loser1Id = playerId
            let loser2Id = enemyId
            let loser1Name = playerName
            let loser2Name = enemyName
            
            if (!loserId) {
                await mongo().then(async mongoose => {
                    try {
                        let loser1 = await duelplayersSchema.find({guildId, playerId:loser1Id})
                        let loser2 = await duelplayersSchema.find({guildId, playerId:loser2Id})

                        console.log(loser1, loser2, loser1Name, loser1Id)
                        if (loser1.length < 1) {
                            loser1 = await new duelplayersSchema({
                                guildId,
                                playerId: loser1Id,
                                playerName: loser1Name,
                                wins: 0,
                                loses: 0,
                                fastestgame: 0,
                                games: 0,
                                playerElo: 1000,
                            }).save()
                        }
                    
                        if (loser2.length < 1) {
                            loser2 = await new duelplayersSchema({
                                guildId,
                                playerId: loser2Id,
                                playerName: loser2Name,
                                wins: 0,
                                loses: 0,
                                fastestgame: 0,
                                games: 0,
                                playerElo: 1000,
                            }).save()
                        }

                        await duelplayersSchema.findOneAndUpdate({
                            guildId,
                            playerId: loser1[0].playerId,
                        }, {
                            $inc: {
                                loses: 1,
                                playerElo: -20
                            },
                        }, {
                            new: true,
                        })

                        await duelplayersSchema.findOneAndUpdate({
                            guildId,
                            playerId: loser2[0].playerId,
                        }, {
                            $inc: {
                                loses: 1,
                                playerElo: -20
                            },
                        }, {
                            new: true,
                        })
                        message.reply(`Nikt z was nie zgadł, odpowiedzią było ${randomNumber}. Tracicie po 20 punktów.`)
    
                    } finally {
                        mongoose.connection.close()
                    }
                })
                return

            } else {
                await mongo().then(async mongoose => {
                    try {
                        const loser = await duelplayersSchema.find({guildId, playerId:loserId})
                        await duelplayersSchema.findOneAndUpdate({
                            guildId,
                            playerId: loserId,
                        }, {
                            $inc: {
                                loses: 1,
                                playerElo: -40
                            },
                        }, {
                            new: true,
                        })
                        message.reply(`Porażka przez poddanie się! ${loser[0].playerName} traci 40 punktów.`)

                    } finally {
                        mongoose.connection.close()
                    }
                })
            } */

        })
    }
}