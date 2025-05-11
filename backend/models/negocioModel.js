import mongoose from "mongoose"

const negocioSchema = new mongoose.Schema({
  userId:{type:String,required:true},
  nombre: {type: String, required: true},
  correo: {type: String, required: true, unique: true},
  telefono: {type: String},
  direccion: {type: String},
  stripeAccountId: {type: String  }, // ID de cuenta Connect, ej: acct_1Hx1234abcXYZ
  stripeOnboarded: {type: Boolean, default: false}, // Cambia a true después de que termine el onboarding
  date: {type: Date, default: Date.now},
});

const negocioModel = mongoose.models.negocio || mongoose.model("negocio",negocioSchema);
export default negocioModel;

