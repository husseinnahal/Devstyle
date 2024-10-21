const express =require('express');
const mongo =require('mongoose');
const cors =require('cors');
require('dotenv').config();

const app=express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongo.connect(process.env.Mongo_Url)
.then(() => {
    console.log("MongoDB connection is working");
})
.catch(() => {
    console.log("Error connecting to MongoDB:");
});


const User=require('./Routes/UserRoute');
const SubCat=require('./Routes/subCatRoute');
const Items=require('./Routes/ItemsRoutes');
const Cart=require('./Routes/CartRoutes');
const Order=require('./Routes/orderRoute');
const Wishlist=require('./Routes/wishlistRoutes');

app.use("/api/User",User);
app.use("/api/SubCat",SubCat);
app.use("/api/Items",Items);
app.use("/api/Cart",Cart);
app.use("/api/Order",Order);
app.use("/api/Wishlist",Wishlist);






app.all('*',(req,res)=>{
    res.status(400).json({
        status:false,
        message:"the resourse is not found"
    })
})

app.listen(process.env.Port || 3000 ,()=>{
    console.log('im listening');
})