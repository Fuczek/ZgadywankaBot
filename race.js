const mongo = require('./mongo')
const racersSchema = require('./schemas/racersSchema')
const xpData = require('./xpData').getxpData()
const tiers = require('./xpData').getTiers()
let messagesCache = {}

randomMinMax = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
isOdd = (num) => {
    return (num % 2 ) == 1
}

module.exports.simulateRace = (playerLevel) => {

    let randomNumber = Math.floor(Math.random()*10)
    let expAmount = 0
    let raceResult = null
    if (randomNumber > 0) {
        expAmount = 20+(4*playerLevel)
        raceResult = 'win'

        //give random item
        /* const itemList = ['ENGINE', 'GEARBX', 'BRAKES', 'SUSPEN', 'TYRES', 'ECU', 'TURBO', 'NITRO']
        const bonusList = ['♥', '♦', '♣', '♠']

        const randomizedItemLevel = randomMinMax(playerLevel, playerLevel+2)
        const randomizedPartName = itemList[randomMinMax(0, 7)]
        let randomizedItemBonuses = []
        //randomizing stats
        if (Math.random() > 0.6) {
            randomizedItemBonuses.push(bonusList[randomMinMax(0,3)])
            if (Math.random() > 0.8) {
                randomizedItemBonuses.push(bonusList[randomMinMax(0,3)])
                if (Math.random() > 0.9) {
                    randomizedItemBonuses.push(bonusList[randomMinMax(0,3)])
                    if (randomizedItemBonuses[0] === randomizedItemBonuses[1] && randomizedItemBonuses[1] === randomizedItemBonuses[2]) {
                        randomizedItemBonuses.push(' ')
                    }
                }
            }
        }
        
        

        let levelString = ``
        for (let i=0; i<randomizedItemBonuses.length; i++) {
            if (randomizedItemBonuses[i] !== ' ') {
                levelString += randomizedItemBonuses[i]
            }
        }

        levelString += randomizedItemLevel
        if (isOdd(levelString.length)) {
            if (levelString.length === 3 || levelString.length === 5) {
                if (levelString.length === 5) {
                    levelString = levelString
                } else {
                    levelString = ` `.repeat(1)+levelString+` `.repeat(1)
                }
            } else {
                levelString = ` `.repeat(2)+levelString+` `.repeat(2)
            }
        } else {
            if (levelString.length === 4) {
                levelString = levelString+` `.repeat(1)
            } else {
                levelString = ` `.repeat(2)+levelString+` `.repeat(1)
            }
        }

        const tier = randomizedItemBonuses.length */

/*         console.log(`${tiers[tier].part1} ${randomizedPartName}
${tiers[tier].part2}${levelString}${tiers[tier].part2}
${tiers[tier].part3}`) */


    } else {
        expAmount = 10+(1*playerLevel)
        raceResult = 'loss'
    }

    return [expAmount, raceResult, playerLevel]
}