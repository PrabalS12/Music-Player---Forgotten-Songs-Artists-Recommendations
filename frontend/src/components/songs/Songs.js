import { React, useState, useEffect } from "react";

import SongItems from "./SongItems";
import Cookies from "universal-cookie";

function Songs() {
  const cookie = new Cookies();
  const [listSongs, changeSongs] = useState([]);
  useEffect(() => {
    var temp = [];
    async function getInfo() {
      const artist = cookie.get("ArtistId");
      console.log(artist);
      var url = "/getSongs";
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ArtistId: artist,
        }),
      });
      let json = await response.json();
      temp = json;
      changeSongs(json);
      console.log(temp);
    }
    getInfo();
  }, []);
  return (
    <>
      <div
        id="mainSongContainer"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignContent: "center",
          height: "100%",
        }}
      >
        {listSongs.map((element, i) => {
          return (
            <>
              <SongItems 
                    key={i} 
                    songId={element.songId} 
                    songName={element.songName}
                    popu={element.popularity}    
                    
                />
            </>
          );
        })}
      </div>
    </>
  );
}

export default Songs;

// {
//     "songId": "3saJiv5CO6ttTUoRXjEMod",
//     "songName": "Headphones On",
//     "artistId": "2SHhfs4BiDxGQ3oxqf0UHY",
//     "popularity": 41,
//     "track_href": "https://api.spotify.com/v1/tracks/3saJiv5CO6ttTUoRXjEMod"
//   },
