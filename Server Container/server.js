let express = require("express"),
    bodyParser = require("body-parser"),
    clientSessions = require("client-sessions"),
    http = require("http"),
    routes = require("./Server/routes.js"),
    fileUpload = require("express-fileupload");

let settings = require("./settings.json");

let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(clientSessions({
  secret: "This is a special secret", // can be anything
  maxAge: 23457862344
}));

app.use(routes);

if(settings.https == true)
{

}

app.use("/images", express.static("./Server/public/Images"));
app.use("/css", express.static("./Server/public/Views/CSS"));
app.use("/js", express.static("./Server/public/Views/JS"));
app.use(fileUpload());

http.createServer(app).listen(settings.httpPort);
console.log("Server initialized on port " + settings.httpPort);
