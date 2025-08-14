import users from "../models/users.js";
import Role from '../models/roles.js';
import bcryptjs from "bcryptjs";
import { generarJWT } from "../middlewares/validar-jwt.js"; // Función que genere un JWT

const AuthController ={
    register: async (req, res)=>{
        try{
            const {firstName, lastName, email, password, globalRole} = req.body;

            // 1. Validamos campos requeridosà

            if (!firstName || !lastName || !email || !password) {
                return res.status(400).json({
                    success: false,
                    msg: 'Todos los campos son obligatorios: firstName, lastName, email, password.',
                });
            }

            // 2. Vericamos si el correo ya está registrado
            const emailExists = await users.findOne({ email: email.toLowerCase().trim() });
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    msg: 'El correo electrónico ya está registrado.',
                });
            }

            // 3. Encriptamos la contraseña
            const saltRounds = 10;
            const hashedPassword = await bcryptjs.hash(password, saltRounds);

            // 4. Asignar rol por defecto 
            const defaultRole = await Role.findOne({ name: 'Developer' });
            if (!defaultRole || !defaultRole.isActive) {
                console.error('Rol por defecto "Developer" no encontrado o inactivo en la BD.');
                return res.status(500).json({
                    success: false,
                    msg: 'Error interno del servidor al asignar rol por defecto.',
                });
            }

            // 5. Creamos el nuevo usuario
            const newUser = new users({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.toLowerCase().trim(),
                password: hashedPassword,
                globalRole: defaultRole._id,
            });

            // 6. Guardamos el usuario en la Base de Datos
            await newUser.save();

            // 7. Generamos el token
            const token = await generarJWT(newUser._id);

            // 8. Devolvemos el usuario (sin incluir la contraseña)
            res.status(201).json({
                success: true,
                msg: 'Usuario registrado correctamente.',
                data: {
                    users: {
                        _id: newUser._id,
                        firstName: newUser.firstName,
                        lastName: newUser.lastName,
                        email: newUser.email,
                        globalRole: defaultRole.name,
                        avatar: newUser.avatar,
                    },
                    //token,
                },
            });
        }catch(error){
            console.error('Error en registro de usuario:', error)
            res.status(500).json({
                success: false,
                msg: "Error interno del servidor al registrar el usuario",
            });
        }
    },

    // Inicio de sesión de un usuario
    login:async (req, res) => {
        try {
            const {email, password} = req.body;
            
            // 1. Validamos el email y la contraseña
            if (!email || !password){
                return res.status(400).json({
                    success: false,
                    msg: "Correo electrónico y contraseña son obligatorios.",
                });
            }

            // 2. Buscamos usuario por email
            const user = await users.findOne({ email: email.toLowerCase().trim() });
            if (!user){
                return res.status(400).json({
                    success: false,
                    msg: 'Credenciales incorrectas.',
                });
            }

            // 3. Verificamos si el usuario esta activo
            if (!user.isActive) {
                return res.status(400).json({
                    success: false,
                    msg: 'Cuenta de usuario inactiva.',
                });
            }

            // 4. Comparamos la contraseña
            const isPasswordValid = await bcryptjs.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({
                    success: false,
                    msg: 'Credenciales incorrectas.',
                });
            }

            // Cuando la autenticación es exitosa, actualizar estado de conexión
            await users.findByIdAndUpdate(user._id,{
                isOnline: true,
                lastSeen: new Date(),
            });

            // 5. Generamos el token4
            const token = await generarJWT(user._id);

            // 6. Actualizamos lastLogin
            user.lastLogin = new Date();
            await user.save({ validateBeforeSave: false }); // Evitamos validar otros campos

            // 7. Obtener el nombre del rol
            const userRole = await Role.findById(user.globalRole);
            const roleName = userRole ? userRole.name : 'Sin Rol';

            // 8. Devolvemos la respuesta existosa
            res.json({
                success: true,
                msg: "Login exitoso",
                data: {
                    user: {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        globalRole: roleName,
                        avatar: user.avatar,
                    },
                    token,
                },
            });
        } catch (error) {
            console.error('Error en inicio de sesión:', error)
            res.status(500).json({
                success: false,
                msg: "Error interno del servidor al iniciar sesión.",
            });
        }
    },

    // Renovar token: Recibe el token anterior, lo verifica y genera uno nuevo
    refreshToken: async (req, res) => {
        try {

            // Verifica que req.user exista
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    msg: 'No hay usuario autenticado'
                });
            }

            const { _id } = req.user;

            // Generamos un token nuevo
            const token = await generarJWT(_id);
            console.log('Usuario para refresh:', req.user);

            res.json({
                success: true,
                msg: "Token renovado exitosamente",
                data: {
                    token,
                },
            });
        } catch (error) {
            console.error('Error al renovar el token:', error);
            res.status(500).json({
                success: false,
                msg: 'Error interno del servidor al renovar el token.',
            });
        }
    },

    // Cerrar sesión: En JWT sin estado, normalmente se maneja en el cliente eliminando el token
    logout: async (req, res) => {
        try {
            // Opcional: implementar lógica de blacklist si es necesario
            
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    msg: 'No hay usuario autenticado'
                });
            }
            console.log(`Usuario cerrando sesión ${req.user._id}`)
            //const { _id } = req.user;

            // Actualizacion estado de conexión y ultima vez
            const updateUser = await users.findByIdAndUpdate(
                req.user._id,
                {
                    isOnline: false,
                    lastSeen: new Date(),
                },{new: true, runValidators: true}
            );
            if (!updateUser){
                return res.status(401).json({
                    success: false,
                    msg: "Usuario no encontrado al cerrar sesión"
                });
            }
            console.log(`Usuario actualizado - isOnline: ${updateUser.isOnline}, lastseen: ${updateUser.lastSeen}`);

            res.json({ 
                success: true,
                msg: "Sesión cerrada correctamente.",
                userId: req.user._id,
            });
        } catch (error) {
            console.error('Error en logout:', error);
            res.status(500).json({
                success: false,
                msg: 'Error interno del servidor al cerrar sesión.',
            });
        }
    },

    // Recuperar contraseña: Busca el usuario por email y envía (simulado) un correo con instrucciones
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const usuario = await users.findOne({ email });
            if (!usuario) {
                return res.status(400).json({ msg: "Usuario no encontrado" });
            }
            // Aquí se generaría un token o link para restablecer contraseña
            // y se enviaría un correo a usuario.email
            res.json({ msg: "Correo para restablecer contraseña enviado" });
        } catch (error) {
            res.status(500).json({ msg: "Error al procesar la solicitud" });
        }
    },

    // Restablecer contraseña: Verifica el token y actualiza la contraseña del usuario
    resetPassword: async (req, res) => {
        try {
            const { token, newPassword } = req.body;
            // Verifica el token (este debe haber sido generado previamente en una lógica de forgotPassword)
            const payload = jwt.verify(token, process.env.SECRET_KEY);
            const usuario = await users.findById(payload.id);
            if (!usuario) {
                return res.status(400).json({ msg: "Usuario no encontrado" });
            }
            // Actualizar contraseña (considera aplicar hash en la contraseña)
            usuario.password = newPassword;
            await usuario.save();
            res.json({ msg: "Contraseña restablecida exitosamente" });
        } catch (error) {
            res.status(500).json({ msg: "Error al restablecer contraseña" });
        }
    },
};

export default AuthController;