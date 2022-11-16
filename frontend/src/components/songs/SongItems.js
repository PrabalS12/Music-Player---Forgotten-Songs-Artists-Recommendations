import {React,useEffect,useState} from "react";

  function createLink(id) {
    window.open(`https://open.spotify.com/track/${id}`);
  }
function SongItems(props) {
  const [recommenedList,newList] = useState([])
  // useEffect(() => {
  // }, [])
  
  return (
    <>
      <div
        className="songsContainer"
        name={props.decade}
        onClick={async() => {
          const data={"songsId":"4Ez7FfO3ex2NcpcEQorZXM"}
          const response = await fetch("/getRecommendedSongs", {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body: data
          });
          const s=await response.json()
          console.log(s);
        }}
      >
        <h3>Play</h3>
        <h3>{props.songName}</h3>
        <h3>{props.popu}</h3>
      </div>
      <div>
        Recommened Songs

      </div>
    </>
  );
}

export default SongItems;
