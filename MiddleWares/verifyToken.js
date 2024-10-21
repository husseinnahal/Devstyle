const jwt =require('jsonwebtoken');


const verfyToken=(req,res,next)=>{
        // for get the header
        const authHeader=req.headers['authorization'] || req.headers['Athorization'] ;
        if (!authHeader) {
                // 401 unauthorize
                return res.status(401).json({
                        status: false,
                        message:"No token found please Login "
                }) 
        }
        // to get the token from authheader
        const token=authHeader.split(' ')[1];
    
        try {
                // to verfy if token is true or no
                const decoded = jwt.verify(token,process.env.secret);
                // {
                //         email: 'hn@gamil.com',
                //         id: '66fd27c10a2f164d7a716695',
                //         role:user
                //         iat: 1727866817,
                //         exp: 1727953217
                //       }
                // l decoded by3tina hol lm3lomet hsab ma nhna htyna bl function hunik

                req.decoded=decoded;
                // lma ysht8el hyde l fucntion btsir m3na hyde k2no variable we can use it in any midlewear

                next();        
        } catch (error) {
                    return res.status(401).json({
                                status: error,
                                message:"invalide token please Log in again"
                        })
                }
        


}

module.exports=verfyToken;