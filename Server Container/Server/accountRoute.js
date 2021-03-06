let express = require("express"),
    path = require("path"),
    uuidv4 = require("uuidv4"),
    bcrypt = require("bcrypt");
let router = express.Router();

let Accounts = require("./Modules/account.js");

let version = require("../settings.json").userVersion;

router.use(function(req, res, next) {
    next();
});

router.post("/login", function(req, res) { 
    if(!req.body.username) return res.json(m(false, "Please send a username"));
    if(!req.body.password) return res.json(m(false, "Please send a password"));

    Accounts.findOne({username: req.body.username}, (err, user) => {
        if(err) {console.log(err); return res.json(m(false, "You caused a big error"));}

        if(!user) return res.json(m(false, "Account username not found"));

        bcrypt.compare(req.body.password, user.password, function(err, res2) {
            if(err) {console.log(err); return res.json(m(false, "You caused a big error"));}

            if(res2 == false) return res.json(m(false, "Incorrect password"));

            
            let sessionKey = uuidv4();
            req = newSession(req, user, sessionKey);
            user.sessions.push(sessionKey);
            user.save( (err) => {
                if(err) throw err;
                console.log("Successful login for " + user.username);
                return res.json({passed: true, redirect: "/session"});
            });
        });
    });
});

router.post("/signup", function(req, res) { 
    if(!req.body.username) return res.json(m(false, "Please send a username"));
    if(!req.body.password) return res.json(m(false, "Please send a password"));

    Accounts.findOne({username: req.body.username}, (err, user) => {
        if(err) {console.log(err); return res.json(m(false, "You caused a big error"));}

        if(user) return res.json(m(false, "This username already exists!"));

        bcrypt.hash(req.body.password, global.saltRounds, function(err2, hash) {
            if(err2) {console.log(err); return res.json(m(false, "You caused a big error"));}

            let newAcc = new Accounts();

            newAcc.username = req.body.username;
            newAcc.password = hash;
            newAcc.userVersion = version;
            user = {
                username: req.body.username,
                email: "Not set"
            };
            let sessionKey = uuidv4();
            req = newSession(req, user, sessionKey);
            newAcc.sessions = [sessionKey];
            newAcc.followers = [];
            newAcc.following = [];
            
            
            global.db.collection("accounts").insert(newAcc, (err3) => {
                if(err3) {console.log(err3); return res.json(m(false, "You caused a big error"));}
                console.log("Successful signup for " + newAcc.username);
                return res.json({passed: true, redirect: "/session"});
            });
        });

        
    });
    
});

router.post("/logout", function(req, res) {
    if(!req.session_state.user) return res.json(m(false, "Session doesnt exist"));
    
    Accounts.update({username: req.session_state.user.username}, {$pull: {sessions: req.session_state.sessionKey}}, (err, user) => {
        if(err) {console.log(err); return res.json(m(false, "You caused a big error"));}
        req.session_state.reset();
        return res.json({redirect: "/login"});
    });
});

router.get("/findUser", function(req, res) {
    if(!req.query.username) return res.json(m(false, "You must send a username"));

    Accounts.find({username: new RegExp(req.query.username, "i")}, (err, users) => {
        if(err) {console.log(err); return res.json(m(false, "You caused a big error"));}

        if(users.length == 0) return res.json(m(false, "No users found"));

        let arr = [];

        for(let i in users)
            arr.push(users[i].username);

        return res.json({users:arr});
    }).limit(10);
});

router.post("/changeAccount", function(req, res) {
    if(!req.session_state.user) return res.json(m(false, "Session doesnt exist"));
    let changed = false;
    let returnMessage = "";

    for(let i in req.body)
    {

    }
    
    if(req.body.username)
    {
        console.log("Username changed");
        
        changed = true;
    }
    if(req.body.password)
    {
        if(!req.body.oldPassword) return res.json(m(false, "Enter your old password"));
        Accounts.findOne({username: req.session_state.user.username}, (err, user) => {
            bcrypt.compare(req.body.oldPassword, user.password, (err2, res) => {
                if(err2) {console.log(err2); return res.json(m(false, "You caused a big error"));}

                if(res == false) return res.json(m(false, "Password incorrect"));

                bcrypt.hash(req.body.password, global.saltRounds, (err3, hash) => {
                    if(err3) {console.log(err3); return res.json(m(false, "You caused a big error"));}
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
            if(err) {console.log(err); return res.json(m(false, "You caused a big error"));}

            return;
        });
        changed = true;
    }
    if(req.body.lastName)
    {
        Accounts.update({username: req.session_state.user.username}, {$set: {lastName: req.body.lastName}}, (err, user) => {
            if(err) {console.log(err); return res.json(m(false, "You caused a big error"));}

            return;
        });
        changed = true;
    }
    if(req.body.email)
    {
        Accounts.update({username: req.session_state.user.username}, {$set: {email: req.body.email}}, (err, user) => {
            if(err) {console.log(err); return res.json(m(false, "You caused a big error"));}

            return;
        });
        changed = true;
    }
    if(req.body.phone)
    {
        Accounts.update({username: req.session_state.user.username}, {$set: {phone: req.body.phone}}, (err, user) => {
            if(err) {console.log(err); return res.json(m(false, "You caused a big error"));}

            return;
        });
        changed = true;
    }
    if(req.body.birthday)
    {
        Accounts.update({username: req.session_state.user.username}, {$set: {birthday: req.body.birthday}}, (err, user) => {
            if(err) {console.log(err); return res.json(m(false, "You caused a big error"));}

            return;
        });
        changed = true;
    }
    if(req.body.twoFactor)
    {
        Accounts.update({username: req.session_state.user.username}, {$set: {twoFactor: req.body.twoFactor}}, (err, user) => {
            if(err) {console.log(err); return res.json(m(false, "You caused a big error"));}

            return;
        });
        changed = true;
    }
    return res.json({passed: true, reason: "No errors", changes: changed});
});

router.get("/userInfo", function(req, res) {
    if(!req.session_state || !req.session_state.user) return res.json(m(false, "No session"));
    Accounts.findOne({username: req.session_state.user.username}, (err, user) => {
        if(err) {console.log(err); return res.json(m(false, "You caused a big error"));}
        
        let ret = {
            username: user.username,
            email: user.email
        };

        return res.json({user: ret});
    });
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

function usernameChange(req, res, newName) {
    Accounts.findOne({username: req.session_state.user.username},  function(err, user) {
        if(err) {console.log(err); return m(false, "You caused a big error");}

        if(!user) user.username = req.body.username;
        else return m(false, "Username taken");

        user.save( (err2) => {
            if(err2) throw err;
            return m(true, "Success usernameChange");
        });
    });
}
function passwordChange(req, res, newName) {

}
function firstNameChange(req, res, newName) {

}
function lastNameChange(req, res, newName) {

}
function emailChange(req, res, newName) {

}
function phoneChange(req, res, newName) {

}
function birthdayChange(req, res, newName) {

}
function twoFactorChange(req, res, newName) {

}


function m(RESULT, REASON)
{
    return {passed: RESULT, reason: REASON};
}

module.exports = router;