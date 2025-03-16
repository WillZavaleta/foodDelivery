import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://willwebdev:dianayyo@cluster0.jrif8.mongodb.net/food-delivery').then(()=>console.log("DB Connected"));
}