const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const racersSchema = mongoose.Schema({
    guildId: reqString,
    userId: reqString,
    username: reqString,
    xp: {
        type: Number,
        default: 0
    },
    races: {
        type: Number,
        default: 0
    },
    wins: {
        type: Number,
        default: 0
    },
    loses: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 0
    },
})

module.exports = mongoose.model('racers', racersSchema)