var express = require("express");
var cors = require("cors");
var mysql = require("mysql");
var creds = require("../creds.json");
const { request } = require("express");

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded());

app.use(cors());
app.post("/getGenre", (req, res) => {
  console.log("Get Genre!");
  //create connection and use database musicDatabase
  var con = mysql.createConnection(creds.sql);
  con.query("use musicDatabase");

  //select all genres from given table
  const queryParam = `select * from ${req.body.year}`;
  con.query(queryParam, (err, result) => {
    if (err) console.log(err);
    var list = [];
    var list2 = [];
    result.forEach((element) => {
      list = element.genre.split(",");
      list2.push({
        genre: list[0],
        albumIMG: element.albumIMG,
      });
    });
    res.send(list2);
  });
});

app.post("/getArtists", (req, res) => {
  console.log("Get Artists!");
  var con = mysql.createConnection(creds.sql);
  con.query("use musicDatabase");

  // get All artists containing genre from their list of genres
  const queryParam = `select * from ${req.body.year} where genre like "%${req.body.genre}%"`;
  con.query(queryParam, (err, result) => {
    res.send(result);
  });
});

app.post("/getSongs", (req, res) => {
  console.log("Get Songs!");
  var con = mysql.createConnection(creds.sql);
  con.query("use musicDatabase");
  const queryParam = `select DISTINCT * from songs where artistId="${req.body.ArtistId}"`;
  con.query(queryParam,(err,result)=>{
    res.send(result);
  })
});


app.get("/getRecommendedSongs",async (req,res)=>{
  console.log("working!!")
  const data={"song_id":`${req.body.songId}`}
  const url="http://localhost:9000/api"
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const s=await response.json()
  console.log("working->"+s)
  res.send(s);
})
app.listen(port, () => console.log("The application has started successfully"));
