import mongoose from "mongoose"

const timeSchema = new mongoose.Schema({
    dia: {
        type: String,
        enum: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
        required: true
    },
    apertura1: {
        type: String,   // "HH:MM" (formato 24h)
        required: false
    },
    cierre1: {
        type: String,    // "HH:MM" (formato 24h)
        required: false
    },
    apertura2: {
        type: String,   // "HH:MM" (formato 24h)
        required: false
    },
    cierre2: {
        type: String,    // "HH:MM" (formato 24h)
        required: false
    },
    abierto: {
        type: Boolean,    // Si el restaurante está abierto ese día
        default: true
    }
})

const timeModel = mongoose.models.time || mongoose.model("time",timeSchema);
export default timeModel;