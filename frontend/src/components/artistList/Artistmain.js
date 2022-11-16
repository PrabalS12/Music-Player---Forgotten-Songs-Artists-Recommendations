import {React,useState,useEffect} from 'react'
import Card from './Card';
import Cookies from 'universal-cookie';

function Artistmain() {
    const cookie = new Cookies();

    const [listArtist,changeArtist]=useState([]);
    useEffect(() => {
      var temp=[]
      async function getInfo(){
        var url = "/getAllArtists";
        const response = await fetch(url, {
          method: "GET",
          mode: "cors",
        });
        let json = await response.json();
        temp=json;
        changeArtist(temp)
      }
      getInfo();
  
  
    }, []);
    return (
      <>
          <div id="mainGenreContainer" style={{display:"flex",flexWrap:"wrap",justifyContent:"center",alignContent:"center"}} >
          {listArtist.map((element, i) => {
            return (
              <>
                <Card
                  key={i}
                  ArtistName={element.artistName}
                  ArtistId={element.artistId}
                  imgUrl={element.artistImg}
                />
              </>
            );
          })}
        </div>
          <button onClick={()=>{console.log(cookie.get("listOfArtist"))}} style={{cursor:"pointer"}}>
            Submit Your List
          </button>
      </>
    )
}

export default Artistmain