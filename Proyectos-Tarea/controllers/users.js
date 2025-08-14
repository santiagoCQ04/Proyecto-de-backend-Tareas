import User from "../models/users.js"
import Role from "../models/roles.js"
import bcryptjs from "bcryptjs"
import { generarJWT } from "../middlewares/validar-jwt.js"

const userController = {
    getAllUsers: async (req, res) => {
        try {
            
            // Verificamos que el rol sea Admin y que esté autenticado
            if (!req.user || req.user.globalRole?.name !== 'Admin') {
                console.log('Acceso denegado - Usuario:', req.user?.globalRole?.name);
                return res.status(403).json({
                    success: false,
                    message: 'Acceso denegado, solo se permite el Administrador'
                });
            }
            const usuarios = await User.find({ isActive: true }).select('-password').populate({ path: 'globalRole', select: 'name description' });
            
            console.log('Usuarios encontrados:', usuarios);
            res.json({ 
                success: true,
                usuarios,
            });
        } catch (error) {
            console.error('Error al listar usuarios:', error);
            res.status(500).json({ msg: "Error interno del servidor" });
        }
    },
    // Obtener usuario por ID
    getUserById: async(req, res) => {
        try {
            const {id} = req.params;
            // Verificar permisos
            if (req.user.globalRole?.name !== 'Admin' && req.user._id.toString() !== id) {
                return res.status(403).json({
                    success: false,
                    msg: 'Acceso denegado',
                });
            }
            const user = await User.findById(id).select('-password').populate('globalRole', 'name description');

            if (!user || !user.isActive) {
                return res.status(404).json({
                    success: false,
                    msg: 'Usuario no encontrado',
                });
            }

            res.json({
                success: true,
                user,
            });
        } catch (error) {
            console.error('Error al obtener usuario:', error)
            res.status(500).json({ msg: "Error interno del servidor" });
        }
    },
    // Actualizar perfil usuario
    updateUser: async(req, res) => {
        try {
            const { id } = req.params;
            const { firstName, lastName, email, password, phone, avatar } = req.body;

            if (req.user.globalRole?.name !== 'Admin' && req.user._id.toString() !== id) {
                return res.status(403).json({
                    success: false,
                    msg: 'No puedes actualizar este usuario.',
                });
            }

            // Validar emial duplicado
            const existingUser = await User.findOne({ email, _id: { $ne: id } });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    msg: 'El correo ya está en uso.',
                });
            }

            const updateData = { firstName, lastName, email, phone, avatar};

            // Encriptar contraseña si se envia
            if (password) {
                const salt = await bcryptjs.genSalt(10);
                updateData.password = await bcryptjs.hash(password, salt);
            }

            const user = await User.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            }).select('-password');

            if (!user) {
                return res.status(404).json({
                    success: false,
                    msg: 'Usuario no encontrado',
                });
            }
        
        // Generar nuevo token si se ha cambiado el email o la contraseña
        let token = null;
        if (password || email !== user.email) {
            token = generarJWT(user._id, user.email, user.globalRole);
        }

        res.json({
            success: true,
            msg: 'Usuario actualizado correctamente',
            user,
            token,
        });
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            res.status(500).json({ msg: 'Error interno al actualizar usuario'});
        }
    },

    // Eliminar usuario
    deleteUser: async(req, res) => {
        try {
            const { id } = req.params;

            // Solo Admin puede eliminar
            if (!req.user || req.user.globalRole?.name !== 'Admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Acceso denegado.'
                });
            }

            // No puede eliminarse a sí mismo
            if (id === req.user._id.toString()) {
                return res.status(400).json({
                    success: false,
                    msg: 'No puedes eliminarte a ti mismo.',
                });
            }

            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    msg: 'Usuario no encontrado.',
                });
            }

            if (!user.isActive) {
                return res.status(400).json({
                    success: false,
                    msg: 'El usuario ya está inactivo.',
                });
            }

            user.isActive = false;
            user.updatedAt = Date.now();
            await user.save();

            res.json({
                success: true,
                msg: `Usuario ${user.firstName} ${user.lastName} eliminado correctamente.`,
            });
        } catch (error){
            console.error('Error al eliminar usuario:', error);
            res.status(500).json({
                msg: 'Error interno al eliminar usuario.'
            });
        }
    },

    changeRole: async(req, res) => {
        try {
            const { id } = req.params;
            const { roleId } = req.body;

            // Solo Admin puede eliminar
            if (!req.user || req.user.globalRole?.name !== 'Admin') {
                return res.status(403).json({
                    success: false,
                    msg: 'Acceso denegado',
                });
            }

            // 1. Validar datos de entreda
            if (!id || !roleId) {
                return res.status(400).json({
                    success: false,
                    msg: "Se requieren ID de usuario y el ID del rol"
                });
            }

            // 2. Verificar existencia del rol
            const roleExists = await Role.findById(roleId);
            if (!roleExists || !roleExists.isActive) {
                return res.status(404).json({
                    success: false,
                    msg: "El rol especifico no existe o está inactivo",
                });
            }

            // 3. Verificar existencia del usuario
            const userExists = await User.findById(id);
            if (!userExists || !userExists.isActive) {
                return res.status(404).json({
                    success: false,
                    msg: "El usuario especifico no existe o está inactivo",
                });
            }

            // 4. Actualizar rol
            userExists.globalRole = roleId;
            userExists.updatedAt = Date.now();
            await userExists.save();

            res.json({
                success: true,
                msg: `Rol actualizado a ${roleExists.name} correctamente.`,
                data: {
                    userId: userExists._id,
                    role: roleExists.name,
                },
            });
        } catch (error) {
            console.error('Error al cambiar el Rol:', error);
            res.status(500).json({ msg: "Error interno al cambiar el rol."});
        }
    },
};
export default userController;