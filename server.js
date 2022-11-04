var express = require("express");

const app = express();
const port = 8080;
const path = require("path");
var cookieParser = require("cookie-parser");
var cors = require("cors");
var { addArtist, addSong } = require("./dbms");

var {getAuth,playlist,refreshToken} =require("./spotifyApis")

var redirect_uri = "http://localhost:8080/hitPlaylist"; // Your redirect uri


app.use(express.json());
app.use(express.urlencoded());

app
  .use(express.static(__dirname + "/public"))
  .use(cors())
  .use(cookieParser());

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.status(200).render("mainPage");
});

app.get("/getArtistId",(req,res)=>getAuth(req,res,redirect_uri));

app.get("/hitPlaylist",(req,res)=>playlist(req,res,redirect_uri));

app.get("/refresh_token", (req,res)=>refreshToken(req,res));

app.post("/addSongs", (req, res) => {
  addSong();
});

app.listen(port, () => console.log("The application has started successfully"));
