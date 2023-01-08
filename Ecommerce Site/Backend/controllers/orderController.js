const Order = require("../Models/order");
const Product = require("../Models/product");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

//create a new order => /api/v1/order/new

exports.newOrder = catchAsyncErrors(async (req, res, next) => {
	const {
		orderItems,
		shippingInfo,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
		paymentInfo,
	} = req.body;
	const order = await Order.create({
		orderItems,
		shippingInfo,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
		paymentInfo,
		paidAt: Date.now,
        user : req.user._id
	});
    res.status(200).json({
        success:true,
        order
    })
});

//Get single order => /api/vi/order/:id

exports.getSingleOrder = catchAsyncErrors(async (req, res, next) =>{
    const order = await Order.findById(req.params.id).populate('user','name email')

    if(!order){
        return next ( new ErrorHandler('No order found with this ID',404))

    }
    res.status(200).json({
        success:true,
        order
    })
})

//Get logged in user orders => /api/vi/order/me

exports.myOrders = catchAsyncErrors(async (req, res, next) =>{
    const order = await Order.find({user : req.user.id})

    if(!order){
        return next ( new ErrorHandler('No order found with this ID',404))

    }
    res.status(200).json({
        success:true,
        order
    })
})

//Get all orders => /api/vi/admin/order

exports.allOrders = catchAsyncErrors(async (req, res, next) =>{
    const order = await Order.find()

    let totalAmount =0;
    order.forEach(order=>{
        totalAmount += order.totalPrice
    })

    if(!order){
        return next ( new ErrorHandler('No order found with this ID',404))

    }
    res.status(200).json({
        success:true,
        totalAmount,
        order
    })
})

//update order => /api/vi/admin/order/:id

exports.updateOrder = catchAsyncErrors(async (req, res, next) =>{
    const order = await Order.findById(req.parapms.id)

    if(order.orderStatus==='delivered'){
        return next ( new ErrorHandler('You have already delivered this order',404))
    }
    if(!order){
        return next ( new ErrorHandler('No order found with this ID',404))

    }
    order.orderItems.forEach(async item =>{
        await updateStock (item.product,item.quantity)
    })
    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();
    await order.save()
    res.status(200).json({
        success:true,

})
})
//delete order => /api/vi/admin/order/:id

exports.deleteOrder = catchAsyncErrors(async (req, res, next) =>{
    const order = await Order.findById(req.parapms.id)

    
    if(!order){
        return next ( new ErrorHandler('No order found with this ID',404))

    }
    
    await order.remove()
    await order.save()
    res.status(200).json({
        success:true,

})
})

async function updateStock(id ,quantity) {
    const product = await Product.findById(id);
    product.stock = product.stock -quantity;
    await product.save({validateBeforeSave:false})
}