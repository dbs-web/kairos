import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        summary: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['em-analise', 'em-producao', 'aprovado', 'arquivado'],
            required: true,
            default: 'em-analise',
        },
        text: {
            type: String,
        },
        date: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

export default mongoose.models.News || mongoose.model('Sugestoes', NewsSchema);
