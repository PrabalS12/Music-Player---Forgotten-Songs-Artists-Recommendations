//import credentials for spotify
var creds = require("./creds.json");
var request = require("request");
var querystring = require("querystring");
var { addArtist, addSong } = require("./dbms");

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

						//get unique artist only
            const table = new Set();
            const tableImage=new Set();
            body.tracks.items.forEach((element) => {
              element.track.artists.forEach((artist) => {
                table.add(artist.id);
              });
            });
            
            
						//get artist detail
            for (const items of table) {
              options.url = `https://api.spotify.com/v1/artists/${items}`;
              request.get(options, function (error, response, body1) {
                
                var artistImg=body1.images[0].url;
								//get Albums

								options.url = `https://api.spotify.com/v1/artists/${body1.id}/albums?market=IN&limit=2&offset=0`;
								request.get(options,function(error,response,body2){
								
									//for each album 
									body2.items.forEach(albums=>{
										var date=new Date(albums.release_date);
                    var table;
                    if(date.getFullYear()>2010) table="T10s";
                    else if(date.getFullYear()<2010&&date.getFullYear()>2000) table="T00s"; 
                    else if(date.getFullYear()<2000&&date.getFullYear()>1990) table="T90s"; 
                    else if(date.getFullYear()<1990&&date.getFullYear()>1980) table="T80s"; 
                    else if(date.getFullYear()<1980&&date.getFullYear()>1970) table="T70s";
                    else table="retro";

                    addArtist(table,body1.id,body1.name, artistImg, body1.genres,body1.popularity,albums.id,albums.name,albums.images[0].url,albums.release_date);

									})
								})
              });
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
};
