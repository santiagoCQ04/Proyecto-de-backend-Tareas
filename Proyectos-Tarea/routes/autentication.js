import Routes from "express";
import AuthController from "../controllers/autentication.js";
import {validarJWT} from '../middlewares/validar-jwt.js';

const router = Routes()

// Registro de nuevo usuario
router.post('/auth/register', AuthController.register);

// Inicio de sesión
router.post('/auth/login', AuthController.login);

// Renovar token
router.post('/auth/refresh', validarJWT, AuthController.refreshToken);

// Cerrar sesión
router.post('/auth/logout', validarJWT, AuthController.logout);

// Recuperar contraseña
router.post('/auth/forgot-password', AuthController.forgotPassword);

// Restablecer contraseña
router.post('/auth/reset-password', AuthController.resetPassword);


export default router;