import React from "react";
import "./albums.css";

function Cards(props) {
  function selectDecade(year) {
    document.cookie = `year=${year}`;
    window.location = "/genre";
  }
  return (
    <>
      <div
        className="cardButton"
        onClick={() => selectDecade(props.decade)}
        name={props.decade}
      >
        <div className="imageContainer">
          <img src={props.imgUrl} className="imageClass" alt={props.decade}/>
        </div>
      </div>
    </>
  );
}

export default Cards;
