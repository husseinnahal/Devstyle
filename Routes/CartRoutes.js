const cart=require('../Controllers/CartControllers');
const token =require('../MiddleWares/verifyToken');
const express= require('express');
const Router=express.Router();


Router.get('/',token,cart.getCart);
Router.post('/',token,cart.addItemToCart);
Router.put('/',token,cart.updateCartQuantity);
Router.delete('/',token,cart.removeItemFromCart);


module.exports=Router;