const User=require('../Controllers/UserController');
const {validationMiddleware, registrValidation,loginValidation}=require('../MiddleWares/validation')
const express=require('express');
const token =require('../MiddleWares/verifyToken');
const Router=express.Router();

Router.post('/registration',registrValidation,validationMiddleware,User.registration);
Router.post('/login',loginValidation,validationMiddleware,User.login);
Router.get('/',token,User.getUsers);
Router.get('/Auser',token,User.getAuser);


module.exports=Router;