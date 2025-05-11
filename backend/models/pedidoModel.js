import mongoose from "mongoose"

const pedidoSchema = new mongoose.Schema({
    userId:{type:String,required:true},
    items:{type:Array,required:true},
    amount:{type:Number,required:true},
    address:{type:Object,required:true},
    status:{type:String,default:"Procesando Pedido"},
    date:{type:Date,default:Date.now},
    delivery:{type:Boolean,default:false},
    payment:{type:Boolean,default:false}
}, { timestamps: true });

const pedidoModel = mongoose.models.pedido || mongoose.model("pedido",pedidoSchema);
export default pedidoModel;