import React from "react";
import { json } from "react-router-dom";
import Cookies from "universal-cookie";

function selectCard(id) {
  const cookie = new Cookies();
  const div=document.getElementById(id);
  var temp = cookie.get("listOfArtist");
  if (temp == null) temp = [];
  if (!temp.includes(id)) {
    if (temp.length == 3){
        const lost=document.getElementById(temp[2]);
        lost.style="box-shadow: none;";
        temp.pop();
    };
    temp.push(id);
    cookie.set("listOfArtist", JSON.stringify(temp));
    div.style="box-shadow: 0px 0px 17px #0238ea;"
}else{
    const newTemp=[]
    for(var i=0;i<temp.length;i++){
        if(temp[i]!=id) newTemp.push(temp[i]); 
    }
    div.style="box-shadow: 0px 0px 17px #0238ea;"
    cookie.set("listOfArtist", JSON.stringify(newTemp));
    console.log("newValues ->" + newTemp);

  }
  console.log("Values ->" + temp);
}

function Card(props) {
  return (
    <>
      <div
        className="cardButton"
        id={props.ArtistId}
        style={{ height: "15vw" }}
      >
        <div className="imageContainer">
          <img
            src={props.imgUrl}
            className="imageClass"
            alt={props.decade}
            onClick={() => {
              selectCard(props.ArtistId);
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p style={{ margin: "0px" }}>Artist Name-:{props.ArtistName}</p>
        </div>
      </div>
    </>
  );
}

export default Card;
