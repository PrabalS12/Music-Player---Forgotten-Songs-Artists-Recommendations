var express = require("express");
var cors = require("cors");
var mysql = require("mysql");
var creds = require("../creds.json");
const { request } = require("express");
var bcrypt = require("bcrypt");

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded());

app.use(cors());
var con = mysql.createConnection(creds.sql);
con.query("use musicDatabase");

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
  const queryParam = `select DISTINCT * from songs where artistId="${req.body.ArtistId}"`;
  con.query(queryParam, (err, result) => {
    res.send(result);
  });
});

app.post("/getRecommendedSongs", async (req, res) => {
  console.log("Song ->" + req.body.songId);
  const data = { song_id: `${req.body.songId}` };
  const url = "http://localhost:9000/api";
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const s = await response.json();
  console.log(`select * from songs where songId="${s[0]}"`);
  const object = [];

    for (var i = 0; i < s.length; i++) {
      await new Promise((resolve) => {
        con.query(`select * from songs where songId="${s[i]}"`, (err, result) => {
          if (err) throw err;
          object.push(result[0]);
          
          resolve();
        });
      });
    }
  res.send(object)
});

app.post("/signupForm", (req, res) => {
  console.log("Name ->" + req.body.personName);

  bcrypt.hash(req.body.password, 10, function (err, hash) {
    var sql =
      "INSERT INTO userTable (email,age,userName,userPassword) VALUES ?";
    var values = [
      [req.body.personEmail, req.body.personAge, req.body.personName, hash],
    ];
    con.query(sql, [values], function (err, result, fields) {
      if (err) {
        throw err;
      }
      res.redirect("./selectArtists");
    });
  });
});

app.post("/loginForm", (req, res) => {
  console.log("Name ->" + req.body.personEmail);

  var sql = `select userPassword from userTable where email="${req.body.personEmail}"`;

  con.query(sql, (err, response) => {
    if (err) throw err;
    const verified = bcrypt.compareSync(
      req.body.password,
      response[0].userPassword
    );
    console.log("password->" + response[0].userPassword);
    if (verified) {
      res.redirect("/");
    } else {
      res.redirect("/login");
    }
  });
});

app.get("/getAllArtists", (req, res) => {
  const sql = "select * from artistTable";
  con.query(sql, (err, response) => {
    if (err) throw err;
    console.log(response);
    res.send(response);
  });
});
app.listen(port, () => console.log("The application has started successfully"));
