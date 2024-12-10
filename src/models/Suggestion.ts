import mongoose from 'mongoose';

const SuggestionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        briefing: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        status: {
            type: String,
            enum: ['em-analise', 'em-producao', 'aprovado', 'rejeitado'],
            required: true,
            default: 'em-analise',
        },
    },
    { timestamps: true },
);

export default mongoose.models.Suggestion || mongoose.model('Suggestion', SuggestionSchema);