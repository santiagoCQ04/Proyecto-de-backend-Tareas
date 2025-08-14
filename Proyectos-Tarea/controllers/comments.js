import Comment from "../models/comments.js";

const CommentsController = {
    // Listar comentarios de un proyecto
    async getCommentsByProject(req, res) {
        try {
            const { projectId } = req.params;
            const comments = await Comment.find({ projectid: projectId }).populate("author");
            res.json(comments);
        } catch (error) {
            res.status(500).json({ msg: "Error al obtener comentarios" });
        }
    },

    // Crear comentario en un proyecto
    async createComment(req, res) {
        try {
            const { projectId } = req.params;
            const { content } = req.body;
            const author = req.user.id;
            const comment = new Comment({
                content: content.trim(),
                author: authorId,
                createdAt: new Date(),
                projectId,
            });
            
            await comment.save();
            res.status(201).json(comment);
        } catch (error) {
            res.status(500).json({ msg: "Error al crear comentario" });
        }
    },

    // Editar comentario
    async updateComment(req, res) {
        try {
            const { id } = req.params;
            const { content } = req.body;
            const comment = await Comment.findById(id);
            if (!comment) return res.status(404).json({ msg: "Comentario no encontrado" });
            if (comment.author.toString() !== req.user.id) {
                return res.status(403).json({ msg: "No puedes editar este comentario" });
            }
            comment.content = content;
            comment.editedAt = new Date();
            comment.updatedAt = new Date();
            await comment.save();
            res.json(comment);
        } catch (error) {
            res.status(500).json({ msg: "Error al editar comentario" });
        }
    },

    // Eliminar comentario
    async deleteComment(req, res) {
        try {
            const { id } = req.params;
            const comment = await Comment.findById(id);
            if (!comment) return res.status(404).json({ msg: "Comentario no encontrado" });
            if (comment.author.toString() !== req.user.id) {
                return res.status(403).json({ msg: "No puedes eliminar este comentario" });
            }
            await comment.deleteOne();
            res.json({ msg: "Comentario eliminado" });
        } catch (error) {
            res.status(500).json({ msg: "Error al eliminar comentario" });
        }
    }
};

export default CommentsController;
