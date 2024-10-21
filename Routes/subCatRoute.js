const SubCat=require('../Controllers/SubcatController');
const {SubCat_Validation,validationMiddleware}=require('../MiddleWares/validation');
const verifyToken=require('../MiddleWares/verifyToken');
const verifyrole=require('../MiddleWares/verigyRole');
const image=require('../Utils/imageLogic');
const express=require('express')
const Router=express.Router()

Router.get("/",SubCat.getSubs);
Router.post("/",verifyToken,verifyrole("admin"),image('images/SubCatImg').single('image'),SubCat_Validation,validationMiddleware,SubCat.addSubCat);
Router.put("/:id",verifyToken,verifyrole("admin"),image('images/SubCatImg').single('image'),SubCat_Validation,validationMiddleware,SubCat.UpdateSub);
Router.delete("/:id",verifyToken,verifyrole("admin"),SubCat.deletSub);

Router.get("/:cat",SubCat.getSubBycat);



module.exports=Router