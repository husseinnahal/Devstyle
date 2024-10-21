const {body,validationResult}=require('express-validator');


const registrValidation=[
    body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name must be more than 2 characters')
    .isLength({ max: 50 }).withMessage('Name must be less than 50 characters'),


    body('phone')
    .notEmpty().withMessage('phone is required')
    .isLength({min:8,max:8}).withMessage('phone must be 8 char'),

    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email'),


    body('password')
    .notEmpty().withMessage('password is required')
    .isLength({min:6}).withMessage('password must be more than 5 char'),

    
    body('adress')
    .notEmpty().withMessage('adress is required')
    .isLength({min:10}).withMessage('adress must be more than 10 char'),
];

const loginValidation=[
    body('email')
    .notEmpty().withMessage('email is required')
    .isEmail().withMessage('please enter your email'),

    body('password')
    .notEmpty().withMessage('password is required')
    .isLength({min:6}).withMessage('password must be more than 5 char'),


];

const updateAdress=[
    body("adress","adress is required").notEmpty(),
    body("adress","adress must be more than 10 char").isLength({min:10}),
]


const SubCat_Validation=[
    body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name must be more than 2 characters')
    .isLength({ max: 25 }).withMessage('Name must be less than 25 characters'),


    body("category","category is required").notEmpty(),
]

const Items_validation=[
    body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name must be more than 2 characters')
    .isLength({ max: 30 }).withMessage('Name must be less than 30 characters'),

body('category')
    .notEmpty().withMessage('Category is required'),

body('Subcat')
    .notEmpty().withMessage('Subcategory is required')
    .isMongoId().withMessage('Subcategory ID is invalid'),

body('descreption')
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 15 }).withMessage('Description must be more than 15 characters')
    .isLength({ max: 300 }).withMessage('Description must be less than 300 characters'),

body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 1 }).withMessage('Price must be more than or equal to $1')
    .isFloat({ max: 10000 }).withMessage('Price must be less than or equal to $10,000'),

body('priceAfterSale')
    .optional()
    .isFloat({ min: 1 }).withMessage('Price after sale must be more than or equal to $1')
    .isFloat({ max: 10000 }).withMessage('Price after sale must be less than or equal to $10,000'),

body('color')
    .notEmpty().withMessage('Color is required')
    .isArray().withMessage('Color must be an array'),

body('size')
    .notEmpty().withMessage('Size is required')
    .isArray().withMessage('Size must be an array'),

body('inStock')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 1 }).withMessage('Quantity must be more than or equal to 1'),

]


const validationMiddleware = (req, res, next) => {
    // if we dont have an error return next
    const result = validationResult(req);
    if (result.isEmpty()) {
        return next();
    }
    // if we have errors return an array of error objects.  
    const messages = result.array().map((err)=> {
        return {
            path: err.path,
            message: err.msg
        }
    });
    // send res with bad req and get the first error
    return res.status(400).json({
        status: false,
        error: messages[0]
    });
}


module.exports={
    validationMiddleware,
    registrValidation,
    loginValidation,
    updateAdress,
    SubCat_Validation,
    Items_validation
}