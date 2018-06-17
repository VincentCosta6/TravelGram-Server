let express = require("express");

const ObjectID = require("mongodb").ObjectID;

let Accounts = require("./Modules/account.js");
let posts = require("./Modules/post.js");

let router = express.Router();

router.get("/feed", function(req, res) {
    if(!req.session_state.user) return res.json(m(false, "You might not have a session"));

    Accounts.findOne({username: req.session_state.user.username}, (err, user) => {
        Accounts.find({username: user.following}, (err2, user2) => {
            
        });
    });
});

function m(RESULT, REASON)
{
    return {passed: RESULT, reason: REASON};
}

module.exports = router;