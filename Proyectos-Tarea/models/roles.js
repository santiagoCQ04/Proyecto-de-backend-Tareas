import mongoose from "mongoose";

const rolesSchema = new mongoose.Schema({
    name: {type: String, enum: ["Admin", "Project Manager", "Developer", "Viewer"], required: true, default: "Developer"},
    description: {type: String, required: true},
    isActive: {type: Boolean, default: true},
    createdAt: {type: Date, default: new Date()},
    updatedAt: {type: Date, default: new Date()}
})

export default mongoose.model("Roles", rolesSchema)