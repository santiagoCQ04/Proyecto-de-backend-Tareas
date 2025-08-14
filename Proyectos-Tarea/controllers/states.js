import State from "../models/states.js";

const StatesController = {
    // Listar todos los estados
    async getAllStates(req, res) {
        try {
            const states = await State.find();
            res.json(states);
        } catch (error) {
            res.status(500).json({ msg: "Error al obtener estados" });
        }
    },

    // Listar estados para proyectos
    async getProjectStates(req, res) {
        try {
            const states = await State.find({ type: "Project" });
            res.json(states);
        } catch (error) {
            res.status(500).json({ msg: "Error al obtener estados de proyecto" });
        }
    },

    // Listar estados para tareas
    async getTaskStates(req, res) {
        try {
            const states = await State.find({ type: "Task" });
            res.json(states);
        } catch (error) {
            res.status(500).json({ msg: "Error al obtener estados de tarea" });
        }
    },

    // Obtener un estado por ID
    async getStateById(req, res) {
        try {
            const { id } = req.params;
            const state = await State.findById(id);
            if (!state) return res.status(404).json({ msg: "Estado no encontrado" });
            res.json(state);
        } catch (error) {
            res.status(500).json({ msg: "Error al obtener estado" });
        }
    },

    // Crear un nuevo estado
    async createState(req, res) {
        try {
            const { name, description, type, isActive } = req.body;
            const state = new State({
                name,
                description,
                type,
                isActive: isActive !== undefined ? isActive : true,
                createdAt: new Date(),
            });
            await state.save();
            res.status(201).json(state);
        } catch (error) {
            console.log("Error al crear el estado ", error);
            
            res.status(500).json({ msg: "Error al crear estado" });
        }
    },

    // Actualizar un estado
    async updateState(req, res) {
        try {
            const { id } = req.params;
            const update = { ...req.body, updatedAt: new Date() };
            const state = await State.findByIdAndUpdate(id, update, { new: true });
            res.json(state);
        } catch (error) {
            res.status(500).json({ msg: "Error al actualizar estado" });
        }
    },

    // Eliminar un estado
    async deleteState(req, res) {
        try {
            const { id } = req.params;
            await State.findByIdAndDelete(id);
            res.json({ msg: "Estado eliminado" });
        } catch (error) {
            res.status(500).json({ msg: "Error al eliminar estado" });
        }
    }
};

export default StatesController;
