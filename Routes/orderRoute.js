const order=require('../Controllers/orderControllers');
const token =require('../MiddleWares/verifyToken');
const role =require('../MiddleWares/verigyRole');
const express= require('express');
const Router=express.Router();


Router.post('/',token,order.createOrder);
Router.get('/',token,order.getOrders);
Router.get('/:id',token,order.getOrder);
Router.delete('/:id',token,role("admin"),order.deletorder);


module.exports=Router;
