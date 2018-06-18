let schema = global.mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    userVersion: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        default: "Not set"
    },
    lastName: {
        type: String,
        default: "Not set"
    },
    email: {
        type: String,
        default: "Not set"
    },
    phone: {
        type: String,
        default: "Not set"
    },
    photoLink: {
        type: String,
        default: "Not set"
    },
    birthday: {
        type: String
    },
    posts: [{
        type: String
    }],
    following: [{
        type: String
    }],
    followers: [{
        type: String
    }],
    sessions: [{
        type: String
    }],
    IPs: [{
        type: String
    }],
    twoFactor: {
        type: Boolean,
        default: false
    }
    
});
let account = global.db.model("accounts", schema);

module.exports = account;