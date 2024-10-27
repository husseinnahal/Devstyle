const User=require('../Models/User');
const hashpass=require('bcrypt')
const jwt=require('jsonwebtoken')

const registration= async (req,res)=>{
    try {
            const {name,phone,adress,email,password}=req.body;
            const emailExist= await User.findOne({email});
            if (emailExist) {
                return res.status(400).json({
                    status:false,
                    message:"Email is already exists"
                })
            }
            const phoneExist= await User.findOne({phone});
            if (phoneExist) {
                return res.status(400).json({
                    status:false,
                    message:"phone number is already exists"
                })
            }

            const hashpassword=await hashpass.hash(password,8);

            const adduser=await new User({name,phone,adress,email,password:hashpassword});

            const token = await jwt.sign({email:adduser.email,id:adduser._id,role:adduser.role},process.env.secret ,{expiresIn: '3d'});

            adduser.token=token;
            adduser.save();

            return res.status(201).json({
                status:true,
                message:"User created successfully",
                token:adduser.token
            })
    } catch (error) {
        res.status(500).json({
            status:"error",
            error:error.message
        })
    }
};

const login =async(req,res)=>{
    try {
        const {email,password}=req.body;
        const userfound=await User.findOne({email});
        if (!userfound) {
            return res.status(400).json({
                    status:false,
                    message:"User is Not Found"
            })
        }
        const Passismatched=await  hashpass.compare(password, userfound.password);
        if (!Passismatched) {
            return res.status(400).json({
                status:false,
                message:"password is wrong"
            })
        }
        
        const token = await jwt.sign({email:userfound.email,id:userfound._id,role:userfound.role},process.env.secret ,{expiresIn: '1d'});
        userfound.token=token;

        return res.status(200).json({
            status:true,
            message:"Logged in succesfully",
            token :userfound.token
        })


    } catch (error) {
           return res.status(400).json({
            status:"error",
            error:error.message
        })
    }


}


const getUsers=async (req,res)=>{
    try {
        const users=await User.find({},{"__v":false});
        if (users.length < 1 || !users) {
            return res.status(404).json({
                status:false,
                message:"no users Founded",
            })
        }
        return  res.status(200).json({
            status:true,
            message:"Users fetched succesfully",
            data:users
        })
    } catch (error) {
       return  res.status(500).json({
            status:"error",
            error:error.message
        })
    }

}

module.exports={
    registration,
    getUsers,
    login,

}