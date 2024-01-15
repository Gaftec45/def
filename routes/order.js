const express = require('express');
const router = express.Router();
const { fetchUserOrders } = require('../services/orderService'); 
const Order = require('../models/orders');
const { findOne } = require('../models/users');

router.get('/dashboard', async (req, res) => {
  res.render('dashboard');
});

router.get('/orders', checkAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id; // Assuming your user ID is stored in req.user

        // Fetch orders for the current user from the database
        const orders = await fetchUserOrders(userId);

        // Render the order-dash.ejs template and pass the orders variable
        res.render('order-dash', { orders });
    } catch (error) {
        console.error('Error fetching user-specific orders:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/create-order', (req, res) => {
    res.render('create-order');
});

router.post('/create-order', checkAuthenticated, async (req, res) => {
    const { senderName, receiverName, destination, pickupStation, packageDetails } = req.body;
    const userId = req.user.id;

    try {
        const order = new Order({ userId, senderName, receiverName, destination, pickupStation, packageDetails, status: 'Pending' });
        await order.save();
        res.redirect('/user/dashboard'); // Assuming this is a named route
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).send('Failed to create order. Please try again.');
    }
});


router.delete('/cancel-order/:orderId', async (req, res) => {
    const orderId = req.params.orderId;

    try {
        // Implement logic to delete the order by ID from the database
        const deletedOrder = await Order.findByIdAndDelete(orderId);

        if (deletedOrder) {
            res.status(200).json({ message: 'Order successfully canceled.' });
        } else {
            res.status(404).json({ message: 'Order not found.'});
        }
    } catch (error) {
        console.error('Error canceling order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/update-order/:orderId', checkAuthenticated, async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId);

        // Render the update-order.ejs view and pass the order variable
        res.render('update-order', { order });
    } catch (error) {
        console.error('Error rendering update-order view:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/update-order/:orderId', checkAuthenticated, async (req, res)=>{
    const orderId = req.params.orderId;
    try{
        //fetch order and update 
        const updateOrder = await Order.findByIdAndUpdate(orderId, {
            senderName: req.body.senderName, 
            receiverName: req.body.receiverName, 
            destination: req.body.destination,
            pickupStation: req.body.pickupStation,
            packageDetails: req.body.packageDetails,
        }, {new: true});

        if (updateOrder){
            res.redirect('/order/orders');
        } else {
            res.status(404).json({message: 'Order Not Found'});
        }
    }
    catch(error){
        console.error('Error updating Order: ', )
    }
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

// ... (your checkNotAuthenticated function and other routes)

module.exports = router;