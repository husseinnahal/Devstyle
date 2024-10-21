const mongo =require('mongoose');


const subcatSchema= new mongo.Schema({
    name:{
        type:String,
        required:[true,"name is require"],
        trim:true,
    },
    
    slug:String,

    category:{
        type:String,
        enum:["MenWears","WomenWears","KidsWears","Shoas","Accessories","Bags"],
        required:[true,"category is require"]
    },
    image:{
        type:String,
        required:[true,"image is require"]
    }

},{timestamps:true});

module.exports=mongo.model("Subcategories",subcatSchema);