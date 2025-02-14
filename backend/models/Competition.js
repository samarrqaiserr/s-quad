import mongoose from 'mongoose';

const competitionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rounds: [
      {
        roundNumber: { type: Number, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        contestants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contestant' }],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Competition', competitionSchema);
