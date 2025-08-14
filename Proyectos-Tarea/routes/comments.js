import Routes from "express";
import {validarJWT} from '../middlewares/validar-jwt.js'
import CommentController from "../controllers/comments.js";

const router = Routes()

// Obtener todos los comentarios de un proyecto
router.get('/project/:id/comments', validarJWT, CommentController.getCommentsByProject);

// Crear un comentario en un proyecto
router.post('/project/:id/comments', validarJWT, CommentController.createComment);

// Editar un comentario
router.put('/comments/:id', validarJWT, CommentController.updateComment);

// Eliminar un comentario
router.delete('/comments/:id', validarJWT, CommentController.deleteComment);


export default router;
