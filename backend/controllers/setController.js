import setModel from "../models/setModel.js";

const updateTarifa = async (req,res) => {
    try {
        await setModel.findOneAndUpdate({},{tarifa:req.body.tarifa})
        res.json({success:true,message:"Tarifa actualizada"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export {updateTarifa}