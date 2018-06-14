let express = require("express"),
    path = require("path"),
    uuidv4 = require("uuidv4"),
    brypt = require("bcrypt");
let router = express.Router();

let Accounts = require("./Modules/account.js");

let userVersion = require("../settings.json");

router.use(function(req, res, next){
    console.log("Tried");
    console.log(req.body);
    next();
});


router.post("/login", function(req, res) { 
    if(!req.body.username) res.json(m(false, "Please send a username"));
    if(!req.body.password) res.json(m(false, "Please send a password"));

    Accounts.findOne({username: req.body.username}, (err, user) => {
        if(err) {console.log(err); return res.json(m(false, "You caused a big error"))};

        if(!user) return res.json(m(false, "Account username not found"));

        bcrypt.compare(req.body.password, user.password, function(err, res) {
            if(err) {console.log(err); return res.json(m(false, "You caused a big error"))};

            if(res == false) return res.json(m(false, "Incorrect password"));

            
            let sessionKey = uuidv4();
            req = newSession(req, sessionKey);
            user.sessions.push(sessionKey);
            user.save( (err) => {
                if(err) throw err;
                return res.json({redirect: "/session"});
            });
        });
    });
});

router.post("/signup", function(req, res) { 
    if(!req.body.username) res.json(m(false, "Please send a username"));
    if(!req.body.password) res.json(m(false, "Please send a password"));

    Accounts.findOne({username: req.body.username}, (err, user) => {
        if(err) {console.log(err); return res.json(m(false, "You caused a big error"))};

        if(user) return res.json(m(false, "This username already exists!"));

        bcrypt.hash(req.body.password, global.saltRounds, function(err2, hash) {
            if(err2) {console.log(err); return res.json(m(false, "You caused a big error"))};

            let newAcc = new Accounts();

            newAcc.username = req.body.username;
            newAcc.password = hash;

            let sessionKey = uuidv4();
            req = newSession(req, sessionKey);
            newAcc.sessions = [sessionKey];
            newAcc.followers = [];
            newAcc.following = [];
            

            global.db.insert(newAcc);
        });

        
    });
    return res.json(m(true, "Connection received"));
});

function newSession(req, sessionKey)
{
    req.session_state.user = {
        username: user.username,
        email: user.email
    };
    req.session_state.sessionKey = sessionKey;
    req.session_state.keyVersion = global.keyVersion;

    return req;
}


function m(RESULT, REASON)
{
    return {passed: RESULT, reason: REASON};
}

module.exports = router;