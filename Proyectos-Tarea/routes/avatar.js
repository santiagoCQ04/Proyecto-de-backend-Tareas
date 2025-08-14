import express from 'express';
import fileUpload from 'express-fileupload'; 

import {
    cargarArchivo,
    mostrarImagen,
    cargarArchivoCloud,
    mostrarImagenCloud
} from '../helpers/cargarArchivo.js';

const router = express.Router();

router.use(fileUpload({
    useTempFiles: true
}));

router.post('/local/:id', cargarArchivo);
router.get('/local/:id', mostrarImagen);

// Rutas para Cloudinary
router.post('/cloud/:id', cargarArchivoCloud);
router.get('/cloud/:id', mostrarImagenCloud);

export default router;