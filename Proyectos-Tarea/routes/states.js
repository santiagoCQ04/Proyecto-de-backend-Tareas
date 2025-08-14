import Routes from "express"
import StateController from "../controllers/states.js"
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Routes()

// Obtener todos los estados
router.get('/', validarJWT, StateController.getAllStates);

// Obtener un estado por ID
router.get('/:id', validarJWT, StateController.getStateById);

// Crear un nuevo estado
router.post('/createState', validarJWT, StateController.createState);

// Actualizar un estado
router.put('/:id', validarJWT, StateController.updateState);

// Eliminar un estado
router.delete('/:id', validarJWT, StateController.deleteState);


export default router;