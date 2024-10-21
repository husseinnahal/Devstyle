// ...role spread operator takes array of value 
const yourRole=(role)=>{

    return  (req,res,next)=>{
        // req.decoded.role what we use a value from decoded in verfyToken 
        if (!role.includes(req.decoded.role)) {
            
          return  res.status(401).json({
                status:false,
                message:"you are not admin",
            });

        }
        next();
    }
};
module.exports=yourRole;