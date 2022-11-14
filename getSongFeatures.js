var mysql = require("mysql");
var creds = require("./creds.json");
var fs = require('fs');
var {stringify} = require('csv-stringify');
    
var con = mysql.createConnection(creds.sql);

var queryVar=`select * from songs`
con.query("use musicDatabase", (err, result) => {
    if (err) throw err;
});

let columns = {
  songId:`songID`,
  songName:`songName`,
  artistId:`artistId`,
  popularity:`popularity`,
  track_href:`track_href`,
};



con.query(queryVar,(err,res)=>{
    if(err) throw err;
    stringify(res, { header: true, columns: columns }, (err, output) => {
      if (err) throw err;
      fs.writeFile('songs.csv', output, (err) => {
        if (err) throw err;
        console.log('saved.');
      });
    });
})