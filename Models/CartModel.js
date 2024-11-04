const mongo =require('mongoose');

const cartSchema= new mongo.Schema({

  items:[{
    item: {
            type: mongo.Schema.Types.ObjectId,
            ref: 'Items',
            required:true
          },
          quantity: {
            type: Number,
            default: 1,
            required: true,
          },
          name:{
            type:String,
          },
          color:{
            type:String,
            required:true
          },
          size:{
            type:String,
            required:true
          },
          price:{
            type:Number,
            required:true
          },
          image:{
            type:String,
            required:true
          },
          instock:{
            type:Number,
            required:true
          }
        
    }],
    
    totalCartPrice:{
        type:Number,
        required: true,
        default: 0
    },

    user: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },

})

module.exports=mongo.model("CartItems",cartSchema);




