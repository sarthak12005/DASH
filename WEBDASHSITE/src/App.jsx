import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Tasks from "./pages/Tasks";
import Solutions from "./pages/Solutions";
import Diary from "./pages/Diary";
import Study from "./pages/Study";
import Home from "./pages/Home";
import DailyTasks from "./pages/DailyTasks";
import Admin from "./pages/Admin";
import SongPage from "./pages/SongPage";
// import Gallery from "./pages/Gallery";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/study" element={<Study />} />
        <Route path="/dailytasks" element={<DailyTasks />} />
        {/* <Route path="/gallery" element={<Gallery/>}/> */}
        <Route path="/song" element={<SongPage/>}/>
        <Route path='/admin' element={<Admin/>}/>
      </Routes>
    </Router>
  );
}

export default App;
