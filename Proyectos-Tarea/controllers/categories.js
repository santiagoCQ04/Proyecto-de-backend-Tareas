import category from "../models/categories.js";


const categoryController = {
  async getAllCategories(req, res) {
    try{
        const categories = await category.find ({ isActive:true});
        res.json(categories);
    }catch (error){
        res.status(500).json({msg:"Error al obtener categorias"})
    }
  },

  async createCategory(req, res){
      try{////
        console.log('req.user:', req.user);
        const {name, description}=req.body;

        const newCategory = new category({
            name,
            description,
            isActive:true,
            createBy: req.user
        })
        await newCategory.save();
        res.status(201).json(newCategory);

      }catch(error){
        console.log('Error al crear la categoria ', error)
        res.status(500).json({
          msg: "Error interno del servidor al crear la Categoria"
        })
      }
  }
}

export default categoryController;