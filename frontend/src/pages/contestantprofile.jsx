import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";

const ContestantDashboard = () => {
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [mp3File, setMp3File] = useState(null);
  const userId = localStorage.getItem("userId"); // Assuming user is stored in localStorage

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      const res = await fetch("http://localhost:5000/competitions");
      const data = await res.json();
      setCompetitions(data);
    } catch (error) {
      console.error("Error fetching competitions:", error);
    }
  };

  const handleApply = (competitionNumber) => {
    setSelectedCompetition(competitionNumber);
  };

  const handleFileChange = (e) => {
    setMp3File(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mp3File) {
      alert("Please select a file before submitting!");
      return;
    }

    const formData = new FormData();
    formData.append("competitionNumber", selectedCompetition);
    formData.append("mp3AudioUpload", mp3File); // ✅ Use the correct state variable

    try {
      const res = await fetch("http://localhost:5000/submissions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ Corrected template string
        },
        body: formData, // FormData should NOT have "Content-Type" manually set
      });

      const data = await res.json();
      if (res.ok) {
        alert("Submission successful!");
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h2 className="text-2xl font-semibold">Contestant Dashboard</h2>
        <h3 className="mt-4 text-lg font-medium">Available Competitions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {competitions.map((comp) => (
            <div key={comp._id} className="bg-white p-4 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold">
                #{comp.competitionNumber}
              </h4>
              <p>{comp.details}</p>
              <p className="text-sm text-gray-500">
                Deadline: {new Date(comp.deadline).toLocaleString()}
              </p>
              <button
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => handleApply(comp.competitionNumber)}
              >
                Apply
              </button>
            </div>
          ))}
        </div>

        {/* Submission Form */}
        {selectedCompetition && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
            <h3 className="text-lg font-medium">
              Submit Your Performance for Competition #{selectedCompetition}
            </h3>
            <form onSubmit={handleSubmit} className="mt-3">
              <input
                type="file"
                accept="audio/mp3"
                onChange={handleFileChange}
                required
                className="w-full p-2 border rounded"
              />
              <button
                type="submit"
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default ContestantDashboard;
