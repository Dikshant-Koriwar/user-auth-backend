import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './utils/db.js';
import router from './routes/user.route.js';

const app =express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

dotenv.config({
    path:'.env'
});

app.use(cors({
    origin:process.env.BASE_URL,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}))


const PORT =process.env.PORT || 3000;

app.get('/',(req,res)=>{
    return res.status(200).json({
        message: 'Welcome to my API!'
    })
});

connectDB()
.then(()=>{
    console.log('Connected to MongoDB successfully');
})
.catch((error)=>{
    console.error(error);
    process.exit(1);
})

app.use('/api/v1/user/', router)


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
});
