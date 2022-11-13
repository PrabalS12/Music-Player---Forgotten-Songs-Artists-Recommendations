var mysql = require("mysql");
var creds = require("./creds.json");
var request = require("request");
const fs = require("fs");

module.exports = {
  //function for adding artist according to release date of album
  addArtist: async function (
    year,
    id,
    Artistname,
    ArtistImg,
    genre,
    popularity,
    albumId,
    albumName,
    albumIMG,
    albumReleaseDate
  ) {
    var con = mysql.createConnection(creds.sql);

    con.query("use musicDatabase", (err, result) => {
      if (err) throw err;
    });
    var date = new Date(albumReleaseDate);
    try{
      const query = `insert into ${year} select "${id}","${Artistname}","${ArtistImg}","${genre}",${popularity},"${albumId}","${albumName}","${albumIMG}","${date.toDateString()}"`;
      con.query(query, (error, result) => {
        if (error){
          console.log(typeof(error));
          for(var k in error){
              console.log(`${k}: ${error[k]}`)
          }
        }
      });
    }catch(err){
      console.log(err);
    }

    con.end();
  },
  //function for adding songs
  addSong: function (id, sName, aId, popu, link) {
    var con = mysql.createConnection(creds.sql);
    con.query("use musicDatabase", (err, result) => {
      if (err) throw err;
    });
    con.query(
      `INSERT INTO songs VALUES("${id}","${sName}","${aId}",${popu},"${link}")`,
      (error, result) => {
        if (error){
          console.log(typeof(error));
          for(var k in error){
              console.log(`${k}: ${error[k]}`)
          }
        }
        console.log("Songs Summitted!" + result);
      }
    );
    con.end();
  },

  // function for adding song features in database
  songFeatures: function (
    dance,
    energy,
    key,
    loud,
    mode,
    speechiness,
    acousticness,
    instrumentalness,
    liveness,
    valence,
    tempo,
    stype,
    songId
  ) {
    var con = mysql.createConnection(creds.sql);
    con.query("use musicDatabase", (err, result) => {
      if (err) throw err;
    });
    const sqlQuery = `INSERT INTO songFeature select ${dance},${energy},${key},${loud},${mode},${speechiness},${acousticness},${instrumentalness},${liveness},${valence},${tempo},"${stype}","${songId}"`;
    
    con.query(sqlQuery, (error, result) => {
      if (error){
        console.log(typeof(error));
        for(var k in error){
            console.log(`${k}: ${error[k]}`)
        }
      }
      console.log("Features Submitted!" + result);
    });

    con.end();
  },
};
