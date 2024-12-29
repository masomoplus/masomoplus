const axios = require('axios');
const qs = require('qs');
const { v4: uuidv4 } = require('uuid');
const Item = require('../models/Item'); // Assuming items represent courses/products
const User = require('../models/User'); // Assuming you have users who are making purchases

// Set up your environment variables in .env file for sensitive information
const shortcode = process.env.MPESA_SHORTCODE; // Shortcode for your M-Pesa business account
const shortcodeSecret = process.env.MPESA_SHORTCODE_SECRET; // Secret key for the shortcode
const lipaNaMpesaShortcode = process.env.LIPA_NA_MPESA_SHORTCODE; // Lipa na M-Pesa shortcode
const lipaNaMpesaShortcodeSecret = process.env.LIPA_NA_MPESA_SHORTCODE_SECRET; // Secret key for Lipa na M-Pesa
const lipaNaMpesaShortcodeLipa = process.env.LIPA_NA_MPESA_SHORTCODE_LIPA; // Business shortcode for lipa na M-Pesa
const shortcode = process.env.LIPA_NA_MPESA_SHORTCODE;
const apiKey = process.env.MPESA_API_KEY; // For accessing the Daraja API
const apiSecret = process.env.MPESA_API_SECRET; // For accessing the Daraja API

// Function to get access token for M-Pesa
const getAccessToken = async () => {
  const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
  
  const auth = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: auth,
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw new Error('Failed to get M-Pesa access token');
  }
};

// Create M-Pesa payment request
const createPaymentRequest = async (req, res) => {
  const { itemId, phoneNumber } = req.body; // Assuming you are passing the item ID and phone number for payment

  if (!itemId || !phoneNumber) {
    return res.status(400).json({ message: 'Item ID and phone number are required' });
  }

  try {
    // Find the item to charge for (e.g., course)
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Get an access token
    const accessToken = await getAccessToken();

    // Prepare the payment request payload
    const payload = {
      BusinessShortcode: lipaNaMpesaShortcodeLipa, // The Lipa na M-Pesa shortcode
      LipaNaMpesaShortcode: lipaNaMpesaShortcodeLipa,
      LipaNaMpesaShortcodeSecret: lipaNaMpesaShortcodeSecret,
      PhoneNumber: phoneNumber,
      Amount: item.price, // Price of the item
      AccountReference: uuidv4(), // Randomly generated account reference for the transaction
      TransactionDesc: `Payment for ${item.name}`, // Transaction description
      Shortcode: lipaNaMpesaShortcodeLipa, // Business shortcode for Lipa na M-Pesa
    };

    // Send the request to M-Pesa API (using Daraja API)
    const apiUrl = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
    
    const response = await axios.post(apiUrl, qs.stringify(payload), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // If the request is successful, return the response to the frontend
    return res.status(200).json({
      message: 'Payment request sent successfully',
      paymentResponse: response.data,
    });
  } catch (error) {
    console.error('Error creating payment request:', error);
    return res.status(500).json({ message: 'Error processing payment request' });
  }
};

// Handle payment confirmation and callback from M-Pesa
const handlePaymentCallback = async (req, res) => {
  const paymentData = req.body;

  try {
    // Payment success confirmation (callback from M-Pesa)
    if (paymentData.Body.stkCallback.ResultCode === 0) {
      const paymentDetails = paymentData.Body.stkCallback.CallbackMetadata.Item;
      
      const transactionId = paymentDetails[1].Value;
      const amount = paymentDetails[0].Value;

      // Update the user or item payment status in the database
      // Assuming we store the user details
      const user = await User.findOne({ phoneNumber: paymentData.Body.stkCallback.CallbackMetadata.Item[4].Value });

      if (user) {
        // Assuming user needs to be updated with the successful payment
        user.paymentStatus = 'Paid';
        user.transactionId = transactionId;
        await user.save();
        
        return res.status(200).json({
          message: 'Payment successfully processed',
          paymentDetails: {
            transactionId,
            amount,
          },
        });
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    } else {
      // Handle failure scenario (e.g., payment failed)
      return res.status(400).json({ message: 'Payment failed' });
    }
  } catch (error) {
    console.error('Error handling payment callback:', error);
    return res.status(500).json({ message: 'Error processing payment callback' });
  }
};

// Retrieve payment status (from M-Pesa API)
const getPaymentStatus = async (req, res) => {
  const { transactionId } = req.query;

  if (!transactionId) {
    return res.status(400).json({ message: 'Transaction ID is required' });
  }

  try {
    const accessToken = await getAccessToken();
    
    const apiUrl = `https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query?Shortcode=${lipaNaMpesaShortcodeLipa}&ShortcodeSecret=${lipaNaMpesaShortcodeSecret}&TransactionId=${transactionId}`;

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.status(200).json({
      paymentStatus: response.data,
    });
  } catch (error) {
    console.error('Error retrieving payment status:', error);
    return res.status(500).json({ message: 'Error retrieving payment status' });
  }
};

module.exports = {
  createPaymentRequest,
  handlePaymentCallback,
  getPaymentStatus,
};
