const express = require('express');
const router = express.Router();
const axios = require('axios'); // Assuming axios is used for payment-related operations
const itemRoutes = require('./itemRoutes'); // Corrected import statement

// Example payment route
router.post('/pay', async (req, res) => {
    try {
        // Example logic for payment processing
        const { amount, currency } = req.body;
        const paymentResponse = await axios.post('https://payment-gateway.example/api/pay', {
            amount,
            currency,
        });

        res.status(200).json({
            success: true,
            data: paymentResponse.data,
        });
    } catch (error) {
        console.error('Payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Payment processing failed',
        });
    }
});

// Use itemRoutes for item-related operations
router.use('/items', itemRoutes);

module.exports = router;
