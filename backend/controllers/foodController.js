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
        image:image_filename
    })
    try {
        await food.save();
        res.json({success:true,message:"Food Added"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
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

//remove food item
const removeFood = async (req,res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        //eliminar imagen (file system)
        fs.unlink(`uploads/${food.image}`,()=>{})
        //eliminar el registro de la BD
        await foodModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Food removed"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export {addFood, listFood, removeFood}