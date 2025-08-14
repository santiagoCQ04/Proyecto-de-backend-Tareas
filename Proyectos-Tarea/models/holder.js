import mongoose from 'mongoose';

const HolderSchema = new mongoose.Schema({
  name: { type: String, required: true }, // nombre del titular
  email: { type: String, required: true, unique: true }, // correo
  photo: { type: String }, // url o nombre del archivo de la foto
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Holder = mongoose.model('Holder', HolderSchema);

export default Holder;