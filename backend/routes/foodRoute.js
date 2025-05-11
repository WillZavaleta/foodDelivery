import express from 'express'
import { addFood, listFood, removeFood, agregarCampoStock, editFood, stockFood } from '../controllers/foodController.js'
import multer from 'multer'
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import 'dotenv/config.js'

const foodRouter = express.Router();

// Configurar Cloudinary
cloudinary.config({ 
    cloud_name: 'dpkpcre6t', 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET // Click 'View API Keys' above to copy your API secret
});

//CLOUDINARY_URL=cloudinary://172369221472918:c42hTJFAOwQVG703v8OhtVH8D1M@dpkpcre6t
// Configurar almacenamiento de Cloudinary
// Almacén personalizado para Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Obtiene la extensión original del archivo
        const ext = file.originalname.split('.').pop();
        
        return {
            folder: "uploads", // Carpeta en Cloudinary
            format: ext,       // Usa la extensión original
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}` // timestamp-nombreOriginal
        };
    }
});

//--------------------------------------------------------
//Image Storage Engine
// const storage = multer.diskStorage({
//     destination:"uploads",
//     filename:(req,file,cb)=>{
//         return cb(null,`${Date.now()}${file.originalname}`)
//     }
// })

const upload = multer({storage:storage})


foodRouter.post("/add",upload.single("image"),addFood)
foodRouter.post("/edit",upload.single("image"),editFood)
foodRouter.get("/list", listFood)
foodRouter.get("/stockFood", stockFood)
foodRouter.post("/remove",removeFood)
foodRouter.get("/campo-stock", agregarCampoStock)

export default foodRouter;