const mongo =require('mongoose');


const wishlistSchema=new mongo.Schema({
    user:{
        type:mongo.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    items:[{
            type: mongo.Schema.Types.ObjectId,
              ref: 'Items'
    }]



});


module.exports=mongo.model("Wishlist",wishlistSchema);
