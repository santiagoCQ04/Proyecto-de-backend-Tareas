import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// Importación de rutas
import autentication from "./routes/autentication.js";
import Roles from "./routes/roles.js";
import Users from "./routes/users.js";
import Categories from "./routes/categories.js";
import Projects from "./routes/projects.js";
import States from "./routes/states.js";
import Comments from "./routes/comments.js";
import Tasks from "./routes/tasks.js"
import passwordResetRoutes from "./routes/passwordReset.js";
//impprtacion para avatar 
import avatarRoutes from "./routes/avatar.js";
// Configuración de rutas ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(express.json());

// Configuración de rutas
app.use("/", autentication);
app.use("/", Roles);
app.use("/", Users);
app.use("/", Categories);
app.use("/", Projects);
app.use("/", States);
app.use("/", Comments);
app.use("/", Tasks);
app.use('/api/password-reset', passwordResetRoutes);
app.use('/api/avatar', avatarRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Error interno del servidor' 
  });
});

// Conexión a MongoDB y inicio del servidor
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI); // Opciones eliminadas
    console.log('✅ Conectado a MongoDB');

    app.listen(process.env.PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${process.env.PORT}`);
      console.log(`📧 Sistema de password reset disponible en /api/password-reset`);
    });
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error.message);
  }
};

startServer();