import PasswordResetToken from "../models/passwordResetToken.js";
import User from "../models/users.js";
import { generarJWT, validarJWT } from "../middlewares/validar-jwt.js";
import { sendResetEmail } from "../services/emailService.js";
import bcrypt from "bcryptjs";

export const requestReset = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    // Usamos tu función generarJWT para crear el token
    const token = await generarJWT(user._id);
    
    await PasswordResetToken.create({ 
      email, 
      token,
      expiresAt: new Date(Date.now() + 3600000) // 1 hora
    });

    await sendResetEmail(email, token);
    
    res.status(200).json({ 
      success: true,
      message: 'Correo de recuperación enviado' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Primero validamos el token con tu middleware
    const fakeReq = { header: () => `Bearer ${token}` };
    const fakeRes = {
      status: () => fakeRes,
      json: () => {}
    };
    const fakeNext = (error) => {
      if (error) throw error;
    };
    
    await validarJWT(fakeReq, fakeRes, fakeNext);
    
    // Si pasa la validación, continuamos
    const user = await User.findById(fakeReq.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await PasswordResetToken.deleteOne({ token });

    res.status(200).json({ 
      success: true,
      message: 'Contraseña actualizada exitosamente' 
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};
