import mongoose from "mongoose";

const setSchema = new mongoose.Schema({
    tarifa:{type:Number,required:true},
})

const setModel = mongoose.models.set || mongoose.model("set",setSchema);

export default setModel;