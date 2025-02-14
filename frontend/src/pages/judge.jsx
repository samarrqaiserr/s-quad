import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";

const Judge = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scores, setScores] = useState({}); // Store score input values

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch("http://localhost:5000/submissions");
        if (!response.ok) {
          throw new Error("Failed to fetch submissions");
        }
        const data = await response.json();
        setSubmissions(data);

        // Initialize scores state
        const initialScores = data.reduce((acc, submission) => {
          acc[submission._id] = submission.score || "";
          return acc;
        }, {});
        setScores(initialScores);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  // Handle input change
  const handleScoreChange = (submissionId, value) => {
    setScores((prevScores) => ({
      ...prevScores,
      [submissionId]: value,
    }));
  };

  // Update score function
  const updateScore = async (submissionId) => {
    const newScore = scores[submissionId];

    try {
      const response = await fetch(
        `http://localhost:5000/submissions/${submissionId}/score`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ score: newScore }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update score");
      }

      const updatedSubmission = await response.json();

      // Update the local state with the new score
      setSubmissions((prevSubmissions) =>
        prevSubmissions.map((submission) =>
          submission._id === submissionId
            ? { ...submission, score: updatedSubmission.score }
            : submission
        )
      );
    } catch (error) {
      console.error("Error updating score:", error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">
          Judge Panel - Submissions
        </h2>

        {loading && <p>Loading submissions...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {submissions.length === 0 && !loading && (
          <p>No submissions available.</p>
        )}

        {submissions.map((submission) => (
          <div
            key={submission._id}
            className="bg-white p-4 shadow-md rounded-lg mb-4"
          >
            <h3 className="text-lg font-semibold">
              Competition #{submission.competitionNumber}
            </h3>
            <p className="text-gray-600">
              User: {submission.userId?.name || "Unknown"}
            </p>

            {/* Audio Player */}
            <audio controls className="mt-2">
              <source
                src={`http://localhost:5000/uploads/${submission.mp3AudioUpload}`}
                type="audio/mp3"
              />
              Your browser does not support the audio element.
            </audio>

            <p className="mt-2">
              <strong>Score:</strong>{" "}
              {submission.score !== null ? submission.score : "Not yet scored"}
            </p>
            <p>
              <strong>Likes:</strong>{" "}
              {submission.likes !== null ? submission.likes : 0}
            </p>

            {/* Score Input & Update Button */}
            <div className="mt-3">
              <input
                type="number"
                value={scores[submission._id]}
                onChange={(e) =>
                  handleScoreChange(submission._id, e.target.value)
                }
                className="border border-gray-300 p-2 rounded-md mr-2"
                placeholder="Enter Score"
              />
              <button
                onClick={() => updateScore(submission._id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Update Score
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Judge;
