import Routes from "express";
import RoleController from "../controllers/roles.js";

const router = Routes()

// Obtener todos los roles
router.get('/',  RoleController.getAllRoles);

// Obtener un rol por ID
//router.get('/:id',  RoleController.getRoleById);

// Crear un nuevo rol
router.post('/roles',  RoleController.createRole);

// Actualizar un rol
router.put('/:id',  RoleController.updateRole);

// Eliminar un rol
router.delete('/:id',  RoleController.deleteRole);

export default router;