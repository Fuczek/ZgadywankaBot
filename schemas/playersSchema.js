const mongoose = require('mongoose')

const playersSchema = mongoose.Schema({
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
})

module.exports = mongoose.model('players', playersSchema)