import mongoose from "mongoose";

const categoriesSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    isActive: {type: Boolean, required: true, default: true},
    createBy: {type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true},
    createdAt: {type: Date, required: false},
    updatedAt: {type: Date, required: false}
})

export default mongoose.model("Categories", categoriesSchema)
