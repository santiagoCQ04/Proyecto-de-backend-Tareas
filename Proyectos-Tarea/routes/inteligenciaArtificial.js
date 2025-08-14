
import Routes from "express"
import AuthController from "../controllers/inteligenciaArtificial.js"

const router = Routes()

// Generar tareas automáticamente según descripción del proyecto
router.post('/generate-tasks', AuthController.verifyToken, AIController.generateTasks);

// Analizar un proyecto y sugerir mejoras
router.post('/analyze-project', AuthController.verifyToken, AIController.analyzeProject);

// Estimar tiempo para tareas
router.post('/estimate-time', AuthController.verifyToken, AIController.estimateTime);

// Generar resumen del proyecto
router.post('/generate-summary', AuthController.verifyToken, AIController.generateSummary);

// Sugerencias de mejora basadas en comentarios y estados
router.post('/suggest-improvements', AuthController.verifyToken, AIController.suggestImprovements);


export default router;
