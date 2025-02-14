import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";

const Admin = () => {
  const [competitions, setCompetitions] = useState([]); // Store competitions
  const [competitionNumber, setCompetitionNumber] = useState("");
  const [details, setDetails] = useState("");
  const [deadline, setDeadline] = useState("");

  // Fetch competitions from the database
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

  // Handle form submission
  const handleCreateCompetition = async (e) => {
    e.preventDefault();

    const newCompetition = {
      competitionNumber: Number(competitionNumber),
      details,
      deadline,
    };

    try {
      const res = await fetch("http://localhost:5000/competitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCompetition),
      });

      if (res.ok) {
        alert("Competition created successfully!");
        fetchCompetitions(); // Refresh the competition list
        setCompetitionNumber("");
        setDetails("");
        setDeadline("");
      } else {
        const errorData = await res.json();
        alert("Error: " + errorData.error);
      }
    } catch (error) {
      console.error("Error creating competition:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h2 className="text-2xl font-semibold">Admin Dashboard</h2>

        {/* Create Competition Form */}
        <form
          onSubmit={handleCreateCompetition}
          className="mt-4 space-y-3 bg-gray-100 p-4 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-medium">Create Competition</h3>
          <input
            type="number"
            placeholder="Competition Number"
            value={competitionNumber}
            onChange={(e) => setCompetitionNumber(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            Create Competition
          </button>
        </form>

        {/* Display Competitions as Cards */}
        <h3 className="mt-6 text-lg font-medium">Existing Competitions</h3>
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
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Admin;
