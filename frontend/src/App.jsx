import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import ContestantProfile from "./pages/contestantprofile"; // Import the profile page
import Judge from "./pages/judge"; // Import the profile page
import Admin from "./pages/admin"; // Import the profile page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/contestant-profile" element={<ContestantProfile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/judge" element={<Judge />} />
      </Routes>
    </Router>
  );
}

export default App;
