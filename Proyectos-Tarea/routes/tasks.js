
import Routes from "express";
import TaskController from "../controllers/tasks.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Routes()

// Listar todas las tareas
router.get('/projects/:projectId/tasks', TaskController.getTasksByProject);

// Crear una nueva tarea
router.post('/projects/:projectId/tasks', validarJWT, TaskController.createTask);

// Obtener una tarea por ID
router.get('/tasks/:id', TaskController.getTaskById);

// Actualizar una tarea
router.put('/tasks/:id', TaskController.updateTask);

// Eliminar una tarea
router.delete('/tasks/:id', TaskController.deleteTask);

//Cambiar estado de tarea
router.put("/tasks/:id/status", TaskController.changeTaskStatus);

//Asignar tarea a usuario
router.put("tasks/:id/assign", TaskController.assignTaskUser);

//Tareas asignadas al usuario X
router.get("tasks/my-tasks", TaskController.getMyTasks);

export default router;