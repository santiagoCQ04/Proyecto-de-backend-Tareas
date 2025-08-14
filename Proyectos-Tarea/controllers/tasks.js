import Task from "../models/tasks.js";
import User from "../models/users.js";
import State from "../models/states.js";

const TasksController = {
    // Listar tareas de un proyecto
    async getTasksByProject(req, res) {
        try {
            const { projectId } = req.params;
            const tasks = await Task.find({ project: projectId }).populate("assignedTo createdBy status");
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ msg: "Error al obtener tareas del proyecto" });
        }
    },

    // Crear tarea en un proyecto
    async createTask(req, res) {
        try {
            const { projectId } = req.params;
            const { title, description, assignedTo, priority, estimatedHours, dueDate, tags } = req.body;
            const createdBy = req.user;
            const task = new Task({
                title,
                description,
                project: projectId,
                assignedTo,
                createdBy,
                status: await State.findOne({ type: "Task", name: "Pendiente" }),
                priority,
                estimatedHours,
                startDate: new Date(),
                dueDate,
                tags,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            await task.save();
            res.status(201).json(task);
        } catch (error) {
            console.log("Error al crear la tarea ", error)
            res.status(500).json({ msg: "Error al crear tarea" });
        }
    },

    // Obtener tarea por ID
    async getTaskById(req, res) {
        try {
            const { id } = req.params;
            const task = await Task.findById(id).populate("assignedTo createBy status");
            if (!task) return res.status(404).json({ msg: "Tarea no encontrada" });
            res.json(task);
        } catch (error) {
            console.log("Error al obtener la tarea ", error);
            
            res.status(500).json({ msg: "Error al obtener tarea" });
        }
    },

    // Actualizar tarea
    async updateTask(req, res) {
        try {
            const { id } = req.params;
            const update = { ...req.body, updatedAt: new Date() };
            const task = await Task.findByIdAndUpdate(id, update, { new: true });
            res.json(task);
        } catch (error) {
            res.status(500).json({ msg: "Error al actualizar tarea" });
        }
    },

    // Eliminar tarea
    async deleteTask(req, res) {
        try {
            const { id } = req.params;
            await Task.findByIdAndDelete(id);
            res.json({ msg: "Tarea eliminada" });
        } catch (error) {
            res.status(500).json({ msg: "Error al eliminar tarea" });
        }
    },

    // Cambiar estado de tarea
    async changeTaskStatus(req, res) {
        try {
            const { id } = req.params;
            const { statusId } = req.body;
            const task = await Task.findByIdAndUpdate(id, { status: statusId, updatedAt: new Date() }, { new: true });
            res.json(task);
        } catch (error) {
            res.status(500).json({ msg: "Error al cambiar estado de tarea" });
        }
    },

    // Asignar tarea a usuario
    async assignTaskUser(req, res) {
        try {
            const { id } = req.params;
            const { userId } = req.body;
            const task = await Task.findByIdAndUpdate(id, { assignedTo: userId, updatedAt: new Date() }, { new: true });
            res.json(task);
        } catch (error) {
            res.status(500).json({ msg: "Error al asignar tarea" });
        }
    },

    // Listar tareas asignadas al usuario autenticado
    async getMyTasks(req, res) {
        try {
            const userId = req.user.id;
            const tasks = await Task.find({ assignedTo: userId }).populate("project status");
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ msg: "Error al obtener tus tareas" });
        }
    }
};

export default TasksController;
