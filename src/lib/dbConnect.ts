import mongoose from 'mongoose'

export async function dbConnect() {
    if(process.env?.MONGODB_URI)
        await mongoose.connect(process.env.MONGODB_URI)
    else throw new Error("Connection to Database failed!")
}

export async function dbClose() {
    await mongoose.disconnect()
}