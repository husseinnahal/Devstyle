const Cart = require('../Models/CartModel');
const Items = require('../Models/Items');

// Add an item to the cart
const addItemToCart = async (req, res) => {
    try {
        const { productId, quantity, color, size} = req.body; 
  
        // Find the item to add
        const product = await Items.findById(productId);
        if (!product) {
            return res.status(404).json({ 
                status: false, 
                message: "items not found" });
        }
        
        // Find the user's cart
        let cart = await Cart.findOne({ user: req.decoded.id });
        if (!cart) {
            cart = new Cart({ user: req.decoded.id, items: [] });
        }
        if (product.inStock==0) {
            return res.status(400).json({ 
                status: false, 
                message: "out of stock" 
            });
        }
        
        if (!product.color.includes(color)) {
            return res.status(400).json({ 
                status: false, 
                message: "the color is not exist" 
            });
        }
        if (!product.size.includes(size)) {
            return res.status(400).json({ 
                status: false, 
                message: "this size is not exist" 
            });
        }

        // Check if product with the same color and size is already in the cart
        // and return the index of this element if it exist
        const existingItemIndex = cart.items.findIndex(items => 
            items.item.equals(productId) && items.color === color && items.size === size
        );

        if (existingItemIndex > -1) {
            // If it exists, update the quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            let price=0;
            if (product.saleByPercentage!=0) {
                 price=product.priceAfterSale;
            }
            else{
                 price=product.price;

            }
            // If it does not exist, add a new item
            cart.items.push({ item: productId, quantity, name:product.name, price:price, color, size ,image:product.imageCover,instock:product.inStock});
        }

        const totalPrice = cart.items.reduce((total, items) => {
            return total + items.quantity * items.price;
        }, 0);

        cart.totalCartPrice = totalPrice;

        await cart.save();
  
        return res.status(201).json({
             status: true, 
             message: "Item added to cart", 
            });

    } catch (error) {
        return res.status(500).json({ 
            status: "error", 
            message: error.message 
        });
    }
  };

// Get the user's cart
const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.decoded.id },{"__v":false});
        if (!cart) {
            return res.status(404).json({ 
                status: false,
                 message: "you dont have a Cart" });
        }

        return res.status(200).json({ 
            status: true,
            message:"fetshed successfuly" ,
            data: cart
         });

    } catch (error) {
        return res.status(500).json({
             status: "error", 
             message: error.message });
    }
};


// Update item quantity in the cart
const updateCartQuantity = async (req, res) => {
    try {
        const { productId, quantity, color, size} = req.body; // Data to identify the item and the new quantity
        const userId =req.decoded.id; // Assuming req.user contains authenticated user information
        // Validate quantity
        if (quantity < 1) {
            return res.status(400).json({
                status: false,
                message: "Quantity must be at least 1",
            });
        }

        // Find the user's cart
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({
                status: false,
                message: "Cart not found"
            });
        }

        // Check if the product with the same color and size exists in the cart
        const existingItemIndex = cart.items.findIndex(item => 
            item.item.equals(productId) && item.color === color && item.size === size
        );

        if (existingItemIndex > -1) {
            // Update the quantity
            cart.items[existingItemIndex].quantity = quantity;

            // Update total cart price
            cart.totalCartPrice = cart.items.reduce((total, item) => 
                total + item.quantity * item.price, 0
            );

            await cart.save();

            return res.status(200).json({
                status: true,
                message: "Cart quantity updated successfully",
            });

        } else {
            return res.status(404).json({
                status: false,
                message: "Item not found in cart"
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

// Remove an item from the cart
const removeItemFromCart = async (req, res) => {
    try {
        const { productId,color,size } = req.body;
        const cart = await Cart.findOne({ user: req.decoded.id });


        cart.items = cart.items.filter(
            (items) => !(items.item.toString() === productId && items.color === color && items.size === size)
        );
        
        cart.totalCartPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

        await cart.save();
        
        return res.status(200).json({ 
            status: true,
            message: "Item removed from cart",
        }
        );
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

module.exports = {
    addItemToCart,
    getCart,
    updateCartQuantity,
    removeItemFromCart
};
