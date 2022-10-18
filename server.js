var express = require("express");
var request = require("request");
var querystring = require("querystring");
const app = express();
const port = 8080;
const path = require("path");
var cookieParser = require("cookie-parser");
var cors = require("cors");
var fs = require("fs");
var { addArtist, addSong } = require("./dbms");

app.use(express.json());
app.use(express.urlencoded());

app
  .use(express.static(__dirname + "/public"))
  .use(cors())
  .use(cookieParser());

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

var client_id = "d4397edcd2614ae293f8b75da49da9e8"; // Your client id
var client_secret = "e1bd6ab576a6474e8019f98ee2fa549c"; // Your secret
var redirect_uri = "http://localhost:8080/hitPlaylist"; // Your redirect uri

var stateKey = "spotify_auth_state";

app.get("/", (req, res) => {
  res.status(200).render("mainPage");
});
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */

var generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

app.get("/getArtistId", function (req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);
  // your application requests authorization
  var scope = "";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

app.get("/hitPlaylist", function (req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };

    request.post(authOptions,  function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        var options = {
          url: req.cookies["url"],
          headers: { Authorization: "Bearer " + access_token, mode: "cors" },
          json: true,
        };
        res.clearCookie("url");
        // use the access token to access the Spotify Web API
        request.get(options, function (error, response, body) {
          /**
           * structure of body
           *  {
           *     .
           *     tracks:{
           *         .
           *         items:[{
           *             .
           *             track:{
           *                 artists:[{
           *
           *                 },{}]
           *              }
           *          },{}]
           *      }
           * }
           */
            const table = new Set();
            body.tracks.items.forEach((element) => {
              element.track.artists.forEach((artist) => {
                table.add(artist.id);
              });
            });
            for (const items of table) {
              count++;
              options.url=`https://api.spotify.com/v1/artists/${items}`;
              request.get(options, function (error, response, body){
                fs.appendFile("./contentFiles/artistInfo2.json", JSON.stringify(body) + "\n", (err) => {
                  if (err) throw err;
                });
              })
            }

        });

        // we can also pass the token to the browser to make requests from there
        res.redirect(
          "/#" +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token,
            })
        );
      } else {
        res.redirect(
          "/#" +
            querystring.stringify({
              error: "invalid_token",
            })
        );
      }
    });
  }
});


app.get("/refresh_token", function (req, res) {
  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        access_token: access_token,
      });
    }
  });
});

app.post("/testing", (req, res) => {
  console.log("working");
  addArtist();
  res.send("working");
});

app.listen(port, () => console.log("The application has started successfully"));
