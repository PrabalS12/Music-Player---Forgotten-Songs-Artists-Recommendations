import { React, useState } from "react";

function SongItems(props) {
  const [recommenedList, newList] = useState([]);

  return (
    <>
      <div
        name={props.decade}
        style={{ display: "flex" }}
      >
        <p>{props.songName}</p>
        <p>{props.popu}</p>
        <button onClick={()=>{window.open("https://open.spotify.com/track/"+props.songId)}}>Listen Song</button>
        <button
          onClick={async () => {
            const data = { songId: props.songId };
            const response = await fetch("/getRecommendedSongs", {
              method: "POST",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            });
            const s = await response.json();
            newList(s);
            console.log(s);
          }}
        >
          Get Recommened Songs
        </button>
      </div>
      <div id="recommendationContainer">
          {recommenedList.map((element,i)=>{
            return(
              <>
                <div key={i}>
                    <p>element.songId</p>
                    <p>element.popularity</p>
                    <button onClick={()=>window.open("https://open.spotify.com/track/"+element.songId)}>Play Song</button>
                </div>
              </>
            )
          })}
      </div>
    </>
  );
}

export default SongItems;
