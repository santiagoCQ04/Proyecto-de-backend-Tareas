import mongoose from "mongoose";

const projectsSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    category: {type: mongoose.Schema.Types.ObjectId, ref: "Categories", required: true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true},
    members: [{
        user: {type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true},
        role: {type: mongoose.Schema.Types.ObjectId, ref: "Roles", required: true},
        joinedAt: {type: Date, default: Date.now},
    },],
    status: {type: mongoose.Schema.Types.ObjectId, ref: "States", required: true},
    priority: {type: String, enum: ["Low", "Medium", "High", "Critical"], required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    estimatedHours: {type: Number, required: true},
    actualHours: {type: Number, default: 0},
    budget: {type: Number, required: true},
    isActive: {type: Boolean, default: true},
    tags: [{type: String}],
    createdAt: {type: Date, required: true},
    updatedAt: {type: Date, required: true}
})

export default mongoose.model("Project", projectsSchema)
