// services/orderService.js
const Order = require('../models/orders');

// Fetch orders for a specific user from the database
async function fetchUserOrders(userId) {
    try {
        const orders = await Order.find({ userId }).exec();
        return orders;
    } catch (error) {
        console.error('Error fetching orders for user from the database:', error);
        throw error;
    }
}

module.exports = { fetchUserOrders };