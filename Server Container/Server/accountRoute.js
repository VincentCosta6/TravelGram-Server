let express = require("express"),
    path = require("path"),
    uuidv4 = require("uuidv4"),
    bcrypt = require("bcrypt");
let router = express.Router();

let Accounts = require("./Modules/account.js");

let userVersion = require("../settings.json");

router.use(function(req, res, next) {
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
            req = newSession(req, user, sessionKey);
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

            console.log("");
            let newAcc = new Accounts();

            newAcc.username = req.body.username;
            newAcc.password = hash;

            user = {
                username: req.body.username,
                email: "Not set"
            };
            console.log("");
            let sessionKey = uuidv4();
            req = newSession(req, user, sessionKey);
            newAcc.sessions = [sessionKey];
            newAcc.followers = [];
            newAcc.following = [];
            
            console.log("");
            global.db.collection("accounts").insert(newAcc, (err3) => {
                if(err3) {console.log(err3); return res.json(m(false, "You caused a big error"))};
                console.log("");
                return res.json(m(true, "Signup successful"));
            });
        });

        
    });
    
});

router.post("/logout", function(req, res) {
    if(!req.session_state.user) return res.json(m(false, "Session doesnt exist"));
    req.session_state.reset();
    Accounts.update({username: req.session_state.user.username}, {$pull: {sessions: req.session_state.sessionKey}}, (err, user) => {
        if(err) {console.log(err); return res.json(m(false, "You caused a big error"))};
        
        return res.json({redirect: "/login"});
    });
});

router.post("/changeAccount", function(req, res) {
    if(!req.session_state.user) return res.json(m(false, "Session doesnt exist"));
    let changed = false;
    let returnMessage = "";
    
    if(req.body.username)
    {
        Accounts.findOne({username: req.session_state.user.username}, (err, user) => {
            if(err) {console.log(err); return res.json(m(false, "You caused a big error"))};

            if(!user) user.username = req.body.username;

            user.save( (err2) => {
                if(err2) throw err;
                return;
            });
        });
        changed = true;
    }
    if(req.body.password)
    {
        if(!req.body.oldPassword) return res.json(m(false, "Enter your old password"));
        Accounts.findOne({username: req.session_state.user.username}, (err, user) => {
            bcrypt.compare(req.body.oldPassword, user.password, (err2, res) => {
                if(err2) {console.log(err2); return res.json(m(false, "You caused a big error"))};

                if(res == false) return res.json(m(false, "Password incorrect"));

                bcrypt.hash(req.body.password, global.saltRounds, (err3, hash) => {
                    if(err3) {console.log(err3); return res.json(m(false, "You caused a big error"))};
                    user.password = hash;

                    user.save( (err4) => {
                        if(err4) throw err4;

                        return;
                    });
                });
            });
        });
        changed = true;
    }
    if(req.body.firstName)
    {
        Accounts.update({username: req.session_state.user.username}, {$set: {firstName: req.body.firstName}}, (err, user) => {
            if(err) {console.log(err); return res.json(m(false, "You caused a big error"))};

            return;
        });
        changed = true;
    }
    if(req.body.lastName)
    {
        Accounts.update({username: req.session_state.user.username}, {$set: {lastName: req.body.lastName}}, (err, user) => {
            if(err) {console.log(err); return res.json(m(false, "You caused a big error"))};

            return;
        });
        changed = true;
    }
    if(req.body.email)
    {
        Accounts.update({username: req.session_state.user.username}, {$set: {email: req.body.email}}, (err, user) => {
            if(err) {console.log(err); return res.json(m(false, "You caused a big error"))};

            return;
        });
        changed = true;
    }
    if(req.body.phone)
    {
        Accounts.update({username: req.session_state.user.username}, {$set: {phone: req.body.phone}}, (err, user) => {
            if(err) {console.log(err); return res.json(m(false, "You caused a big error"))};

            return;
        });
        changed = true;
    }
    if(req.body.birthday)
    {
        Accounts.update({username: req.session_state.user.username}, {$set: {birthday: req.body.birthday}}, (err, user) => {
            if(err) {console.log(err); return res.json(m(false, "You caused a big error"))};

            return;
        });
        changed = true;
    }
    if(req.body.twoFactor)
    {
        Accounts.update({username: req.session_state.user.username}, {$set: {twoFactor: req.body.twoFactor}}, (err, user) => {
            if(err) {console.log(err); return res.json(m(false, "You caused a big error"))};

            return;
        });
        changed = true;
    }
    return res.json({passed: true, reason: "No errors", changes: changed});
});

function newSession(req, user, sessionKey)
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