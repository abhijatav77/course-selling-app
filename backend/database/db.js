import dotenv from 'dotenv';
import mongoose from 'mongoose'

dotenv.config();


const main = async() => {
    try {
        await mongoose.connect(process.env.DB_CON)
        console.log("Database connected successfully");
    } catch (error) {
        console.log(error)
    }
}

export default main;