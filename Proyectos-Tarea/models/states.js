import mongoose from "mongoose";

const statesSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    type: {type: String, enum: ["Project", "Task"], required: true},
    isActive: {type: Boolean, required: true, default: true},
    createdAt: {type: Date, required: true},
    updatedAt: {type: Date, required: false}
})

export default mongoose.model("States", statesSchema)
