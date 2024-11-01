const Wishlist=require('../Models/Wishlistmodel');


const addtoWishlist=async(req,res)=>{
   try {
    const { items } = req.body;
    const userId = req.decoded.id;

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId,items: [items]});
    } else {
      if (!wishlist.items.includes(items)) {
        wishlist.items.push(items);
      }else{
        return res.status(400).json({ 
            status: true,
            message:"is already in wishlist",
          });
      }
    }

    await wishlist.save();

    return res.status(200).json({ 
        status: true,
        message:"the item added to wishlist succesfuly",
    });
    
   } catch (error) {
    return res.status(500).json({ 
        status: false,
        message:error.message,
         });
   }
}

const delfrom_Wihslist=async(req,res)=>{
    try {
        const {items}=req.body;
        const userId = req.decoded.id;
    
        let wishlist = await Wishlist.findOne({ user: userId });
    
        if (!wishlist.items.includes(items)) {
            return res.status(400).json({
                status:false,
                message:"this item is not in wishlist"
            })
        } else {
            wishlist.items=await wishlist.items.filter(item => item.toString() !== items);

            wishlist.save();
    
            return res.status(200).json({
                status:true,
                message:"removed item from wishlist successfuly",
            })
        }

    } catch (error) {
        return res.status(500).json({ 
            status: false,
            message:error.message,
             });
    }


}

const getwishlist=async(req,res)=>{
try {
    const getwish=await Wishlist.find({user:req.decoded.id}).populate("items");
    if (!getwish) {
        return res.status(400).json({
            status:false,
            message:"you dont have Wishlist",
        })
    }
    
    return res.status(200).json({
        status:true,
        message:"feched succesfuly",
        data:getwish
    })
    
} catch (error) {
    return res.status(500).json({ 
        status: false,
        message:error.message,
         });
}


}

const getid=async(req,res)=>{
    try {
        const getwish=await Wishlist.find({user:req.decoded.id}).populate("items",`_id`);
        if (!getwish) {
            return res.status(400).json({
                status:false,
                message:"you dont have Wishlist",
            })
        }
        
        return res.status(200).json({
            status:true,
            message:"feched succesfuly",
            data:getwish
        })
        
    } catch (error) {
        return res.status(500).json({ 
            status: false,
            message:error.message,
             });
    }
    
    
    }

module.exports={
    addtoWishlist,
    delfrom_Wihslist,
    getwishlist,
    getid
}