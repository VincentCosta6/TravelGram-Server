let schema = global.mongoose.Schema({
    creator: {
        type: String,
        require: true,
        unique: true
    },
    users: [{
        type: String
    }],
    messages: [{
        type: String
    }]
});
let lobbies = global.db.model("lobbies", schema);

module.exports = account;