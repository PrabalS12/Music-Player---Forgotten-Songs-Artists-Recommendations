import { React, useEffect,useState } from "react";
import GenreItems from "./GenreItems";
import Cookies from 'universal-cookie';

function containsObject(obj, list) {
  var i;
  for (i = 0; i < list.length; i++) {
      if (list[i].genre === obj.genre) {
          return false;
      }
  }
  return true
}

function Genre() {
  const [listGenre,changeGenre]=useState([]);
  const cookie=new Cookies;
  useEffect(() => {
    var temp=[]
    var temp2=[]
    async function getInfo(){
  
      console.log("working");
      var url = "/getGenre";
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify({year:cookie.get("year")})
      });
      let json = await response.json();
      temp=json;
      temp.forEach(element => {
        var genreObject={genre:element.genre,info:element}
        if(containsObject(genreObject,temp2)) temp2.push(genreObject)
      });
      changeGenre(temp2);
      console.log(temp2);
    }
    getInfo();


  }, []);
  return (
    <>
      <div id="mainGenreContainer">
        {listGenre.map((element, i) => {
          return (
            <>
              <GenreItems
                key={i}
                Genre={element.genre}
                info={element}
                imgUrl={element.info.albumIMG}
              />
            </>
          );
        })}
      </div>
    </>
  );
}

export default Genre;

// {
//   "artistId": "62mCohf6aiF3nryWghwCxM",
//   "artistName": "Ghulam Ali",
//   "artistIMG": "https://i.scdn.co/image/ab6761610000e5ebc86468adb7a71b55ca9e543d",
//   "genre": "classic bollywood",
//   "popularity": 45,
//   "albumId": "00iVY6PT5MNJPZt19TlyHk",
//   "albumName": "Tere Shahar Main",
//   "albumIMG": "https://i.scdn.co/image/ab67616d0000b2734f01ac1d9f4ed3c06924097e",
//   "releasedDate": "Wed Sep 22 2021"
// },
