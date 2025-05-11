import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    // cartData:{type:Object,default:{}}
    cartData: { type: mongoose.Schema.Types.Mixed, default: {} },
    role: { type: String, enum: ['superadmin','admin', 'cliente'], default: 'cliente' } 
},{minimize:false})

const userModel = mongoose.models.user || mongoose.model("user",userSchema);
export default userModel;
