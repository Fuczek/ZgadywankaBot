const mongoose = require('mongoose')

const winratioSchema = mongoose.Schema({
    guildId: {
        type: Number
    },
    wins: {
        type: Number,
        default: 0
    },
    loses: {
        type: Number,
        default: 0
    },
})

module.exports = mongoose.model('winratio', winratioSchema)