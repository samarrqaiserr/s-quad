import mongoose from 'mongoose';

const performanceSchema = new mongoose.Schema(
  {
    contestantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contestant', required: true },
    roundNumber: { type: Number, required: true },
    videoUrl: { type: String, required: true }, // Performance submission link
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Performance', performanceSchema);
