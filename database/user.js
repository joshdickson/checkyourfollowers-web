var mongoose = require('mongoose');


var userSchema = new mongoose.Schema({

    // to-do: mute, block, etc
    twitter: {
        id: String,
        token: String,
        tokenSecret: String,
        displayName: String,
        username: String,
    },

    requests: [{
        requestTime: Date,
        request: String,
        tweetID: String,
        query: {
            rawCount: Number,
            found: Number,
            activeCount: Number,
            activeAndBotCount: Number,
        },
    }],

    dateCreated: Date,

});

module.exports = mongoose.model('User', userSchema);
