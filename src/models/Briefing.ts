import mongoose from 'mongoose';

const BriefingSchema = new mongoose.Schema({
    suggestion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Suggestion',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['em-analise', 'em-producao', 'aprovado', 'arquivado'],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
});

export default mongoose.models.Briefing || mongoose.model('Briefing', BriefingSchema);
