import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    performanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Performance', required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Vote', voteSchema);
