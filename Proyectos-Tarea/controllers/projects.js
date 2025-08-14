import Project from "../models/projects.js";
import User from "../models/users.js";
import State from "../models/states.js";
import Category from "../models/categories.js";

// Ejemplo de middleware de permisos (puedes personalizarlo)
const checkProjectPermission = async (userId, projectId) => {
    const project = await Project.findById(projectId);
    if (!project) return false;
    return project.owner.equals(userId) || project.members.some(m => m.user.equals(userId));
};

const ProjectController = {
    // Listar proyectos del usuario autenticado
    async getProjectsByUser(req, res) {
        try {
            const userId = req.user.id;
            const projects = await Project.find({ $or: [{ owner: userId }, { "members.user": userId }] })
                .populate("category owner members.user members.role status");
            res.json(projects);
        } catch (error) {
            res.status(500).json({ msg: "Error al obtener proyectos" });
        }
    },

    // Crear un nuevo proyecto
    async createProject(req, res) {
        try {

            // Validación: verificar que req.user exista
            if (!req.user){
                return res.status(401).json({
                    msg: "Usuario no autenticado. Debes iniciar sesión"
                });
            }

            const { name, description, category, priority, startDate, endDate, estimatedHours, budget, tags } = req.body;

            // Verificar que el usuario exista (opcional pero recomendado)
            const user = await User.findById(req.user.id);
            if (!user){
                return res.status(404).json({ 
                    msg: "Usuario no encontrado" 
                });
            }

            const owner = user;

            // Buscar estado inicial (manejar error si no existe)
            const initialState = await State.findOne({ type: "Project", name: "Planificación" });
            if (!initialState) {
                return res.status(500).json({ msg: "Estado inicial de proyecto no encontrado" });
            }
            const project = new Project({
                name,
                description,
                category,
                owner,
                members: [{ user: owner, role: req.user.globalRole, joinedAt: new Date() }],
                status: await State.findOne({ type: "Project", name: "Planificación" }),
                priority,
                startDate,
                endDate,
                estimatedHours,
                budget,
                tags,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            await project.save();
            res.status(201).json(project);
        } catch (error) {
            console.log('Error al crear el proyecto ', error)
            res.status(500).json({ msg: "Error al crear proyecto" });
        }
    },

    // Obtener un proyecto específico
    async getProjectById(req, res) {
        try {
            const { id } = req.params;
            const project = await Project.findById(id)
                .populate("category owner members.user members.role status");
            if (!project) return res.status(404).json({ msg: "Proyecto no encontrado" });
            // Validar permisos
            if (!(await checkProjectPermission(req.user.id, id))) {
                return res.status(403).json({ msg: "No tienes permisos para ver este proyecto" });
            }
            res.json(project);
        } catch (error) {
            res.status(500).json({ msg: "Error al obtener proyecto" });
        }
    },

    // Actualizar un proyecto
    async updateProject(req, res) {
        try {
            const { id } = req.params;
            if (!(await checkProjectPermission(req.user.id, id))) {
                return res.status(403).json({ msg: "No tienes permisos para editar este proyecto" });
            }
            const update = { ...req.body, updatedAt: new Date() };
            const project = await Project.findByIdAndUpdate(id, update, { new: true });
            res.json(project);
        } catch (error) {
            res.status(500).json({ msg: "Error al actualizar proyecto" });
        }
    },

    // Eliminar un proyecto
    async deleteProject(req, res) {
        try {
            const { id } = req.params;
            if (!(await checkProjectPermission(req.user.id, id))) {
                return res.status(403).json({ msg: "No tienes permisos para eliminar este proyecto" });
            }
            await Project.findByIdAndDelete(id);
            res.json({ msg: "Proyecto eliminado" });
        } catch (error) {
            res.status(500).json({ msg: "Error al eliminar proyecto" });
        }
    },

    // Agregar miembro al proyecto
    async addMember(req, res) {
        try {
            const { id } = req.params;
            const { userId, roleId } = req.body;
            const project = await Project.findById(id);
            if (!project) return res.status(404).json({ msg: "Proyecto no encontrado" });
            if (!project.owner.equals(req.user.id)) {
                return res.status(403).json({ msg: "Solo el owner puede agregar miembros" });
            }
            project.members.push({ user: userId, role: roleId, joinedAt: new Date() });
            await project.save();
            res.json(project);
        } catch (error) {
            res.status(500).json({ msg: "Error al agregar miembro" });
        }
    },

    // Remover miembro del proyecto
    async removeMember(req, res) {
        try {
            const { id, userId } = req.params;
            const project = await Project.findById(id);
            if (!project) return res.status(404).json({ msg: "Proyecto no encontrado" });
            if (!project.owner.equals(req.user.id)) {
                return res.status(403).json({ msg: "Solo el owner puede remover miembros" });
            }
            project.members = project.members.filter(m => !m.user.equals(userId));
            await project.save();
            res.json(project);
        } catch (error) {
            res.status(500).json({ msg: "Error al remover miembro" });
        }
    },

    // Cambiar estado del proyecto
    async updateProjectStatus(req, res) {
        try {
            const { id } = req.params;
            const { statusId } = req.body;
            if (!(await checkProjectPermission(req.user.id, id))) {
                return res.status(403).json({ msg: "No tienes permisos para cambiar el estado" });
            }
            const project = await Project.findByIdAndUpdate(id, { status: statusId, updatedAt: new Date() }, { new: true });
            res.json(project);
        } catch (error) {
            res.status(500).json({ msg: "Error al cambiar estado" });
        }
    }
};

export default ProjectController;


