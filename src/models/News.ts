import mongoose from "mongoose"

const SugestoesSchema = new mongoose.Schema(
    {
        "title" : {
            type: String,
            required: true
        },
        'summary' : {
            type: String,
            required: true
        },
        "user" : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        "url": {
            type: String,
            required: true
        },
        "thumbnail": {
            type: String,
            required: true
        },
        "status" : {
            type: String,
            enum: ["em-analise", "em-producao", "aprovado", "rejeitado"],
            required: true,
            default: "em-analise"
        },
        "text" : {
            type: String,
        },
        "date" : {
            type: String,
            required: true
        },

    },
    {timestamps: true}
)

export default mongoose.models.Sugestoes || mongoose.model("Sugestoes", SugestoesSchema);   