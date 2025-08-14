import Routes from "express"
import categoryController from "../controllers/categories.js"
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Routes()

// Obtener todas las categorías (protegido)
router.get('/categories', validarJWT, categoryController.getAllCategories);

// Crear una categoría (protegido)
router.post('/createcategories', validarJWT, categoryController.createCategory);

// Actualizar una categoría por ID (protegido)
/* router.put('/:id', validarJWT, categoryController.update);

// Eliminar una categoría por ID (protegido)
router.delete('/:id', validarJWT, categoryController.delete); */


export default router;
