import React from "react";
import "../decades/albums.css";

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

function GenreItems(props) {
  return (
    <>
      <div className="cardButton" name={props.decade} style={{height:"15vw"}}>
        <div className="imageContainer">
          <img src={props.imgUrl} className="imageClass" alt={props.decade} />
        </div>
        <div>
          <p>{props.Genre}</p>
        </div>
      </div>
    </>
  );
}

export default GenreItems;
