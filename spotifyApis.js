//import credentials for spotify
var creds = require("./creds.json");
var request = require("request");
var querystring = require("querystring");
var { addArtist, addSong, songFeatures } = require("./dbms");
const fs = require("fs");
const { resolve } = require("path");

var generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = "spotify_auth_state";

module.exports = {
  getAuth: function (req, res, redirect_uri) {
    var state = generateRandomString(16);
    res.cookie(stateKey, state);
    // your application requests authorization
    var scope = "";
    res.redirect(
      "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
          response_type: "code",
          client_id: creds.spotify.client_id,
          scope: scope,
          redirect_uri: redirect_uri,
          state: state,
        })
    );
  },
  playlist: function (req, res, redirect_uri) {
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
            new Buffer(
              creds.spotify.client_id + ":" + creds.spotify.client_secret
            ).toString("base64"),
        },
        json: true,
      };
      fs.truncate("./contentFiles/albumsList.txt", 0, () => {
        console.log("done");
      });
      request.post(authOptions, function (error, response, body) {
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
          request.get(options, async function (error, response, body) {
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

            //get unique artist only
            const table = new Set();
            body.tracks.items.forEach((element) => {
              element.track.artists.forEach((artist) => {
                table.add(artist.id);
              });
            });

            //get artist detail
            var i = 0;
            for (const items of table) {
              i++;
              setTimeout(() => {
                options.url = `https://api.spotify.com/v1/artists/${items}`;
                request.get(options, function (error, response, body1) {
                  var artistImg = "";
                  if (body1.images.length != 0) artistImg = body1.images[0].url;
                  //     //get Albums

                  options.url = `https://api.spotify.com/v1/artists/${body1.id}/albums?market=IN&limit=2&offset=0`;
                  request.get(options, function (error, response, body2) {
                    //for each album
                    console.log(body2);
                    body2.items.forEach((albums, j) => {
                      setTimeout(() => {
                        var date = new Date(albums.release_date);
                        var table;
                        if (date.getFullYear() > 2010) table = "T10s";
                        else if (
                          date.getFullYear() < 2010 &&
                          date.getFullYear() > 2000
                        )
                          table = "T00s";
                        else if (
                          date.getFullYear() < 2000 &&
                          date.getFullYear() > 1990
                        )
                          table = "T90s";
                        else if (
                          date.getFullYear() < 1990 &&
                          date.getFullYear() > 1980
                        )
                          table = "T80s";
                        else if (
                          date.getFullYear() < 1980 &&
                          date.getFullYear() > 1970
                        )
                          table = "T70s";
                        else table = "retro";

                        addArtist(
                          table,
                          body1.id,
                          body1.name,
                          artistImg,
                          body1.genres,
                          body1.popularity,
                          albums.id,
                          albums.name,
                          albums.images[0].url,
                          albums.release_date
                        );

                        // requesting for 5 songs for each of the playlists
                        fs.appendFile(
                          "./contentFiles/albumsList.txt",
                          `${albums.id}` + "\n",
                          (err) => {
                            if (err) throw err;
                          }
                        );
                          console.log("Done!! Albums")
                        }, 100 * j);
                      });
                    });
                  });
                  console.log("Done!! Artists")
              }, 300 * i);
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
  },
  refreshToken: function (req, res) {
    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      headers: {
        Authorization:
          "Basic " +
          new Buffer(
            creds.spotify.client_id + ":" + creds.spotifye.client_secret
          ).toString("base64"),
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
  },

  songs: function (req, res, redirect_uri) {
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
            new Buffer(
              creds.spotify.client_id + ":" + creds.spotify.client_secret
            ).toString("base64"),
        },
        json: true,
      };
    }
    request.post(authOptions, async function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        var options = {
          url: req.cookies["url"],
          headers: { Authorization: "Bearer " + access_token, mode: "cors" },
          json: true,
        };
        fs.readFileSync("./contentFiles/albumsList.txt", "utf-8")
          .split(/\r?\n/)
          .forEach((line, i) => {
            setTimeout(() => {
              if (line != "") {
                options.url = `https://api.spotify.com/v1/albums/${line}/tracks?market=IN&limit=3&offset=0`;
                request.get(options, (error, response, body3) => {
                  if (error){
                    console.log(typeof(error));
                    for(var k in error){
                        console.log(`${k}: ${error[k]}`)
                    }
                  }
                  body3.items.forEach(async (songs, j) => {
                    // Songs Information
                    options.url = `https://api.spotify.com/v1/tracks/${songs.id}?market=IN`;
                    request.get(options, (error, response, body4) => {
                      if (error){
                        console.log(typeof(error));
                        for(var k in error){
                            console.log(`${k}: ${error[k]}`)
                        }
                      }
                      body4.artists.forEach((item) => {
                        addSong(
                          body4.id,
                          body4.name,
                          item.id,
                          body4.popularity,
                          body4.href
                        );
                      });
                    });
                    //Get Acoustic Features
                    setTimeout(() => {
                      options.url = `https://api.spotify.com/v1/audio-features/${songs.id}`;
                      request.get(options, function (err, response, body5) {
                        songFeatures(
                          body5.danceability,
                          body5.energy,
                          body5.key,
                          body5.loudness,
                          body5.mode,
                          body5.speechiness,
                          body5.acousticness,
                          body5.instrumentalness,
                          body5.liveness,
                          body5.valence,
                          body5.tempo,
                          body5.type,
                          songs.id
                        );
                      });
                    }, 100 * j);
                  });
                });
              }
            }, 500 * i);
          });
      } else {
        res.redirect(
          "/#" +
            querystring.stringify({
              error: "invalid_token",
            })
        );
      }
    });
    res.status(200).render("mainPage");
  },
};
