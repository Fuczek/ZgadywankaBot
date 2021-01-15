const mongoose = require('mongoose')

const zgaduelSchema = mongoose.Schema({
    guildId: {
        type: Number
    },
    playerId: {
        type: Number
    },
    playerName: {
        type: String
    },
    wins: {
        type: Number,
        default: 0
    },
    loses: {
        type: Number,
        default: 0
    },
    fastestgame: {
        type: Number,
    },
    games: {
        type: Array,
    },
    playerElo: {
        type: Number,
        default: 1000
    }
})

module.exports = mongoose.model('zgaduel', zgaduelSchema)