let express = require("express"),
fileUpload = require("express-fileupload");

const ObjectID = require("mongodb").ObjectID;

let Accounts = require("./Modules/account.js");
let posts = require("./Modules/post.js");

let router = express.Router();

router.use(fileUpload());

router.post("/newPost", function(req, res) {
    if(!req.session_state.user) return res.json(m(false, "Session might not be active"))

    let post = new posts();
    post._id = new ObjectID();
    post.creator = req.session_state.user.username;
    let arr = [];
    for(let i in req.files)
        arr.push(req.files[i].name);
    post.files = arr;

    Accounts.update({username: req.session_state.user.username}, {$push: {posts: post._id}}, (err, user) => {
        if(err) {console.log(err); return res.json(m(false, "You caused a big error"));}
    });
    global.db.collection("posts").insert(post, (err) => {
        if(err) {console.log(err); return res.json(m(false, "You caused a big error"));}
        console.log("");
        return res.json(m(true, "Post successful"));
    });
});

router.delete("/deletePost", function(req, res) {
    if(!req.session_state.user) return res.json(m(false, "Session might not be active"));

    posts.findOne({creator: req.body.postID}, (err, post) => {
        if(err) {console.log(err); return res.json(m(false, "You caused a big error"));}

        if(post.creator != req.session_state.user.username) return res.json(m(false, "You are not the owner of this post"));

        posts.deleteOne({_id: req.body.postID}, (err2) => {
            if(err2) {console.log(err2); return res.json(m(false, "You caused a big error"))}
            else return res.json(m(true, "Post deleted"));
        });
    });
});

function m(RESULT, REASON)
{
    return {passed: RESULT, reason: REASON};
}

module.exports = router;