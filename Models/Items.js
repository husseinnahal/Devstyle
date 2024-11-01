const { type } = require('express/lib/response');
const mongo =require('mongoose');

const itemSchema=new mongo.Schema({
    name:{
        type:String,
        required:[true,"name is required"],
        trim:true
    },
    category:{
        type:String,
        enum:["MenWears","WomenWears","KidsWears","Shoas","Accessories","Bags"],
        required:[true,"category is require"]
    },
    Subcat:{
        type:mongo.Schema.ObjectId,
        ref: 'Subcategories',
        required:[true,"subcategory is require"]
    },
    descreption:{
        type:String,
        required:[true,"desc is required"],
        minlength: [15, 'Too short Item description'],
        trim:true
    },
    price:{
        type:Number,
        required:[true,"price is required"],
        min:[1,"price must be above or equal 1"]
    },
    priceAfterSale:{
        type:Number,
    },
    saleByPercentage:{
        type:Number,
    },
    color:{
        type:[String],
        required:[true,"color is required"],
    },
    size:{
        type:[String],
        required:[true,"size is required"],
    },
    inStock:{
        type:Number,
        required:[true,"quantity is required"],
        min:[1,"quantity must be above or equal 5"]
    },
    sold:{
        type:Number,
        default:0,
    },
    imageCover: {
        type: String,
    },
    images: {
        type:[String],
        required: [true, 'Image  is required'],
    }
},{timestamps:true});

module.exports=mongo.model("Items",itemSchema);