import React from "react";

function getSongs(id){
  document.cookie=`ArtistId=${id}`
  window.location = "/Songs"; 
}

function ArtistCard(props) {
  return (
    <>
      <div
        className="cardButton"
        name={props.decade}
        style={{ height: "15vw" }}
      >
        <div className="imageContainer">
          <img src={props.imgUrl} className="imageClass" alt={props.decade} onClick={()=>{getSongs(props.ArtistId)}}/>
        </div>
        <div style={{display:"flex",flexDirection:"column"}}>
          <p style={{margin:"0px"}}>Artist Name-:{props.ArtistName}</p>
          <p style={{margin:"0px"}}>Album Name-:{props.AlbumName}</p>
        </div>
      </div>
    </>
  );
}

export default ArtistCard;
