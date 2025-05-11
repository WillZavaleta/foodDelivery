//import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import pedidoModel from "../models/pedidoModel.js";
import Stripe from "stripe";

// placing user order for frontend
const placeOrder = async (req, res) => {
    const frontend_url = "https://tomato-t8yt.onrender.com";
    // const frontend_url = "http://localhost:5173";
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    try {
        // Ajustamos los precios en los items antes de guardarlos
        const updatedItems = req.body.items.map((item) => ({
            ...item,
            name: item.conOrilla ? item.name = item.name + " con orilla de queso": item.name,
            price: item.conOrilla ? item.price + 15 : item.price // Si tiene orilla, sumamos 15 pesos
        }));

        const newOrder = new pedidoModel({
            userId: req.body.userId,
            items: updatedItems,
            amount: req.body.amount,
            address: req.body.address,
            delivery: req.body.delivery//si es true es con entrega a domicilio
        });

        //console.log("Orden a guardar:", newOrder); // <-- Ver qué se va a guardar

        await newOrder.save().catch((err) => {
            console.log("❌ Error al guardar la orden:", err);
        });
        console.log("Orden guardada:", newOrder); // <-- Confirmar que se guardó
        //await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Crear items para Stripe
        const line_items = updatedItems.map((item) => ({
            price_data: {
                currency: "mxn",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 // Convertimos a centavos
            },
            quantity: item.quantity
        }));

        // Agregar costos de envío
        line_items.push({
            price_data: {
                currency: "mxn",
                product_data: {
                    name: "Tarifa de Entrega"
                },
                unit_amount: 35 * 100
            },
            quantity: 1
        });

        //opción para que los pagos lleguen a mi cuenta 
        // const session = await stripe.checkout.sessions.create({
        //     line_items: line_items,
        //     mode: 'payment',
        //     success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}&userId=${req.body.userId}`,
        //     cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}&userId=${req.body.userId}`,
        // });
        
        //opción para que los pagos lleguen a la cuenta del dueño del negocio. Debo recibir el accountId del negocio.
        const { accountId } = req.body;
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}&userId=${req.body.userId}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}&userId=${req.body.userId}`,
            payment_intent_data: {
              transfer_data: {
                destination: accountId // Aquí va el Stripe account ID del dueño del negocio
              },
              // application_fee_amount: 500, // Opcional: si tú quieres cobrar una comisión (en centavos)
            },
          });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};


// para verificar si se realizó la compra y redireccionar desde el frontend
const verifyOrder = async (req,res) => {
    const {orderId,success,userId} = req.body;
    try {
        if (success) {
            await pedidoModel.findByIdAndUpdate(orderId,{payment:true});
            // Vaciar el carrito solo si el pago fue exitoso
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.json({success:true,message:"Paid"});            
        }
        else {
            await pedidoModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Not Paid"});
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

// user orders for frontend
const userOrders = async (req,res) => {
    try {
        const orders = await pedidoModel.find({userId:req.body.userId,payment:true}).sort({ date: -1 });
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})

    }
}

//Listing orders for admin panel
const listOrders = async (req,res) => {
    try {
        const orders = await pedidoModel.find({}).sort({ date: -1 });
        res.json({success:true,data:orders})
    } catch (error) {
         console.log(error);
         res.json({success:false,message:"Error"});
    }
}

//api for updating order status
const updateStatus = async (req,res) => {
    try {
        await pedidoModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Status Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}
