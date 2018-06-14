let express = require("express");

global.mongoose = require("mongoose");
global.mongoose.connect("mongodb://localhost/travelgram");

global.db = global.mongoose.connection;

global.db.once("open", () => {
    console.log("Connected to " + global.db.name + " database");
});

global.keyVersion = require("../settings.json").sessionKey;
global.saltRounds = require("../settings.json").saltRounds;

let router = express.Router();

router.use(function(req, res, next){
    console.log("Tried");
    console.log(req.body);
    next();
});

router.use(require("./base.js"));
router.use(require("./accountRoute.js"));

module.exports = router;