import mongoose from "mongoose"

const usersSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    avatar: {type: String},
    phone: {type: String},
    globalRole: {type: mongoose.Schema.Types.ObjectId, ref: "Roles", required: true},
    isActive: {type: Boolean, required: true, default: true},
    isOnline: {type: Boolean, default: false},
    lastSeen: {type: Date},
    isEmailVerified: {type: Boolean, required: true, default: false},
    lastLogin: {type: Date},
    createdAt: {type: Date, default: new Date()},
    updatedAt: {type: Date, default: new Date()}
})

export default mongoose.model("Users", usersSchema)
