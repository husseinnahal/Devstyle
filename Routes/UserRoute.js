const User=require('../Controllers/UserController');
const {validationMiddleware, registrValidation,loginValidation}=require('../MiddleWares/validation')
const express=require('express');
const Router=express.Router();

Router.post('/registration',registrValidation,validationMiddleware,User.registration);
Router.post('/login',loginValidation,validationMiddleware,User.login);
Router.get('/',User.getUsers);


module.exports=Router;