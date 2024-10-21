const User=require('../Controllers/UserController');
const verifyToken=require('../MiddleWares/verifyToken');
const {validationMiddleware, registrValidation,loginValidation,updateAdress}=require('../MiddleWares/validation')
const express=require('express');
const Router=express.Router();

Router.post('/registration',registrValidation,validationMiddleware,User.registration);
Router.post('/login',loginValidation,validationMiddleware,User.login);
Router.get('/',User.getUsers);
Router.put('/:id',verifyToken,updateAdress,validationMiddleware,User.UpdateaAdress);

module.exports=Router;