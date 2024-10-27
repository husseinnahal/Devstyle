const Items=require('../Models/Items');
const Subcategories=require('../Models/SubCategories');
const mongo = require('mongoose');

const getItems=async (req,res)=>{
    try {
        const getall=await Items.find({},{"__v":false}).populate('Subcat','name' );
        if (getall.length < 1 || !getall) {
            return res.status(404).json({
                status:false,
                message:"no Items Founded",
            })
        }
        const result = await Items.aggregate([
            {
                $group: {
                    _id: null,
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" },
                },
            },
        ]);
        const { minPrice, maxPrice } = result[0];

        return res.status(200).json({
            status:true,
            message:"fetched items succesfuly",
            data:getall,
            Pricerange: { minPrice, maxPrice },
        })

    } catch (error) {
        return res.status(500).json({
            status:"error",
            message:error.message,
        })
    }
}

const getAnItem=async (req,res)=>{
    const id = req.params.id;
    if(!mongo.Types.ObjectId.isValid(id)){
        return res.status(400).json({
            status: false, 
            message: 'Invalid item id'
        });
    }
    try {
        const getitem=await Items.findById(id,{"__v":false});
        if (getitem.length==0) {
            return res.status(404).json({
                status:false,
                message:"No item found",
            })
        }

        return res.status(200).json({
            status:true,
            message:"fetched item succesfuly",
            data:getitem
        })
    } catch (error) {
        return res.status(500).json({
            status:"error",
            message:error.message,
        })
    }
}

const getItemsByCat=async (req,res)=>{ 
    try {
        const { subcategory, minPrice, maxPrice,sortNew,populars } = req.query;

        // Build filter object
        const filter = { category: req.params.cat };

        if (subcategory) filter.Subcat = subcategory;
        if (minPrice) filter.price = { $gte: Number(minPrice) }; // Greater than or equal to minPrice
        if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) }; // Less than or equal to maxPrice
        // pagination
        const limit=req.query.limit || 16;
        const page=req.query.page || 1;
        const skip=(page-1)*limit;
        
        // for filters New item and most popular
        let getitems={}
        if (sortNew && populars) {
            const bysold = parseInt(populars); // -1 or 1
            const bytime = parseInt(sortNew); 
            let sort = {
                sold: bysold,
                createdAt: bytime,
              };
            getitems = await Items.find(filter, { "__v": false }).sort(sort).limit(limit).skip(skip);
            
        }
        else if (sortNew){
            // -createdAt for new or createdAt for old to new
            let newcreatedAt = 1;
            if (sortNew ==1) {
                newcreatedAt="createdAt";
            } else {
                newcreatedAt="-createdAt";
            }
            
             getitems = await Items.find(filter, { "__v": false }).sort(newcreatedAt).limit(limit).skip(skip);
        }
        else if (populars){
            // -createdAt for new or createdAt for old to new
            let popular = 1;
            if (populars ==1) {
                popular="sold";
            } else {
                popular="-sold";
            }
             getitems = await Items.find(filter, { "__v": false }).sort(popular).limit(limit).skip(skip);
        }
        else{
             getitems = await Items.find(filter, { "__v": false }).limit(limit).skip(skip);

        }

        
        // Fetch items based on filters
        if (getitems.length==0) {
            return res.status(404).json({
                status:false,
                message:"No items found",
            })
        }

        const minItemPrice = getitems.reduce((min, item) => item.price < min ? item.price : min, getitems[0].price);
        const maxItemPrice = getitems.reduce((max, item) => item.price > max ? item.price : max, 0);


        return res.status(200).json({
            status:true,
            message:"fetched items succesfuly",
            data:getitems,
            minPrice:minItemPrice,
            maxPrice:maxItemPrice
            })
      } catch (error) {
        return res.status(500).json({
            status:"error",
            message:error.message,
        })
    }
}

const getSaleItems=async (req,res)=>{ 
    try {
        const { discount,category} = req.query;
        const filter = { saleByPercentage: { $ne: 0 } };

        if (discount) filter.saleByPercentage = { $gte: Number(discount) };
        if (category) filter.category = category;


        const getsales=await Items.find(filter,{ "__v": false })

        if (getsales.length==0) {
            return res.status(404).json({
                status:false,
                message:"No items found",
            })
        }
        return res.status(200).json({
            status:true,
            message:"fetched items succesfuly",
            data:getsales
        })

    } catch (error) {
        return res.status(500).json({
            status:"error",
            message:error.message,
        })
    }
}

const searchs=async (req,res)=>{ 
    try {
        let {search} = req.query
        search = search.trim(); 
        if (!search) {
            return res.status(400).json({
                status: false,
                message: "Search input is empty"
            });
        }
        const getsearch=await Items.find( { name: { $regex: search, $options: 'i' }},{ "__v": false })

        if (getsearch.length==0) {
            return res.status(404).json({
                status:false,
                message:"No items found",
            })
        }
        return res.status(200).json({
            status:true,
            message:"fetched items succesfuly",
            data:getsearch
        })

    } catch (error) {
        return res.status(500).json({
            status:"error",
            message:error.message,
        })
    }
}
const bestSeller=async (req,res)=>{ 
    try {

        const thebest=await Items.find({},{ "__v": false }).sort('-sold').limit(8)

        if (thebest.length==0) {
            return res.status(404).json({
                status:false,
                message:"No items found",
            })
        }
        return res.status(200).json({
            status:true,
            message:"fetched items succesfuly",
            data:thebest
        })

    } catch (error) {
        return res.status(500).json({
            status:"error",
            message:error.message,
        })
    }
}






const addItem=async (req,res)=>{

    try {
        const {name,category,Subcat,descreption,price,priceAfterSale,color,size,inStock}=req.body;
        const images = req.files ? req.files.map(file => `/images/Itemimg/${file.filename}`) : [];

        const numericPrice = Number(price);
        const numericPriceAfterSale = Number(priceAfterSale);

        if (numericPrice <= numericPriceAfterSale) {
            return res.status(400).json({
                satus:false,
                message:"price must be greater than price after sale"
            })
        }
        let ByPercentage=0;
        if (priceAfterSale) {
             ByPercentage =100 - (priceAfterSale*100)/price;
        }    

        if (images.length == 0) {
            return res.status(400).json({
                status: false,
                message: 'Image file is required',
            });
        }
        const validationCat = ["MenWears","WomenWears","KidsWears","Shoas","Accessories","Bags"];
        if (!validationCat.includes(category)) {
            return res.status(400).json({
                status: false,
                message: "this Category is not exist",
            });
        }
        
        const validSubcats = await Subcategories.find({ _id: Subcat });      
        if (validSubcats.length < 1 || !validSubcats) {
          return res.status(400).json({
            status: false,
            message: 'subcategories are invalid',
          });
        }

        const Size =size.map(val => val.toUpperCase());


        const additem=await new Items({name,category,Subcat,descreption,price,priceAfterSale,saleByPercentage:parseInt(ByPercentage),color,size:Size,inStock,imageCover:images[0],images});
         additem.save();
        return res.status(201).json({
            status:true,
            message:"item created successfuly",
        })
    
    } catch (error) {
        return res.status(500).json({
            status:"error",
            message:error.message,
        })
    }
}

const updateItem=async (req,res)=>{

    try {
        const {name,category,Subcat,descreption,price,priceAfterSale,color,size,inStock}=req.body;
        const images = req.files ? req.files.map(file => `/images/Itemimg/${file.filename}`) : [];

        if (price <= priceAfterSale) {
            return res.status(400).json({
                satus:false,
                message:"price must be greater than price after sale"
            })
        }
        let ByPercentage=0;
        if (priceAfterSale) {
             ByPercentage =100 - (priceAfterSale*100)/price;
        }    

        if (images.length == 0) {
            return res.status(400).json({
                status: false,
                message: 'Image file is required',
            });
        }
        const validationCat = ["MenWears","WomenWears","KidsWears","Shoas","Accessories","Bags"];
        if (!validationCat.includes(category)) {
            return res.status(400).json({
                status: false,
                message: "this Category is not exist",
            });
        }
        const validSubcats = await Subcategories.find({ _id: Subcat });      
        if (validSubcats.length < 1 || !validSubcats) {
          return res.status(400).json({
            status: false,
            message: 'subcategories are invalid',
          });
        }

        const Size =size.map(val => val.toUpperCase());

        const additem=await Items.findByIdAndUpdate(req.params.id,{name,category,Subcat,descreption,price,priceAfterSale,saleByPercentage:ByPercentage,color,size,inStock,imageCover:images[0],images});
        return res.status(201).json({
            status:true,
            message:"item updated successfuly",
        })
    
    } catch (error) {
        return res.status(500).json({
            status:"error",
            message:error.message,
        })
    }
}

const delItem=async (req,res)=>{
    const id = req.params.id;
    if(!mongo.Types.ObjectId.isValid(id)){
        return res.status(400).json({
            status: false, 
            message: 'Invalid item id'
        });
    }
    try {
        const del=await  Items.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            status:true,
            message:"item deleted successfuly",
        })
    
    }catch (error) {
        return res.status(500).json({
            status:"error",
            message:error.message,
        })
    }

}



module.exports={
    getItems,
    getAnItem,
    getItemsByCat,
    getSaleItems,
    searchs,
    bestSeller,

    addItem,
    updateItem,
    delItem

}