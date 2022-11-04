var mysql = require("mysql");
var creds = require("./creds.json");
module.exports = {
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
    var date=new Date(albumReleaseDate);
    // console.log(query);
    try {
        const query=`insert into ${year} values("${id}","${Artistname}","${ArtistImg}","${genre}",${popularity},"${albumId}","${albumName}","${albumIMG}","${date.toDateString()}")`;
        con.query(
          query,
          (err, result) => {
            if (err) throw err;
          }
        );
    } catch (error) {
        console.log(error);        
    }


    // console.log(`"${year}","${id}","${Artistname}","${ArtistImg}","${genre}","${popularity}","${albumId}","${albumName}","${albumIMG}","${albumReleaseDate}`)
    con.end();
  },
  addSong: function () {
    var con = mysql.createConnection(creds.sql);
    con.connect((err) => {
      if (err) throw err;
      con.query("use musicDatabase", (err, result) => {
        if (err) throw err;
      });
      con.query(`select artistId from artists;`, (err, result) => {
        if (err) throw err;
        result.forEach((element) => {
          console.log(element.artistId);
        });
      });
    });
    con.end();
  },
};
