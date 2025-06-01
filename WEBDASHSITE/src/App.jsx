import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Tasks from "./pages/Tasks";
import Solutions from "./pages/Solutions";
import Diary from "./pages/Diary";
import Study from "./pages/Study";
import Home from "./pages/Home";
import DailyTasks from "./pages/DailyTasks";
import Admin from "./pages/Admin";
import SongPage from "./pages/SongPage";
import Daily from "./pages/Daily";
import Words from "./pages/Words";
import ChatPage from "./pages/ChatPage";
import SingleChatPage from "./pages/singleChatPage";

// import Gallery from "./pages/Gallery";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/study" element={<Study />} />
        <Route path='/daily' element={<Daily />} />
        <Route path="/daily/dailytasks" element={<DailyTasks />} />
        <Route path='/daily/words' element={<Words />} />
        {/* <Route path="/gallery" element={<Gallery/>}/> */}
        <Route path="/song" element={<SongPage />} />
        <Route path='/admin' element={<Admin />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:userId" element={<SingleChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
