const Order = require('../Models/orderModel');
const Items = require('../Models/Items');
const Carts = require('../Models/CartModel');

const createOrder = async (req, res) => {
    try {
        const { cartid, name, addres, phone } = req.body;
        const Cartitem = [];

        const cart = await Carts.findById(cartid);
        if (!cart || cart.items.length < 1) {
            return res.status(400).json({
                status: false,
                message: "This cart is empty or does not exist"
            });
        }

        // Add all items in the cart to Cartitem
        Cartitem.push(...cart.items);
        // Loop through the items in the cart and update their sold quantity
        for (let item of cart.items) {
            const product = await Items.findById(item.item);
            if (product.inStock >= item.quantity) {
                await Items.findByIdAndUpdate(item.item, {
                    $inc: {
                        sold: item.quantity,       // Increment the sold quantity
                        inStock: -item.quantity    // Decrement the inStock quantity
                    }
                });
            } else {
                return res.status(400).json({
                    status: false,
                    message: `Quantity for product ${product._id} exceeds stock availability`,
                });
            }
        }

        // Create a new order with Cartitem array
        const newOrder = new Order({
            user: req.decoded.id, // Assuming user ID is decoded from a token
            cart: Cartitem,
            name,
            addres,
            phone
        });

        await newOrder.save();
        await Carts.findByIdAndDelete(cartid);
        
        return res.status(201).json({
            status: true,
            message: "Order created successfully",
            data: newOrder
        });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};



const getOrders=async (req, res) => {
    try {
        const getorders=await Order.find({},{"__v":false}).populate("cartid");
        if (getorders.length==0) {
            return res.status(404).json({
                status:false,
                message:"no orders found",
            })
        }
        
        return res.status(200).json({
            status:true,
            message:"fetached successfuly",
            data:getorders
        })
        
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });

    }


}

const getOrder=async (req, res) => {
    try {
        const getorder=await Order.findById(req.params.id,{},{"__v":false}).populate("cartid");
        if (getorder.length==0) {
            return res.status(404).json({
                status:false,
                message:"no order found",
            })
        }
        return res.status(200).json({
            status:true,
            message:"fetached successfuly",
            data:getorder
        })
        
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });

    }


}

const deletorder=async (req, res) => {
try {
    const delorder=await Order.findByIdAndDelete(req.params.id);
    return res.status(200).json({
        status:true,
        message:"deleted succesfuly"
    })
    
} catch (error) {
    return res.status(500).json({ status: "error", message: error.message });

}
}

module.exports={
    createOrder,
    getOrders,
    getOrder,
    deletorder
}