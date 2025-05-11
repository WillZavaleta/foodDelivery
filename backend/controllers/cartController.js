import userModel from "../models/userModel.js";

//add items to user cart
// const addToCart = async (req, res) => {
//     try {
//         let userData = await userModel.findById(req.body.userId);
//         let cartData = await userData.cartData;
//         if(!cartData[req.body.itemId]){
//             cartData[req.body.itemId] = 1;
//         }
//         else{
//             cartData[req.body.itemId] += 1;
//         }
//         await userModel.findByIdAndUpdate(req.body.userId,{cartData})
//         res.json({success:true,message:"Added to Cart"})
//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"Error"})
//     }
// }

const addToCart = async (req, res) => {
    try {
        const { userId, itemId, conOrilla } = req.body;

        // Buscar al usuario
        let userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        let cartData = userData.cartData || {}; // Si no existe, inicializar como objeto

        // Verificar si el producto ya está en el carrito
        const existingItems = cartData[itemId] || [];

        // Buscar si ya existe la misma variante
        const index = existingItems.findIndex(item => item.conOrilla === conOrilla);

        if (index !== -1) {
            // Si existe, incrementar la cantidad
            existingItems[index].cantidad += 1;
        } else {
            // Si no existe, agregar nueva entrada
            existingItems.push({ cantidad: 1, conOrilla });
        }

        // Actualizar el carrito con la nueva estructura
        cartData[itemId] = existingItems;

        // Guardar en la base de datos
        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Added to Cart" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error" });
    }
};


//remove items from user cart
// const removeFromCart = async (req,res) => {
//     try {
//         let userData = await userModel.findById(req.body.userId);
//         let cartData = await userData.cartData;
//         if (cartData[req.body.itemId]>0){
//             cartData[req.body.itemId] -= 1;
//         }
//         await userModel.findByIdAndUpdate(req.body.userId,{cartData});
//         res.json({success:true,message:"Removed from Cart"})
//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"Error"})
//     }
// }
const removeFromCart = async (req, res) => {
    try {
        const { userId, itemId, conOrilla } = req.body;

        let userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        let cartData = userData.cartData || {};

        if (!cartData[itemId]) {
            return res.json({ success: false, message: "El producto no está en el carrito" });
        }

        // Buscar la variante dentro del array
        let existingItems = cartData[itemId];
        const index = existingItems.findIndex(item => item.conOrilla === conOrilla);

        if (index !== -1) {
            if (existingItems[index].cantidad > 1) {
                // Si hay más de una unidad, reducir la cantidad
                existingItems[index].cantidad -= 1;
            } else {
                // Si solo hay una unidad, eliminar la variante del array
                existingItems.splice(index, 1);
            }

            // Si ya no quedan variantes de este producto, eliminar la clave del carrito
            if (existingItems.length === 0) {
                delete cartData[itemId];
            }
        }

        // Guardar cambios en la base de datos
        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Removed from Cart" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error" });
    }
};


//fetch user cart data
const getCart = async (req,res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        res.json({success:true,cartData})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export {addToCart,removeFromCart,getCart}