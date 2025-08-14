import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema({
    content: {type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true},
    projectId: {type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true},
    editedAt: {type: Date},
    createdAt: {type: Date, required: true},
    updatedAt: {type: Date, required: false}
})

export default mongoose.model("Comments", commentsSchema)
