import {React,useState,useEffect} from 'react'
import ArtistCard from './ArtistCard';
import Cookies from 'universal-cookie';


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



function Artist() {
  const cookie=new Cookies();
  const [listArtist,changeArtist]=useState([]);
  useEffect(() => {
    var temp=[]
    async function getInfo(){
      var url = "/getArtists";
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify({year:cookie.get("year"),genre:cookie.get("genre")})
      });
      let json = await response.json();
      temp=json;
      changeArtist(temp)
      console.log(temp);
    }
    getInfo();


  }, []);
  return (
    <>
        <div id="mainGenreContainer" style={{display:"flex",flexWrap:"wrap",justifyContent:"center",alignContent:"center",height:"100%"}} >
        {listArtist.map((element, i) => {
          return (
            <>
              <ArtistCard
                key={i}
                ArtistName={element.artistName}
                ArtistId={element.artistId}
                AlbumName={element.albumName}
                imgUrl={element.albumIMG}
              />
            </>
          );
        })}
      </div>
    </>
  )
}

export default Artist