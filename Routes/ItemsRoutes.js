const Items=require('../Controllers/ItemsControllers');
const {Items_validation,validationMiddleware}=require('../MiddleWares/validation');
const token =require('../MiddleWares/verifyToken');
const role =require('../MiddleWares/verigyRole');
const images=require('../Utils/arrayimages');
const express= require('express');
const Router=express.Router();

Router.get("/",Items.getItems);
Router.get("/sales",Items.getSaleItems);
Router.get("/searchs",Items.searchs);
Router.get("/bestSeller",Items.bestSeller);
Router.get("/cat/:cat",Items.getItemsByCat);
Router.get("/:id",Items.getAnItem);




Router.post("/",token,role("admin"),images('images/Itemimg').array('images', 50),
Items_validation,validationMiddleware,Items.addItem);

Router.put("/:id",token,role("admin"),images('images/Itemimg').array('images', 50),
Items_validation,validationMiddleware,Items.updateItem);

Router.delete("/:id",token,role("admin"),Items.delItem);


module.exports=Router;