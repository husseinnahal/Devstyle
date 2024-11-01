const wishlist=require('../Controllers/wishlistControllers');
const token =require('../MiddleWares/verifyToken');
const express= require('express');
const Router=express.Router();

Router.post('/',token,wishlist.addtoWishlist)
Router.get('/',token,wishlist.getwishlist)
Router.get('/inwishlist',token,wishlist.getid)
Router.delete('/',token,wishlist.delfrom_Wihslist)

module.exports=Router