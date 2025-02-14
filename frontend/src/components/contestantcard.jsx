import { useState } from "react";

const ContestantCard = ({ contestant, onScoreSubmit }) => {
  const { _id, mp3AudioUpload, score } = contestant;
  const [newScore, setNewScore] = useState(score || 0);

  const handleScoreChange = (e) => {
    setNewScore(e.target.value);
  };

  const handleSubmit = () => {
    onScoreSubmit(_id, newScore);
  };

  return (
    <div className="border p-4 rounded-lg shadow-md bg-white">
      <h3 className="text-lg font-bold">Contestant ID: {_id}</h3>
      <audio controls className="w-full mt-2">
        {/* ✅ Corrected template literal usage */}
        <source
          src={`http://localhost:5000/uploads/${mp3AudioUpload}`}
          type="audio/mp3"
        />
        Your browser does not support the audio element.
      </audio>
      <div className="mt-3">
        <label className="block font-medium">Score (0-10):</label>
        <input
          type="number"
          min="0"
          max="10"
          value={newScore}
          onChange={handleScoreChange}
          className="border p-1 w-16 text-center"
        />
        <button
          onClick={handleSubmit}
          className="ml-3 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Submit Score
        </button>
      </div>
    </div>
  );
};

export default ContestantCard;
