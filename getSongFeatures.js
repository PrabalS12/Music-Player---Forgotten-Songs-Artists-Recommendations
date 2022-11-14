var mysql = require("mysql");
var creds = require("./creds.json");
var fs = require('fs');
var {stringify} = require('csv-stringify');
    
var con = mysql.createConnection(creds.sql);

var queryVar=`select * from songFeature`
con.query("use musicDatabase", (err, result) => {
    if (err) throw err;
});

let columns = {
  danceability:`danceability`,
  energy:`energy`,
  skey:`skey`,
  loudness:`loudness`,
  smode:`smode`,
  speechiness:`speechiness`,
  acousticness:`acousticness`,
  instrumentalness:`instrumentalness`,
  liveness:`liveness`,
  valence:`valence`,
  tempo:`tempo`,
  stype:`stype`,
  songId:`songId`
};



con.query(queryVar,(err,res)=>{
    if(err) throw err;
    stringify(res, { header: true, columns: columns }, (err, output) => {
      if (err) throw err;
      fs.writeFile('acousticFeatures.csv', output, (err) => {
        if (err) throw err;
        console.log('saved.');
      });
    });
    console.log(res)
})