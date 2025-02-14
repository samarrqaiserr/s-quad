import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema(
  {
    competitionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Competition', required: true },
    roundNumber: { type: Number, required: true },
    rankings: [
      {
        contestantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contestant', required: true },
        totalScore: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Result', resultSchema);
