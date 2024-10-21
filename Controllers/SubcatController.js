const Subcat=require('../Models/SubCategories')
const slugify=require('slugify');

const addSubCat =async(req,res)=>{
    try {
        const {name,category}=req.body;
        const image = req.file ? `/images/SubCatImg/${req.file.filename}` : null;

        const validationCat = ["MenWears","WomenWears","KidsWears","Shoas","Accessories","Bags"];
        if (!validationCat.includes(category)) {
            return res.status(400).json({
                status: false,
                message: "this Category is not exist",
            });
        }
        if (image == null) {
            return res.status(400).json({
                status: false,
                message: 'Image file is required',
            });
        }
        const nameExist= await Subcat.findOne({name});
        if (nameExist && nameExist.category== category) {
            return res.status(400).json({
                status: false,
                message: "this subCategory is already exist",
            });
        }

        const addsubcat=await new Subcat({name,slug:slugify(name, '_'),category,image});
        addsubcat.save();
        return res.status(201).json({
            status:true,
            message:"SubCategory created successfuly"
        })
        
    } catch (error) {
        return  res.status(500).json({
             status:"error",
             error:error.message
         })
     }
}

const getSubs=async  (req,res)=>{
    try {
        const getall=await Subcat.find({},{"__v":false});
        if (getall.length < 1 || !getall) {
            return res.status(404).json({
                status:false,
                message:"no Subcatgories Founded",
            })
        }
        return res.status(200).json({
            status:true,
            message:"fetched Subcategories is successfuly",
            data:getall
        })

    } catch (error) {
        return  res.status(500).json({
             status:"error",
             error:error.message
         })
     }
 


}

const UpdateSub=async  (req,res)=>{
    try {
        const {name,category}=req.body;
        const image = req.file ? `/images/SubCatImg/${req.file.filename}` : null;

        const validationCat = ["MenWears","WomenWears","KidsWears","Shoas","Accessories","Bags"];
        if (!validationCat.includes(category)) {
            return res.status(400).json({
                status: false,
                message: "this Category is not exist",
            });
        }

        const nameExist= await Subcat.findOne({name});
        if (nameExist && nameExist.category== category) {
            return res.status(400).json({
                status: false,
                message: "this subCategory is already exist",
            });
        }

        const Updatesubcat=await Subcat.findByIdAndUpdate(req.params.id,{name,slug:slugify(name, '_'),category,image});

        return res.status(200).json({
            status:true,
            message:"SubCategory Updated successfuly"
        })
        
    } catch (error) {
        return  res.status(500).json({
             status:"error",
             error:error.message
         })
     }
}

const deletSub=async (req,res)=>{
    try {
        const delSub=await Subcat.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            status:true,
            message:"deletes subcategory  successfuly"
        })
    } catch (error) {
        return  res.status(500).json({
             status:"error",
             error:error.message
         })
     }
}



const getSubBycat=async(req,res)=>{
    try {
        const cats=["MenWears","WomenWears","KidsWears","Shoas","Accessories","Bags"];
        if(!cats.includes(req.params.cat)){
            return res.json({
                status:false,
                message:"the category is not  exist",
            })

        }

        const getsub=await Subcat.find({category:req.params.cat});
        return res.json({
            status:true,
            message:"fetched subcategories successfuly",
            data:getsub
        })

    }  catch (error) {
        return  res.status(500).json({
             status:"error",
             error:error.message
         })
     }
}



module.exports={
    getSubs,
    addSubCat,
    UpdateSub,
    deletSub,
    getSubBycat
}