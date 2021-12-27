const express=require('express');
const app=express();
const mongoose=require('mongoose')
const dotenv=require('dotenv');
dotenv.config();

// connect DB
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>console.log('MongoDb is connected')).catch((err)=>{
    console.log(err)
})
// middleware 
app.use(express.json());

// route
app.use('/user',require('./routes/user'));
app.listen(5000,()=>console.log(`Server is running`))