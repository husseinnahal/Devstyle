const mongo =require('mongoose');

const UserSchema=new mongo.Schema({
    name:{
        type:String,
        trim:true,
        required:[true,"name is required"]
    },

    phone:{
        type:String,
        required:[true,"phone is required"]
    },

    adress:{
        type:String,
        required:[true,"adress is required"],
        lowercase:true
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
      },

    password:{
        type:String,
        required:[true,"password is required"],
    },
    role: {
      type: String,
      enum: ['user','admin'],
      default: 'user',
    },


    token:String
    
},{timestamps:true});

module.exports=mongo.model("User",UserSchema)