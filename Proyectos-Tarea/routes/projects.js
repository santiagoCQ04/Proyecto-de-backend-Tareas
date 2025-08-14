import Routes from "express"
import ProjectController from "../controllers/projects.js"
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Routes()

// Listar proyectos del usuario autenticado
router.get('/project', validarJWT, ProjectController.getProjectsByUser);

// Crear un nuevo proyecto
router.post('/createproject', validarJWT, ProjectController.createProject);

// Obtener un proyecto específico
router.get('/:id/project', validarJWT, ProjectController.getProjectById);

// Actualizar un proyecto
router.put('/:id', validarJWT, ProjectController.updateProject);

// Eliminar un proyecto
router.delete('/:id/project', validarJWT, ProjectController.deleteProject);

// Agregar miembro al proyecto
router.post('/:id/members', validarJWT, ProjectController.addMember);

// Remover miembro del proyecto
router.delete('/:id/members/:userId', validarJWT, ProjectController.removeMember);

// Cambiar el estado del proyecto
router.put('/:id/status', validarJWT, ProjectController.updateProjectStatus);
export default router;
