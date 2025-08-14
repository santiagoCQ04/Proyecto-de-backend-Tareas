import mongoose from "mongoose";

const tasksSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    project: {type: mongoose.Schema.Types.ObjectId, ref: "Projects", required: true},
    assignedTo: {type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true},
    createBy: {type: mongoose.Schema.Types.ObjectId, ref: "Users", required: false},
    status: {type: mongoose.Schema.Types.ObjectId, ref: "States", required: true},
    priority: {type: String, enum: ["Low", "Medium", "High", "Critical"], required: true},
    estimatedHours: {type: Number, required: true},
    actualHours: {type: Number, required: false},
    startDate: {type: Date, required: true},
    dueDate: {type: Date, required: true},
    completedAt: {type: Date, required: false},
    tags: [{type: String}],
    isActive: {type: Boolean, required: true, default: true},
    createdAt: {type: Date, required: true},
    updatedAt: {type: Date, required: false}
})

export default mongoose.model("Tasks", tasksSchema)
