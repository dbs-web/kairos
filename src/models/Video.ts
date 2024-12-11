import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    legenda: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
});

export default mongoose.models.Video || mongoose.model('Video', VideoSchema);
