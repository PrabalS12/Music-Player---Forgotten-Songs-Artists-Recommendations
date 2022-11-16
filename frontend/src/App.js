import { Routes, Route, BrowserRouter } from "react-router-dom";
import Artist from "./components/artist/Artist";
import Albums from "./components/decades/Decades";
import Genre from "./components/Genre/Genre";
import Songs from "./components/songs/Songs";

//select fav artists 
import Artistmain from "./components/artistList/Artistmain";

//login and signpage
import Signup from "./components/loginPages/Signup";
import Login from "./components/loginPages/Login";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Albums />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login/>}/>
          
          <Route path="/genre" element={<Genre />} />
          <Route path="/artists" element={<Artist />}/>
          <Route path="/songs" element={<Songs/>}/>
          <Route path="/selectArtists" element={<Artistmain/>}/>
          
        </Routes>

      </BrowserRouter>
    </>
  );
}

export default App;
