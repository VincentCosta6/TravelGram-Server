let schema = global.mongoose.Schema({
    creator: {
        type: String,
        require: true,
        unique: true
    },
    files: [{
        type: String
    }],
    tagged: [{
        type: String
    }],
    liked: [{
        type: String
    }],
    comments: [{
        type: String
    }]
});
let posts = global.db.model("posts", schema);

module.exports = posts;