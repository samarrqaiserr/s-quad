import { Link } from "react-router-dom";
import { FaTachometerAlt } from "react-icons/fa"; // Dashboard Icon

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      {/* Left Side - Singing Competition */}
      <div className="text-xl font-bold">🎤 Singing Competition</div>

      {/* Right Side - Dashboard */}
      <div className="flex items-center space-x-3">
        <FaTachometerAlt size={24} />
        <span className="text-lg font-medium">Welcome to Dashboard</span>
      </div>
    </nav>
  );
};

export default Navbar;
