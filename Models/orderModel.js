const mongo =require('mongoose');

const cartSchema= new mongo.Schema({

    cartid:{
      type:mongo.Schema.Types.ObjectId,
      ref:"CartItems",
      required:true,
    },
    
    user: {
        type: mongo.Schema.ObjectId,
        ref: 'User',
      },


},{timestamps:true});

module.exports=mongo.model("Orders",cartSchema);