import { Routes, Route, BrowserRouter } from "react-router-dom";
import Artist from "./components/artist/artist";
import Albums from "./components/decades/Decades";
import Genre from "./components/Genre/Genre";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Albums />} />
          <Route path="/genre" element={<Genre />} />
          <Route
            path="/artists"
            element={
              <>
                <Artist />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
