import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
            default: 'user',
            enum: ['user', 'admin'],
        },
    },
    { timestamps: true }
)

export default mongoose.models.User || mongoose.model('User', UserSchema)