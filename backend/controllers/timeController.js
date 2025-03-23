import timeModel from "../models/timeModel.js";

//guardar un horario
const addTime = async (req,res) =>{

    const time = new timeModel({
        dia:req.body.dia,
        apertura1:req.body.apertura1,
        cierre1:req.body.cierre1,
        apertura2:req.body.apertura2,
        cierre2:req.body.cierre2,
        abierto:req.body.abierto
    })
    try {
        await time.save();
        res.json({success:true,message:"Horario agregado"});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
};

//actualizar horario
const updateTime = async (req,res) => {
    const { dia, apertura1, cierre1, apertura2, cierre2, abierto } = req.body;
    try {
        const horario  = await timeModel.findOne({dia});

        if(horario){
            horario.apertura1 = apertura1;
            horario.cierre1 = cierre1;
            horario.apertura2 = apertura2;
            horario.cierre2 = cierre2;
            horario.abierto = abierto;
            await horario.save();
            res.json({success:true,message:"Horario actualizado"});
        }

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }

};

//obtener todos los horarios
const getTimes = async (req,res) => {
    try {
        const times = await timeModel.find({});
        res.json({success:true,data:times});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
};

//obtener un horario 
const getTimeDia = async (req, res)=> {
    const {dia} = req.query;
    // console.log(dia)
    try {
        const time = await timeModel.findOne({dia:dia});
        res.json({success:true,data:time});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}




export {getTimes, addTime, updateTime, getTimeDia}