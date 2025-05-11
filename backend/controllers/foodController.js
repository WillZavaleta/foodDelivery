import foodModel from "../models/foodModel.js";
import fs from 'fs'

//add food item
const addFood = async (req,res) => {
    
    // let image_filename = `${req.file.filename}`;
    //obtener el nombre de la imagen con su extensión
    let image_filename = `${req.file.path}`;
    console.log(image_filename)

    const food = new foodModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        stock:req.body.stock,
        image:image_filename
    })
    try {
        await food.save();
        res.json({success:true,message:"Platillo añadido"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}

//edit food
const editFood = async (req, res) => {
    const {id, name, description, price, category, stock} = req.body;

    try {
        await foodModel.findByIdAndUpdate(id, {
            name: name,
            description: description,
            price: price,
            category: category,
            stock: stock,
            ...(req.file && { image: req.file.path }) // si hay imagen, también la actualiza
          });
          res.json({success:true, message:"Platillo actualizado"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error al actualizar platillo"})
    }
}

//all food list
const listFood = async (req,res) => {
    try {
        const foods = await foodModel.find().sort({category: 1});
        res.json({success:true,data:foods})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//stock food list
const stockFood = async (req,res) => {
    try {
        const foods = await foodModel.find({stock: true}).sort({category: 1});
        res.json({success:true,data:foods})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//remove food item
const removeFood = async (req,res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        //eliminar imagen (file system)
        fs.unlink(`uploads/${food.image}`,()=>{})
        //eliminar el registro de la BD
        await foodModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Platillo eliminado"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//snippet especial para agregar el campo stock a todos los registros
const agregarCampoStock = async (req, res) => {
    try {
        await foodModel.updateMany(
          {}, // Aplica a todos los documentos
          { $set: { stock: true } } // Agrega nuevaColumna con valor true
        );
    
        res.status(200).json({ success: true, message: 'Campo agregado exitosamente a todos los documentos.' });
      } catch (error) {
        console.error('Error al agregar el campo:', error);
        res.status(500).json({ success: false, message: 'Error al agregar el campo.', error });
      }
}

export {addFood, listFood, removeFood, agregarCampoStock, editFood, stockFood}