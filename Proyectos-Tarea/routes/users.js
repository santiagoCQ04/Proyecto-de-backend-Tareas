import Routes from "express"
import userController from "../controllers/users.js"
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Routes()

// Obtener todos los usuarios
router.get('/users', validarJWT, userController.getAllUsers);

// Obtener un usuario por ID
router.get('/:id', validarJWT, userController.getUserById);

// Actualizar un usuario
router.put('/:id',  userController.updateUser);

// Eliminar un usuario
router.delete('/user/:id',  userController.deleteUser);

// Cambiar rol
router.put('/:id/role', validarJWT, userController.changeRole);


export default router;