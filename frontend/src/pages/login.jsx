import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigation

const Login = () => {
  const [name, setName] = useState(""); // For Signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("contestant"); // Default role
  const [isSignup, setIsSignup] = useState(false); // Toggle between login/signup
  const navigate = useNavigate(); // Hook for navigation

  const handleAuth = async (e) => {
    e.preventDefault();

    const endpoint = isSignup ? "signup" : "login";
    const userData = isSignup
      ? { name, email, password, role }
      : { email, password };

    try {
      const res = await fetch(`http://localhost:5000/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Server Response:", data); // Debugging Line

      if (data.user && data.user.role) {
        localStorage.setItem("token", data.token);
        alert("Login successful!");

        switch (data.user.role) {
          case "admin":
            navigate("/admin");
            break;
          case "judge":
            navigate("/judge");
            break;
          case "contestant":
          default:
            navigate("/contestant-profile");
            break;
        }
      } else {
        alert("Invalid response from server!");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">
          🎤 Singing Competition {isSignup ? "Signup" : "Login"}
        </h2>

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignup && (
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            className="w-full p-3 border rounded-lg"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="w-full p-3 border rounded-lg"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {isSignup && (
            <select
              className="w-full p-3 border rounded-lg"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="contestant">Contestant</option>
              <option value="judge">Judge</option>
              <option value="admin">Admin</option>
            </select>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="text-center mt-4">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-600 font-semibold underline"
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>

        <div className="mt-4 flex flex-col space-y-3">
          <a
            href="http://localhost:5000/auth/google"
            className="block text-center bg-red-500 text-white py-2 rounded-lg"
          >
            Login with Google
          </a>
          <a
            href="http://localhost:5000/auth/facebook"
            className="block text-center bg-blue-700 text-white py-2 rounded-lg"
          >
            Login with Facebook
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
