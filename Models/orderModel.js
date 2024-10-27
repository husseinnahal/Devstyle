const { type } = require('express/lib/response');
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
    // note : bde zid hun l addres , phone , name
    name:{
      type:String,
      required:[true,"name is required"]
    },
    addres:{
      type:String,
      required:[true,"addrrs is required"]
    },
    phone:{
      type:String,
      required:[true,"phone number is required"]
    }

},{timestamps:true});

module.exports=mongo.model("Orders",cartSchema);