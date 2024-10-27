const order=require('../Controllers/orderControllers');
const token =require('../MiddleWares/verifyToken');
const {OrderValidation,validationMiddleware}=require('../MiddleWares/validation');
const role =require('../MiddleWares/verigyRole');
const express= require('express');
const Router=express.Router();


Router.post('/',token,OrderValidation,validationMiddleware,order.createOrder);
Router.get('/',token,role("admin"),order.getOrders);
Router.get('/:id',token,role("admin"),order.getOrder);
Router.delete('/:id',token,role("admin"),order.deletorder);


module.exports=Router;
