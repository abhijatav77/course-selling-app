import express from 'express';
import main from './database/db.js';

import courseRoute from './routes/course.routes.js';
import userRoute from './routes/user.routes.js'
import adminRoute from './routes/admin.routes.js'
import orderRoute from './routes/order.routes.js'

const app = express();
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary';
import cookieParser from 'cookie-parser';
import cors from 'cors'

dotenv.config()



app.use(express.json())
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));


app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))


const PORT = process.env.PORT || 3000;

//defining routes
app.use('/api/v1/course', courseRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/order', orderRoute);


cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret 
});

main()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is runnig on port ${PORT}`);
        })
    })
    .catch((err) => {
        throw new Error("Error " + err)
    })