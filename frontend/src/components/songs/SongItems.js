import React from "react";

function createLink(id){
    window.open(`https://open.spotify.com/track/${id}`);
}
function SongItems(props) {
  return (
    <>
      <div
        className="cardButton"
        name={props.decade}
        style={{ height: "15vw" }}
        onClick={()=>{createLink(props.songId)}}
      >
        <div className="imageContainer">
          <div src={props.imgUrl} className="imageClass" alt={props.decade} style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
            <h3>Play</h3>
            <h3>{props.songName}</h3>
            <h3>{props.popu}</h3>
          </div>
        </div>
      </div>
    </>
  );
}

export default SongItems;
