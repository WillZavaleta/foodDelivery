import setModel from "../models/setModel.js";

const updateSet = async (req,res) => {
    // console.log(req.body.tarifa)
    try {        
        await setModel.findOneAndUpdate({},{tarifa:req.body.tarifa});
        res.json({success:true,message:"Tarifa actualizada"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const getSet = async (req,res) => {
    try {
        const settings = await setModel.find({});
        res.json({success:true,data:settings})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export {updateSet, getSet}