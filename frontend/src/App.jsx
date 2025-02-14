import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import ContestantProfile from "./pages/contestantprofile"; // Import the profile page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/contestant-profile" element={<ContestantProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
