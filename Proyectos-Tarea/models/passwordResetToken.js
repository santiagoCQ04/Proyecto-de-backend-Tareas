import mongoose from "mongoose";

const passwordResetTokenSchema = new mongoose.Schema({
    email: { type:String, required:true},
    token: {type: String, required:true},
    expiresAt: {type: Date, default: Date.now, expires:3600}

})
export default mongoose.model('PasswordResetToken', passwordResetTokenSchema);