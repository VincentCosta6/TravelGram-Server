let express = require("express");

const ObjectID = require("mongodb").ObjectID;

let Accounts = require("./Modules/account.js");
let posts = require("./Modules/post.js");

let router = express.Router();


function m(RESULT, REASON)
{
    return {passed: RESULT, reason: REASON};
}

module.exports = router;