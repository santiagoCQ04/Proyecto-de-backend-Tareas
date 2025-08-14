import Role from "../models/roles.js";

const RoleController = {
    getAllRoles: async (req, res) => {
        try{
            const roles = await Role.find({ isActive:true});
            res.json(roles);
        }catch(error){
            res.status(500).json({msg:"ERROR AL OBTENER ROLES"})
            console.log(error);
        }
    },

    createRole: async (req, res) => {
        try{
            const {name, description}=req.body;

        const newRole = new Role({
            name,
            description,
            isActive: true
        });
        await newRole.save();
        res.status(201).json(newRole);
    } catch(error) {
        res.status(500).json({msg:"ERROR AL CREAR ROL"});
        console.log(error);
    }
},
    updateRole: async (req, res) => {
    try {
        const { name, description, isActive } = req.body;
        const updatedRole = await Role.findByIdAndUpdate(
            req.params.id,
            { name, description, isActive, updatedAt: new Date() },
            { new: true }
        );
        if (!updatedRole) {
            return res.status(404).json({ msg: "ROL NO ENCONTRADO" });
        }
        res.json(updatedRole);
    } catch (error) {
        res.status(500).json({ msg: "ERROR AL ACTUALIZAR ROL" });
        console.log(error);
    }
 },

    deleteRole: async (req, res) => {
    try {
      // Verificar si el rol está siendo usado antes de eliminar
      const usersWithRole = await User.countDocuments({ globalRole: req.params.id });
      if (usersWithRole > 0) {
        return res.status(400).jyyytson({ message: 'No se puede eliminar, hay usuarios con este rol' });
      }

      await Role.findByIdAndDelete(req.params.id);
      res.json({ message: 'Rol eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar rol' });
    }
  },
}

export default RoleController;